import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import StatusPill from '../../components/StatusPill';
import EmptyState from '../../components/EmptyState';
import { useOrders } from '../../hooks/useOrders';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../../constants/theme';
import { CURRENCY } from '../../constants/config';
import type { Order } from '../../types/models';

export default function Recent() {
  const { orders, loading, error, reload } = useOrders();
  const sorted: Order[] = [...orders]
    .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
    .slice(0, 30);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Recent sales" subtitle="Latest 30 transactions" />
      <FlatList<Order>
        data={sorted}
        keyExtractor={(o, i) => String(o.orderId ?? o.id ?? i)}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxxl }}
        refreshing={loading} onRefresh={reload}
        ListEmptyComponent={!loading ? <EmptyState icon="time-outline" title={error ? 'Could not load' : 'No sales yet'} subtitle={error ?? 'Completed orders show up here.'} /> : null}
        renderItem={({ item }) => {
          const total = Number(item.total ?? (item.items ?? []).reduce((s, x) => s + Number(x.price || 0) * Number(x.quantity || 0), 0));
          const id = (item.orderId ?? item.id ?? '') as string;
          return (
            <View style={s.card}>
              <View style={{ flex: 1 }}>
                <Text style={TYPE.title}>Order #{id.slice(-6) || '—'}</Text>
                <Text style={[TYPE.caption, { marginTop: 2 }]}>{(item.items ?? []).length} items · {String(item.createdAt ?? '').slice(0, 16) || '—'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[TYPE.h2, { fontSize: 18 }]}>{CURRENCY}{total.toFixed(2)}</Text>
                <View style={{ height: 6 }} />
                <StatusPill status={item.status ?? 'completed'} />
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADII.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.soft },
});
