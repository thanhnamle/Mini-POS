import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

// Định nghĩa kiểu dữ liệu cho Address phù hợp với DB mới
type AddressData = {
  id?: string;
  first_name: string;
  last_name: string;
  street_number: string;
  apt_suite: string;
  ward: string;
  city: string;
  is_default: boolean;
  label: string;
};

const initialAddress: AddressData = {
  first_name: '',
  last_name: '',
  street_number: '',
  apt_suite: '',
  ward: '',
  city: '',
  is_default: false,
  label: '',
};

export default function ShippingAddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- States ---
  const [primary, setPrimary] = useState<AddressData>({ ...initialAddress, label: 'Primary', is_default: true });
  const [secondary, setSecondary] = useState<AddressData>({ ...initialAddress, label: 'Secondary' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const primaryAddr = data.find(a => a.label === 'Primary') || data[0];
        const secondaryAddr = data.find(a => a.label === 'Secondary');
        
        if (primaryAddr) setPrimary(primaryAddr);
        if (secondaryAddr) setSecondary(secondaryAddr);
      }
    } catch (err: any) {
      console.error('Error fetching addresses:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDefault = (type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setPrimary(prev => ({ ...prev, is_default: true }));
      setSecondary(prev => ({ ...prev, is_default: false }));
    } else {
      setPrimary(prev => ({ ...prev, is_default: false }));
      setSecondary(prev => ({ ...prev, is_default: true }));
    }
  };

  // --- Save Logic ---
  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      console.log('Saving addresses for user:', user.id);

      const savePromises = [
        upsertAddress(user.id, primary),
        upsertAddress(user.id, secondary)
      ];

      await Promise.all(savePromises);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.replace('/(shop)/settings');
      }, 2000);
    } catch (err: any) {
      console.error('Save error details:', err);
    } finally {
      setSaving(false);
    }
  };

  const upsertAddress = async (userId: string, address: AddressData) => {
    if (!address.street_number) return;

    const payload = {
      ...address,
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    // Sử dụng upsert để tự động INSERT hoặc UPDATE dựa trên user_id và label
    const { error } = await supabase
      .from('addresses')
      .upsert(payload, { 
        onConflict: 'user_id,label',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Upsert error:', error.message);
      throw error;
    }
  };



  const updateField = (type: 'primary' | 'secondary', field: keyof AddressData, value: string) => {
    if (type === 'primary') {
      setPrimary(prev => ({ ...prev, [field]: value }));
    } else {
      setSecondary(prev => ({ ...prev, [field]: value }));
    }
  };


  const renderInput = (
    label: string, 
    value: string, 
    onChange: (v: string) => void, 
    placeholder: string, 
    halfWidth: boolean = false
  ) => (
    <View style={[styles.inputGroup, halfWidth && { flex: 1 }]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#C0B8B0"
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A1814" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      {/* --- Success Popup --- */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconBg}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Updated Successfully</Text>
            <Text style={styles.successSub}>Your shipping details are now up to date.</Text>
          </View>
        </View>
      </Modal>

      {/* --- Custom Header --- */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(shop)/settings')} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1814" />
        </Pressable>
        <Text style={styles.headerTitle}>Account</Text>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="settings-outline" size={24} color="#1A1814" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Page Title --- */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Shipping Address</Text>
            <Text style={styles.pageSubtitle}>Manage your delivery locations for faster checkout.</Text>
          </View>
          
          {/* --- Primary Address Card --- */}
          <Pressable 
            style={[styles.addressCard, primary.is_default && styles.activeCard]} 
            onPress={() => toggleDefault('primary')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconTitle}>
                <Ionicons name="home" size={20} color={primary.is_default ? '#1A1814' : '#5A5550'} />
                <Text style={[styles.cardTitle, primary.is_default && { color: '#1A1814' }]}>Primary Residence</Text>
              </View>
              {primary.is_default && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              )}
            </View>

            <View style={styles.row}>
              {renderInput('FIRST NAME', primary.first_name, (v) => updateField('primary', 'first_name', v), 'Jane', true)}
              <View style={{ width: 16 }} />
              {renderInput('LAST NAME', primary.last_name, (v) => updateField('primary', 'last_name', v), 'Doe', true)}
            </View>

            {renderInput('STREET & HOUSE NUMBER', primary.street_number, (v) => updateField('primary', 'street_number', v), '123 Le Loi St.')}
            {renderInput('APT, SUITE, ETC. (OPTIONAL)', primary.apt_suite, (v) => updateField('primary', 'apt_suite', v), 'Room 402, Building A')}
            
            <View style={styles.row}>
              {renderInput('WARD', primary.ward, (v) => updateField('primary', 'ward', v), 'Ben Nghe Ward', true)}
              <View style={{ width: 16 }} />
              {renderInput('CITY', primary.city, (v) => updateField('primary', 'city', v), 'Ho Chi Minh City', true)}
            </View>
          </Pressable>

          {/* --- Secondary Address Card --- */}
          <Pressable 
            style={[styles.addressCard, styles.secondaryCard, secondary.is_default && styles.activeCard]}
            onPress={() => toggleDefault('secondary')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconTitle}>
                <Ionicons name="business" size={20} color={secondary.is_default ? '#1A1814' : '#5A5550'} />
                <Text style={[styles.cardTitle, secondary.is_default && { color: '#1A1814' }]}>Studio / Secondary</Text>
              </View>
              {secondary.is_default && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              )}
            </View>

            <View style={styles.row}>
              {renderInput('FIRST NAME', secondary.first_name, (v) => updateField('secondary', 'first_name', v), 'Jane', true)}
              <View style={{ width: 16 }} />
              {renderInput('LAST NAME', secondary.last_name, (v) => updateField('secondary', 'last_name', v), 'Doe', true)}
            </View>

            {renderInput('STREET & HOUSE NUMBER', secondary.street_number, (v) => updateField('secondary', 'street_number', v), '456 Maker St.')}

            {renderInput('APT, SUITE, ETC.', secondary.apt_suite, (v) => updateField('secondary', 'apt_suite', v), 'Studio 5')}
            
            <View style={styles.row}>
              {renderInput('WARD', secondary.ward, (v) => updateField('secondary', 'ward', v), 'Ward ...', true)}
              <View style={{ width: 16 }} />
              {renderInput('CITY', secondary.city, (v) => updateField('secondary', 'city', v), 'City ...', true)}
            </View>
          </Pressable>





          {/* --- Actions --- */}
          <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 20) + 70 }]}>
            <Pressable onPress={() => router.push('/(shop)/settings')} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </Pressable>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1814',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1A1814',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#8C8478',
    marginTop: 8,
    lineHeight: 22,
  },
  addressCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  secondaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1814',
    shadowColor: '#1A1814',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },


  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  successIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1814',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1814',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: '#8C8478',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  cardIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1814',
  },
  defaultBadge: {
    backgroundColor: '#1A1814',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C8478',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#EAE6DE',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 16,
    marginBottom: 16,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1814',
  },
  saveBtn: {
    backgroundColor: '#000000',
    width: '100%',
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
