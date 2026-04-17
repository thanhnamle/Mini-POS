import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../store/CartContext';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../../constants/theme';
import { CURRENCY } from '../../constants/config';
import type { Product } from '../../types/models';

export default function CashierHome() {
  const router = useRouter();
  const { products, loading, error, reload } = useProducts();
  const { add, totals } = useCart();
  const [q, setQ] = useState<string>('');
  const [cat, setCat] = useState<string>('All');

  const categories: string[] = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category).filter((c): c is string => !!c)))],
    [products]
  );
  const filtered = useMemo(() => products.filter((p) =>
    (cat === 'All' || p.category === cat) &&
    (!q || (p.name ?? '').toLowerCase().includes(q.toLowerCase()))
  ), [products, q, cat]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Good day" subtitle="Let’s ring up some sales" />

      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={COLORS.textSubtle} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search the catalog" placeholderTextColor={COLORS.textSubtle} style={s.search} />
      </View>

      <View style={{ paddingVertical: SPACING.md }}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories} keyExtractor={(x) => x}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setCat(item)} style={[s.chip, cat === item && s.chipOn]}>
              <Text style={[TYPE.label, cat === item && { color: COLORS.white }]}>{item}</Text>
            </TouchableOpacity>
          )} />
      </View>

      <FlatList<Product>
        data={filtered}
        keyExtractor={(p, i) => String(p.productId ?? p.id ?? i)}
        numColumns={2}
        columnWrapperStyle={{ gap: SPACING.md, paddingHorizontal: SPACING.lg }}
        contentContainerStyle={{ paddingBottom: 140, gap: SPACING.md }}
        refreshing={loading} onRefresh={reload}
        ListEmptyComponent={!loading ? <EmptyState icon="bag-handle-outline" title={error ? 'Could not load' : 'No products'} subtitle={error ?? 'Ask your admin to add items.'} /> : null}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.thumb}><Ionicons name="pricetag-outline" size={22} color={COLORS.primary} /></View>
            <Text style={TYPE.title} numberOfLines={1}>{item.name}</Text>
            <Text style={[TYPE.caption, { marginTop: 2 }]} numberOfLines={1}>{item.category ?? 'Uncategorized'}</Text>
            <Text style={[TYPE.h2, { fontSize: 18, marginTop: 6 }]}>{CURRENCY}{Number(item.price ?? 0).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => add(item)} activeOpacity={0.85} style={s.addBtn}>
              <Ionicons name="add" size={18} color={COLORS.white} />
              <Text style={[TYPE.label, { color: COLORS.white, marginLeft: 6 }]}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {totals.count > 0 && (
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(cashier)/cart')} style={s.fab}>
          <View style={s.fabLeft}>
            <Ionicons name="cart-outline" size={20} color={COLORS.white} />
            <Text style={[TYPE.title, { color: COLORS.white, marginLeft: 8 }]}>{totals.count} item{totals.count > 1 ? 's' : ''}</Text>
          </View>
          <Text style={[TYPE.title, { color: COLORS.white }]}>{CURRENCY}{totals.subtotal.toFixed(2)} ›</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: SPACING.lg, paddingHorizontal: SPACING.md, paddingVertical: 10, borderRadius: RADII.md, gap: 8 },
  search: { flex: 1, color: COLORS.text, fontSize: 15 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADII.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  chipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  card: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADII.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.soft },
  thumb: { width: '100%', aspectRatio: 1.4, backgroundColor: COLORS.surfaceMuted, borderRadius: RADII.md, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  addBtn: { marginTop: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: RADII.md },
  fab: { position: 'absolute', left: SPACING.lg, right: SPACING.lg, bottom: 80, backgroundColor: COLORS.primary, borderRadius: RADII.xl, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...SHADOW.card },
  fabLeft: { flexDirection: 'row', alignItems: 'center' },
});
