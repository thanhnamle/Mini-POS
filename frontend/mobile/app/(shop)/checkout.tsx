import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '../../ctx/CartContext';
import { useAuth } from '../../ctx/AuthContext';
import { supabase } from '../../lib/supabase';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();

  const { cart, clearCart, removeFromCart, isCheckoutActive, setCheckoutActive } = useCart();
  
  const [successVisible, setSuccessVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Tính toán trực tiếp checkoutItems thay vì dùng state + useEffect
  const checkoutItems = params.buyNowId 
    ? [{
        id: params.buyNowId,
        name: params.buyNowName,
        price: parseFloat(params.buyNowPrice as string),
        quantity: 1,
        size: params.buyNowSize,
        selectedSize: params.buyNowSize,
        surface: '#F6F6F4',
        icon: 'shirt-outline',
        iconColor: '#111111'
      }]
    : (isCheckoutActive ? cart : []);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const tax = subtotal * 0.08; 
  const grandTotal = subtotal + tax;


  const handleProcessTransaction = async () => {
    if (!user) return;
    if (checkoutItems.length === 0) return;

    try {
      setProcessing(true);
      const pointsToEarn = Math.floor(grandTotal);
      setEarnedPoints(pointsToEarn);
      
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'paid',
          total_amount: grandTotal,
          subtotal: subtotal,
          tax_rate: 8.00,
          items_count: checkoutItems.length,
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItemsToInsert = checkoutItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        unit_price: item.price,
        subtotal: item.price * (item.quantity || 1)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Update Loyalty Points
      const { error: loyaltyError } = await supabase.rpc('increment_loyalty_points', {
        user_id_param: user.id,
        points_to_add: pointsToEarn
      });

      if (loyaltyError) {
        // Fallback if RPC fails
        const { data: profile } = await supabase.from('profiles').select('loyalty_points').eq('id', user.id).single();
        await supabase.from('profiles').update({ loyalty_points: (profile?.loyalty_points || 0) + pointsToEarn }).eq('id', user.id);
      }

      if (!params.buyNowId) {
        clearCart();
      }

      // 5. Refresh user profile to show new points
      await refreshProfile();

      setSuccessVisible(true);

    } catch (err: any) {
      Alert.alert('Transaction Failed', err.message);
    } finally {
      setProcessing(false);
    }
  };


  const handleViewHistory = () => {
    setSuccessVisible(false);
    router.push('/(shop)/order_history');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.menuBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>
          <View style={styles.headerBrand}>
            <Text style={styles.brandText}>ATELIER.</Text>
            <Text style={styles.modeText}>CHECKOUT MODE</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.eyebrow}>TRANSACTION REVIEW</Text>
          <Text style={styles.title}>Order Summary</Text>

          {/* Order Items */}
          <View style={styles.itemsList}>
            {checkoutItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="bag-outline" size={80} color="#EAE6DE" />
                <Text style={styles.emptyTitle}>Your Bag is Waiting</Text>
                <Text style={styles.emptySub}>Please review your items in the bag and confirm "Proceed to Order" to start checkout.</Text>
                <Pressable 
                  style={styles.exploreBtn}
                  onPress={() => router.replace('/(shop)/explore')}
                >
                  <Text style={styles.exploreBtnText}>CONTINUE SHOPPING</Text>
                </Pressable>
              </View>
            ) : (
              checkoutItems.map((item, idx) => (
                <OrderItem 
                  key={`${item.id}-${idx}`}
                  name={item.name} 
                  sku={(item.id as string).slice(0, 8).toUpperCase()} 
                  price={item.price} 
                  qty={item.quantity || 1}
                  surface={item.surface || '#F6F6F4'}
                  icon={item.icon || 'shirt-outline'}
                  iconColor={item.iconColor || '#111111'}
                  onDelete={!params.buyNowId ? () => removeFromCart(item.id as string, (item as any).selectedSize) : undefined}
                />
              ))
            )}
          </View>

          {/* Total Card */}
          <View style={styles.totalCard}>
            <View style={styles.totalHeader}>
              <View>
                <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
              </View>
              <Ionicons name="card" size={32} color="#FFFFFF20" />
            </View>
            
            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Subtotal</Text>
                <Text style={styles.breakdownValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Tax (8%)</Text>
                <Text style={styles.breakdownValue}>${tax.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Payment Section */}
          <Text style={styles.sectionTitle}>SELECT PAYMENT</Text>
          
          <View style={styles.paymentList}>
            <PaymentOption 
              icon="cash-outline" 
              title="Cash" 
              sub="PHYSICAL TENDER" 
              selected={paymentMethod === 'Cash'}
              onPress={() => setPaymentMethod('Cash')}
            />
            <PaymentOption 
              icon="card-outline" 
              title="Credit Card" 
              sub="CHIP & PIN, SWIPE" 
              selected={paymentMethod === 'Credit Card'}
              onPress={() => setPaymentMethod('Credit Card')}
            />
            <PaymentOption 
              icon="wallet-outline" 
              title="Digital Wallet" 
              sub="APPLE PAY, GOOGLE PAY" 
              selected={paymentMethod === 'Digital Wallet'}
              onPress={() => setPaymentMethod('Digital Wallet')}
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 70 }]}>
          <Pressable 
            style={[styles.mainBtn, (checkoutItems.length === 0 || processing) && styles.disabledBtn]} 
            onPress={handleProcessTransaction}
            disabled={checkoutItems.length === 0 || processing}
          >
            {processing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.mainBtnText}>PROCESS TRANSACTION</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

      {/* ── Success Modal ── */}
      <Modal
        visible={successVisible}
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

            <Text style={styles.successTitle}>Payment Successful</Text>
            <Text style={styles.successSub}>Thank you for your purchase!{'\n'}Your order is now in your history.</Text>

            {/* Points Badge */}
            <View style={styles.pointsBadge}>
              <Ionicons name="sparkles" size={16} color="#BFA28C" />
              <Text style={styles.pointsBadgeText}>You earned {earnedPoints} loyalty points!</Text>
            </View>


            <Pressable style={styles.newOrderBtn} onPress={handleViewHistory}>
              <Text style={styles.newOrderBtnText}>View Order History</Text>
            </Pressable>

            <Pressable style={styles.printBtn} onPress={() => {
              setSuccessVisible(false);
              router.replace('/(shop)/explore');
            }}>
              <Text style={styles.printBtnText}>Back to Shop</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}



function OrderItem({ name, sku, price, qty, surface, icon, iconColor, onDelete }: any) {
  return (
    <View style={styles.itemRow}>
      <View style={[styles.itemThumb, { backgroundColor: surface, alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemSku}>SKU: {sku}</Text>
      </View>
      <View style={styles.itemPriceQty}>
        <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
        <Text style={styles.itemQty}>QTY: {qty.toString().padStart(2, '0')}</Text>
      </View>
      {onDelete && (
        <Pressable onPress={onDelete} style={styles.itemDeleteBtn}>
          <Ionicons name="trash-outline" size={18} color="#FF4B4B" />
        </Pressable>
      )}
    </View>
  );
}


function PaymentOption({ icon, title, sub, selected, onPress }: { icon: any, title: string, sub: string, selected?: boolean, onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.paymentBtn, selected && styles.paymentBtnActive]}>
      <View style={styles.paymentIconBox}>
        <Ionicons name={icon} size={20} color="#111111" />
      </View>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>{title}</Text>
        <Text style={styles.paymentSub}>{sub}</Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color="#111111" />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#EAE6DE" />
      )}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F4',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 64,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrand: {
    flex: 1,
    marginLeft: 12,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  modeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8478',
    letterSpacing: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD7D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -1.5,
    marginBottom: 32,
  },
  itemsList: {
    gap: 16,
    marginBottom: 32,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
  },
  itemThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },
  itemSku: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8C8478',
  },
  itemPriceQty: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C8478',
  },
  itemDeleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    marginTop: 20,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#8C8478',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreBtn: {
    height: 56,
    paddingHorizontal: 32,
    backgroundColor: '#111111',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  totalCard: {
    backgroundColor: '#111111',
    borderRadius: 32,
    padding: 32,
    marginBottom: 40,
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1,
    marginBottom: 4,
  },
  grandTotalValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  breakdown: {
    gap: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF15',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#8C8478',
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  paymentList: {
    gap: 12,
  },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  paymentBtnActive: {
    borderColor: '#111111',
  },
  paymentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F6F6F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },
  paymentSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8478',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#F6F6F4',
  },
  mainBtn: {
    height: 64,
    backgroundColor: '#111111',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },
  emptyText: {
    fontSize: 14,
    color: '#8C8478',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  mainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
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
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
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
  newOrderBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#111111',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  newOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  printBtn: {
    padding: 12,
  },
  printBtnText: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F6F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
  },
  pointsBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BFA28C',
  },
});


