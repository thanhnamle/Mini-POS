import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function ModalScreen() {
  const { email, role } = useLocalSearchParams<{ email?: string; role?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>ACCESS GRANTED</Text>
        <Text style={styles.title}>Login flow is working.</Text>
        <Text style={styles.body}>
          Signed in as <Text style={styles.bodyStrong}>{email ?? 'merchant@minipos.com'}</Text> with
          the <Text style={styles.bodyStrong}> {role ?? 'Cashier'}</Text> role.
        </Text>
        <Text style={styles.body}>
          Use this as a temporary destination while you build the real admin and cashier app areas.
        </Text>

        <Link dismissTo href="/login" style={styles.link}>
          <Text style={styles.linkText}>Back to login</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.screen,
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    maxWidth: 420,
    padding: Spacing.xxxl,
    width: '100%',
  },
  eyebrow: {
    color: Colors.accent,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  body: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  bodyStrong: {
    color: Colors.text,
    fontWeight: '700',
  },
  link: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  linkText: {
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
