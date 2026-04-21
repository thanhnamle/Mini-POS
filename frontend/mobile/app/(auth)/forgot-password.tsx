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
const SWITCHER_PADDING = 30;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Entrance animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSendReset = () => {
    // Logic to send reset email would go here
    setIsSent(true);
    // After sending, you might want to redirect or show a success state
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

              <Text style={s.panelHeadline}>
                {isSent ? 'Check your\nemail.' : 'Forgot password?'}
              </Text>
              <Text style={s.panelSub}>
                {isSent 
                  ? "We've sent a secure link to reset your credentials to your email."
                  : "Enter your email address below. We'll send a secure link to reset your account credentials."
                }
              </Text>
            </View>

            {/* ── FORM CARD ── */}
            <View style={s.formCard}>
              {!isSent ? (
                <>
                  {/* Email field */}
                  <View style={s.fieldGroup}>
                    <Text style={s.fieldLabel}>WORK EMAIL ADDRESS</Text>
                    <View style={[s.inputWrap, emailFocused && s.inputWrapFocused]}>
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color={emailFocused ? '#1A1814' : '#A09890'}
                        style={s.inputIcon}
                      />
                      <TextInput
                        style={s.input}
                        placeholder="name@atelier.com"
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

                  {/* Send button */}
                  <Pressable
                    style={s.primaryBtn}
                    android_ripple={{ color: 'rgba(223, 90, 90, 0.12)', borderless: false }}
                    onPress={handleSendReset}
                  >
                    <Text style={s.primaryBtnText}>SEND RESET LINK</Text>
                    <View style={s.primaryBtnArrow}>
                      <Ionicons name="arrow-forward" size={14} color="#1A1814" />
                    </View>
                  </Pressable>
                </>
              ) : (
                <View style={s.successContainer}>
                   <View style={s.successIconCircle}>
                      <Ionicons name="checkmark-done" size={32} color="#F4F1EC" />
                   </View>
                   <Text style={s.successText}>Email sent successfully!</Text>
                   <Pressable
                      style={s.primaryBtn}
                      onPress={() => router.replace('/(auth)/login')}
                    >
                      <Text style={s.primaryBtnText}>BACK TO LOGIN</Text>
                    </Pressable>
                </View>
              )}

              {/* Support Link */}
              {!isSent && (
                <View style={s.supportRow}>
                  <Text style={s.supportText}>Still having trouble? </Text>
                  <Pressable>
                    <Text style={s.supportLink}>Contact support</Text>
                  </Pressable>
                </View>
              )}

              {/* Encryption Notice */}
              <View style={s.encryptionBox}>
                <View style={s.encryptionLine} />
                <Text style={s.encryptionText}>END-TO-END ENCRYPTION</Text>
                <View style={s.encryptionLine} />
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

  // Top panel (Centered Header)
  topPanel: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 28,
    position: 'relative',
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

  // Support link
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  supportText: {
    color: '#8C8478',
    fontSize: 14,
  },
  supportLink: {
    color: '#1A1814',
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  // Encryption Notice
  encryptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    opacity: 0.3,
  },
  encryptionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A1814',
  },
  encryptionText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A1814',
    letterSpacing: 1,
  },

  // Success state
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1814',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successText: {
    color: '#1A1814',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  }
});
