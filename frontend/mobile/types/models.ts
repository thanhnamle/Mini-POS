export type Role = 'admin' | 'cashier';

export interface User {
  email: string;
  role: Role;
  name: string;
}

export interface Product {
  productId?: string;
  id?: string;
  name: string;
  category?: string;
  price: number;
  stock?: number;
  inventory?: number;
  description?: string;
}

export interface OrderItem {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export interface Order {
  orderId?: string;
  id?: string;
  items: OrderItem[];
  total?: number;
  status?: OrderStatus | string;
  createdAt?: string;
}

export interface AppSettings {
  notifications: { orders: boolean; lowStock: boolean; marketing: boolean };
  theme: 'light' | 'dark';
  currency: string;
  taxRate: number;
}
