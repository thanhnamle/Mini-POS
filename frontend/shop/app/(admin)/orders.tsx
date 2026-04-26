import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, SlidersHorizontal, Clock, Wallet, Banknote, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MOCK_ORDERS = [
  {
    id: '1042',
    customer: 'Jane Doe',
    itemsCount: 3,
    total: 145.00,
    paymentMethod: 'Cash (COD)',
    paymentType: 'cod',
    status: 'Pending',
  },
  {
    id: '1043',
    customer: 'John Smith',
    itemsCount: 1,
    total: 320.00,
    paymentMethod: 'Digital',
    paymentType: 'digital',
    status: 'Pending',
  },
  {
    id: '1044',
    customer: 'Alice Cooper',
    itemsCount: 5,
    total: 85.50,
    paymentMethod: 'Cash (COD)',
    paymentType: 'cod',
    status: 'Pending',
  },
];

type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<OrderStatus>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: OrderStatus[] = ['Pending', 'Confirmed', 'Delivered'];

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
            Orders
          </Text>
          <Text className="text-[16px] font-medium text-slate-500">
            Manage and fulfill customer requests.
          </Text>
        </View>

        {/* --- SEARCH & FILTER --- */}
        <View className="px-6 mb-6 flex-row items-center gap-3">
          <View className="flex-1 h-14 bg-slate-100 rounded-2xl flex-row items-center px-4">
            <Search color="#94A3B8" size={20} />
            <TextInput
              placeholder="Search orders..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-3 font-bold text-slate-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable className="w-14 h-14 bg-slate-100 rounded-2xl items-center justify-center">
            <SlidersHorizontal color="black" size={20} />
          </Pressable>
        </View>

        {/* --- TABS --- */}
        <View className="px-6 mb-8 flex-row border-b border-slate-100">
          {tabs.map((tab) => (
            <Pressable 
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`mr-8 pb-3 relative`}
            >
              <Text className={`text-base font-bold ${activeTab === tab ? 'text-black' : 'text-slate-400'}`}>
                {tab}
              </Text>
              {activeTab === tab && (
                <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
              )}
            </Pressable>
          ))}
        </View>

        {/* --- ORDERS LIST --- */}
        <View className="px-6 space-y-6 flex-col gap-6">
          {MOCK_ORDERS.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function OrderCard({ order }: { order: any }) {
  return (
    <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
      {/* Card Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
          ORDER #{order.id}
        </Text>
        <View className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-full">
          <Clock size={12} color="black" strokeWidth={3} />
          <Text className="text-[10px] font-black ml-1.5 text-black">
            {order.status}
          </Text>
        </View>
      </View>

      {/* Customer Name */}
      <Text className="text-[22px] font-[900] text-slate-900 mb-5">
        {order.customer}
      </Text>

      {/* Info Container */}
      <View className="bg-slate-50 rounded-[24px] p-5 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-slate-400 font-bold">Items ({order.itemsCount})</Text>
          <Text className="text-slate-900 font-black text-lg">${order.total.toFixed(2)}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-400 font-bold">Payment</Text>
          <View className="flex-row items-center">
            {order.paymentType === 'cod' ? (
              <Banknote size={16} color="black" />
            ) : (
              <Wallet size={16} color="black" />
            )}
            <Text className="text-black font-black ml-2">{order.paymentMethod}</Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <Pressable 
        className="bg-black h-14 rounded-full items-center justify-center active:opacity-90"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }]
        })}
      >
        <Text className="text-white font-black text-base">
          {order.id === '1043' ? 'Mark Delivered' : 'Confirm Order'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
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
