import { Ionicons } from '@expo/vector-icons';

export type Category = 'All' | 'Apparel' | 'Accessories' | 'Objects';

export type Product = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  accent: string;
  surface: string;
  iconColor: string;
};

export const products: Product[] = [
  {
    id: 'heavy-cotton-shirt',
    name: 'Heavy Cotton T-Shirt',
    category: 'Apparel',
    price: 45,
    description: 'A premium, heavyweight cotton tee with a relaxed fit. Engineered for comfort and durability.',
    icon: 'shirt-outline',
    accent: '#F3F3F1',
    surface: '#FFFFFF',
    iconColor: '#C5C7C8',
  },
  {
    id: 'ceramic-mug',
    name: 'Ceramic Mug',
    category: 'Objects',
    price: 28,
    description: 'Hand-crafted ceramic mug with a matte finish. Perfect for your morning ritual.',
    icon: 'cafe-outline',
    accent: '#252525',
    surface: '#1A1A1A',
    iconColor: '#9F9F9F',
  },
  {
    id: 'canvas-tote',
    name: 'Canvas Tote',
    category: 'Accessories',
    price: 35,
    description: 'Minimalist canvas tote bag. Spacious enough for your daily essentials and more.',
    icon: 'bag-handle-outline',
    accent: '#F6F6F4',
    surface: '#FFFFFF',
    iconColor: '#B8B8B2',
  },
  {
    id: 'studio-headphones',
    name: 'Studio Headphones',
    category: 'Objects',
    price: 299,
    description: 'Professional-grade headphones for pure, unadulterated sound. Experience music as it was intended.',
    icon: 'headset-outline',
    accent: '#171717',
    surface: '#0F0F0F',
    iconColor: '#2A2A2A',
  },
  {
    id: 'worker-jacket',
    name: 'Worker Jacket',
    category: 'Apparel',
    price: 185,
    description: 'A versatile worker jacket inspired by heritage workwear. Built to last a lifetime.',
    icon: 'shirt-outline',
    accent: '#E2E2E2',
    surface: '#F4F4F4',
    iconColor: '#6C6C6C',
  },
  {
    id: 'classic-wallet',
    name: 'Classic Wallet',
    category: 'Accessories',
    price: 85,
    description: 'Slim leather wallet handcrafted with vegetable-tanned leather. Ages beautifully over time.',
    icon: 'wallet-outline',
    accent: '#D7D7D7',
    surface: '#F1F1F1',
    iconColor: '#535353',
  },
];
