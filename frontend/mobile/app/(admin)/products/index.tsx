import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import EmptyState from '../../../components/EmptyState';
import ActionButton from '../../../components/ActionButton';
import StatusPill from '../../../components/StatusPill';
import { useProducts } from '../../../hooks/useProducts';
import { deleteProduct } from '../../../services/api';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../../../constants/theme';
import { CURRENCY } from '../../../constants/config';
import type { Product } from '../../../types/models';

export default function ProductsList() {
  const router = useRouter();
  const { products, loading, error, reload, setProducts } = useProducts();
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

  const onDelete = (p: Product) => {
    const id = (p.productId ?? p.id) as string;
    Alert.alert('Delete product', `Remove “${p.name}”?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const prev = products;
        setProducts((cur) => cur.filter((x) => (x.productId ?? x.id) !== id));
        try { await deleteProduct(id); }
        catch (e) { setProducts(prev); Alert.alert('Failed', e instanceof Error ? e.message : 'Unknown error'); }
      }},
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Catalog" subtitle={`${products.length} products`}
        right={<TouchableOpacity onPress={() => router.push('/(admin)/products/edit')} hitSlop={10}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>} />

      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={COLORS.textSubtle} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search products" placeholderTextColor={COLORS.textSubtle} style={s.search} />
      </View>

      <View style={s.chips}>
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
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxxl }}
        refreshing={loading} onRefresh={reload}
        ListEmptyComponent={!loading ? (
          <EmptyState icon="pricetags-outline" title={error ? 'Could not load' : 'No products'}
            subtitle={error ?? 'Add your first item to get started.'}
            action={<ActionButton title="Add product" onPress={() => router.push('/(admin)/products/edit')} />} />
        ) : null}
        renderItem={({ item }) => {
          const stock = Number(item.stock ?? item.inventory ?? 0);
          const id = (item.productId ?? item.id) as string;
          return (
            <TouchableOpacity activeOpacity={0.85} style={s.card}
              onPress={() => router.push({ pathname: '/(admin)/products/edit', params: { id } })}>
              <View style={{ flex: 1 }}>
                <Text style={TYPE.title}>{item.name}</Text>
                <Text style={[TYPE.caption, { marginTop: 2 }]}>{item.category ?? 'Uncategorized'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={[TYPE.h2, { fontSize: 18 }]}>{CURRENCY}{Number(item.price ?? 0).toFixed(2)}</Text>
                  <View style={{ width: SPACING.md }} />
                  <StatusPill status={stock <= 5 ? 'low' : 'ok'} label={`${stock} in stock`} />
                </View>
              </View>
              <TouchableOpacity onPress={() => onDelete(item)} hitSlop={10} style={s.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: SPACING.lg, paddingHorizontal: SPACING.md, paddingVertical: 10, borderRadius: RADII.md, gap: 8 },
  search: { flex: 1, color: COLORS.text, fontSize: 15 },
  chips: { paddingVertical: SPACING.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADII.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  chipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADII.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.soft },
  deleteBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fbeae5', alignItems: 'center', justifyContent: 'center' },
});
