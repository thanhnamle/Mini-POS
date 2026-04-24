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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 44 }} />
          <Text style={styles.headerTitle}>ADMIN SETTINGS</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Image
                source={user?.user_metadata?.avatar_url 
                  ? { uri: user?.user_metadata?.avatar_url } 
                  : { uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'admin'}` }
                }
                style={styles.avatarImg}
              />
            </View>
            <Text style={styles.userName}>{user?.user_metadata?.full_name || 'Atelier Admin'}</Text>
            
            <View style={styles.rankBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#000000" />
              <Text style={styles.rankText}>ADMINISTRATOR</Text>
            </View>
          </View>

          {/* Settings Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WORKSPACE CONTROL</Text>
            <SettingsItem 
              icon="person-outline" 
              label="Personal Information" 
              subLabel={user?.email || 'admin@atelier.com'}
              onPress={() => {}}
            />
            <SettingsItem 
              icon="call-outline" 
              label="Contact Number" 
              subLabel={formatPhone(user?.user_metadata?.phone)}
              onPress={() => {}}
            />
            <SettingsItem 
              icon="lock-closed-outline" 
              label="Security & Password" 
              subLabel="Last updated 2 days ago"
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>STORE MANAGEMENT</Text>
            <SettingsItem 
              icon="receipt-outline" 
              label="Global Transactions" 
              onPress={() => router.push('/(admin)/sales')}
            />
            <SettingsItem 
              icon="cube-outline" 
              label="Inventory Controls" 
              onPress={() => router.push('/(admin)/products')}
            />
            <SettingsItem 
              icon="people-outline" 
              label="Customer Database" 
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM</Text>
            <SettingsItem 
              icon="notifications-outline" 
              label="Push Notifications" 
              onPress={() => {}}
            />
            <SettingsItem 
              icon="information-circle-outline" 
              label="Version Control" 
              subLabel="v1.0.4 - Stable"
              onPress={() => {}}
            />
          </View>

          <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#FF4B4B" />
            <Text style={styles.signOutText}>Sign Out from Workspace</Text>
          </Pressable>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingsItem({ icon, label, subLabel, onPress }: { icon: any, label: string, subLabel?: string, onPress?: () => void }) {
  return (
    <Pressable style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsIconBox}>
        <Ionicons name={icon} size={20} color="#111111" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingsLabel}>{label}</Text>
        {subLabel && <Text style={styles.settingsSubLabel} numberOfLines={1}>{subLabel}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D1D1D1" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 56,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 24,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 48,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -1,
    marginBottom: 4,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginTop: 4,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 2,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF4B4B',
  },
  settingsSubLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
});
