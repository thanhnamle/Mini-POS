import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = 'https://767blee8h7.execute-api.ap-southeast-2.amazonaws.com/prod';

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const totalItemsSold = orders.reduce((sum, order) => sum + (order.items_count || 0), 0);
  const recentTransactions = orders.slice(0, 5);

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar style="dark" />
      
      {/* --- HEADER --- */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Pressable className="w-10 h-10 items-center justify-center">
          <Ionicons name="menu-outline" size={26} color="#000000" />
        </Pressable>
        
        <Text style={s.brandText}>ATELIER MANAGER</Text>
        
        <Pressable className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden items-center justify-center">
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=32' }} 
            style={{ width: '100%', height: '100%' }}
          />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* --- TITLE SECTION --- */}
        <View className="px-6 pt-6 mb-8">
          <Text className="text-[12px] font-black tracking-[2px] text-slate-400 uppercase mb-1">
            Overview
          </Text>
          <Text className="text-[40px] font-[900] text-slate-900 tracking-[-2px]">
            Dashboard
          </Text>
        </View>

        {/* --- DAILY REVENUE CARD --- */}
        <View className="px-6 mb-6">
          <View className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
            <View className="flex-row justify-between items-center mb-6">
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                <Ionicons name="cash-outline" size={24} color="#000000" />
              </View>
              <View className="bg-white px-4 py-2 rounded-full border border-slate-100">
                <Text className="text-[10px] font-black tracking-[1px] text-slate-400">LIFETIME</Text>
              </View>
            </View>
            
            <Text className="text-slate-500 font-bold mb-2">Total Revenue</Text>
            <View className="flex-row items-baseline">
              <Text className="text-[44px] font-[900] text-slate-900 tracking-[-2px]">
                ${Math.floor(totalRevenue).toLocaleString()}
              </Text>
              <Text className="text-[24px] font-[900] text-slate-400 ml-1">
                .{(totalRevenue % 1).toFixed(2).substring(2)}
              </Text>
            </View>
            
            <View className="flex-row items-center mt-4">
              <Ionicons name="trending-up" size={16} color="#10B981" />
              <Text className="text-[#10B981] font-bold ml-1">+Real-time</Text>
              <Text className="text-slate-400 font-medium ml-1">data from API</Text>
            </View>
          </View>
        </View>

        {/* --- PRODUCTS SOLD CARD (BLACK) --- */}
        <View className="px-6 mb-8">
          <View className="bg-black rounded-[32px] p-8 shadow-xl shadow-black/20">
            <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="archive-outline" size={24} color="#FFFFFF" />
            </View>
            <Text className="text-slate-400 font-bold mb-1">Products Sold</Text>
            <Text className="text-[48px] font-[900] text-white tracking-[-2px]">
              {totalItemsSold.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* --- RECENT TRANSACTIONS --- */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-black text-slate-900">Recent Transactions</Text>
            <Pressable onPress={() => router.push('/(admin)/orders')}>
              <Text className="text-[11px] font-black text-slate-400 uppercase tracking-[1px]">View All</Text>
            </Pressable>
          </View>

          {/* Transaction Items */}
          <View className="bg-slate-50 rounded-[32px] p-4 mb-20">
            {recentTransactions.map((order) => (
              <React.Fragment key={order.id}>
                <TransactionItem 
                  id={order.order_number || `#${order.id.substring(0,4)}`} 
                  items={order.items_count} 
                  time={new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  amount={parseFloat(order.total_amount).toFixed(2)} 
                />
                <View className="h-[1px] bg-slate-100 mx-4" />
              </React.Fragment>
            ))}
            {recentTransactions.length === 0 && (
              <Text className="text-center py-10 text-slate-400 font-bold">No transactions yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TransactionItem({ id, items, time, amount }: { id: string, items: number, time: string, amount: string }) {
  return (
    <View className="flex-row items-center p-4">
      <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
        <Ionicons name="receipt-outline" size={24} color="#000000" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-black text-slate-900">{id}</Text>
        <Text className="text-xs font-bold text-slate-400">{items} items • {time}</Text>
      </View>
      <Text className="text-lg font-[900] text-slate-900">${amount}</Text>
    </View>
  );
}

const s = StyleSheet.create({
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
