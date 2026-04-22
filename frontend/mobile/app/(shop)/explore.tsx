import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../ctx/CartContext';
import CartPreview from '../../components/CartPreview';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { products, Product, Category } from '../../constants/products';

const categories: Category[] = ['All', 'Apparel', 'Accessories', 'Objects'];

export default function ShopHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            {isSearchActive ? (
              <View style={styles.searchBarContainer}>
                <Ionicons name="search-outline" size={20} color="#737373" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products..."
                  placeholderTextColor="#A3A3A3"
                  autoFocus
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <Pressable onPress={() => { setIsSearchActive(false); setSearchQuery(''); }}>
                  <Ionicons name="close-circle" size={20} color="#737373" />
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable style={styles.iconButton} onPress={() => setIsSearchActive(true)}>
                  <Ionicons name="search-outline" size={24} color="#111111" />
                </Pressable>

                <Text style={styles.brand}>ATELIER.</Text>

                <View style={styles.headerActions}>
                  <View style={styles.cartWrap}>
                    <Pressable style={styles.iconButton} onPress={() => setIsCartVisible(true)}>
                      <Ionicons name="bag-outline" size={28} color="#111111" />
                    </Pressable>
                    {itemCount > 0 && (
                      <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{itemCount}</Text>
                      </View>
                    )}
                  </View>

                  <Pressable style={styles.avatar} onPress={() => router.push('/(shop)/settings')}>
                    <Text style={styles.avatarText}>CA</Text>
                  </Pressable>
                </View>
              </>
            )}
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
              <Pressable
                key={product.id}
                style={styles.card}
                onPress={() => router.push({
                  pathname: '/(shop)/product/[id]',
                  params: { id: product.id }
                })}
              >
                <ProductArtwork product={product} />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <CartPreview visible={isCartVisible} onClose={() => setIsCartVisible(false)} />
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
    gap: 16,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F1',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
    paddingVertical: 8,
  },
  // iconButton: {
  //   position: 'relative',
  //   width: 36,
  //   height: 36,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#F6F6F4',
    borderRadius: 32,
    padding: 32,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -1,
  },
  modalSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAE6DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    marginBottom: 24,
  },
  previewItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  previewItemThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#111111',
    marginRight: 16,
  },
  previewItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  previewItemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },
  previewItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  previewItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  previewItemQty: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8478',
    backgroundColor: '#EAE6DE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewItemVariant: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8478',
  },
  giftWrapBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  giftWrapText: {
    fontSize: 10,
    color: '#8C8478',
    flex: 1,
    lineHeight: 14,
  },
  modalFooter: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#EAE6DE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
  },
  taxNote: {
    fontSize: 10,
    color: '#8C8478',
    textAlign: 'right',
  },
  proceedBtn: {
    height: 56,
    backgroundColor: '#111111',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
