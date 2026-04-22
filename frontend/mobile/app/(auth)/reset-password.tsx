import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
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

const FORM_CARD_MARGIN = 20;
const SWITCHER_PADDING = 24;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  // Entrance animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [contentFade, contentSlide]);

  const handleUpdatePassword = () => {
    // Logic to update password
    router.replace('/(auth)/login');
  };

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
              <Pressable style={s.backIconBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#1A1814" />
              </Pressable>

              <View style={s.brandRow}>
                <Text style={s.brand}>ATELIER.</Text>
              </View>
              
              <View style={s.decoLines}>
                  <View style={[s.decoLine, {width: '15%'}]} />
                  <View style={[s.decoLine, {width: '10%', marginTop: 6}]} />
              </View>

              <Text style={s.panelHeadline}>Create New Password</Text>
              <Text style={s.panelSub}>Please enter and confirm your new password.</Text>
            </View>

            {/* ── FORM CARD ── */}
            <View style={s.formCard}>
              {/* New Password field */}
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>NEW PASSWORD</Text>
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
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#A09890"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password field */}
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>CONFIRM PASSWORD</Text>
                <View style={[s.inputWrap, confirmFocused && s.inputWrapFocused]}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={confirmFocused ? '#1A1814' : '#A09890'}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor="#C0B8B0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={s.eyeBtn}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#A09890"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Update button */}
              <Pressable
                style={s.primaryBtn}
                android_ripple={{ color: 'rgba(223, 90, 90, 0.12)', borderless: false }}
                onPress={handleUpdatePassword}
              >
                <Text style={s.primaryBtnText}>UPDATE PASSWORD</Text>
                <View style={s.primaryBtnArrow}>
                  <Ionicons name="refresh" size={14} color="#1A1814" />
                </View>
              </Pressable>

              {/* Security Notice */}
              <View style={s.securityNotice}>
                <Ionicons name="shield-outline" size={12} color="#8C8478" />
                <Text style={s.securityText}>Passwords must be at least 8 characters long.</Text>
              </View>
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
  backIconBtn: {
    position: 'absolute',
    left: 20,
    top: -10,
    padding: 8,
    zIndex: 10,
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

  // Top panel
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
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 40,
    marginBottom: 12,
    textAlign: 'center',
  },
  panelSub: {
    color: '#8C8478',
    fontSize: 15,
    letterSpacing: 0.1,
    textAlign: 'center',
    lineHeight: 22,
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

  // Security notice
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.6,
  },
  securityText: {
    fontSize: 12,
    color: '#8C8478',
    fontWeight: '600',
  },
});
