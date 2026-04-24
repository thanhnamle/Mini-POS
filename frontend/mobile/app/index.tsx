import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  index: number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: Feature[] = [
  {
    title: 'Curated Collections',
    description: 'Explore our hand-picked selection of premium apparel and accessories.',
    icon: 'shirt-outline',
    index: 0,
  },
  {
    title: 'Seamless Shopping',
    description: 'Experience a frictionless checkout designed for the modern connoisseur.',
    icon: 'bag-handle-outline',
    index: 1,
  },
  {
    title: 'Personalized Style',
    description: 'Get tailored recommendations that match your unique aesthetic.',
    icon: 'sparkles-outline',
    index: 2,
  },
];

// ─── Animated Feature Row ──────────────────────────────────────────────────────

function FeatureRow({ title, description, icon, index }: Feature) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 480,
        delay: 400 + index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 480,
        delay: 400 + index * 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, index, slideAnim]);


  const isLast = index === features.length - 1;

  return (
    <Animated.View
      style={[
        styles.featureRow,
        !isLast && styles.featureRowBorder,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Number tag */}
      <View style={styles.featureNumTag}>
        <Text style={styles.featureNumText}>0{index + 1}</Text>
      </View>

      {/* Icon circle */}
      <View style={styles.featureIconCircle}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>

      {/* Text */}
      <View style={styles.featureTextWrap}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Hero Scene ────────────────────────────────────────────────────────────────

function HeroScene() {
  const pulseAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.88,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.heroContainer}>
      {/* Premium Generated Background */}
      <Image 
        source={require('../assets/images/hero_bw.png')} 
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Corner accent label */}
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>EST. 2026</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  // Hero fade in
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-16)).current;
  const headFade = useRef(new Animated.Value(0)).current;
  const headSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(heroSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.parallel([
      Animated.timing(headFade, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(headSlide, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [heroFade, heroSlide, headFade, headSlide]);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* Subtle background texture orbs */}
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: footerHeight > 0 ? footerHeight + 24 : 200 }}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>

          {/* ── Top bar ── */}
          <View style={styles.topBar}>
            <Text style={styles.brand}>ATELIER.</Text>
            <View style={styles.topBarPill}>
              <View style={styles.topBarDot} />
              <Text style={styles.topBarPillText}>BOUTIQUE</Text>
            </View>
          </View>

          {/* ── Hero ── */}
          <Animated.View
            style={[
              styles.heroWrap,
              { opacity: heroFade, transform: [{ translateY: heroSlide }] },
            ]}
          >
            <HeroScene />
          </Animated.View>

          {/* ── Headline block ── */}
          <Animated.View
            style={[
              styles.headlineBlock,
              { opacity: headFade, transform: [{ translateY: headSlide }] },
            ]}
          >
            {/* Eyebrow */}
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrowText}>CURATED COMMERCE</Text>
            </View>

            <Text style={styles.headline}>The modern{'\n'}fashion house</Text>

            <Text style={styles.subheadline}>
              A digital sanctuary for boutiques, galleries, and studios that value timeless design.
            </Text>
          </Animated.View>

          {/* ── Divider ── */}
          <View style={styles.sectionDivider}>
            <View style={styles.sectionDividerLine} />
            <Text style={styles.sectionDividerLabel}>WHAT&apos;S INSIDE</Text>
            <View style={styles.sectionDividerLine} />
          </View>

          {/* ── Feature list ── */}
          <View style={styles.featureList}>
            {features.map((f) => (
              <FeatureRow key={f.title} {...f} />
            ))}
          </View>

        </SafeAreaView>
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View
        onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        {/* Blur-like top border */}
        <View style={styles.footerBorder} />

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(auth)/login')}
          android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryBtnText}>GET STARTED</Text>
          <View style={styles.primaryBtnArrow}>
            <Ionicons name="arrow-forward" size={16} color="#000000" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Orbs
  orbTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#F0F0F0',
    opacity: 0.7,
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: 200,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },

  safeArea: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  brand: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  topBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  topBarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2bff00ff',
  },
  topBarPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // Hero container
  heroWrap: {
    marginBottom: 36,
  },
  heroContainer: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  heroBadge: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Headline block
  headlineBlock: {
    marginBottom: 32,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  eyebrowLine: {
    width: 24,
    height: 1.5,
    backgroundColor: '#000000',
    borderRadius: 1,
  },
  eyebrowText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  headline: {
    color: '#000000',
    fontSize: 50,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: -2.5,
    marginBottom: 18,
  },
  subheadline: {
    color: '#666666',
    fontSize: 15,
    lineHeight: 26,
    letterSpacing: -0.1,
    maxWidth: 280,
  },

  // Section divider
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  sectionDividerLabel: {
    color: '#999999',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
  },

  // Feature list
  featureList: {
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  featureRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  featureNumTag: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
  },
  featureNumText: {
    color: '#999999',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featureIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTextWrap: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  featureDesc: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 20,
  },

  // Footer
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  footerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  primaryBtn: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  primaryBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});