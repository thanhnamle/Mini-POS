import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
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
  const { user, role } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>PROFILE</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {user?.email?.[0].toUpperCase() ?? 'U'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.user_metadata?.full_name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role?.toUpperCase()}</Text>
            </View>
          </View>

          {/* Settings Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <SettingsItem icon="person-outline" label="Personal Information" />
            <SettingsItem icon="location-outline" label="Shipping Addresses" />
            <SettingsItem icon="card-outline" label="Payment Methods" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORDERS</Text>
            <SettingsItem icon="receipt-outline" label="Order History" />
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingsItem({ icon, label }: { icon: any, label: string }) {
  return (
    <Pressable style={styles.settingsItem}>
      <View style={styles.settingsIconBox}>
        <Ionicons name={icon} size={20} color="#111111" />
      </View>
      <Text style={styles.settingsLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#EAE6DE" />
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
    backgroundColor: '#D9EDF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0F172A12',
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
  userEmail: {
    fontSize: 14,
    color: '#8C8478',
    marginBottom: 16,
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
    marginBottom: 32,
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
    marginBottom: 40,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF4B4B',
  },
});
