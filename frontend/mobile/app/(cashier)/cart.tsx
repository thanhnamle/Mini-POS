import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import ActionButton from '../../components/ActionButton';
import { useCart } from '../../store/CartContext';
import { createOrder } from '../../services/api';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../../constants/theme';
import { CURRENCY } from '../../constants/config';
import type { Order, OrderItem } from '../../types/models';

export default function Cart() {
  const router = useRouter();
  const { items, setQty, remove, totals, clear } = useCart();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onCheckout = async () => {
    if (items.length === 0) return;
    const payload: Order = {
      items: items.map(({ productId, name, price, quantity }: OrderItem) => ({ productId, name, price, quantity })),
      total: totals.subtotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    try {
      setSubmitting(true);
      await createOrder(payload);
      clear();
      Alert.alert('Order created', `Total ${CURRENCY}${totals.subtotal.toFixed(2)}`, [
        { text: 'View recent', onPress: () => router.push('/(cashier)/recent') },
        { text: 'Done', style: 'cancel' },
      ]);
    } catch (e) {
      Alert.alert('Checkout failed', e instanceof Error ? e.message : 'Unknown error');
    } finally { setSubmitting(false); }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Cart" subtitle={`${totals.count} item${totals.count === 1 ? '' : 's'}`} />
      <FlatList<OrderItem>
        data={items}
        keyExtractor={(x) => x.productId}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 220 }}
        ListEmptyComponent={<EmptyState icon="cart-outline" title="Cart is empty" subtitle="Add items from the shop tab." action={<ActionButton title="Browse products" onPress={() => router.push('/(cashier)')} />} />}
        renderItem={({ item }) => (
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={TYPE.title}>{item.name}</Text>
              <Text style={[TYPE.caption, { marginTop: 2 }]}>{CURRENCY}{item.price.toFixed(2)} each</Text>
            </View>
            <View style={s.qty}>
              <TouchableOpacity onPress={() => setQty(item.productId, item.quantity - 1)} style={s.qtyBtn}>
                <Ionicons name="remove" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={[TYPE.title, { width: 24, textAlign: 'center' }]}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => setQty(item.productId, item.quantity + 1)} style={s.qtyBtn}>
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => remove(item.productId)} hitSlop={10} style={{ marginLeft: SPACING.md }}>
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={s.footer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md }}>
            <Text style={TYPE.label}>Subtotal</Text>
            <Text style={[TYPE.h2, { fontSize: 20 }]}>{CURRENCY}{totals.subtotal.toFixed(2)}</Text>
          </View>
          <ActionButton title={`Checkout · ${CURRENCY}${totals.subtotal.toFixed(2)}`} onPress={onCheckout} loading={submitting} />
          <View style={{ height: 8 }} />
          <ActionButton title="Clear cart" variant="ghost" onPress={clear} />
        </View>
      )}
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.soft },
  qty: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceMuted, borderRadius: RADII.pill, padding: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
});
