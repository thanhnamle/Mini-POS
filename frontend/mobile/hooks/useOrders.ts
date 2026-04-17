import { useCallback, useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';
import type { Order } from '../types/models';

export interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      setOrders(await fetchOrders());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { orders, loading, error, reload: load };
}
