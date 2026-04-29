import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Globe, MapPin, Landmark, Languages, Clock } from 'lucide-react-native';

export default function ShopRegionScreen() {
  const router = useRouter();
  const [currency, setCurrency] = useState('VND');
  const [timezone, setTimezone] = useState('GMT+7 (ICT)');
  const [language, setLanguage] = useState('Vietnamese');
  const [address, setAddress] = useState('123 Le Loi, District 1, Ho Chi Minh City');

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(admin)/settings')}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Shop Region</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Region &{'\n'}Localization</Text>
            <Text style={styles.description}>
              Configure your store's regional presence, currency, and local formatting.
            </Text>
          </View>

          {/* --- CURRENCY SELECTION --- */}
          <Section title="CURRENCY & FINANCIALS">
            <SelectionItem 
              icon={<Landmark size={20} color="#0F172A" />} 
              label="Primary Currency" 
              value={currency}
              onPress={() => setCurrency(currency === 'VND' ? 'USD' : 'VND')}
            />
            <View className="h-[1px] bg-slate-50 my-2" />
            <View className="p-4">
              <Text className="text-[12px] font-medium text-slate-400">
                This currency will be used for all transactions, pricing, and financial reporting across the platform.
              </Text>
            </View>
          </Section>

          {/* --- LOCATION & TIMEZONE --- */}
          <Section title="LOCALIZATION">
            <SelectionItem 
              icon={<Clock size={20} color="#0F172A" />} 
              label="Store Timezone" 
              value={timezone}
            />
            <View className="h-[1px] bg-slate-50 my-2" />
            <SelectionItem 
              icon={<Languages size={20} color="#0F172A" />} 
              label="Display Language" 
              value={language}
              onPress={() => setLanguage(language === 'Vietnamese' ? 'English' : 'Vietnamese')}
            />
          </Section>

          {/* --- STORE ADDRESS --- */}
          <Section title="PHYSICAL PRESENCE">
            <View className="p-4">
              <View className="flex-row items-center mb-3">
                <MapPin size={18} color="#64748b" className="mr-2" />
                <Text className="text-sm font-bold text-slate-900">Store Address</Text>
              </View>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter store address..."
              />
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

function SelectionItem({ icon, label, value, onPress }: { icon: any, label: string, value: string, onPress?: () => void }) {
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
        <Text className="text-[12px] font-medium text-slate-400 mt-0.5">{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
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
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    textAlignVertical: 'top',
    minHeight: 100,
  },
});
