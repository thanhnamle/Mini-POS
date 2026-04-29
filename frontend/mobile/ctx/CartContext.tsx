import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Product } from '../constants/products';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  isCheckoutActive: boolean;
  setCheckoutActive: (active: boolean) => void;
  prepareCheckout: () => void;
  loadCartFromDB: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);

  // 1. Sync from DB on mount or user change
  const loadCartFromDB = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading cart:', error.message);
      return;
    }

    if (data) {
      const mappedItems: CartItem[] = data.map(item => ({
        ...item.products,
        quantity: item.quantity,
        selectedSize: item.selected_size,
        surface: item.products.surface || '#F6F6F4',
        accent: item.products.accent || '#EAE6DE',
        icon: item.products.icon || 'shirt-outline',
        iconColor: item.products.icon_color || '#111111',
      }));
      setCart(mappedItems);
    }
  }, [user]);

  useEffect(() => {
    loadCartFromDB();
  }, [loadCartFromDB]);

  const addToCart = async (product: any, size: string, quantity: number = 1) => {
    if (!user) {
      // Fallback to local state if not logged in (optional)
      setCart(prev => {
        const existing = prev.find(i => i.id === product.id && i.selectedSize === size);
        if (existing) return prev.map(i => i.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { ...product, quantity: quantity, selectedSize: size }];
      });
      return;
    }
 
    try {
      const { error } = await supabase.rpc('add_to_cart_v2', {
        p_user_id: user.id,
        p_product_id: product.id,
        p_size: size,
        p_quantity: quantity
      });

      if (error) throw error;
      
      await loadCartFromDB();
      
    } catch (err: any) {
      console.error('Add to cart error:', err.message);
      Alert.alert('Cart Error', `Could not add to cart: ${err.message}`);
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('selected_size', size);
      
      if (error) {
        Alert.alert('Error', 'Could not remove item');
      } else {
        await loadCartFromDB();
      }
    } else {
      setCart(prev => prev.filter(i => !(i.id === productId && i.selectedSize === size)));
    }
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      setCart([]);
    } else {
      setCart([]);
    }
    setIsCheckoutActive(false);
  };

  const prepareCheckout = () => {
    if (cart.length > 0) {
      setIsCheckoutActive(true);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      totalAmount, 
      itemCount,
      isCheckoutActive,
      setCheckoutActive: setIsCheckoutActive,
      prepareCheckout,
      loadCartFromDB
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
