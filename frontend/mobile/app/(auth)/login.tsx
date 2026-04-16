import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const DEMO_ACCOUNTS = [
  { label: 'Admin Demo', email: 'admin@minipos.com', password: 'admin123' },
  { label: 'Cashier Demo', email: 'cashier@minipos.com', password: 'cashier123' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return email.trim().length > 0 && password.trim().length >= 6;
  }, [email, password]);

  const submit = async () => {
    if (!isFormValid) {
      Alert.alert('Missing details', 'Enter a valid email and a password with at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const normalizedEmail = email.trim().toLowerCase();
      const isAdmin = normalizedEmail.includes('admin');

      router.replace(
        isAdmin
          ? {
              pathname: '/(admin)/dashboard',
              params: { email: normalizedEmail, role: 'Admin' },
            }
          : {
              pathname: '/(cashier)/home',
              params: { email: normalizedEmail, role: 'Cashier' },
            }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.keyboardArea}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Ionicons name="storefront" size={16} color={Colors.white} />
              </View>
              <Text style={styles.brandText}>MINI POS MERCHANT</Text>
            </View>

            <View style={styles.heroBlock}>
              <Text style={styles.title}>Welcome Back</Text>
              {/* <Text style={styles.subtitle}>
                Sign in to access your merchant dashboard and continue your store workflow.
              </Text> */}
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>WORK EMAIL</Text>
                <View style={styles.inputShell}>
                  <Ionicons name="mail" size={18} color={Colors.icon} />
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="Enter your work email"
                    placeholderTextColor={Colors.placeholder}
                    style={styles.input}
                    value={email}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <Pressable onPress={() => Alert.alert('Not implemented', 'Forgot password is not wired yet.')}>
                    <Text style={styles.linkLabel}>FORGOT?</Text>
                  </Pressable>
                </View>
                <View style={styles.inputShell}>
                  <Ionicons name="lock-closed" size={18} color={Colors.icon} />
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor={Colors.placeholder}
                    secureTextEntry={!isPasswordVisible}
                    style={styles.input}
                    value={password}
                  />
                  <Pressable
                    hitSlop={10}
                    onPress={() => setIsPasswordVisible((current) => !current)}>
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off' : 'eye'}
                      size={20}
                      color={Colors.icon}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                disabled={!isFormValid || isSubmitting}
                onPress={submit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (!isFormValid || isSubmitting) && styles.primaryButtonDisabled,
                  pressed && isFormValid && !isSubmitting && styles.primaryButtonPressed,
                ]}>
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Authorizing...' : 'Authorize Access'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </Pressable>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR AUTHENTICATE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.altActions}>
              <Pressable
                onPress={() => Alert.alert('Not implemented', 'Biometric auth can be added after the basic flow works.')}
                style={styles.altButton}>
                <MaterialCommunityIcons name="fingerprint" size={18} color={Colors.text} />
                <Text style={styles.altButtonText}>Biometric</Text>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert('Not implemented', 'QR sign-in is not wired yet.')}
                style={styles.altButton}>
                <Ionicons name="qr-code-outline" size={18} color={Colors.text} />
                <Text style={styles.altButtonText}>QR Scan</Text>
              </Pressable>
            </View>

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Quick Demo Access</Text>
              <Text style={styles.demoCopy}>
                Use these temporary credentials until real authentication is connected.
              </Text>
              <View style={styles.demoButtons}>
                {DEMO_ACCOUNTS.map((account) => (
                  <Pressable
                    key={account.label}
                    onPress={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                    style={styles.demoButton}>
                    <Text style={styles.demoButtonText}>{account.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Text style={styles.footer}>
              © 2026 Mini POS Systems. Secure merchant access for admin and cashier roles.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.hero,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.hero,
  },
  brandBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  brandText: {
    color: Colors.text,
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  heroBlock: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.serif,
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
  },
  subtitle: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 19,
    lineHeight: 28,
    maxWidth: 320,
  },
  form: {
    gap: Spacing.xl,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  linkLabel: {
    color: Colors.accent,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    minHeight: 58,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    color: Colors.text,
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    paddingVertical: Spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.sm,
    minHeight: 58,
    paddingHorizontal: Spacing.xl,
  },
  primaryButtonPressed: {
    backgroundColor: Colors.primaryPressed,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '800',
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    marginTop: Spacing.xxxl,
  },
  dividerLine: {
    backgroundColor: Colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  altActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  altButton: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.md,
  },
  altButtonText: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  demoSection: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radius.lg,
    marginTop: Spacing.xxxl,
    padding: Spacing.xl,
  },
  demoTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  demoCopy: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  demoButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  demoButtonText: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    marginTop: Spacing.xxxl,
    textAlign: 'center',
  },
});
