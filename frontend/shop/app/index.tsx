import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isCompactScreen = height < 840;
  const heroTopPadding = isCompactScreen ? insets.top + 20 : insets.top + 36;
  const heroBottomPadding = isCompactScreen ? 24 : 32;
  const contentPadding = isCompactScreen ? 24 : 32;
  const sectionGap = isCompactScreen ? 32 : 48;
  const artworkHeight = isCompactScreen ? 240 : 320;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Hero Section */}
        <View
          style={{
            paddingHorizontal: contentPadding,
            paddingTop: heroTopPadding,
            paddingBottom: heroBottomPadding,
          }}
        >
          <Text
            className="font-[900] text-slate-900 tracking-[-2px] mb-4"
            style={{
              fontSize: isCompactScreen ? 38 : 44,
              lineHeight: isCompactScreen ? 42 : 48,
            }}
          >
            Master Your{"\n"}Retail Domain.
          </Text>
          <Text
            className="font-medium text-slate-500 max-w-[320px]"
            style={{
              fontSize: isCompactScreen ? 16 : 17,
              lineHeight: isCompactScreen ? 24 : 26,
            }}
          >
            A premium atelier experience for modern store owners. Control inventory, analyze performance, and drive growth with precision.
          </Text>
        </View>

        {/* Features List */}
        <View
          className="space-y-8"
          style={{
            paddingHorizontal: contentPadding,
            marginBottom: sectionGap,
          }}
        >
          <FeatureItem 
            icon="analytics-outline" 
            title="Strategic Analytics" 
            description="Monitor revenue and sales performance in real-time with comprehensive dashboards."
            compact={isCompactScreen}
          />
          <FeatureItem 
            icon="cube-outline" 
            title="Inventory Control" 
            description="Manage products and stock levels with precision. Never miss a restock opportunity."
            compact={isCompactScreen}
          />
          <FeatureItem 
            icon="trending-up-outline" 
            title="Growth Tools" 
            description="Launch campaigns and promotions to boost your business and engage customers."
            compact={isCompactScreen}
          />
        </View>

        {/* Buttons */}
        <View
          className="space-y-4 gap-5"
          style={{
            paddingHorizontal: contentPadding,
            marginBottom: sectionGap,
          }}
        >
          <Pressable 
            onPress={() => router.push('/(auth)/login')}
            className="h-[64px] bg-black rounded-[32px] items-center justify-center active:opacity-90 shadow-lg shadow-black/20"
          >
            <Text className="text-white text-base font-bold">Enter Admin Suite</Text>
          </Pressable>
          
          <Pressable 
            className="h-[64px] bg-slate-50 rounded-[32px] items-center justify-center active:opacity-70 border border-slate-100"
          >
            <Text className="text-slate-900 text-base font-bold">Explore Features</Text>
          </Pressable>
        </View>

        {/* Status Card Image Area */}
        <View style={{ paddingHorizontal: isCompactScreen ? 20 : 24 }}>
          <View
            className="bg-[#0A0A0A] rounded-[40px] overflow-hidden justify-end p-6 relative border border-white/5"
            style={{ height: artworkHeight }}
          >
            <Image 
              source={require('../assets/images/welcome-artwork.png')}
              style={styles.artwork}
              resizeMode="contain"
            />
            
            {/* System Status Overlay */}
            <View className="bg-white/90 backdrop-blur-2xl rounded-[28px] p-6 flex-row justify-between items-center border border-white/20 shadow-xl">
              <View>
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">
                  System Status
                </Text>
                <Text className="text-base font-bold text-slate-900">
                  All Modules Operational
                </Text>
              </View>
              <View className="w-3 h-3 bg-slate-900 rounded-full" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  compact,
}: {
  icon: any,
  title: string,
  description: string,
  compact: boolean,
}) {
  return (
    <View className="flex-row items-start mb-6" style={{ columnGap: compact ? 16 : 20 }}>
      <View
        className="bg-[#F1F1F1] rounded-2xl items-center justify-center"
        style={{
          width: compact ? 44 : 48,
          height: compact ? 44 : 48,
        }}
      >
        <Ionicons name={icon} size={compact ? 20 : 22} color="#111111" />
      </View>
      <View className="flex-1">
        <Text
          className="font-bold text-slate-900 mb-1"
          style={{ fontSize: compact ? 16 : 17 }}
        >
          {title}
        </Text>
        <Text
          className="text-slate-500 font-medium"
          style={{
            fontSize: compact ? 13 : 14,
            lineHeight: compact ? 18 : 20,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
