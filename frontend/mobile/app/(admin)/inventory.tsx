import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import ScreenContainer from '../../components/ScreenContainer';
import SectionCard from '../../components/SectionCard';
import MetricCard from '../../components/MetricCard';
import ListRow from '../../components/ListRow';
import StatusPill from '../../components/StatusPill';
import EmptyState from '../../components/EmptyState';
import ActionButton from '../../components/ActionButton';
import FormField from '../../components/FormField';
import { useProducts } from '../../hooks/useProducts';
import { updateProduct } from '../../services/api';
import { localRestock } from '../../services/local';
import { SPACING } from '../../constants/theme';

const LOW = 5;

export default function Inventory() {
  const { products, loading, reload, setProducts } = useProducts();
  const [restockId, setRestockId] = useState<string | null>(null);
  const [qty, setQty] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const grouped = useMemo(() => {
    const low = products.filter((p) => Number(p.stock ?? p.inventory ?? 0) <= LOW);
    const ok  = products.filter((p) => Number(p.stock ?? p.inventory ?? 0) >  LOW);
    return { low, ok };
  }, [products]);

  const onRestock = async () => {
    const p = products.find((x) => (x.productId ?? x.id) === restockId);
    if (!p || !restockId) return;
    const add = Number(qty);
    if (!add || add <= 0) { Alert.alert('Enter a quantity'); return; }
    const next = Number(p.stock ?? p.inventory ?? 0) + add;
    try {
      setSaving(true);
      try { await updateProduct(restockId, { ...p, stock: next }); }
      catch { await localRestock(restockId, add); }
      setProducts((cur) => cur.map((x) => (x.productId ?? x.id) === restockId ? { ...x, stock: next } : x));
      setRestockId(null); setQty('');
    } catch (e) { Alert.alert('Failed', e instanceof Error ? e.message : 'Unknown error'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Header title="Inventory" subtitle="Track and replenish stock" />
      <ScreenContainer refreshing={loading} onRefresh={reload}>
        <View style={s.row}>
          <MetricCard label="Items" value={String(products.length)} icon="cube-outline" />
          <View style={{ width: SPACING.md }} />
          <MetricCard label="Low stock" value={String(grouped.low.length)} icon="alert-circle-outline" accent />
        </View>
        <View style={{ height: SPACING.lg }} />

        <SectionCard title="Needs attention">
          {grouped.low.length === 0
            ? <EmptyState icon="leaf-outline" title="Healthy shelves" subtitle="No items below threshold." />
            : grouped.low.map((p, i, a) => {
                const id = (p.productId ?? p.id) as string;
                return (
                  <ListRow key={id || i}
                    icon="alert-circle-outline"
                    title={p.name}
                    subtitle={`${Number(p.stock ?? p.inventory ?? 0)} left · ${p.category ?? '—'}`}
                    right={<StatusPill status="low" />}
                    onPress={() => { setRestockId(id); setQty(''); }}
                    last={i === a.length - 1}
                  />
                );
              })}
        </SectionCard>

        {restockId && (
          <SectionCard title="Restock">
            <FormField label="Add quantity" value={qty} onChangeText={setQty} placeholder="e.g. 10" keyboardType="number-pad" />
            <ActionButton title="Confirm restock" onPress={onRestock} loading={saving} />
            <View style={{ height: 8 }} />
            <ActionButton title="Cancel" variant="ghost" onPress={() => setRestockId(null)} />
          </SectionCard>
        )}

        <SectionCard title="In stock">
          {grouped.ok.length === 0
            ? <EmptyState icon="cube-outline" title="Nothing yet" />
            : grouped.ok.slice(0, 8).map((p, i, a) => {
                const id = (p.productId ?? p.id) as string;
                return (
                  <ListRow key={id || i}
                    icon="cube-outline"
                    title={p.name}
                    subtitle={`${Number(p.stock ?? p.inventory ?? 0)} on hand`}
                    right={<StatusPill status="ok" />}
                    last={i === a.length - 1}
                  />
                );
              })}
        </SectionCard>
      </ScreenContainer>
    </>
  );
}
const s = StyleSheet.create({ row: { flexDirection: 'row' } });
