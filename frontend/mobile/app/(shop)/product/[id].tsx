import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { products } from '../../../constants/products';
import { useCart } from '../../../ctx/CartContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState('M');
  
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

  const handleAddToBag = () => {
    addToCart(product, selectedSize);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Artwork Header */}
        <View style={[styles.artworkFrame, { backgroundColor: product.surface }]}>
          <SafeAreaView edges={['top']} style={styles.headerRow}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={product.surface === '#FFFFFF' ? '#111111' : '#FFFFFF'} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={24} color={product.surface === '#FFFFFF' ? '#111111' : '#FFFFFF'} />
            </Pressable>
          </SafeAreaView>

          <View style={[styles.artworkGlow, { backgroundColor: product.accent, opacity: 0.2 }]} />
          <Ionicons name={product.icon} size={160} color={product.iconColor} />
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Size Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT SIZE</Text>
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

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DETAILS</Text>
            <View style={styles.detailItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#6B6560" />
              <Text style={styles.detailText}>Sustainable materials</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="refresh-outline" size={18} color="#6B6560" />
              <Text style={styles.detailText}>30-day free returns</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 70 }]}>
        <Pressable style={styles.primaryBtn} onPress={handleAddToBag}>
          <Text style={styles.primaryBtnText}>ADD TO BAG</Text>
          <View style={styles.btnIcon}>
            <Ionicons name="bag-add-outline" size={18} color="#1A1814" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: '500',
    color: '#1A1814',
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#6B6560',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1814',
    letterSpacing: 2,
    marginBottom: 16,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeChip: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: '#EAE6DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipActive: {
    backgroundColor: '#1A1814',
    borderColor: '#1A1814',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1814',
  },
  sizeTextActive: {
    color: '#FFFFFF',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6B6560',
    fontWeight: '500',
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
  },
  primaryBtn: {
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
});
