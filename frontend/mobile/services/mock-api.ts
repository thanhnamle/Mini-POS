import type { Order, Product } from '../types/models';
import * as storage from './storage';

const PRODUCTS_KEY = 'minipos.mock.products';
const ORDERS_KEY = 'minipos.mock.orders';

const seedProducts: Product[] = [
  {
    productId: 'prod-candle',
    name: 'Sandal Candle',
    category: 'Home',
    price: 24,
    stock: 18,
    description: 'Warm sandalwood candle for boutique shelves.',
  },
  {
    productId: 'prod-tea',
    name: 'Jasmine Tea Tin',
    category: 'Pantry',
    price: 16,
    stock: 7,
    description: 'Loose-leaf jasmine blend.',
  },
  {
    productId: 'prod-vase',
    name: 'Ceramic Vase',
    category: 'Decor',
    price: 42,
    stock: 3,
    description: 'Neutral ceramic vase with matte finish.',
  },
];

const seedOrders: Order[] = [
  {
    orderId: 'ord-demo-1001',
    items: [
      { productId: 'prod-candle', name: 'Sandal Candle', price: 24, quantity: 2 },
      { productId: 'prod-tea', name: 'Jasmine Tea Tin', price: 16, quantity: 1 },
    ],
    total: 64,
    status: 'pending',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    orderId: 'ord-demo-1000',
    items: [{ productId: 'prod-vase', name: 'Ceramic Vase', price: 42, quantity: 1 }],
    total: 42,
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await storage.getItem(key);

  if (!raw) {
    await storage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    await storage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<T> {
  await storage.setItem(key, JSON.stringify(value));
  return value;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    productId: product.productId ?? product.id ?? makeId('prod'),
    category: product.category ?? 'General',
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? product.inventory ?? 0),
    description: product.description ?? '',
  };
}

function normalizeOrder(order: Order): Order {
  const items = Array.isArray(order.items) ? order.items : [];
  const total =
    Number(order.total ?? 0) ||
    items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  return {
    ...order,
    orderId: order.orderId ?? order.id ?? makeId('ord'),
    items,
    total,
    status: order.status ?? 'pending',
    createdAt: order.createdAt ?? new Date().toISOString(),
  };
}

export async function fetchProductsLocal(): Promise<Product[]> {
  const products = await readJson<Product[]>(PRODUCTS_KEY, seedProducts);
  return products.map(normalizeProduct);
}

export async function createProductLocal(product: Product): Promise<Product> {
  const products = await fetchProductsLocal();
  const created = normalizeProduct({ ...product, productId: makeId('prod') });
  await writeJson(PRODUCTS_KEY, [created, ...products]);
  return created;
}

export async function updateProductLocal(id: string, product: Product): Promise<Product> {
  const products = await fetchProductsLocal();
  let updated: Product | null = null;

  const next = products.map((current) => {
    if ((current.productId ?? current.id) !== id) {
      return current;
    }

    updated = normalizeProduct({ ...current, ...product, productId: id, id });
    return updated;
  });

  if (!updated) {
    throw new Error('Product not found');
  }

  await writeJson(PRODUCTS_KEY, next);
  return updated;
}

export async function deleteProductLocal(id: string): Promise<void> {
  const products = await fetchProductsLocal();
  await writeJson(
    PRODUCTS_KEY,
    products.filter((product) => (product.productId ?? product.id) !== id)
  );
}

export async function fetchOrdersLocal(): Promise<Order[]> {
  const orders = await readJson<Order[]>(ORDERS_KEY, seedOrders);
  return orders.map(normalizeOrder);
}

export async function createOrderLocal(order: Order): Promise<Order> {
  const orders = await fetchOrdersLocal();
  const created = normalizeOrder({ ...order, orderId: makeId('ord') });
  await writeJson(ORDERS_KEY, [created, ...orders]);
  return created;
}
