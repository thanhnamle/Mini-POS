import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const FORM_CARD_MARGIN = 20;
const SWITCHER_PADDING = 24;
const SWITCHER_WIDTH = width - (FORM_CARD_MARGIN * 2) - (SWITCHER_PADDING * 2);
const PILL_WIDTH = (SWITCHER_WIDTH - 4) / 2;

type Role = 'cashier' | 'admin';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [role, setRole] = useState<Role>('cashier');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const pillAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchRole = (r: Role) => {
    setRole(r);
    Animated.spring(pillAnim, {
      toValue: r === 'cashier' ? 0 : 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 150,
    }).start();
  };

  return (
    <View style={s.screen}>
      <StatusBar style="dark" />

      {/* ── Background texture elements (Subtle Orbs) ── */}
      <View style={s.orb1} />
      <View style={s.orb2} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 20 }]}
        >
          <Animated.View
            style={[
              s.animatedContent,
              { opacity: contentFade, transform: [{ translateY: contentSlide }] },
            ]}
          >
            {/* ── Top Panel (BRAND & HEADLINE) - Centered ── */}
            <View style={s.topPanel}>
              <View style={s.brandRow}>
                <Text style={s.brand}>ATELIER</Text>
                <View style={s.brandDot} />
              </View>
              
              <View style={s.decoLines}>
                  <View style={[s.decoLine, {width: '15%'}]} />
                  <View style={[s.decoLine, {width: '10%', marginTop: 6}]} />
              </View>

              <Text style={s.panelHeadline}>ATELIER  POS</Text>
              <Text style={s.panelSub}>Sign in to your workspace</Text>
            </View>

            {/* ── FORM CARD - New Design ── */}
            <View style={s.formCard}>
              {/* Role switcher */}
              <View style={s.roleSwitcher}>
                <Animated.View
                  style={[
                    s.rolePill,
                    {
                      width: PILL_WIDTH,
                      transform: [
                        {
                          translateX: pillAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [2, PILL_WIDTH + 2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Pressable style={s.roleBtn} onPress={() => switchRole('cashier')}>
                  <Text style={[s.roleBtnText, role === 'cashier' && s.roleBtnTextActive]}>
                    Cashier
                  </Text>
                </Pressable>
                <Pressable style={s.roleBtn} onPress={() => switchRole('admin')}>
                  <Text style={[s.roleBtnText, role === 'admin' && s.roleBtnTextActive]}>
                    Admin
                  </Text>
                </Pressable>
              </View>

              {/* Email field */}
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>EMAIL OR USERNAME</Text>
                <View style={[s.inputWrap, emailFocused && s.inputWrapFocused]}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={emailFocused ? '#1A1814' : '#A09890'}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="jane@atelierpos.com"
                    placeholderTextColor="#C0B8B0"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password field */}
              <View style={s.fieldGroup}>
                <View style={s.fieldLabelRow}>
                  <Text style={s.fieldLabel}>PASSWORD</Text>
                  <Pressable>
                    <Text style={s.forgotText}>Forgot password?</Text>
                  </Pressable>
                </View>
                <View style={[s.inputWrap, passwordFocused && s.inputWrapFocused]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={passwordFocused ? '#1A1814' : '#A09890'}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor="#C0B8B0"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#A09890"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Sign in button */}
              <Pressable
                style={s.primaryBtn}
                android_ripple={{ color: 'rgba(223, 90, 90, 0.12)', borderless: false }}
                // onPress={() => router.push('/(tabs)')}
              >
                <Text style={s.primaryBtnText}>SIGN IN</Text>
                <View style={s.primaryBtnArrow}>
                  <Ionicons name="key" size={14} color="#1A1814" />
                </View>
              </Pressable>

              {/* Sign up link */}
              <View style={s.switchAuthRow}>
                <Text style={s.switchAuthText}>Don&apos;t have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/signup')}>
                  <Text style={s.switchAuthLink}>Sign Up</Text>
                </Pressable>
              </View>

              <Pressable style={s.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={18} color="#8C8478" />
                <Text style={s.backBtnText}>Back to Home</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EDE9E2', // Nền màn hình kem xám nhạt
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
    paddingBottom: 40,
  },
  animatedContent: {
    flex: 1,
  },

  // Texture Orbs
  orb1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#EAE5DC',
    opacity: 0.7,
  },
  orb2: {
    position: 'absolute',
    bottom: 200,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E8E2D8',
    opacity: 0.5,
  },

  // Top panel (Centered Header)
  topPanel: {
    alignItems: 'center', // Căn giữa nội dung
    marginBottom: 40,
    paddingHorizontal: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  brand: {
    color: '#1A1814',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C8F0B0', // Green dot
    marginTop: 2,
  },
  decoLines: {
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  decoLine: {
    height: 1.5,
    backgroundColor: '#1A1814',
    borderRadius: 1,
    opacity: 0.15,
  },
  panelHeadline: {
    color: '#1A1814',
    fontSize: 50,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 52,
    marginBottom: 12,
    textAlign: 'center', // Căn giữa văn bản
  },
  panelSub: {
    color: '#8C8478',
    fontSize: 15,
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  // ── FORM CARD - New Design ──
  formCard: {
    backgroundColor: '#F4F1EC',
    marginHorizontal: FORM_CARD_MARGIN,
    borderRadius: 28,
    padding: SWITCHER_PADDING,
    shadowColor: '#1A1814',
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  // Role switcher
  roleSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE6DE', // Nền switcher tối hơn Card
    borderRadius: 14,
    padding: 2,
    marginBottom: 32,
    height: 48,
    width: '100%',
  },
  rolePill: {
    position: 'absolute',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1A1814', // Pill màu tối
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8C8478',
  },
  roleBtnTextActive: {
    color: '#F4F1EC', // Màu chữ kem khi active
  },

  // Fields
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    color: '#8C8478',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotText: {
    color: '#1A1814',
    fontSize: 12,
    fontWeight: '700',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE6DE',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapFocused: {
    borderColor: '#C8B890', // Màu beige khi focus
    backgroundColor: '#FFFFFF', // Nền trắng khi focus
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#1A1814',
    fontSize: 16,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 4,
  },

  primaryBtn: {
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1A1814',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Căn giữa nội dung
    marginTop: 10,
    marginBottom: 24,
    paddingHorizontal: 20,
    position: 'relative', // Để định vị icon nếu cần, nhưng ở đây dùng gap
    gap: 12,
  },
  primaryBtnText: {
    color: '#F4F1EC',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryBtnArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C8B890',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
    padding: 10,
  },
  backBtnText: {
    color: '#8C8478',
    fontSize: 14,
    fontWeight: '600',
  },

  // Switch auth
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchAuthText: {
    color: '#8C8478',
    fontSize: 14,
  },
  switchAuthLink: {
    color: '#1A1814',
    fontSize: 14,
    fontWeight: '800',
  },
});