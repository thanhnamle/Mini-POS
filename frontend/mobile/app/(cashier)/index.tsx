import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Category = 'All' | 'Apparel' | 'Accessories' | 'Objects';

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  accent: string;
  surface: string;
  iconColor: string;
};

const categories: Category[] = ['All', 'Apparel', 'Accessories', 'Objects'];

const products: Product[] = [
  {
    id: 'heavy-cotton-shirt',
    name: 'Heavy Cotton T-Shirt',
    category: 'Apparel',
    price: 45,
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
    icon: 'wallet-outline',
    accent: '#D7D7D7',
    surface: '#F1F1F1',
    iconColor: '#535353',
  },
];

const bottomTabs = [
  { key: 'catalog', label: 'CATALOG', icon: 'grid-outline', active: true },
  { key: 'sales', label: 'SALES', icon: 'receipt-outline', active: false },
  { key: 'inventory', label: 'INVENTORY', icon: 'cube-outline', active: false },
  { key: 'settings', label: 'SETTINGS', icon: 'settings-outline', active: false },
] as const;

export default function CashierHomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const visibleProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 112 },
          ]}
        >
          <View style={styles.headerRow}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="menu-outline" size={28} color="#111111" />
            </Pressable>

            <Text style={styles.brand}>ATELIER POS</Text>

            <View style={styles.headerActions}>
              <View style={styles.cartWrap}>
                <Pressable style={styles.iconButton}>
                  <Ionicons name="cart-outline" size={28} color="#111111" />
                </Pressable>
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>3</Text>
                </View>
              </View>

              <Pressable style={styles.avatar}>
                <Text style={styles.avatarText}>CA</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.heroBlock}>
            <Text style={styles.heroTitle}>Curated Collection.</Text>
          </View>

          <View style={styles.categoryWrap}>
            {categories.map((category) => {
              const active = category === selectedCategory;

              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                >
                  <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.grid}>
            {visibleProducts.map((product) => (
              <View key={product.id} style={styles.card}>
                <ProductArtwork product={product} />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 18) },
        ]}
      >
        {bottomTabs.map((tab) => (
          <Pressable key={tab.key} style={styles.bottomTab}>
            <Ionicons
              name={tab.icon}
              size={22}
              color={tab.active ? '#111111' : '#737373'}
            />
            <Text style={[styles.bottomTabText, tab.active && styles.bottomTabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ProductArtwork({ product }: { product: Product }) {
  const isDark = product.surface === '#1A1A1A' || product.surface === '#0F0F0F';

  return (
    <View
      style={[
        styles.artworkFrame,
        { backgroundColor: product.surface },
      ]}
    >
      <View
        style={[
          styles.artworkGlow,
          {
            backgroundColor: product.accent,
            opacity: isDark ? 0.22 : 0.8,
          },
        ]}
      />
      <View
        style={[
          styles.artworkPlate,
          { backgroundColor: product.accent },
        ]}
      />
      <Ionicons
        name={product.icon}
        size={88}
        color={product.iconColor}
        style={styles.productIcon}
      />
      {product.id === 'studio-headphones' ? (
        <Text style={styles.artworkStamp}>SAFE WORK</Text>
      ) : null}
      {product.id === 'classic-wallet' ? (
        <MaterialCommunityIcons
          name="leaf"
          size={18}
          color="#656565"
          style={styles.walletMark}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 34,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flex: 1,
    color: '#111111',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartWrap: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D9EDF7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F172A12',
  },
  avatarText: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroBlock: {
    marginBottom: 30,
  },
  heroTitle: {
    color: '#111111',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -1,
    maxWidth: 240,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 34,
  },
  categoryChip: {
    minWidth: 74,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#111111',
  },
  categoryChipText: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 40,
  },
  card: {
    width: '47.5%',
  },
  artworkFrame: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  artworkGlow: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    borderRadius: 16,
  },
  artworkPlate: {
    position: 'absolute',
    width: '72%',
    height: '72%',
    borderRadius: 999,
    opacity: 0.45,
  },
  productIcon: {
    opacity: 0.95,
  },
  artworkStamp: {
    position: 'absolute',
    bottom: 12,
    color: '#EAEAEA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  walletMark: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    opacity: 0.8,
  },
  productName: {
    color: '#111111',
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 2,
  },
  productCategory: {
    color: '#6D6D6D',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  productPrice: {
    color: '#111111',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
    paddingTop: 14,
    paddingHorizontal: 8,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 70,
  },
  bottomTabText: {
    color: '#737373',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  bottomTabTextActive: {
    color: '#111111',
  },
});
