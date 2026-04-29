import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Lock, ShieldCheck, Smartphone, Monitor, ChevronRight, Fingerprint, KeyRound } from 'lucide-react-native';

export default function SecurityScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FA, setIs2FA] = useState(false);
  const [isBiometric, setIsBiometric] = useState(true);

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return 0;
    if (newPassword.length < 6) return 0.3;
    if (newPassword.length < 10) return 0.6;
    return 1;
  };

  const strength = getPasswordStrength();
  const strengthColor = strength <= 0.3 ? '#ef4444' : strength <= 0.6 ? '#f59e0b' : '#10b981';

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password updated successfully');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(admin)/settings')}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Security{'\n'}& Password</Text>
              <Text style={styles.description}>
                Protect your admin workspace with advanced authentication and session management.
              </Text>
            </View>

            {/* --- CHANGE PASSWORD CARD --- */}
            <View className="bg-white rounded-[32px] p-6 mb-8 border border-slate-100 shadow-sm">
              <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-3">
                  <KeyRound size={20} color="#0F172A" />
                </View>
                <Text className="text-lg font-[900] text-slate-900">Change Password</Text>
              </View>

              <View className="space-y-4 flex-col gap-4">
                <View>
                  <Text className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Current Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="••••••••"
                  />
                </View>

                <View>
                  <Text className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">New Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="••••••••"
                  />
                  {/* Strength Meter */}
                  <View className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <View 
                      style={{ width: `${strength * 100}%`, backgroundColor: strengthColor }} 
                      className="h-full" 
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Confirm New Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                  />
                </View>

                <Pressable 
                  onPress={handleUpdatePassword}
                  className="bg-black h-14 rounded-2xl items-center justify-center mt-2 active:opacity-90"
                >
                  <Text className="text-white font-black">Update Password</Text>
                </Pressable>
              </View>
            </View>

            {/* --- SECURITY HARDENING --- */}
            <View className="bg-white rounded-[32px] p-6 mb-8 border border-slate-100 shadow-sm">
              <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-3">
                  <ShieldCheck size={20} color="#10b981" />
                </View>
                <Text className="text-lg font-[900] text-slate-900">Hardening</Text>
              </View>

              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-bold text-slate-900 mb-1">Two-Factor Auth</Text>
                  <Text className="text-xs text-slate-400 font-medium">Add an extra layer of security</Text>
                </View>
                <Switch 
                  value={is2FA} 
                  onValueChange={setIs2FA}
                  trackColor={{ false: '#f1f5f9', true: '#10b981' }}
                />
              </View>

              <View className="h-[1px] bg-slate-50 mb-6" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center">
                    <Text className="text-base font-bold text-slate-900 mb-1 mr-2">Biometric Unlock</Text>
                    <Fingerprint size={14} color="#64748b" />
                  </View>
                  <Text className="text-xs text-slate-400 font-medium">Use FaceID or Fingerprint</Text>
                </View>
                <Switch 
                  value={isBiometric} 
                  onValueChange={setIsBiometric}
                  trackColor={{ false: '#f1f5f9', true: '#10b981' }}
                />
              </View>
            </View>

            {/* --- ACTIVE SESSIONS --- */}
            <View className="bg-white rounded-[32px] p-6 mb-10 border border-slate-100 shadow-sm">
              <Text className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-6">
                Active Sessions
              </Text>
              
              <SessionItem 
                icon={<Smartphone size={18} color="#0F172A" />} 
                device="iPhone 15 Pro" 
                location="TP. Hồ Chí Minh, VN" 
                current 
              />
              <View className="h-[1px] bg-slate-50 my-4" />
              <SessionItem 
                icon={<Monitor size={18} color="#64748b" />} 
                device='MacBook Pro 16"' 
                location="Hà Nội, VN" 
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function SessionItem({ icon, device, location, current }: { icon: any, device: string, location: string, current?: boolean }) {
  return (
    <View className="flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-base font-bold text-slate-900 mr-2">{device}</Text>
          {current && (
            <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
              <Text className="text-[8px] font-black text-emerald-600 uppercase">Current</Text>
            </View>
          )}
        </View>
        <Text className="text-[12px] font-medium text-slate-400 mt-0.5">{location}</Text>
      </View>
      {!current && (
        <Pressable className="px-4 py-2 bg-slate-50 rounded-xl">
          <Text className="text-[10px] font-black text-slate-900 uppercase">Revoke</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111111',
    lineHeight: 44,
    letterSpacing: -1,
  },
  description: {
    fontSize: 16,
    color: '#737373',
    lineHeight: 24,
    marginTop: 12,
  },
  input: {
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});
