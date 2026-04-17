import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { AdminBottomNav, type AdminTabKey } from '@/components/admin-bottom-nav';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type SettingsRowProps = {
  icon: ComponentProps<typeof Ionicons>['name'] | ComponentProps<typeof MaterialCommunityIcons>['name'] | ComponentProps<typeof Feather>['name'];
  iconLibrary?: 'ionicons' | 'material' | 'feather';
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
};

function getAdminName(email?: string | string[]) {
  if (typeof email === 'string' && email.includes('admin')) {
    return 'Julian Reed';
  }

  return 'Julian Reed';
}

function SettingsRow({
  icon,
  iconLibrary = 'ionicons',
  title,
  subtitle,
  trailing,
  onPress,
}: SettingsRowProps) {
  const renderIcon = () => {
    if (iconLibrary === 'material') {
      return <MaterialCommunityIcons name={icon as ComponentProps<typeof MaterialCommunityIcons>['name']} size={22} color={Colors.primary} />;
    }

    if (iconLibrary === 'feather') {
      return <Feather name={icon as ComponentProps<typeof Feather>['name']} size={20} color={Colors.primary} />;
    }

    return <Ionicons name={icon as ComponentProps<typeof Ionicons>['name']} size={20} color={Colors.primary} />;
  };

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>{renderIcon()}</View>
        <View style={styles.rowCopy}>
          <Text style={styles.rowTitle}>{title}</Text>
          {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {trailing}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const params = useLocalSearchParams<{ email?: string; role?: string }>();
  const [pushAlerts, setPushAlerts] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const goBack = () => {
    router.replace({
      pathname: '/(admin)/dashboard',
      params: {
        email: params.email,
        role: params.role ?? 'Admin',
        section: 'catalog',
      },
    });
  };

  const openDashboardTab = (tab: AdminTabKey) => {
    if (tab === 'settings') {
      return;
    }

    router.replace({
      pathname: '/(admin)/dashboard',
      params: {
        email: params.email,
        role: params.role ?? 'Admin',
        section: tab,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.screen} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={goBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/160?img=12' }} style={styles.profileImage} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{getAdminName(params.email)}</Text>
            <Text style={styles.profileRole}>Store Lead</Text>
            <Text style={styles.profileTier}>PREMIUM{"\n"}TIER</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert('Edit profile', 'Profile editing can be connected to your real admin API next.')}
            style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}>
            <Text style={styles.profileButtonText}>Edit{"\n"}Profile</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionHeading}>ACCOUNT</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="person-outline"
            title="Profile Info"
            trailing={<Ionicons name="chevron-forward" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Profile info', 'Profile details are ready for backend wiring.')}
          />
          <SettingsRow
            icon="lock-closed-outline"
            title="Password"
            trailing={<Ionicons name="chevron-forward" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Password', 'Password update flow is not connected yet.')}
          />
          <SettingsRow
            icon="dice-outline"
            title="Linked Devices"
            trailing={<Ionicons name="chevron-forward" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Linked devices', 'No device management service is connected yet.')}
          />
        </View>

        <Text style={styles.sectionHeading}>NOTIFICATIONS</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="notifications-outline"
            title="Push alerts"
            trailing={
              <Switch
                onValueChange={setPushAlerts}
                thumbColor={Colors.white}
                trackColor={{ false: '#ded9d2', true: '#0d7f79' }}
                value={pushAlerts}
              />
            }
          />
          <SettingsRow
            icon="mail-outline"
            title="Email reports"
            trailing={
              <Switch
                onValueChange={setEmailReports}
                thumbColor={Colors.white}
                trackColor={{ false: '#ded9d2', true: '#0d7f79' }}
                value={emailReports}
              />
            }
          />
        </View>

        <Text style={styles.sectionHeading}>SYSTEM</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="moon-outline"
            title="Theme (Dark Mode)"
            trailing={
              <Switch
                onValueChange={setDarkMode}
                thumbColor={Colors.white}
                trackColor={{ false: '#ded9d2', true: '#0d7f79' }}
                value={darkMode}
              />
            }
          />
          <SettingsRow
            icon="cash-outline"
            title="Currency/Tax settings"
            subtitle="USD - 8.25%"
            trailing={<Ionicons name="chevron-forward" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Tax settings', 'Currency and tax configuration screen can be added next.')}
          />
        </View>

        <Text style={styles.sectionHeading}>SUPPORT</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="help-circle-outline"
            title="Help Center"
            trailing={<Feather name="external-link" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Help Center', 'Support content is not connected yet.')}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            trailing={<Ionicons name="chevron-forward" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content is pending.')}
          />
          <SettingsRow
            icon="document-text-outline"
            title="Terms of Service"
            trailing={<Ionicons name="chevron-forward" size={18} color={Colors.textSubtle} />}
            onPress={() => Alert.alert('Terms of Service', 'Terms content is pending.')}
          />
        </View>

        <Pressable
          onPress={() => router.replace('/login')}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="logout" size={20} color="#ae2f2b" />
          <Text style={styles.logoutLabel}>LOG OUT</Text>
        </Pressable>

        <Text style={styles.version}>MERCHANT CORE POS v2.4.0 ( LEAD EDITION )</Text>
      </ScrollView>

      <AdminBottomNav activeTab="settings" onSelect={openDashboardTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screen,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  pressed: {
    opacity: 0.82,
  },
  headerTitle: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    fontSize: 21,
    fontWeight: '800',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
    padding: Spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
  },
  profileImage: {
    borderColor: '#d9d1c7',
    borderRadius: 40,
    borderWidth: 2,
    height: 80,
    width: 80,
  },
  profileCopy: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
  },
  profileRole: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  profileTier: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginTop: 8,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    minHeight: 92,
    minWidth: 102,
    paddingHorizontal: Spacing.lg,
  },
  profileButtonText: {
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionHeading: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
    marginTop: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  rowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  rowIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
  },
  rowCopy: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#fbd0cb',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.lg,
    minHeight: 58,
  },
  logoutLabel: {
    color: '#ae2f2b',
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  version: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 11,
    letterSpacing: 1.6,
    marginTop: Spacing.xxl,
    textAlign: 'center',
  },
});
