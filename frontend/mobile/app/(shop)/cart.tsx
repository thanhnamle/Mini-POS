import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { products } from '../../constants/products';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Mock cart items for demo
  const [cartItems, setCartItems] = useState([
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 1 },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15;
  const total = subtotal + shipping;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1A1814" />
          </Pressable>
          <Text style={styles.headerTitle}>SHOPPING BAG</Text>
          <View style={{ width: 44 }} />
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="bag-outline" size={64} color="#EAE6DE" />
              <Text style={styles.emptyText}>Your bag is empty</Text>
              <Pressable style={styles.shopBtn} onPress={() => router.replace('/(shop)/explore')}>
                <Text style={styles.shopBtnText}>CONTINUE SHOPPING</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={[styles.itemArtwork, { backgroundColor: item.surface }]}>
                <Ionicons name={item.icon} size={40} color={item.iconColor} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category} • M</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityWrap}>
                <Pressable onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                  <Ionicons name="remove" size={16} color="#1A1814" />
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                  <Ionicons name="add" size={16} color="#1A1814" />
                </Pressable>
              </View>
              <Pressable onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Ionicons name="close" size={20} color="#8C8478" />
              </Pressable>
            </View>
          )}
        />

        {cartItems.length > 0 && (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            <Pressable style={styles.checkoutBtn}>
              <Text style={styles.checkoutBtnText}>CHECKOUT NOW</Text>
              <View style={styles.btnIcon}>
                <Ionicons name="arrow-forward" size={18} color="#1A1814" />
              </View>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 56,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1814',
    letterSpacing: 2,
  },
  listContent: {
    padding: 24,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  itemArtwork: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1814',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 13,
    color: '#8C8478',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
  },
  quantityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F4F1',
    borderRadius: 20,
    padding: 4,
    marginRight: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8C8478',
    marginTop: 16,
    marginBottom: 32,
  },
  shopBtn: {
    height: 54,
    paddingHorizontal: 32,
    borderRadius: 27,
    backgroundColor: '#1A1814',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F4F1EC',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6B6560',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1814',
  },
  totalRow: {
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F4F1EC',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1814',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1814',
  },
  checkoutBtn: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1814',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  btnIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C8B890',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
