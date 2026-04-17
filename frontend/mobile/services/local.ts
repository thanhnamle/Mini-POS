import type { AppSettings } from '../types/models';
import * as storage from './storage';

const SETTINGS_KEY = 'minipos.settings';

const defaults: AppSettings = {
  notifications: { orders: true, lowStock: true, marketing: false },
  theme: 'light',
  currency: 'USD',
  taxRate: 8.25,
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await storage.getItem(SETTINGS_KEY);
  return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<AppSettings>) } : defaults;
}

export async function saveSettings(s: AppSettings): Promise<AppSettings> {
  await storage.setItem(SETTINGS_KEY, JSON.stringify(s));
  return s;
}

export async function localRestock(productId: string, qty: number): Promise<number> {
  const key = `minipos.restock.${productId}`;
  const prev = Number((await storage.getItem(key)) || 0);
  const next = prev + Number(qty || 0);
  await storage.setItem(key, String(next));
  return next;
}
