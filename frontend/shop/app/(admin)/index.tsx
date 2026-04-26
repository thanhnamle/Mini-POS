import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
                <Text className="text-[10px] font-black tracking-[1px] text-slate-400">DAILY</Text>
              </View>
            </View>
            
            <Text className="text-slate-500 font-bold mb-2">Total Revenue</Text>
            <View className="flex-row items-baseline">
              <Text className="text-[44px] font-[900] text-slate-900 tracking-[-2px]">
                $4,280
              </Text>
              <Text className="text-[24px] font-[900] text-slate-400 ml-1">
                .50
              </Text>
            </View>
            
            <View className="flex-row items-center mt-4">
              <Ionicons name="trending-up" size={16} color="#10B981" />
              <Text className="text-[#10B981] font-bold ml-1">+12.5%</Text>
              <Text className="text-slate-400 font-medium ml-1">vs yesterday</Text>
            </View>
          </View>
        </View>

        {/* --- MONTHLY REVENUE CARD --- */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
              <Ionicons name="stats-chart" size={24} color="#000000" />
              <View className="bg-slate-100 px-4 py-2 rounded-full">
                <Text className="text-[10px] font-black tracking-[1px] text-slate-400">MONTHLY</Text>
              </View>
            </View>
            
            <Text className="text-slate-500 font-bold mb-2">Total Revenue (MTD)</Text>
            <View className="flex-row items-baseline mb-6">
              <Text className="text-[44px] font-[900] text-slate-900 tracking-[-2px]">
                $86,400
              </Text>
              <Text className="text-[24px] font-[900] text-slate-400 ml-1">
                .00
              </Text>
            </View>

            {/* DUMMY CHART */}
            <View className="flex-row items-end justify-between h-20 pt-4">
              {[30, 50, 40, 20, 70, 60, 80, 100].map((h, i) => (
                <View 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className={`w-[8%] rounded-full ${i === 7 ? 'bg-black' : 'bg-slate-100'}`}
                />
              ))}
            </View>
            <Text className="text-[10px] font-bold text-slate-400 text-right mt-2">$12k</Text>
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
              1,248
            </Text>
          </View>
        </View>

        {/* --- RECENT TRANSACTIONS --- */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-black text-slate-900">Recent Transactions</Text>
            <Pressable>
              <Text className="text-[11px] font-black text-slate-400 uppercase tracking-[1px]">View All</Text>
            </Pressable>
          </View>

          {/* Transaction Items */}
          <View className="bg-slate-50 rounded-[32px] p-4 mb-20">
            <TransactionItem id="#8842" items={2} time="10:42 AM" amount="142.00" />
            <View className="h-[1px] bg-slate-100 mx-4" />
            <TransactionItem id="#8841" items={1} time="10:15 AM" amount="45.00" />
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
        <Text className="text-base font-black text-slate-900">Order {id}</Text>
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
