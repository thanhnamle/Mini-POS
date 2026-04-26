import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { Shield, Activity, Users, Settings, LogOut, ChevronRight, Bell, Lock, Smartphone, Receipt, Archive, Globe } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const formatPhone = (phoneStr: string) => {
    if (!phoneStr) return 'Not set';
    if (phoneStr.startsWith('+84')) {
      return `(+84) ${phoneStr.slice(3).trim()}`;
    }
    return phoneStr;
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.brandText}>ATELIER CONTROL</Text>
          <Pressable className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden items-center justify-center">
            <Image 
              source={{ uri: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/100?img=32' }} 
              style={{ width: '100%', height: '100%' }}
            />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* --- ADMIN TITLE --- */}
          <View className="mb-8">
            <Text className="text-[32px] font-[900] text-slate-900 tracking-[-1px] mb-1">
              Control Center
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">
                Admin Active • {user?.user_metadata?.full_name?.split(' ')[0] || 'Administrator'}
              </Text>
            </View>
          </View>

          {/* --- QUICK STATS ROW --- */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10 -mx-6 px-6">
            <StatCard icon={<Activity size={18} color="#10b981" />} label="System" value="Healthy" color="#ecfdf5" />
            <StatCard icon={<Users size={18} color="#3b82f6" />} label="Staff" value="3 Online" color="#eff6ff" />
            <StatCard icon={<Shield size={18} color="#f59e0b" />} label="Security" value="Encrypted" color="#fffbeb" />
          </ScrollView>

          {/* --- OPERATIONS CARD --- */}
          <View className="bg-black rounded-[32px] p-6 mb-10 shadow-xl shadow-black/10">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-6">
              Shop Operations
            </Text>
            
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white text-lg font-black mb-1">Online Ordering</Text>
                <Text className="text-slate-500 text-xs font-bold">Allow users to place orders</Text>
              </View>
              <Switch 
                value={isOnline} 
                onValueChange={setIsOnline}
                trackColor={{ false: '#334155', true: '#10b981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="h-[1px] bg-white/10 mb-6" />

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-lg font-black mb-1">Maintenance Mode</Text>
                <Text className="text-slate-500 text-xs font-bold">Lock app for updates</Text>
              </View>
              <Switch 
                value={isMaintenance} 
                onValueChange={setIsMaintenance}
                trackColor={{ false: '#334155', true: '#ef4444' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* --- SETTINGS GROUPS --- */}
          <SettingsGroup title="WORKSPACE CONTROL">
            <SettingsItem 
              icon={<Users size={20} color="#111111" />} 
              label="Personal Information" 
              subLabel={`${user?.email || 'admin@atelier.com'} • ${formatPhone(user?.user_metadata?.phone)}`}
              onPress={() => router.push('/(admin)/profile_info')}
            />
            <SettingsItem 
              icon={<Lock size={20} color="#111111" />} 
              label="Security & Password" 
              subLabel="Last updated 2 days ago"
              onPress={() => router.push('/(admin)/security')}
            />
          </SettingsGroup>

          <SettingsGroup title="STORE MANAGEMENT">
            <SettingsItem 
              icon={<Receipt size={20} color="#111111" />} 
              label="Global Transactions" 
              onPress={() => router.push('/(admin)/sales')}
            />
            <SettingsItem 
              icon={<Archive size={20} color="#111111" />} 
              label="Inventory Controls" 
              onPress={() => router.push('/(admin)/products')}
            />
            <SettingsItem 
              icon={<Globe size={20} color="#111111" />} 
              label="Shop Region" 
              subLabel="Vietnam (GMT+7)"
              onPress={() => router.push('/(admin)/shop_region')}
            />
          </SettingsGroup>

          <SettingsGroup title="SYSTEM & PREFERENCES">
            <SettingsItem 
              icon={<Bell size={20} color="#111111" />} 
              label="Push Notifications" 
              onPress={() => router.push('/(admin)/notifications')}
            />
            <SettingsItem 
              icon={<Settings size={20} color="#111111" />} 
              label="App Preferences" 
              subLabel="v1.0.4 - Stable Build"
              onPress={() => router.push('/(admin)/preferences')}
            />
          </SettingsGroup>

          {/* --- SIGN OUT --- */}
          <Pressable 
            style={styles.signOutBtn} 
            onPress={handleSignOut}
            className="active:opacity-80"
          >
            <LogOut size={20} color="#FF4B4B" />
            <Text style={styles.signOutText}>Terminate Session</Text>
          </Pressable>
          
          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <View style={{ backgroundColor: color }} className="mr-3 px-5 py-4 rounded-[24px] min-w-[120px]">
      <View className="mb-3">{icon}</View>
      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</Text>
      <Text className="text-base font-black text-slate-900">{value}</Text>
    </View>
  );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
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

function SettingsItem({ icon, label, subLabel, onPress }: { icon: any, label: string, subLabel?: string, onPress?: () => void }) {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center p-4 active:bg-slate-50 rounded-[24px]"
    >
      <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-slate-900">{label}</Text>
        {subLabel && <Text className="text-[12px] font-medium text-slate-400 mt-0.5">{subLabel}</Text>}
      </View>
      <ChevronRight size={18} color="#CBD5E1" />
    </Pressable>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 24,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FF4B4B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
