import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

/**
 * SIGN UP SCREEN - ATELIER BOUTIQUE
 * Cleaned & Optimized Version
 */

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- 1. Form States ---
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [password, setPassword] = useState('');
  const phoneInputRef = useRef<PhoneInput | null>(null);
  
  // --- 2. UI States ---
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Focus States for UI Highlighting
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- 3. Animations ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // --- 4. Logic ---
  const handleSignUp = async () => {
    if (!email || !password || !fullName || !username || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!phoneInputRef.current?.isValidNumber(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullPhoneNumber =
        phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero()?.formattedNumber ||
        formattedPhone;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
            phone: fullPhoneNumber,
            role: 'customer',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          username: username,
          email: email, // Lưu thêm email để tra cứu login bằng username
          role: 'customer',
        });

        if (profileError) console.warn('Profile sync failed:', profileError.message);
        router.replace('/(shop)/explore');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render input fields with consistent styling
  const renderField = (
    label: string, 
    icon: any, 
    value: string, 
    onChange: (t: string) => void, 
    placeholder: string,
    fieldKey: string,
    props: any = {}
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, focusedField === fieldKey && styles.inputWrapFocused]}>
        <Ionicons 
          name={icon} 
          size={18} 
          color={focusedField === fieldKey ? '#1A1814' : '#A09890'} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#C0B8B0"
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Visual Decor Elements */}
      <View style={styles.orb} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            
            {/* --- HEADER --- */}
            <View style={styles.header}>
              <Text style={styles.brand}>ATELIER.</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join our fashion community</Text>
            </View>

            {/* --- FORM CARD --- */}
            <View style={styles.card}>
              {renderField('FULL NAME', 'person-outline', fullName, setFullName, 'John Doe', 'name', { autoCapitalize: 'words' })}
              
              {renderField('USERNAME', 'at-outline', username, (v) => setUsername(v.toLowerCase().trim()), 'username', 'user', { autoCapitalize: 'none' })}
              
              {renderField('EMAIL', 'mail-outline', email, setEmail, 'email@example.com', 'email', { keyboardType: 'email-address', autoCapitalize: 'none' })}

              {/* Phone Field with Country Picker */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
                <View style={[styles.inputWrap, styles.phoneInputWrap, focusedField === 'phone' && styles.inputWrapFocused]}>
                  <PhoneInput
                    ref={phoneInputRef}
                    defaultCode="VN"
                    value={phone}
                    layout="first"
                    onChangeText={setPhone}
                    onChangeFormattedText={setFormattedPhone}
                    containerStyle={styles.pickerContainer}
                    textContainerStyle={styles.pickerTextContainer}
                    textInputStyle={styles.pickerInput}
                    codeTextStyle={styles.pickerCodeText}
                    flagButtonStyle={styles.pickerFlagButton}
                    countryPickerButtonStyle={styles.pickerFlagButton}
                    textInputProps={{
                      placeholder: '0123 456 789',
                      placeholderTextColor: '#C0B8B0',
                      onFocus: () => setFocusedField('phone'),
                      onBlur: () => setFocusedField(null),
                    }}
                    countryPickerProps={{
                      withAlphaFilter: true,
                      withCallingCode: true,
                      withEmoji: true,
                    }}
                  />
                </View>
              </View>


              {/* Password Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <View style={[styles.inputWrap, focusedField === 'pass' && styles.inputWrapFocused]}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={18} 
                    color={focusedField === 'pass' ? '#1A1814' : '#A09890'} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#C0B8B0"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('pass')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#A09890" />
                  </Pressable>
                </View>
              </View>

              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#D24B4B" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Submit Button */}
              <Pressable 
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.submitBtnText}>{loading ? 'CREATING...' : 'SIGN UP'}</Text>
                <View style={styles.submitBtnIcon}>
                  <Ionicons name={loading ? 'sync' : 'arrow-forward'} size={16} color="#1A1814" />
                </View>
              </Pressable>

              {/* Footer Links */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={() => router.back()}>
                  <Text style={styles.footerLink}>Login</Text>
                </Pressable>
              </View>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE9E2',
  },
  orb: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E2DDD4',
    opacity: 0.6,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brand: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1814',
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 24,
    height: 2,
    backgroundColor: '#1A1814',
    marginTop: 4,
    marginBottom: 16,
    opacity: 0.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1814',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#8C8478',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#F4F1EC',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE6DE',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapFocused: {
    borderColor: '#C8B890',
    backgroundColor: '#FFFFFF',
  },
  phoneInputWrap: {
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
  },
  eyeBtn: {
    padding: 8,
  },
  pickerContainer: {
    flex: 1,
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  pickerTextContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight: 16,
  },
  pickerFlagButton: {
    width: 92,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pickerCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
    marginRight: 8,
  },
  pickerInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
    paddingVertical: 0,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: '#D24B4B',
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1814',
    height: 60,
    borderRadius: 30,
    gap: 12,
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#F4F1EC',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  submitBtnIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C8B890',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#8C8478',
    fontSize: 14,
  },
  footerLink: {
    color: '#1A1814',
    fontSize: 14,
    fontWeight: '800',
  },
});
