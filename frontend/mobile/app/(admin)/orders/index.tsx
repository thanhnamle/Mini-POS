import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import StatusPill from '../../../components/StatusPill';
import EmptyState from '../../../components/EmptyState';
import { useOrders } from '../../../hooks/useOrders';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../../../constants/theme';
import { CURRENCY } from '../../../constants/config';
import type { Order } from '../../../types/models';

const TABS = ['All', 'Pending', 'Completed'] as const;
type Tab = typeof TABS[number];

export default function OrdersList() {
  const router = useRouter();
  const { orders, loading, error, reload } = useOrders();
  const [tab, setTab] = useState<Tab>('All');

  const data: Order[] = useMemo(() => {
    const sorted = [...orders].sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
    if (tab === 'All') return sorted;
    return sorted.filter((o) => String(o.status ?? '').toLowerCase() === tab.toLowerCase());
  }, [orders, tab]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Orders" subtitle={`${orders.length} total`} />
      <View style={s.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[s.tab, tab === t && s.tabOn]}>
            <Text style={[TYPE.label, tab === t && { color: COLORS.white }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList<Order>
        data={data}
        keyExtractor={(o, i) => String(o.orderId ?? o.id ?? i)}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxxl }}
        refreshing={loading} onRefresh={reload}
        ListEmptyComponent={!loading ? <EmptyState icon="receipt-outline" title={error ? 'Could not load' : 'No orders yet'} subtitle={error ?? 'Orders created at checkout will appear here.'} /> : null}
        renderItem={({ item }) => {
          const total = Number(item.total ?? (item.items ?? []).reduce((s, x) => s + Number(x.price || 0) * Number(x.quantity || 0), 0));
          const id = (item.orderId ?? item.id ?? '') as string;
          return (
            <TouchableOpacity activeOpacity={0.85} style={s.card} onPress={() => router.push({ pathname: '/(admin)/orders/[id]', params: { id } })}>
              <View style={{ flex: 1 }}>
                <Text style={TYPE.title}>Order #{id.slice(-6) || '—'}</Text>
                <Text style={[TYPE.caption, { marginTop: 2 }]}>{(item.items ?? []).length} items · {String(item.createdAt ?? '').slice(0, 10) || '—'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[TYPE.h2, { fontSize: 18 }]}>{CURRENCY}{total.toFixed(2)}</Text>
                <View style={{ height: 6 }} />
                <StatusPill status={item.status ?? 'completed'} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADII.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADII.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.soft },
});
