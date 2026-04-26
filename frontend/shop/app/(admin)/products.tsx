import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Plus, Package } from 'lucide-react-native';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Chronograph Minimal',
    sku: 'WAT-001',
    price: 245.00,
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
  {
    id: '2',
    name: 'Aero Runner Black',
    sku: 'SHO-042',
    price: 180.00,
    status: 'OUT OF STOCK',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  },
  {
    id: '3',
    name: 'Studio Over-Ear',
    sku: 'AUD-109',
    price: 320.00,
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
];

type FilterStatus = 'ALL ITEMS' | 'IN STOCK' | 'OUT OF STOCK';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL ITEMS');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: FilterStatus[] = ['ALL ITEMS', 'IN STOCK', 'OUT OF STOCK'];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* --- HEADER --- */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable className="w-10 h-10 items-center justify-center">
          <Ionicons name="menu-outline" size={26} color="#000000" />
        </Pressable>
        
        <Text style={styles.brandText}>ATELIER POS</Text>
        
        <Pressable className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden items-center justify-center">
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=32' }} 
            style={{ width: '100%', height: '100%' }}
          />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* --- TITLE SECTION --- */}
        <View className="px-6 pt-6 mb-6">
          <Text className="text-[32px] font-[900] text-slate-900 tracking-[-1px] mb-1">
            CATALOG
          </Text>
          <Text className="text-[14px] font-medium text-slate-500">
            Manage your inventory, pricing, and availability.
          </Text>
        </View>

        {/* --- ADD PRODUCT BUTTON --- */}
        <View className="px-6 mb-10">
          <Pressable className="bg-black h-12 px-6 rounded-full self-start flex-row items-center active:opacity-90">
            <Plus color="white" size={16} strokeWidth={3} />
            <Text className="text-white font-black ml-2 text-xs uppercase tracking-wider">Add New Product</Text>
          </Pressable>
        </View>

        {/* --- SEARCH & FILTERS CARD --- */}
        <View className="mx-6 p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm mb-8">
          <View className="h-12 bg-slate-100 rounded-xl flex-row items-center px-4 mb-4">
            <Search color="#94A3B8" size={18} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-3 font-bold text-slate-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View className="flex-row">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`mr-2 px-4 py-2 rounded-lg ${activeFilter === filter ? 'bg-[#333333]' : 'bg-slate-100'}`}
                >
                  <Text className={`text-[10px] font-black uppercase tracking-wider ${activeFilter === filter ? 'text-white' : 'text-slate-500'}`}>
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* --- PRODUCTS LIST --- */}
        <View className="px-6 space-y-6 flex-col gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>

        {/* --- FOOTER --- */}
        <View className="mt-16 mb-8 items-center">
          <Text className="text-[10px] font-black text-slate-300 uppercase tracking-[3px]">
            End of Catalog
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ProductCard({ product }: { product: any }) {
  const isOutOfStock = product.status === 'OUT OF STOCK';

  return (
    <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
      {/* Status Badge */}
      <View className="flex-row mb-4">
        <View className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-lg">
          {isOutOfStock && <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />}
          <Text className="text-[10px] font-black text-black uppercase tracking-wider">
            {product.status}
          </Text>
        </View>
      </View>

      {/* Image Container */}
      <View className="aspect-square bg-slate-50 rounded-[24px] overflow-hidden mb-6 relative">
        <Image 
          source={{ uri: product.image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {isOutOfStock && (
          <View className="absolute inset-0 items-center justify-center bg-white/40">
            <View className="bg-[#333333]/80 px-4 py-2 rounded-md">
              <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                Restock Pending
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Details */}
      <View className="mb-6">
        <Text className="text-[20px] font-[900] text-slate-900 mb-1">
          {product.name}
        </Text>
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          SKU: {product.sku}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-[10px] font-black text-slate-300 uppercase tracking-[2px] mb-1">
            Price
          </Text>
          <Text className="text-[24px] font-[900] text-slate-900">
            ${product.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  brandText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
});
