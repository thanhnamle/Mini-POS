import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bell, ShoppingBag, Package, BarChart3, BellRing } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [notifs, setNotifs] = useState({
    newOrders: true,
    orderCancelled: true,
    lowStock: true,
    outOfStock: true,
    dailySales: false,
    systemUpdates: true,
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(admin)/settings')}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Push{'\n'}Notifications</Text>
            <Text style={styles.description}>
              Control which alerts you receive to stay updated on your shop's performance.
            </Text>
          </View>

          {/* --- OPERATIONAL --- */}
          <Section title="OPERATIONAL ALERTS">
            <NotifToggle 
              icon={<ShoppingBag size={20} color="#3b82f6" />}
              label="New Orders"
              subLabel="Get notified when a customer places an order"
              value={notifs.newOrders}
              onValueChange={() => toggleNotif('newOrders')}
            />
            <View className="h-[1px] bg-slate-50 mx-4" />
            <NotifToggle 
              icon={<BellRing size={20} color="#f43f5e" />}
              label="Order Cancelled"
              subLabel="Alert when an order is voided or cancelled"
              value={notifs.orderCancelled}
              onValueChange={() => toggleNotif('orderCancelled')}
            />
          </Section>

          {/* --- INVENTORY --- */}
          <Section title="INVENTORY & STOCK">
            <NotifToggle 
              icon={<Package size={20} color="#f59e0b" />}
              label="Low Stock Warning"
              subLabel="Alert when items drop below threshold"
              value={notifs.lowStock}
              onValueChange={() => toggleNotif('lowStock')}
            />
            <View className="h-[1px] bg-slate-50 mx-4" />
            <NotifToggle 
              icon={<Package size={20} color="#ef4444" />}
              label="Out of Stock"
              subLabel="Immediate alert for unavailable products"
              value={notifs.outOfStock}
              onValueChange={() => toggleNotif('outOfStock')}
            />
          </Section>

          {/* --- REPORTS --- */}
          <Section title="REPORTS & SYSTEM">
            <NotifToggle 
              icon={<BarChart3 size={20} color="#10b981" />}
              label="Daily Sales Summary"
              subLabel="Receive a daily EOD performance report"
              value={notifs.dailySales}
              onValueChange={() => toggleNotif('dailySales')}
            />
            <View className="h-[1px] bg-slate-50 mx-4" />
            <NotifToggle 
              icon={<Bell size={20} color="#64748b" />}
              label="System Updates"
              subLabel="Important app and security updates"
              value={notifs.systemUpdates}
              onValueChange={() => toggleNotif('systemUpdates')}
            />
          </Section>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4 ml-2">
        {title}
      </Text>
      <View className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm">
        {children}
      </View>
    </View>
  );
}

function NotifToggle({ icon, label, subLabel, value, onValueChange }: { icon: any, label: string, subLabel: string, value: boolean, onValueChange: () => void }) {
  return (
    <View className="flex-row items-center p-4">
      <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1 mr-4">
        <Text className="text-[15px] font-bold text-slate-900">{label}</Text>
        <Text className="text-[12px] font-medium text-slate-400 mt-0.5">{subLabel}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: '#f1f5f9', true: '#10b981' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111111',
    lineHeight: 44,
    letterSpacing: -1,
  },
  description: {
    fontSize: 16,
    color: '#737373',
    lineHeight: 24,
    marginTop: 12,
  },
});
