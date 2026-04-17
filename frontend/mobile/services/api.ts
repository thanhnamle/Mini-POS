import { API_BASE_URL, HAS_REMOTE_API } from '../constants/config';
import type { Order, Product } from '../types/models';
import {
  createOrderLocal,
  createProductLocal,
  deleteProductLocal,
  fetchOrdersLocal,
  fetchProductsLocal,
  updateProductLocal,
} from './mock-api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data &&
        typeof data === 'object' &&
        (('message' in data && (data as { message?: string }).message) ||
          ('error' in data && (data as { error?: string }).error))) ||
      `Request failed (${res.status})`;

    throw new Error(String(message));
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeProduct(product: Partial<Product>): Product {
  return {
    ...product,
    productId: product.productId ?? product.id ?? '',
    id: product.id ?? product.productId ?? '',
    name: product.name ?? 'Untitled product',
    category: product.category ?? 'General',
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? product.inventory ?? 0),
    inventory: Number(product.inventory ?? product.stock ?? 0),
    description: product.description ?? '',
  };
}

function normalizeOrder(order: Partial<Order> & { totalAmount?: number; timestamp?: string }): Order {
  const items = Array.isArray(order.items) ? order.items : [];
  const totalFromItems = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const total = Number(order.total ?? order.totalAmount ?? totalFromItems);
  const status = typeof order.status === 'string' ? order.status : 'pending';
  const createdAt = order.createdAt ?? order.timestamp ?? new Date().toISOString();

  return {
    ...order,
    orderId: order.orderId ?? order.id ?? '',
    id: order.id ?? order.orderId ?? '',
    items,
    total,
    status,
    createdAt,
  };
}

function hasUpdatedProduct(data: Product | { updatedProduct?: Product }): data is { updatedProduct?: Product } {
  return typeof data === 'object' && data !== null && 'updatedProduct' in data;
}

export async function fetchProducts(): Promise<Product[]> {
  if (!HAS_REMOTE_API) {
    return fetchProductsLocal();
  }

  const data = await request<Product[] | { items: Product[] }>('/products');
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return items.map(normalizeProduct);
}

export async function createProduct(product: Product): Promise<Product> {
  if (!HAS_REMOTE_API) {
    return createProductLocal(product);
  }

  const data = await request<Product>('/products', { method: 'POST', body: product });
  return normalizeProduct(data);
}

export async function updateProduct(id: string, product: Product): Promise<Product> {
  if (!HAS_REMOTE_API) {
    return updateProductLocal(id, product);
  }

  const data = await request<Product | { updatedProduct?: Product }>(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: product,
  });

  const updated = hasUpdatedProduct(data) ? data.updatedProduct : data;

  return normalizeProduct(updated ?? { ...product, productId: id, id });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!HAS_REMOTE_API) {
    await deleteProductLocal(id);
    return;
  }

  await request<void>(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function fetchOrders(): Promise<Order[]> {
  if (!HAS_REMOTE_API) {
    return fetchOrdersLocal();
  }

  const data = await request<Order[] | { items: Order[] }>('/orders');
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return items.map((order) => normalizeOrder(order));
}

export async function createOrder(order: Order): Promise<Order> {
  if (!HAS_REMOTE_API) {
    return createOrderLocal(order);
  }

  const data = await request<Order>('/orders', { method: 'POST', body: order });
  return normalizeOrder(data);
}
