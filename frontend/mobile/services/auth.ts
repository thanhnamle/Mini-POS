import type { User } from '../types/models';
import * as storage from './storage';

const KEY = 'minipos.session';

export async function signIn({ email, password }: { email: string; password: string }): Promise<User> {
  if (!email || !password) throw new Error('Enter email and password');
  const role: User['role'] = email.toLowerCase().includes('admin') ? 'admin' : 'cashier';
  const user: User = { email, role, name: role === 'admin' ? 'Store Owner' : 'Cashier' };
  await storage.setItem(KEY, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> { await storage.removeItem(KEY); }

export async function getSession(): Promise<User | null> {
  const raw = await storage.getItem(KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}
