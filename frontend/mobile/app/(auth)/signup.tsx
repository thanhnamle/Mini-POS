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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const FORM_CARD_MARGIN = 20;
const SWITCHER_PADDING = 24;

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Entrance animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.screen}>
      <StatusBar style="dark" />

      {/* ── Background texture elements ── */}
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
            {/* ── Top Panel (Centered Header) ── */}
            <View style={s.topPanel}>
              <View style={s.brandRow}>
                <Text style={s.brand}>ATELIER.</Text>
              </View>
              
              <View style={s.decoLines}>
                  <View style={[s.decoLine, {width: '15%'}]} />
                  <View style={[s.decoLine, {width: '10%', marginTop: 6}]} />
              </View>

              <Text style={s.panelHeadline}>Create Account</Text>
              <Text style={s.panelSub}>Configure your workspace profile</Text>
            </View>

            {/* ── FORM CARD ── */}
            <View style={s.formCard}>
              {/* Full name field */}
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>FULL NAME</Text>
                <View style={[s.inputWrap, nameFocused && s.inputWrapFocused]}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={nameFocused ? '#1A1814' : '#A09890'}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="Jane Doe"
                    placeholderTextColor="#C0B8B0"
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Work email field */}
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>WORK EMAIL</Text>
                <View style={[s.inputWrap, emailFocused && s.inputWrapFocused]}>
                  <Ionicons
                    name="mail-outline"
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
                <Text style={s.fieldLabel}>CREATE PASSWORD</Text>
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

                {/* Password strength bar */}
                {password.length > 0 && (
                  <View style={s.strengthRow}>
                    {[0, 1, 2, 3].map((i) => (
                      <View
                        key={i}
                        style={[
                          s.strengthSegment,
                          i < Math.min(Math.floor(password.length / 3), 4) && s.strengthSegmentFill,
                          i < Math.min(Math.floor(password.length / 3), 4) &&
                            password.length >= 9 &&
                            s.strengthSegmentStrong,
                        ]}
                      />
                    ))}
                    <Text style={s.strengthLabel}>
                      {password.length < 4
                        ? 'Weak'
                        : password.length < 7
                        ? 'Fair'
                        : password.length < 9
                        ? 'Good'
                        : 'Strong'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Create account button */}
              <Pressable
                style={s.primaryBtn}
                android_ripple={{ color: 'rgba(223, 90, 90, 0.12)', borderless: false }}
                onPress={() => router.push('/(cashier)/index')}
              >
                <Text style={s.primaryBtnText}>CREATE ACCOUNT</Text>
                <View style={s.primaryBtnArrow}>
                  <Ionicons name="person-add" size={14} color="#1A1814" />
                </View>
              </Pressable>

              {/* Sign in link */}
              <View style={s.switchAuthRow}>
                <Text style={s.switchAuthText}>Already have an account? </Text>
                <Pressable onPress={() => router.back()}>
                  <Text style={s.switchAuthLink}>Sign In</Text>
                </Pressable>
              </View>

              <Pressable style={s.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={18} color="#8C8478" />
                <Text style={s.backBtnText}>Back to Login</Text>
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
    backgroundColor: '#EDE9E2',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    alignItems: 'center',
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
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 48,
    marginBottom: 12,
    textAlign: 'center',
  },
  panelSub: {
    color: '#8C8478',
    fontSize: 15,
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  // Form card
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
    borderColor: '#C8B890',
    backgroundColor: '#FFFFFF',
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

  // Dropdown
  dropdownValue: {
    flex: 1,
    color: '#1A1814',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownPlaceholder: {
    color: '#C0B8B0',
  },
  dropdownList: {
    overflow: 'hidden',
    backgroundColor: '#EAE6DE',
    borderRadius: 16,
    marginTop: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
  },
  dropdownItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(26,24,20,0.1)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(26,24,20,0.06)',
  },
  dropdownItemText: {
    color: '#6B6560',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownItemTextSelected: {
    color: '#1A1814',
    fontWeight: '800',
  },

  // Password strength
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  strengthSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#DDD8D0',
  },
  strengthSegmentFill: {
    backgroundColor: '#C8B890',
  },
  strengthSegmentStrong: {
    backgroundColor: '#5C8A5C',
  },
  strengthLabel: {
    color: '#8C8478',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginLeft: 4,
    width: 40,
  },

  primaryBtn: {
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1A1814',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 24,
    paddingHorizontal: 20,
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
