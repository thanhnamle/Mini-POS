import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenContainer from '../../../components/ScreenContainer';
import Header from '../../../components/Header';
import SectionCard from '../../../components/SectionCard';
import ListRow from '../../../components/ListRow';
import StatusPill from '../../../components/StatusPill';
import EmptyState from '../../../components/EmptyState';
import { fetchOrders } from '../../../services/api';
import { SPACING, TYPE } from '../../../constants/theme';
import { CURRENCY } from '../../../constants/config';
import type { Order } from '../../../types/models';

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchOrders();
        setOrder(items.find((x) => String(x.orderId ?? x.id) === String(id)) ?? null);
      } catch (e) { setError(e instanceof Error ? e.message : 'Unknown error'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (<><Header title="Order" back /><ScreenContainer><Text style={TYPE.caption}>Loading…</Text></ScreenContainer></>);
  if (!order) return (<><Header title="Order" back /><ScreenContainer><EmptyState icon="alert-circle-outline" title="Not found" subtitle={error ?? 'This order is unavailable.'} /></ScreenContainer></>);

  const total = Number(order.total ?? (order.items ?? []).reduce((s, x) => s + Number(x.price || 0) * Number(x.quantity || 0), 0));

  return (
    <>
      <Header title={`Order #${String(id ?? '').slice(-6)}`} subtitle={String(order.createdAt ?? '').slice(0, 16)} back />
      <ScreenContainer>
        <SectionCard title="Status" action={<StatusPill status={order.status ?? 'completed'} />}>
          <Text style={TYPE.caption}>Items: {(order.items ?? []).length}</Text>
          <Text style={[TYPE.h2, { marginTop: 6 }]}>{CURRENCY}{total.toFixed(2)}</Text>
        </SectionCard>
        <SectionCard title="Items">
          {(order.items ?? []).map((it, i, a) => (
            <ListRow key={`${it.productId}-${i}`}
              icon="cube-outline"
              title={it.name ?? it.productId}
              subtitle={`${it.quantity} × ${CURRENCY}${Number(it.price).toFixed(2)}`}
              right={<Text style={TYPE.title}>{CURRENCY}{(Number(it.price) * Number(it.quantity)).toFixed(2)}</Text>}
              last={i === a.length - 1}
            />
          ))}
        </SectionCard>
        <Text style={[TYPE.caption, { marginTop: SPACING.md, textAlign: 'center' }]}>Read-only — status updates require backend support.</Text>
      </ScreenContainer>
    </>
  );
}
