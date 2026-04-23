import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../ctx/AuthContext';
import { supabase } from '../../lib/supabase';
import PhoneInput from 'react-native-phone-number-input';
import * as ImagePicker from 'expo-image-picker';

export default function PersonalInformationScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const phoneInputRef = useRef<PhoneInput | null>(null);


  // 1. Fetch current profile data
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setFetching(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, loyalty_points')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('Profile fetch handled:', error.message);
        }

        if (data) {
          setFullName(data.full_name || user.user_metadata?.full_name || '');
          setPhone(data.phone || user.user_metadata?.phone || '');
        } else {
          setFullName(user.user_metadata?.full_name || '');
          setPhone(user.user_metadata?.phone || '');
        }


      } catch (error: any) {
        console.error('Unexpected error loading profile:', error.message);
        setFullName(user.user_metadata?.full_name || '');
        setPhone(user.user_metadata?.phone || '');
      } finally {
        // ALWAYS end loading state
        setFetching(false);
      }
    }

    loadProfile();
  }, [user]);


  // 2. Update profile data
  const handleSaveDetails = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const fullPhoneNumber = 
        phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero()?.formattedNumber || 
        formattedPhone || 
        phone;

      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          phone: fullPhoneNumber 
        }
      });

      if (authError) throw authError;

      // 2. Update Profiles Table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: fullPhoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      // If it's just a 'missing column' error, we don't alert the user yet
      // because we already saved to metadata.
      if (dbError && !dbError.message.includes('column "phone" of relation "profiles" does not exist')) {
        throw dbError;
      }

      await refreshProfile();
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }

  };

  const pickImage = async () => {
    // 1. Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to change your avatar.');
      return;
    }

    // 2. Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleUploadAvatar(result.assets[0].uri);
    }
  };

  const handleUploadAvatar = async (uri: string) => {
    if (!user) return;
    setLoading(true);

    try {
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Convert URI to Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (authError) throw authError;

      // 4. Update Profiles Table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      // (Handle missing column gracefully like before)
      if (dbError && !dbError.message.includes('column "avatar_url" of relation "profiles" does not exist')) {
        throw dbError;
      }

      await refreshProfile();
      Alert.alert('Success', 'Profile photo updated successfully.');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Make sure the "avatars" bucket exists and is public.');
    } finally {
      setLoading(false);
    }
  };



  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 4 || i === 7) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    return formatted.trim();
  };


  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(shop)/settings')}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={24} color="#111111" />
          </Pressable>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Personal{'\n'}Information</Text>
              <Text style={styles.description}>
                Update your details to ensure your Atelier POS experience is seamless and secure.
              </Text>
            </View>

            {fetching ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator color="#111111" />
                <Text style={{ marginTop: 12, color: '#737373' }}>Loading your details...</Text>
              </View>
            ) : (
              <View style={styles.card}>
                {/* Profile Photo Section */}
                <View style={styles.photoSection}>
                  <View style={styles.avatarContainer}>
                    <Image 
                      source={user?.user_metadata?.avatar_url 
                        ? { uri: user.user_metadata.avatar_url } 
                        : { uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Guest'}` }
                      } 
                      style={styles.avatar}
                    />
                    {loading && (
                      <View style={styles.avatarLoading}>
                        <ActivityIndicator color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Pressable onPress={pickImage} disabled={loading}>
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </Pressable>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your full name"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={[styles.input, { color: '#8C8478', backgroundColor: '#F9F9F9' }]}
                      value={email}
                      editable={false}
                    />
                    <Text style={{ fontSize: 10, color: '#8C8478' }}>Email cannot be changed here</Text>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
                    <View style={[styles.inputWrap, styles.phoneInputWrap, focusedField === 'phone' && styles.inputWrapFocused]}>
                      <PhoneInput
                        ref={phoneInputRef}
                        defaultCode="VN"
                        value={phone}
                        layout="first"
                        onChangeText={(text) => {
                          const formatted = formatPhoneNumber(text);
                          setPhone(formatted);
                        }}
                        onChangeFormattedText={(text) => setFormattedPhone(text)}
                        containerStyle={styles.pickerContainer}
                        textContainerStyle={styles.pickerTextContainer}
                        textInputStyle={styles.pickerInput}
                        codeTextStyle={styles.pickerCodeText}
                        flagButtonStyle={styles.pickerFlagButton}
                        countryPickerButtonStyle={styles.pickerFlagButton}
                        textInputProps={{
                          placeholder: '0389 921 661',
                          placeholderTextColor: '#C0B8B0',
                          onFocus: () => setFocusedField('phone'),
                          onBlur: () => setFocusedField(null),
                          maxLength: 15,
                          value: phone,
                        }}


                        countryPickerProps={{
                          withAlphaFilter: true,
                          withCallingCode: true,
                          withEmoji: true,
                        }}
                      />

                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                  <Pressable 
                    style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
                    onPress={handleSaveDetails}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.saveBtnText}>Save Details</Text>
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </Pressable>

                  <Pressable style={styles.discardBtn} onPress={() => router.push('/(shop)/settings')} disabled={loading}>
                    <Text style={styles.discardBtnText}>Discard Changes</Text>
                  </Pressable>
                </View>
              </View>
            )}
            
            {/* Extra space for tab bar if needed */}
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── Success Modal ── */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.successTitle}>Profile Updated</Text>
            <Text style={styles.successSub}>Your personal information has been{'\n'}saved successfully.</Text>

            <Pressable style={styles.closeModalBtn} onPress={() => {
              setShowSuccess(false);
              router.push('/(shop)/settings');
            }}>
              <Text style={styles.closeModalBtnText}>Back to Profile</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  screen: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111111',
    lineHeight: 44,
    letterSpacing: -1,
  },
  description: {
    fontSize: 16,
    color: '#737373',
    lineHeight: 24,
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A6D0D6',
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  avatarLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#737373',
  },
  input: {
    height: 56,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111111',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  saveBtn: {
    height: 56,
    backgroundColor: '#1E1E1E',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  discardBtn: {
    height: 56,
    backgroundColor: '#F1F1F1',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardBtnText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  // Success Modal Styles
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  successContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F6F6F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    color: '#8C8478',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  closeModalBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#111111',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  // Field Styles
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputWrap: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E4E0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapFocused: {
    borderColor: '#111111',
    borderWidth: 1.5,
  },
  phoneInputWrap: {
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  pickerContainer: {
    width: '100%',
    height: 54,
    backgroundColor: 'transparent',
  },
  pickerTextContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  pickerInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    height: 54,
  },
  pickerCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  pickerFlagButton: {
    width: 60,
  },

});


