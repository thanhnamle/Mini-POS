import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import SectionCard from '../../components/SectionCard';
import MetricCard from '../../components/MetricCard';
import ListRow from '../../components/ListRow';
import StatusPill from '../../components/StatusPill';
import EmptyState from '../../components/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { COLORS, SPACING, TYPE } from '../../constants/theme';
import { CURRENCY } from '../../constants/config';
import type { Order, OrderItem } from '../../types/models';

const LOW_STOCK_THRESHOLD = 5;
const sumItems = (items: OrderItem[] = []): number =>
  items.reduce((s, x) => s + Number(x.price || 0) * Number(x.quantity || 0), 0);

export default function Dashboard() {
  const router = useRouter();
  const { products, loading: pLoading, reload: reloadP } = useProducts();
  const { orders,   loading: oLoading, reload: reloadO } = useOrders();

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todays = orders.filter((o) => String(o.createdAt ?? '').slice(0, 10) === today);
    const sales = todays.reduce((s, o) => s + Number(o.total ?? sumItems(o.items)), 0);
    const pending = orders.filter((o) => String(o.status ?? '').toLowerCase() === 'pending').length;
    const low = products.filter((p) => Number(p.stock ?? p.inventory ?? 0) <= LOW_STOCK_THRESHOLD).length;
    return { sales, pending, low, productCount: products.length };
  }, [orders, products]);

  const refreshing = pLoading || oLoading;
  const onRefresh = () => { reloadP(); reloadO(); };

  const pendingOrders: Order[] = orders.filter((o) => String(o.status ?? '').toLowerCase() === 'pending').slice(0, 4);
  const lowStock = products.filter((p) => Number(p.stock ?? p.inventory ?? 0) <= LOW_STOCK_THRESHOLD).slice(0, 4);

  return (
    <>
      <Header title="Store Overview" subtitle="Your shop at a glance" />
      <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
        <View style={s.metricsRow}>
          <MetricCard label="Today’s sales" value={`${CURRENCY}${stats.sales.toFixed(2)}`} icon="trending-up-outline" />
          <View style={{ width: SPACING.md }} />
          <MetricCard label="Pending orders" value={String(stats.pending)} icon="time-outline" accent />
        </View>
        <View style={[s.metricsRow, { marginTop: SPACING.md }]}>
          <MetricCard label="Products" value={String(stats.productCount)} icon="pricetags-outline" />
          <View style={{ width: SPACING.md }} />
          <MetricCard label="Low stock" value={String(stats.low)} icon="alert-circle-outline" />
        </View>

        <View style={{ height: SPACING.lg }} />

        <SectionCard title="Quick actions">
          <ListRow icon="add-circle-outline" title="Add product"        subtitle="Create a new catalog item" onPress={() => router.push('/(admin)/products/edit')} />
          <ListRow icon="receipt-outline"    title="Review orders"      subtitle="Pending and recent activity" onPress={() => router.push('/(admin)/orders')} />
          <ListRow icon="cube-outline"       title="Inventory & restock" subtitle="Address low-stock items" onPress={() => router.push('/(admin)/inventory')} last />
        </SectionCard>

        <SectionCard
          title="Pending orders"
          action={<Text style={[TYPE.label, { color: COLORS.accent }]} onPress={() => router.push('/(admin)/orders')}>See all</Text>}
        >
          {pendingOrders.map((o, i, a) => {
            const id = (o.orderId ?? o.id ?? '').toString();
            return (
              <ListRow key={id || i}
                icon="receipt-outline"
                title={`Order #${id.slice(-6) || (i + 1)}`}
                subtitle={`${(o.items?.length ?? 0)} items · ${CURRENCY}${Number(o.total ?? sumItems(o.items)).toFixed(2)}`}
                right={<StatusPill status={o.status} />}
                onPress={() => router.push({ pathname: '/(admin)/orders/[id]', params: { id } })}
                last={i === a.length - 1}
              />
            );
          })}
          {!oLoading && pendingOrders.length === 0 && (
            <EmptyState icon="checkmark-done-outline" title="All caught up" subtitle="No orders awaiting action." />
          )}
        </SectionCard>

        <SectionCard title="Low stock alerts">
          {lowStock.map((p, i, a) => {
            const id = (p.productId ?? p.id ?? '').toString();
            return (
              <ListRow key={id || i}
                icon="alert-circle-outline"
                title={p.name}
                subtitle={`${Number(p.stock ?? p.inventory ?? 0)} left`}
                right={<StatusPill status="low" />}
                onPress={() => router.push({ pathname: '/(admin)/products/edit', params: { id } })}
                last={i === a.length - 1}
              />
            );
          })}
          {!pLoading && lowStock.length === 0 && (
            <EmptyState icon="leaf-outline" title="Healthy shelves" subtitle="No items below threshold." />
          )}
        </SectionCard>
      </ScreenContainer>
    </>
  );
}
const s = StyleSheet.create({ metricsRow: { flexDirection: 'row' } });
