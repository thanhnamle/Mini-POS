import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { OrderItem, Product } from '../types/models';

export interface CartTotals { subtotal: number; count: number; }

export interface CartContextValue {
  items: OrderItem[];
  add: (product: Product) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totals: CartTotals;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const id = (product.productId ?? product.id) as string;
      const i = prev.findIndex((x) => x.productId === id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [...prev, { productId: id, name: product.name, price: Number(product.price) || 0, quantity: 1 }];
    });
  }, []);

  const setQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) => prev
      .map((x) => x.productId === productId ? { ...x, quantity: Math.max(0, quantity) } : x)
      .filter((x) => x.quantity > 0));
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals: CartTotals = useMemo(() => ({
    subtotal: items.reduce((s, x) => s + x.price * x.quantity, 0),
    count: items.reduce((s, x) => s + x.quantity, 0),
  }), [items]);

  const value = useMemo<CartContextValue>(() => ({ items, add, setQty, remove, clear, totals }),
    [items, add, setQty, remove, clear, totals]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
