import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

const FORM_CARD_MARGIN = 24;

export default function AdminLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [contentFade, contentSlide]);

  const handleSignIn = async () => {
    if (!identifier || !password) {
      setError('Please enter your credentials');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalEmail = identifier.trim();
      const isEmail = finalEmail.includes('@');
      
      if (!isEmail) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, role')
          .ilike('username', finalEmail)
          .maybeSingle();

        if (profileError || !profile) {
          setError('Username not found');
          setLoading(false);
          return;
        }
        finalEmail = profile.email;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Kiểm tra quyền truy cập admin/shop
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'admin') {
          router.replace('/(admin)');
        } else {
          setError('Access denied. Admin credentials required.');
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.screen}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 60 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
            {/* Header Area */}
            <View className="px-8 mb-12">
              <Text className="text-[12px] font-black tracking-[4px] text-slate-400 uppercase mb-4">
                Atelier Suite
              </Text>
              <Text className="text-[48px] font-[900] text-slate-900 leading-[52px] tracking-[-2px]">
                Admin{"\n"}Access.
              </Text>
            </View>

            {/* Form Card */}
            <View style={s.formCard} className="bg-white border border-slate-100 shadow-2xl shadow-slate-200">
              <View className="mb-8">
                <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase mb-3">
                  Workspace Identity
                </Text>
                <View style={[s.inputWrap, identifierFocused && s.inputFocused]}>
                  <TextInput
                    placeholder="Email or Username"
                    placeholderTextColor="#CBD5E1"
                    style={s.input}
                    value={identifier}
                    onChangeText={setIdentifier}
                    onFocus={() => setIdentifierFocused(true)}
                    onBlur={() => setIdentifierFocused(false)}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-10">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase">
                    Security Key
                  </Text>
                  <Pressable>
                    <Text className="text-[11px] font-bold text-slate-900 uppercase">Forgot?</Text>
                  </Pressable>
                </View>
                <View style={[s.inputWrap, passwordFocused && s.inputFocused]}>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#CBD5E1"
                    style={s.input}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </Pressable>
                </View>
              </View>

              {error && (
                <View className="bg-red-50 p-4 rounded-2xl mb-6 flex-row items-center">
                  <Ionicons name="alert-circle" size={18} color="#EF4444" className="mr-2" />
                  <Text className="text-red-600 text-xs font-bold flex-1">{error}</Text>
                </View>
              )}

              <Pressable 
                onPress={handleSignIn}
                disabled={loading}
                className={`h-16 rounded-3xl items-center justify-center flex-row shadow-lg ${loading ? 'bg-slate-800' : 'bg-black shadow-black/20'}`}
              >
                <Text className="text-white font-black tracking-[1px] mr-2">
                  {loading ? 'VERIFYING...' : 'SIGN IN TO SUITE'}
                </Text>
                {!loading && <Ionicons name="chevron-forward" size={18} color="white" />}
              </Pressable>

              <View className="mt-8 items-center">
                <Text className="text-slate-400 text-xs font-medium">
                  Don&apos;t have access?{" "}
                  <Text 
                    className="text-slate-900 font-black"
                    onPress={() => router.push('/(auth)/signup')}
                  >
                    Request Admin Entry
                  </Text>
                </Text>
              </View>
            </View>

            <Pressable 
              onPress={() => router.back()}
              className="mt-12 items-center flex-row justify-center"
            >
              <Ionicons name="arrow-back" size={16} color="#94A3B8" className="mr-2" />
              <Text className="text-slate-400 font-bold text-sm">Back to Welcome</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formCard: {
    marginHorizontal: FORM_CARD_MARGIN,
    borderRadius: 32,
    padding: 32,
  },
  inputWrap: {
    height: 64,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
