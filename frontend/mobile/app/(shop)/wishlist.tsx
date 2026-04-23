import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../ctx/AuthContext';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  surface: string;
  accent: string;
  icon: any;
  iconColor: string;
};

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [categories, setCategories] = useState(['All Items']);

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          product_id,
          products (
            *,
            categories (name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const mapped: Product[] = (data || []).map((item: any) => {
        const p = item.products;
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.categories?.name || 'Collection',
          surface: p.surface || '#F6F6F4',
          accent: p.accent || '#EAE6DE',
          icon: p.icon || 'shirt-outline',
          iconColor: p.icon_color || '#111111',
        };
      });

      setItems(mapped);
      
      // Extract unique categories
      const uniqueCats = ['All Items', ...new Set(mapped.map(i => i.category))];
      setCategories(uniqueCats);
      
    } catch (err: any) {
      console.error('Fetch wishlist error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', productId);
      
      if (!error) {
        setItems(prev => prev.filter(item => item.id !== productId));
      }
    } catch (err: any) {
      console.error('Remove error:', err.message);
    }
  };

  const filteredItems = items.filter(item => 
    selectedCategory === 'All Items' || item.category === selectedCategory
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable 
      style={styles.productCard}
      onPress={() => router.push(`/(shop)/product/${item.id}`)}
    >
      <View style={[styles.imageContainer, { backgroundColor: item.surface }]}>
        <View style={[styles.glow, { backgroundColor: item.accent }]} />
        <Ionicons name={item.icon} size={100} color={item.iconColor} />
        
        <Pressable 
          style={styles.heartBtn}
          onPress={() => removeFromWishlist(item.id)}
        >
          <Ionicons name="heart" size={20} color="#FF4B4B" />
        </Pressable>
      </View>
      
      <View style={styles.productInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.productMeta}>{item.category} • Size M</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.push('/(shop)/settings')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color="#111111" />
          </Pressable>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.pageTitle}>Saved Items</Text>
          <Text style={styles.pageSubtitle}>{items.length} ITEMS CURATED</Text>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {categories.map((cat) => (
              <Pressable 
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#111111" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={64} color="#EAE6DE" />
              <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
              <Text style={styles.emptySubtitle}>Save items you love to find them easily later.</Text>
              <Pressable style={styles.shopBtn} onPress={() => router.push('/(shop)/explore')}>
                <Text style={styles.shopBtnText}>EXPLORE SHOP</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C8478',
    letterSpacing: 1,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F6F6F4',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#111111',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C8478',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  productCard: {
    marginBottom: 32,
  },
  imageContainer: {
    height: 380,
    borderRadius: 24,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  heartBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  productInfo: {
    marginTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    flex: 1,
    marginRight: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  productMeta: {
    fontSize: 13,
    color: '#8C8478',
    fontWeight: '600',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8C8478',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  shopBtn: {
    marginTop: 32,
    backgroundColor: '#111111',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
