import React, { useEffect, useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import ScreenContainer from '../../components/ScreenContainer';
import SectionCard from '../../components/SectionCard';
import ListRow from '../../components/ListRow';
import ActionButton from '../../components/ActionButton';
import { COLORS, SPACING, TYPE } from '../../constants/theme';
import { getSession, signOut } from '../../services/auth';
import { loadSettings, saveSettings } from '../../services/local';
import type { AppSettings, User } from '../../types/models';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => { (async () => {
    setUser(await getSession());
    setSettings(await loadSettings());
  })(); }, []);

  const update = async (patch: Partial<AppSettings>) => {
    if (!settings) return;
    const next: AppSettings = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const onLogout = () => Alert.alert('Sign out', 'End your session?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/(auth)/login'); } },
  ]);

  if (!settings) return null;

  return (
    <>
      <Header title="Settings" subtitle="Preferences and account" />
      <ScreenContainer>
        <SectionCard title="Profile">
          <ListRow icon="person-outline" title={user?.name ?? 'Store Owner'} subtitle={user?.email}
            onPress={() => Alert.alert('Profile', 'Profile editing will be available soon.')} last />
        </SectionCard>

        <SectionCard title="Notifications">
          <ListRow icon="notifications-outline" title="New orders"
            right={<Switch value={settings.notifications.orders} onValueChange={(v) => update({ notifications: { ...settings.notifications, orders: v } })} trackColor={{ true: COLORS.primary, false: COLORS.border }} />} />
          <ListRow icon="alert-circle-outline" title="Low-stock alerts"
            right={<Switch value={settings.notifications.lowStock} onValueChange={(v) => update({ notifications: { ...settings.notifications, lowStock: v } })} trackColor={{ true: COLORS.primary, false: COLORS.border }} />} />
          <ListRow icon="megaphone-outline" title="Marketing tips"
            right={<Switch value={settings.notifications.marketing} onValueChange={(v) => update({ notifications: { ...settings.notifications, marketing: v } })} trackColor={{ true: COLORS.primary, false: COLORS.border }} />} last />
        </SectionCard>

        <SectionCard title="Appearance">
          <ListRow icon="moon-outline" title="Dark theme" subtitle="Coming soon"
            right={<Switch value={settings.theme === 'dark'} onValueChange={(v) => update({ theme: v ? 'dark' : 'light' })} trackColor={{ true: COLORS.primary, false: COLORS.border }} />} last />
        </SectionCard>

        <SectionCard title="Store">
          <ListRow icon="cash-outline" title="Currency" subtitle={settings.currency}
            onPress={() => Alert.alert('Currency', 'Currency selector coming soon.')} />
          <ListRow icon="calculator-outline" title="Tax rate" subtitle={`${settings.taxRate}%`}
            onPress={() => Alert.alert('Tax rate', 'Tax editor coming soon.')} last />
        </SectionCard>

        <SectionCard title="Support">
          <ListRow icon="help-circle-outline" title="Help center"
            onPress={() => Alert.alert('Help center', 'Opens external help site (placeholder).')} />
          <ListRow icon="document-text-outline" title="Privacy policy"
            onPress={() => Alert.alert('Privacy policy', 'Coming soon.')} />
          <ListRow icon="information-circle-outline" title="About Mini POS" subtitle="v1.0.0" last />
        </SectionCard>

        <View style={{ height: SPACING.md }} />
        <ActionButton title="Sign out" variant="danger" onPress={onLogout} />
        <View style={{ height: SPACING.lg }} />
        <Text style={[TYPE.caption, { textAlign: 'center' }]}>Mini POS — handcrafted for boutique merchants.</Text>
      </ScreenContainer>
    </>
  );
}
