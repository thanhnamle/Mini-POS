import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
    title: 'Smart Inventory',
    description: 'Precise, automated tracking and control over every SKU in your collection.',
    icon: 'archive-outline',
    index: 0,
  },
  {
    title: 'Seamless Checkout',
    description: 'Frictionless, elegant transactions designed to elevate the final customer touchpoint.',
    icon: 'card-outline',
    index: 1,
  },
  {
    title: 'Real-time Analytics',
    description: 'Instant, data-driven insights crafted to inform your strategic curation.',
    icon: 'stats-chart-outline',
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
  }, []);

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
        <Ionicons name={icon} size={20} color="#F8F5F0" />
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
  }, []);

  return (
    <View style={styles.heroContainer}>
      {/* Warm ambient glow behind */}
      <View style={styles.heroGlowOuter} />

      {/* Room frame */}
      <View style={styles.heroRoom}>
        {/* Ceiling shadow band */}
        <View style={styles.heroCeilingBand} />

        {/* Back wall */}
        <View style={styles.heroWall}>
          {/* Niche / alcove */}
          <View style={styles.heroNiche}>
            <View style={styles.heroNicheInner} />
          </View>
        </View>

        {/* Pendant lamps */}
        {[
          { left: '16%' as const, stemH: 52, delay: 0 },
          { left: '33%' as const, stemH: 70, delay: 80 },
          { left: '56%' as const, stemH: 60, delay: 40 },
          { left: '74%' as const, stemH: 44, delay: 120 },
        ].map(({ left, stemH, delay }, i) => (
          <PendantLamp key={i} left={left} stemHeight={stemH} pulseAnim={pulseAnim} />
        ))}

        {/* Floor reflection strip */}
        <View style={styles.heroFloorStrip} />

        {/* Counter */}
        <View style={styles.heroCounter}>
          <View style={styles.heroCounterSurface} />
          <View style={styles.heroCounterBody} />
          <View style={styles.heroCounterBase} />
        </View>

        {/* Floor */}
        <View style={styles.heroFloor} />
      </View>

      {/* Corner accent label */}
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>POS v2</Text>
      </View>
    </View>
  );
}

type LampProps = {
  left: `${number}%`;
  stemHeight: number;
  pulseAnim: Animated.Value;
};

function PendantLamp({ left, stemHeight, pulseAnim }: LampProps) {
  return (
    <View style={[styles.lamp, { left }]}>
      <View style={[styles.lampStem, { height: stemHeight }]} />
      <View style={styles.lampCap} />
      <View style={styles.lampShadeWrap}>
        <View style={styles.lampShade} />
      </View>
      <Animated.View
        style={[
          styles.lightPool,
          { opacity: pulseAnim },
        ]}
      />
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
  }, []);

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
            <Text style={styles.brand}>ATELIER</Text>
            <View style={styles.topBarPill}>
              <View style={styles.topBarDot} />
              <Text style={styles.topBarPillText}>POS</Text>
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

            <Text style={styles.headline}>The modern{'\n'}retail OS.</Text>

            <Text style={styles.subheadline}>
              Built for boutiques, galleries, and studios that refuse to compromise on experience.
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
          android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: false }}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryBtnText}>GET STARTED</Text>
          <View style={styles.primaryBtnArrow}>
            <Ionicons name="arrow-forward" size={16} color="#1A1814" />
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
    backgroundColor: '#F4F1EC',
  },

  // Orbs
  orbTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#EAE5DC',
    opacity: 0.7,
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: 200,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E8E2D8',
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
    color: '#1A1814',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  topBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#BFA28C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  topBarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C8F0B0',
  },
  topBarPillText: {
    color: '#F4F1EC',
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
    backgroundColor: '#2B2925',
    shadowColor: '#BFA28C',
    shadowOpacity: 0.30,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  heroGlowOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF1D3',
  },
  heroRoom: {
    position: 'absolute',
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroCeilingBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#BFA28C',
  },
  heroWall: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    bottom: 60,
    backgroundColor: '#9c866b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroNiche: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#28241F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  heroNicheInner: {
    width: 90,
    height: 56,
    borderRadius: 4,
    backgroundColor: '#80623e',
  },
  heroFloorStrip: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgb(209, 172, 150)',
  },
  heroFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFF1D3',
  },
  heroCounter: {
    position: 'absolute',
    bottom: 60,
    left: 50,
    right: 50,
  },
  heroCounterSurface: {
    height: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#947a55',
  },
  heroCounterBody: {
    height: 22,
    backgroundColor: '#b9a988',
  },
  heroCounterBase: {
    alignSelf: 'center',
    width: '85%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2A2620',
  },
  heroBadge: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: 'rgba(128, 38, 38, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroBadgeText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Lamps
  lamp: {
    position: 'absolute',
    top: 14,
    alignItems: 'center',
  },
  lampStem: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  lampCap: {
    width: 8,
    height: 3,
    borderRadius: 1,
    backgroundColor: '#5A5550',
  },
  lampShadeWrap: {
    alignItems: 'center',
  },
  lampShade: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#d3ad66',
  },
  lightPool: {
    width: 72,
    height: 50,
    borderRadius: 36,
    backgroundColor: 'rgba(247, 173, 25, 0.51)',
    marginTop: 2,
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
    backgroundColor: '#8C8070',
    borderRadius: 1,
  },
  eyebrowText: {
    color: '#8C8070',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  headline: {
    color: '#1A1814',
    fontSize: 50,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: -2.5,
    marginBottom: 18,
  },
  subheadline: {
    color: '#6B6560',
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
    backgroundColor: 'rgba(26,24,20,0.15)',
  },
  sectionDividerLabel: {
    color: '#9C9690',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
  },

  // Feature list
  featureList: {
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#f3e5cc',
    overflow: 'hidden',
    shadowColor: '#C8C0B4',
    shadowOpacity: 0.3,
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
    borderBottomColor: 'rgba(26,24,20,0.1)',
  },
  featureNumTag: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
  },
  featureNumText: {
    color: '#B0A898',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featureIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#BFA28C',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTextWrap: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    color: '#1A1814',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  featureDesc: {
    color: '#706860',
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
    backgroundColor: '#F4F1EC',
  },
  footerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(26,24,20,0.1)',
  },
  primaryBtn: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#1A1814',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 10,
    shadowColor: '#BFA28C',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  primaryBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  primaryBtnText: {
    color: '#F4F1EC',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C8B890',
    alignItems: 'center',
    justifyContent: 'center',
  },
});