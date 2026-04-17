import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import type { Product } from '../types/models';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      setProducts(await fetchProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { products, loading, error, reload: load, setProducts };
}
