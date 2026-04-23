import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';


import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

type PaymentMethod = {
  id: string;
  card_holder: string;
  last_4: string;
  expiry: string;
  brand: string;
  is_default: boolean;
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      setMethods(data || []);
    } catch (err: any) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMethod = async (id: string) => {
    try {
      // 1. Reset all to false
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('is_default', true);

      // 2. Set new default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      setShowSuccess(true);
      fetchPaymentMethods();
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err: any) {
      console.error('Update error:', err.message);
    }
  };

  const handleAddCard = async () => {
    if (cardNumber.length < 16 || !expiry || !holderName) return;

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const last4 = cardNumber.slice(-4);
      const brand = cardNumber.startsWith('4') ? 'visa' : 'mastercard';

      const { error } = await supabase
        .from('payment_methods')
        .insert([{
          user_id: user.id,
          card_holder: holderName,
          last_4: last4,
          expiry: expiry,
          brand: brand,
          is_default: methods.length === 0
        }]);

      if (error) throw error;

      setShowAddModal(false);
      resetForm();
      fetchPaymentMethods();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      console.error('Add card error:', err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCardNumber('');
    setHolderName('');
    setExpiry('');
    setCvv('');
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleRemoveCard = async () => {
    if (!itemToRemove) return;
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', itemToRemove);

      if (error) throw error;
      
      setShowConfirmModal(false);
      setItemToRemove(null);
      fetchPaymentMethods();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err: any) {
      console.error('Remove error:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* --- Confirm Delete Modal --- */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.warningIconBg}>
              <Ionicons name="alert-circle-outline" size={32} color="#FF4B4B" />
            </View>
            <Text style={styles.confirmTitle}>Remove Card?</Text>
            <Text style={styles.confirmSub}>Are you sure you want to remove this payment method? This action cannot be undone.</Text>
            
            <View style={styles.confirmActions}>
              <Pressable 
                style={styles.cancelActionBtn} 
                onPress={() => {
                  setShowConfirmModal(false);
                  setItemToRemove(null);
                }}
              >
                <Text style={styles.cancelActionText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.removeActionBtn} 
                onPress={handleRemoveCard}
              >
                <Text style={styles.removeActionText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>



      {/* --- Add Card Modal --- */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.addCardContent}>
            <View style={styles.addCardHeader}>
              <Text style={styles.addCardTitle}>Add Credit Card</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#1A1814" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CARD HOLDER NAME</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="J. DOE" 
                  value={holderName}
                  onChangeText={setHolderName}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CARD NUMBER</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="•••• •••• •••• ••••" 
                  keyboardType="numeric"
                  maxLength={19}
                  value={formatCardNumber(cardNumber)}
                  onChangeText={(t) => setCardNumber(t.replace(/\s/g, ''))}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>EXPIRY</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="MM/YY" 
                    keyboardType="numeric"
                    maxLength={5}
                    value={formatExpiry(expiry)}
                    onChangeText={setExpiry}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="•••" 
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>

              <Pressable 
                style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
                onPress={handleAddCard}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Card</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- Success Modal --- */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconBg}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Success</Text>
            <Text style={styles.successSub}>Your payment method has been updated.</Text>
          </View>
        </View>
      </Modal>

      {/* --- Header --- */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(shop)/settings')} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1814" />
        </Pressable>
        <Text style={styles.headerTitle}>Account</Text>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="settings-outline" size={24} color="#1A1814" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Payment Methods</Text>
          <Text style={styles.pageSubtitle}>Manage your saved cards and payment preferences for seamless transactions.</Text>
        </View>

        <Text style={styles.sectionTitle}>Saved Cards</Text>

        {loading ? (
          <ActivityIndicator color="#1A1814" style={{ marginTop: 20 }} />
        ) : (
          methods.length > 0 ? (
            methods.map((item) => (
              <Pressable 
                key={item.id} 
                onPress={() => setDefaultMethod(item.id)}
                style={[styles.card, item.is_default && styles.primaryCard]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardIconTitle}>
                    <Ionicons 
                      name={item.brand === 'visa' ? 'card' : 'card-outline'} 
                      size={32} 
                      color={item.is_default ? '#1A1814' : '#5A5550'} 
                    />
                    {item.is_default && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                      </View>
                    )}
                  </View>
                  <Pressable 
                    onPress={() => {
                      setItemToRemove(item.id);
                      setShowConfirmModal(true);
                    }}
                    style={styles.removeBtn}
                  >

                    <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
                  </Pressable>
                </View>


                <Text style={styles.cardNumber}>•••• •••• •••• {item.last_4}</Text>
                <Text style={styles.cardHolder}>{item.card_holder.toUpperCase()}</Text>
                
                <View style={styles.cardBottom}>
                  <Text style={styles.cardExp}>Exp: {item.expiry}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noCardsText}>No saved cards found.</Text>
          )
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Add New Method</Text>

        <View style={{ paddingBottom: 35 }}>
          <Pressable style={styles.methodBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="card-outline" size={20} color="#1A1814" />
          <Text style={styles.methodBtnText}>Credit Card</Text>
        </Pressable>

        <Pressable style={styles.methodBtn}>
          <Ionicons name="logo-apple" size={20} color="#1A1814" />
          <Text style={styles.methodBtnText}>Apple Pay</Text>
        </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    paddingTop: 35,
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
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  titleSection: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1814',
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#5A5550',
    lineHeight: 22,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1814',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1A1814',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    padding: 8,
    marginRight: -8,
  },
  primaryBadge: {
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },

  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5A5550',
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1814',
    letterSpacing: 2,
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1814',
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardExp: {
    fontSize: 13,
    color: '#5A5550',
    fontWeight: '500',
  },
  divider: {
    height: 2,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  methodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  methodBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    width: '80%',
    alignItems: 'center',
  },
  successIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1814',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1814',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: '#5A5550',
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    width: '85%',
    alignItems: 'center',
  },
  warningIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1814',
    marginBottom: 8,
  },
  confirmSub: {
    fontSize: 14,
    color: '#5A5550',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  confirmActions: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelActionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    marginRight: 12,
  },
  removeActionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#1A1814',
    alignItems: 'center',
  },
  cancelActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1814',
  },
  removeActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addCardContent: {

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    maxHeight: '90%',
  },
  addCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  addCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1814',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5A5550',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1A1814',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#1A1814',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noCardsText: {
    fontSize: 15,
    color: '#5A5550',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

