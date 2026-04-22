import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>UN</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.eyebrow}>TRANSACTION REVIEW</Text>
          <Text style={styles.title}>Order Summary</Text>

          {/* Order Items */}
          <View style={styles.itemsList}>
            <OrderItem 
              name="Atelier Series 01" 
              sku="8820-MNML" 
              price={240} 
              qty={1} 
            />
            <OrderItem 
              name="Studio Headset Pro" 
              sku="4410-AUDI" 
              price={350} 
              qty={1} 
            />
            <OrderItem 
              name="Vessel Matte Obsidian" 
              sku="1092-VESL" 
              price={45} 
              qty={2} 
            />
          </View>

          {/* Total Card */}
          <View style={styles.totalCard}>
            <View style={styles.totalHeader}>
              <View>
                <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                <Text style={styles.grandTotalValue}>$680.00</Text>
              </View>
              <Ionicons name="card" size={32} color="#FFFFFF20" />
            </View>
            
            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Subtotal</Text>
                <Text style={styles.breakdownValue}>$635.00</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Tax (7%)</Text>
                <Text style={styles.breakdownValue}>$44.45</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Service Fee</Text>
                <Text style={styles.breakdownValue}>$0.55</Text>
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
            />
            <PaymentOption 
              icon="card-outline" 
              title="Credit / Debit Card" 
              sub="CHIP & PIN, SWIPE" 
              selected
            />
            <PaymentOption 
              icon="wallet-outline" 
              title="Digital Wallet" 
              sub="APPLE PAY, GOOGLE PAY" 
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <Pressable style={styles.mainBtn}>
            <Text style={styles.mainBtnText}>PROCESS TRANSACTION</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function OrderItem({ name, sku, price, qty }: { name: string, sku: string, price: number, qty: number }) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemThumb} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemSku}>SKU: {sku}</Text>
      </View>
      <View style={styles.itemPriceQty}>
        <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
        <Text style={styles.itemQty}>QTY: {qty.toString().padStart(2, '0')}</Text>
      </View>
    </View>
  );
}

function PaymentOption({ icon, title, sub, selected }: { icon: any, title: string, sub: string, selected?: boolean }) {
  return (
    <View style={[styles.paymentBtn, selected && styles.paymentBtnActive]}>
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
    </View>
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
  mainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
