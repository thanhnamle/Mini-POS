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
import PhoneInput from 'react-native-phone-number-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

const FORM_CARD_MARGIN = 24;

export default function AdminSignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [password, setPassword] = useState('');
  const phoneInputRef = useRef<PhoneInput | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !username || !phone.trim()) {
      setError('Please fill in all security fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase().trim(),
            phone: formattedPhone,
            role: 'admin',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          username: username.toLowerCase().trim(),
          email: email,
          role: 'admin',
        }, { onConflict: 'id' });

        if (profileError && profileError.code !== '42501') {
          console.error('Profile creation issue:', profileError.message);
          setError(`DB Error: ${profileError.message}`);
          setLoading(false);
          return;
        }
        
        // Hiện thông báo thành công thay vì chuyển trang ngay
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, icon: any, value: string, onChange: (t: string) => void, placeholder: string, fieldKey: string, props: any = {}) => (
    <View className="mb-6">
      <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase mb-3 ml-1">
        {label}
      </Text>
      <View style={[s.inputWrap, focusedField === fieldKey && s.inputFocused]}>
        <Ionicons name={icon} size={18} color={focusedField === fieldKey ? '#000000' : '#94A3B8'} className="mr-3" />
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <View style={s.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 40 }]} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            
            <View className="px-8 mb-10">
              <Text className="text-[12px] font-black tracking-[4px] text-slate-400 uppercase mb-4">
                Registration
              </Text>
              <Text className="text-[40px] font-[900] text-slate-900 leading-[44px] tracking-[-2px]">
                Request Entry.
              </Text>
            </View>

            <View style={s.formCard} className="bg-white border border-slate-100 shadow-2xl shadow-slate-200">
              {renderField('Atelier Name', 'person-outline', fullName, setFullName, 'Owner Full Name', 'name')}
              {renderField('Identifier', 'at-outline', username, setUsername, 'workspace_id', 'user', { autoCapitalize: 'none' })}
              {renderField('Work Email', 'mail-outline', email, setEmail, 'admin@atelier.com', 'email', { keyboardType: 'email-address' })}

              <View className="mb-6">
                <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase mb-3 ml-1">
                  Contact Number
                </Text>
                <View style={[s.inputWrap, s.phoneWrap, focusedField === 'phone' && s.inputFocused]}>
                  <PhoneInput
                    ref={phoneInputRef}
                    defaultCode="VN"
                    layout="first"
                    onChangeText={setPhone}
                    onChangeFormattedText={setFormattedPhone}
                    containerStyle={s.phoneContainer}
                    textContainerStyle={s.phoneTextContainer}
                    textInputStyle={s.phoneInputText}
                    codeTextStyle={s.phoneCodeText}
                    flagButtonStyle={s.phoneFlagButton}
                    textInputProps={{
                      onFocus: () => setFocusedField('phone'),
                      onBlur: () => setFocusedField(null),
                    }}
                  />
                </View>
              </View>

              <View className="mb-10">
                <Text className="text-[11px] font-black tracking-[2px] text-slate-400 uppercase mb-3 ml-1">
                  Master Password
                </Text>
                <View style={[s.inputWrap, focusedField === 'pass' && s.inputFocused]}>
                  <Ionicons name="lock-closed-outline" size={18} color={focusedField === 'pass' ? '#000000' : '#94A3B8'} className="mr-3" />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor="#CBD5E1"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField('pass')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
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
                onPress={handleSignUp}
                disabled={loading}
                className={`h-16 rounded-3xl items-center justify-center flex-row shadow-lg ${loading ? 'bg-slate-800' : 'bg-black shadow-black/20'}`}
              >
                <Text className="text-white font-black tracking-[1px] mr-2">
                  {loading ? 'PROCESSING...' : 'INITIALIZE WORKSPACE'}
                </Text>
                {!loading && <Ionicons name="arrow-forward" size={18} color="white" />}
              </Pressable>

              <View className="mt-8 items-center">
                <Text className="text-slate-400 text-xs font-medium">
                  Already have access?{" "}
                  <Text className="text-slate-900 font-black" onPress={() => router.back()}>
                    Sign In
                  </Text>
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- SUCCESS OVERLAY --- */}
      {isSuccess && (
        <View style={[StyleSheet.absoluteFill, s.successOverlay]} className="items-center justify-center px-10">
          <Animated.View className="bg-white rounded-[40px] p-10 w-full items-center shadow-2xl border border-slate-50">
            <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-8">
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>
            
            <Text className="text-3xl font-[900] text-slate-900 text-center mb-4 tracking-[-1px]">
              Setup Complete.
            </Text>
            
            <Text className="text-slate-500 text-center font-bold leading-6 mb-10">
              Your Atelier Admin account has been initialized. You can now access your workspace.
            </Text>

            <Pressable 
              onPress={() => router.replace('/(auth)/login')}
              className="bg-black w-full h-16 rounded-3xl items-center justify-center flex-row shadow-lg shadow-black/20"
            >
              <Text className="text-white font-black tracking-[1px] mr-2">ENTER ATELIER</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </Pressable>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 60 },
  formCard: { marginHorizontal: FORM_CARD_MARGIN, borderRadius: 32, padding: 24 },
  inputWrap: {
    height: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: { borderColor: '#000000', backgroundColor: '#FFFFFF' },
  input: { flex: 1, color: '#0F172A', fontSize: 15, fontWeight: '700' },
  phoneWrap: { paddingHorizontal: 0, overflow: 'hidden' },
  phoneContainer: { 
    flex: 1, 
    backgroundColor: 'transparent',
    height: 60,
  },
  phoneTextContainer: { 
    flex: 1, 
    backgroundColor: 'transparent', 
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  phoneInputText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#0F172A', 
    height: 60,
  },
  phoneCodeText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#0F172A',
  },
  phoneFlagButton: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 100,
  },
});
