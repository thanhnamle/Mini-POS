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
import { SafeAreaView } from 'react-native-safe-area-context';

const ROLES = ['Cashier', 'Store Manager', 'Admin', 'Owner'];
const FORM_CARD_MARGIN = 20;

export default function SignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Entrance animations
  const panelFade = useRef(new Animated.Value(0)).current;
  const panelSlide = useRef(new Animated.Value(-20)).current;
  const formFade = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(28)).current;

  // Dropdown height animation
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(panelFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(panelSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    Animated.parallel([
      Animated.timing(formFade, { toValue: 1, duration: 540, delay: 160, useNativeDriver: true }),
      Animated.timing(formSlide, { toValue: 0, duration: 540, delay: 160, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleDropdown = () => {
    const toValue = roleOpen ? 0 : 1;
    setRoleOpen(!roleOpen);
    Animated.spring(dropdownAnim, {
      toValue,
      useNativeDriver: false,
      damping: 20,
      stiffness: 180,
    }).start();
  };

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setRoleOpen(false);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, ROLES.length * 48],
  });

  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={s.screen}>
      <StatusBar style="light" />

      {/* ── Dark top panel ── */}
      <Animated.View
        style={[s.topPanel, { opacity: panelFade, transform: [{ translateY: panelSlide }] }]}
      >
        <SafeAreaView edges={['top']}>
          <View style={s.topPanelInner}>
            {/* Brand */}
            <View style={s.brandRow}>
              <Text style={s.brand}>ATELIER</Text>
              <View style={s.brandDot} />
            </View>

            <Text style={s.panelHeadline}>Create{'\n'}account.</Text>
            <Text style={s.panelSub}>Configure your workspace profile</Text>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* ── Form card ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View
            style={[s.formCard, { opacity: formFade, transform: [{ translateY: formSlide }] }]}
          >

            {/* Full name */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>FULL NAME</Text>
              <View style={[s.inputWrap, nameFocused && s.inputWrapFocused]}>
                <Ionicons
                  name="person-outline"
                  size={16}
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

            {/* Work email */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>WORK EMAIL</Text>
              <View style={[s.inputWrap, emailFocused && s.inputWrapFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={16}
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

            {/* Primary role dropdown */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>PRIMARY ROLE</Text>
              <Pressable
                style={[s.inputWrap, s.dropdownTrigger, roleOpen && s.inputWrapFocused]}
                onPress={toggleDropdown}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color={roleOpen ? '#1A1814' : '#A09890'}
                  style={s.inputIcon}
                />
                <Text style={[s.dropdownValue, !selectedRole && s.dropdownPlaceholder]}>
                  {selectedRole || 'Select a role...'}
                </Text>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: dropdownAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <Ionicons name="chevron-down" size={16} color="#A09890" />
                </Animated.View>
              </Pressable>

              {/* Dropdown list */}
              <Animated.View style={[s.dropdownList, { height: dropdownHeight, opacity: dropdownOpacity }]}>
                {ROLES.map((role, i) => (
                  <Pressable
                    key={role}
                    style={[
                      s.dropdownItem,
                      i < ROLES.length - 1 && s.dropdownItemBorder,
                      selectedRole === role && s.dropdownItemSelected,
                    ]}
                    onPress={() => selectRole(role)}
                  >
                    <Text style={[s.dropdownItemText, selectedRole === role && s.dropdownItemTextSelected]}>
                      {role}
                    </Text>
                    {selectedRole === role && (
                      <Ionicons name="checkmark" size={15} color="#1A1814" />
                    )}
                  </Pressable>
                ))}
              </Animated.View>
            </View>

            {/* Password */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>CREATE PASSWORD</Text>
              <View style={[s.inputWrap, passwordFocused && s.inputWrapFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
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
              android_ripple={{ color: 'rgba(255,255,255,0.12)', borderless: false }}
            //   onPress={() => router.push('/(tabs)')}
            >
              <Text style={s.primaryBtnText}>Create Account</Text>
              <View style={s.primaryBtnArrow}>
                <Ionicons name="arrow-forward" size={15} color="#1A1814" />
              </View>
            </Pressable>

            {/* Sign in link */}
            <View style={s.switchAuthRow}>
              <Text style={s.switchAuthText}>Already have an account? </Text>
              <Pressable onPress={() => router.back()}>
                <Text style={s.switchAuthLink}>Sign In</Text>
              </Pressable>
            </View>

            {/* Back button */}
            <Pressable style={s.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={18} color="#8C8478" />
                <Text style={s.backBtnText}>Back to SignIn</Text>
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
    backgroundColor: '#1A1814',
  },

  // Top dark panel
  topPanel: {
    backgroundColor: '#1A1814',
    paddingBottom: 28,
  },
  topPanelInner: {
    paddingHorizontal: 28,
    paddingTop: 10,
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  brand: {
    color: '#F4F1EC',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C8B890',
    marginBottom: 2,
  },
  panelHeadline: {
    color: '#F4F1EC',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 42,
    marginBottom: 10,
  },
  panelSub: {
    color: '#7A7268',
    fontSize: 14,
    letterSpacing: 0.1,
  },

  // Form card
  formCard: {
    flex: 1,
    backgroundColor: '#F4F1EC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
    marginTop: -4,
  },

  // Fields
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#8C8478',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE6DE',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapFocused: {
    borderColor: '#1A1814',
    backgroundColor: '#F4F1EC',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1A1814',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 4,
  },

  // Dropdown
  dropdownTrigger: {
    zIndex: 10,
  },
  dropdownValue: {
    flex: 1,
    color: '#1A1814',
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: '#C0B8B0',
  },
  dropdownList: {
    overflow: 'hidden',
    backgroundColor: '#EEEAE2',
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: '#E0DCD4',
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
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#1A1814',
    fontWeight: '700',
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

  // Primary button
  primaryBtn: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#1A1814',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 8,
    marginBottom: 28,
    elevation: 8,
    shadowColor: '#1A1814',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryBtnText: {
    color: '#F4F1EC',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  primaryBtnArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C8B890',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Switch auth
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchAuthText: {
    color: '#8C8478',
    fontSize: 13,
  },
  switchAuthLink: {
    color: '#1A1814',
    fontSize: 13,
    fontWeight: '800',
  },
});