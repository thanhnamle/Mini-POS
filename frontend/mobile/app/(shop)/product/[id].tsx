import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../ctx/AuthContext';
import { useCart } from '../../../ctx/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: number;
  image_url: string;
  stock: number;
  // UI fields
  surface: string;
  accent: string;
  icon: any;
  iconColor: string;
  category: string;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const checkWishlist = useCallback(async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .maybeSingle();
    
    setIsInWishlist(!!data);
  }, [user, id]);

  const toggleWishlist = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please sign in to save items.');
      return;
    }
    if (!id) return;
    
    if (isInWishlist) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
      if (!error) setIsInWishlist(false);
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: id });
      if (!error) setIsInWishlist(true);
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const mappedProduct: Product = {
        ...data,
        category: data.categories?.name || 'Collection',
        surface: data.surface || '#F6F6F4',
        accent: data.accent || '#EAE6DE',
        icon: data.icon || 'shirt-outline',
        iconColor: data.icon_color || '#111111',
        description: data.description || 'No description available for this premium item.',
      };
      
      setProduct(mappedProduct);
    } catch (err: any) {
      console.error('Fetch product error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    checkWishlist();
  }, [fetchProduct, checkWishlist]);





  const handleAddToBag = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image_url || 'https://via.placeholder.com/150',
      category: product.category,
      icon: product.icon,
      surface: product.surface,
      accent: product.accent,
      iconColor: product.iconColor,
    };
    // Add multiple times based on quantity
    for(let i=0; i<quantity; i++) {
      addToCart(cartItem as any, selectedSize);
    }
    setShowCartSuccess(true);
  };
  
  const handleBuyNow = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please sign in to continue.');
      return;
    }
    if (!product) return;

    router.push({
      pathname: '/(shop)/checkout',
      params: { 
        buyNowId: product.id,
        buyNowName: product.name,
        buyNowPrice: product.price,
        buyNowSize: selectedSize,
        buyNowQty: quantity
      }
    });
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));



  if (loading) {
    return (
      <View style={styles.errorScreen}>
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorScreen}>
        <Text>Product not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Artwork Header */}
        <View style={[styles.artworkFrame, { backgroundColor: product.surface }]}>
          <SafeAreaView edges={['top']} style={styles.headerRow}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#111111" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={toggleWishlist}>
              <Ionicons 
                name={isInWishlist ? "heart" : "heart-outline"} 
                size={24} 
                color={isInWishlist ? "#FF4B4B" : "#111111"} 
              />
            </Pressable>

          </SafeAreaView>

          <View style={[styles.artworkGlow, { backgroundColor: product.accent, opacity: 0.2 }]} />
          <Ionicons name={product.icon} size={160} color={product.iconColor} />
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          {/* Ratings & Sold */}
          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Pressable key={s} onPress={() => setUserRating(s)}>
                    <Ionicons 
                      name={s <= userRating ? "star" : "star-outline"} 
                      size={18} 
                      color={s <= userRating ? "#FFC107" : "#EAE6DE"} 
                    />
                  </Pressable>
                ))}
              </View>
              <Text style={styles.ratingText}>{userRating.toFixed(1)}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.soldText}>8.2k Sold</Text>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Size Selector */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SELECT SIZE</Text>
              <Text style={styles.sizeGuide}>Size Guide</Text>
            </View>
            <View style={styles.sizeRow}>
              {sizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quantity Selector - Redesigned */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QUANTITY</Text>
            <View style={styles.qtyContainer}>
              <Pressable style={styles.qtyActionBtn} onPress={decrementQty}>
                <Ionicons name="remove" size={24} color="#111111" />
              </Pressable>
              <View style={styles.qtyValueContainer}>
                <Text style={styles.qtyValueText}>{quantity.toString().padStart(2, '0')}</Text>
              </View>
              <Pressable style={styles.qtyActionBtn} onPress={incrementQty}>
                <Ionicons name="add" size={24} color="#111111" />
              </Pressable>
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SPECIFICATIONS</Text>
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Ionicons name="shield-checkmark" size={20} color="#1A1814" />
                <Text style={styles.specLabel}>Premium</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="leaf" size={20} color="#1A1814" />
                <Text style={styles.specLabel}>Eco-Friendly</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="airplane" size={20} color="#1A1814" />
                <Text style={styles.specLabel}>Fast Shipping</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>


      {/* Sticky Bottom Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 70 }]}>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.secondaryBtn} onPress={handleAddToBag}>
            <Ionicons name="bag-add-outline" size={24} color="#1A1814" />
          </Pressable>
          
          <Pressable 
            style={styles.primaryBtn} 
            onPress={handleBuyNow}
          >
            <Text style={styles.primaryBtnText}>BUY NOW</Text>
            <View style={styles.btnIcon}>
              <Ionicons name="flash" size={18} color="#1A1814" />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Success Modal for Cart */}
      <Modal visible={showCartSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconContainer}>
              <Ionicons name="bag-handle" size={80} color="#1A1814" />
            </View>
            <Text style={styles.successTitle}>Added to Bag</Text>
            <Text style={styles.successSubtitle}>
              {quantity}x {product.name} has been added to your shopping bag.
            </Text>
            <View style={styles.modalBtnRow}>
              <Pressable 
                style={[styles.successBtn, { backgroundColor: '#F5F5F5', flex: 1 }]} 
                onPress={() => setShowCartSuccess(false)}
              >
                <Text style={[styles.successBtnText, { color: '#111111' }]}>Continue</Text>
              </Pressable>
              <View style={{ width: 12 }} />
              <Pressable 
                style={[styles.successBtn, { flex: 1 }]} 
                onPress={() => {
                  setShowCartSuccess(false);
                  router.push('/(shop)/explore');
                }}
              >
                <Text style={styles.successBtnText}>Checkout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLink: {
    marginTop: 10,
    color: '#BFA28C',
    fontWeight: '700',
  },
  artworkFrame: {
    height: 440,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C8478',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1814',
    letterSpacing: -1,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1814',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    color: '#1A1814',
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: '#EAE6DE',
    marginHorizontal: 12,
  },
  soldText: {
    fontSize: 14,
    color: '#8C8478',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#6B6560',
    fontWeight: '400',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1814',
    letterSpacing: 1.5,
  },
  sizeGuide: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BFA28C',
    textDecorationLine: 'underline',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    width: 180,
    height: 60,
    padding: 6,
  },
  qtyActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  qtyValueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValueText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
  },
  sizeChip: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sizeChipActive: {
    backgroundColor: '#1A1814',
    borderColor: '#1A1814',
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1814',
  },
  sizeTextActive: {
    color: '#FFFFFF',
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
  },
  specItem: {
    alignItems: 'center',
    gap: 8,
  },
  specLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C8478',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F4F1EC',
    zIndex: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  secondaryBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1814',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  btnIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C8B890',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Success Modal Styles
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1814',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#6B6560',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
  },
  successBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1814',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});


