import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getSession } from '../services/auth';
import { COLORS } from '../constants/theme';

export default function Boot() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const s = await getSession();
      if (!s) router.replace('/(auth)/login');
      else if (s.role === 'admin') router.replace('/(admin)/dashboard');
      else router.replace('/(cashier)');
    })();
  }, [router]);
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={COLORS.primary} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
});
