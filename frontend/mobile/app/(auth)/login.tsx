import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import FormField from '../../components/FormField';
import ActionButton from '../../components/ActionButton';
import { signIn } from '../../services/auth';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('admin@store.co');
  const [password, setPassword] = useState<string>('demo');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const user = await signIn({ email, password });
      router.replace(user.role === 'admin' ? '/(admin)/dashboard' : '/(cashier)');
    } catch (e) {
      Alert.alert('Sign in failed', e instanceof Error ? e.message : 'Unknown error');
    } finally { setLoading(false); }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ height: SPACING.xxxl }} />
        <Text style={[TYPE.brand, { fontSize: 34 }]}>Mini POS</Text>
        <Text style={[TYPE.caption, { marginTop: 6 }]}>Premium retail, simply managed.</Text>

        <View style={s.card}>
          <Text style={[TYPE.h2, { marginBottom: SPACING.md }]}>Sign in</Text>
          <FormField label="Email" value={email} onChangeText={setEmail} placeholder="you@store.co" keyboardType="email-address" />
          <FormField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <ActionButton title="Continue" onPress={onSubmit} loading={loading} style={{ marginTop: SPACING.sm }} />
          <Text style={[TYPE.caption, { marginTop: SPACING.md, textAlign: 'center' }]}>
            Tip: emails containing “admin” sign in as Admin. Anything else is Cashier.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
const s = StyleSheet.create({
  card: { marginTop: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: RADII.xl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.card },
});
