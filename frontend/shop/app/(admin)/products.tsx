import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Plus, X } from 'lucide-react-native';

const API_URL = 'https://767blee8h7.execute-api.ap-southeast-2.amazonaws.com/prod';

type FilterStatus = 'ALL ITEMS' | 'IN STOCK' | 'OUT OF STOCK';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL ITEMS');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filters: FilterStatus[] = ['ALL ITEMS', 'IN STOCK', 'OUT OF STOCK'];

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleAddProduct = async () => {
    if (!name || !price || !stock) {
      Alert.alert('Missing Info', 'Please fill in Name, Price and Stock.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
          sku,
          description,
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' // Default dummy image
        }),
      });

      if (response.ok) {
        setModalVisible(false);
        resetForm();
        fetchProducts(); // Refresh list
        Alert.alert('Success', 'Product added successfully!');
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add product');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setSku('');
    setDescription('');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const isOutOfStock = (p.stock || 0) <= 0;
    
    if (activeFilter === 'IN STOCK') return matchesSearch && !isOutOfStock;
    if (activeFilter === 'OUT OF STOCK') return matchesSearch && isOutOfStock;
    return matchesSearch;
  });

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
          <Pressable 
            onPress={() => setModalVisible(true)}
            className="bg-black h-12 px-6 rounded-full self-start flex-row items-center active:opacity-90"
          >
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
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <Text className="text-center py-20 text-slate-400 font-bold">No products found</Text>
          )}
        </View>

        {/* --- FOOTER --- */}
        <View className="mt-16 mb-8 items-center">
          <Text className="text-[10px] font-black text-slate-300 uppercase tracking-[3px]">
            End of Catalog
          </Text>
        </View>
      </ScrollView>

      {/* --- ADD PRODUCT MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-[900] text-slate-900">Add Product</Text>
                <Pressable onPress={() => setModalVisible(false)} className="p-2 bg-slate-100 rounded-full">
                  <X color="black" size={20} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="space-y-4 flex-col gap-4">
                  <View>
                    <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</Text>
                    <TextInput
                      className="h-14 bg-slate-50 rounded-2xl px-4 font-bold text-slate-900 border border-slate-100"
                      placeholder="e.g. Minimalist Watch"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Price ($)</Text>
                      <TextInput
                        className="h-14 bg-slate-50 rounded-2xl px-4 font-bold text-slate-900 border border-slate-100"
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={price}
                        onChangeText={setPrice}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock</Text>
                      <TextInput
                        className="h-14 bg-slate-50 rounded-2xl px-4 font-bold text-slate-900 border border-slate-100"
                        placeholder="0"
                        keyboardType="number-pad"
                        value={stock}
                        onChangeText={setStock}
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">SKU</Text>
                    <TextInput
                      className="h-14 bg-slate-50 rounded-2xl px-4 font-bold text-slate-900 border border-slate-100"
                      placeholder="WAT-101"
                      value={sku}
                      onChangeText={setSku}
                    />
                  </View>

                  <View>
                    <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</Text>
                    <TextInput
                      className="h-24 bg-slate-50 rounded-2xl px-4 py-3 font-bold text-slate-900 border border-slate-100"
                      placeholder="Enter product details..."
                      multiline
                      textAlignVertical="top"
                      value={description}
                      onChangeText={setDescription}
                    />
                  </View>
                </View>

                <Pressable 
                  onPress={handleAddProduct}
                  disabled={submitting}
                  className="bg-black h-16 rounded-full items-center justify-center mt-8 mb-4 active:opacity-90"
                >
                  {submitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-black text-lg">Save Product</Text>
                  )}
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function ProductCard({ product }: { product: any }) {
  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
      {/* Status Badge */}
      <View className="flex-row mb-4">
        <View className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-lg">
          {isOutOfStock ? (
             <>
               <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
               <Text className="text-[10px] font-black text-black uppercase tracking-wider">OUT OF STOCK</Text>
             </>
          ) : (
            <Text className="text-[10px] font-black text-black uppercase tracking-wider">IN STOCK ({product.stock})</Text>
          )}
        </View>
      </View>

      {/* Image Container */}
      <View className="aspect-square bg-slate-50 rounded-[24px] overflow-hidden mb-6 relative">
        <Image 
          source={{ uri: product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' }}
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
          SKU: {product.sku || 'N/A'}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-[10px] font-black text-slate-300 uppercase tracking-[2px] mb-1">
            Price
          </Text>
          <Text className="text-[24px] font-[900] text-slate-900">
            ${parseFloat(product.price || 0).toFixed(2)}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
});
