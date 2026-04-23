import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../ctx/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, points, rank, phone } = useAuth();
  const [defaultAddress, setDefaultAddress] = useState<string | null>(null);
  const [defaultPayment, setDefaultPayment] = useState<string | null>(null);

  const fetchDefaultAddress = useCallback(async () => {
    try {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('addresses')
        .select('street_number, ward, city')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setDefaultAddress(`${data[0].street_number}, ${data[0].ward}, ${data[0].city}`);
      } else {
        setDefaultAddress('Set your shipping address');
      }
    } catch (err: any) {
      console.error('Fetch address error:', err.message);
      setDefaultAddress('Set your shipping address');
    }
  }, [user?.id]);

  const fetchDefaultPayment = useCallback(async () => {
    try {
      if (!user?.id) return;

      const { data } = await supabase
        .from('payment_methods')
        .select('brand, last_4')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();

      if (data) {
        setDefaultPayment(`${data.brand.toUpperCase()} •••• ${data.last_4}`);
      } else {
        setDefaultPayment('Add a payment method');
      }
    } catch (err: any) {
      console.error('Fetch payment error:', err.message);
      setDefaultPayment('Add a payment method');
    }
  }, [user?.id]);

  // Fetch default data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDefaultAddress();
      fetchDefaultPayment();
    }, [fetchDefaultAddress, fetchDefaultPayment])
  );


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  // Logic to calculate progress to next rank
  const getNextRankInfo = () => {
    if (points < 500) return { next: 'Silver', target: 500, current: points };
    if (points < 1500) return { next: 'Gold', target: 1500, current: points };
    if (points < 3000) return { next: 'Platinum', target: 3000, current: points };
    if (points < 6000) return { next: 'Diamond', target: 6000, current: points };
    return { next: 'Max', target: points, current: points };
  };

  const rankInfo = getNextRankInfo();
  const progress = (rankInfo.current / rankInfo.target) * 100;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 44 }} />
          <Text style={styles.headerTitle}>PROFILE</Text>
          <Pressable style={styles.backBtn} onPress={() => router.push('/(shop)/settings')}>
            <Ionicons name="settings-outline" size={24} color="#111111" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Image
                source={user?.user_metadata?.avatar_url ? { uri: user?.user_metadata?.avatar_url } : { uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}` }}
                style={styles.avatarImg}
              />
            </View>
            <Text style={styles.userName}>{user?.user_metadata?.full_name || 'User'}</Text>
            
            {/* Membership Rank Badge */}
            <View style={styles.rankBadge}>
              <Ionicons name="ribbon-outline" size={14} color="#B8860B" />
              <Text style={styles.rankText}>{rank.toUpperCase()} MEMBER</Text>
            </View>
          </View>

          {/* Loyalty Section */}
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyHeader}>
              <Text style={styles.loyaltyTitle}>Atelier Points</Text>
              <Text style={styles.pointsValue}>{points.toLocaleString()} pts</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.loyaltySub}>
              {rankInfo.next === 'Max' 
                ? 'You have reached the highest rank!' 
                : `${(rankInfo.target - points).toLocaleString()} pts more to reach ${rankInfo.next}`}
            </Text>
          </View>


          {/* Settings Sections */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <SettingsItem 
              icon="person-outline" 
              label="Personal Information" 
              subLabel={phone || 'Add your phone number'}
              onPress={() => router.push('/(shop)/profile_info')}
            />

            <SettingsItem 
              icon="location-outline" 
              label="Shipping Addresses" 
              subLabel={defaultAddress || 'Loading...'}
              onPress={() => router.push('/(shop)/shipping_address')}
            />
            <SettingsItem 
              icon="card-outline" 
              label="Payment Methods" 
              subLabel={defaultPayment || 'Loading...'}
              onPress={() => router.push('/(shop)/payment_methods')}
            />

          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORDERS</Text>
            <SettingsItem 
              icon="receipt-outline" 
              label="Order History" 
              onPress={() => router.push('/(shop)/order_history')}
            />
            <SettingsItem icon="heart-outline" label="Wishlist" />
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>
            <SettingsItem icon="help-circle-outline" label="Help Center" />
            <SettingsItem icon="information-circle-outline" label="About Atelier" />
          </View>

          <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#FF4B4B" />
            <Text style={styles.signOutText}>Sign Out</Text>
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
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#F6F6F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },

  avatarLargeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
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
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginTop: 4,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B8860B',
    letterSpacing: 1,
  },
  loyaltyCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loyaltyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8C8478',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  loyaltySub: {
    fontSize: 12,
    color: '#8C8478',
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: '#F6F6F4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C8478',
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
    backgroundColor: '#F6F6F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF4B4B',
  },
  settingsSubLabel: {
    fontSize: 12,
    color: '#8C8478',
    marginTop: 2,
    fontWeight: '500',
  },
});


