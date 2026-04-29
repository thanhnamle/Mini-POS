import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, Moon, Sun, Trash2, Info, Laptop } from 'lucide-react-native';

export default function PreferencesScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState('System');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all temporary data?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Success', 'Cache cleared successfully') }
      ]
    );
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
          <Text style={styles.headerTitle}>App Preferences</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>App{'\n'}Preferences</Text>
            <Text style={styles.description}>
              Customize the look and feel of your Atelier Admin workspace.
            </Text>
          </View>

          {/* --- APPEARANCE --- */}
          <Section title="APPEARANCE">
            <ThemeItem 
              icon={<Sun size={20} color="#f59e0b" />}
              label="Light Mode"
              selected={theme === 'Light'}
              onPress={() => setTheme('Light')}
            />
            <View className="h-[1px] bg-slate-50 mx-4" />
            <ThemeItem 
              icon={<Moon size={20} color="#6366f1" />}
              label="Dark Mode"
              selected={theme === 'Dark'}
              onPress={() => setTheme('Dark')}
            />
            <View className="h-[1px] bg-slate-50 mx-4" />
            <ThemeItem 
              icon={<Laptop size={20} color="#64748b" />}
              label="System Default"
              selected={theme === 'System'}
              onPress={() => setTheme('System')}
            />
          </Section>

          {/* --- STORAGE --- */}
          <Section title="DATA & STORAGE">
            <Pressable 
              onPress={handleClearCache}
              className="flex-row items-center p-4 active:bg-slate-50 rounded-[24px]"
            >
              <View className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center mr-4">
                <Trash2 size={20} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-slate-900">Clear App Cache</Text>
                <Text className="text-[12px] font-medium text-slate-400 mt-0.5">Free up ~42.5 MB of space</Text>
              </View>
            </Pressable>
          </Section>

          {/* --- INFO --- */}
          <Section title="ABOUT ATELIER">
            <View className="p-4 flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-4">
                <Info size={20} color="#0F172A" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-slate-900">Version Info</Text>
                <Text className="text-[12px] font-medium text-slate-400 mt-0.5">v1.0.4 - Stable Build</Text>
              </View>
            </View>
          </Section>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4 ml-2">
        {title}
      </Text>
      <View className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm">
        {children}
      </View>
    </View>
  );
}

function ThemeItem({ icon, label, selected, onPress }: { icon: any, label: string, selected: boolean, onPress: () => void }) {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center p-4 active:bg-slate-50 rounded-[24px]"
    >
      <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-slate-900">{label}</Text>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
      )}
    </Pressable>
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
});
