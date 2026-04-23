import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutAtelierScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { marginTop: 20 }]}>
          <Pressable onPress={() => router.push('/(shop)/settings')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#111111" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Label */}
          <Text style={styles.experienceLabel}>THE ATELIER EXPERIENCE</Text>

          {/* Title */}
          <Text style={styles.mainTitle}>Digital Curator</Text>

          {/* Intro Description */}
          <Text style={styles.introText}>
            A space dedicated to the meticulous curation of digital artifacts. We reject the generic in favor of the bespoke, crafting environments that feel architectural rather than utilitarian.
          </Text>

          {/* Hero Image */}
          <View style={styles.heroImageContainer}>
            <Image
              source={require('../../assets/images/atelier_about.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Our Philosophy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Our Philosophy</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>Founded 2026</Text>
              <Text style={styles.metaText}>Version 1.0.0</Text>
            </View>

            <Text style={styles.philosophyText}>
              The Atelier was born from a simple observation: our digital spaces have become noisy, cluttered, and profoundly uninspiring. We envisioned an alternative—a digital environment designed with the same care and intention as a physical gallery or a high-end publication.
            </Text>

            {/* Blockquote */}
            <View style={styles.blockquoteContainer}>
              <Text style={styles.blockquoteText}>
                "We believe that structure should be felt, not seen. Depth is created through tonal layering, not arbitrary lines."
              </Text>
            </View>

            <Text style={styles.philosophyText}>
              Every component, from the weight of our typography to the subtle blur of our navigation, is a deliberate choice. We prioritize intentional asymmetry and generous whitespace to create a sense of breathing room. This is not merely an application; it is an atelier for your digital life.
            </Text>
          </View>

          {/* System Architecture Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>System Architecture</Text>
            
            <View style={styles.archCard}>
              <View style={styles.archIconBox}>
                <Ionicons name="layers-outline" size={20} color="#111111" />
              </View>
              <View style={styles.archInfo}>
                <Text style={styles.archTitle}>Tonal Layering</Text>
                <Text style={styles.archSub}>Depth through shadow and opacity.</Text>
              </View>
            </View>

            <View style={styles.archCard}>
              <View style={styles.archIconBox}>
                <Ionicons name="text-outline" size={20} color="#111111" />
              </View>
              <View style={styles.archInfo}>
                <Text style={styles.archTitle}>Editorial Typography</Text>
                <Text style={styles.archSub}>Inter sans-serif, precisely tracked.</Text>
              </View>
            </View>

            <View style={styles.archCard}>
              <View style={styles.archIconBox}>
                <Ionicons name="code-slash-outline" size={20} color="#111111" />
              </View>
              <View style={styles.archInfo}>
                <Text style={styles.archTitle}>Build Status</Text>
                <Text style={styles.archSub}>v1.0.4 - Stable Release</Text>
              </View>
            </View>
          </View>

          {/* Footer CTA */}
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Experience the Curation</Text>
            <Text style={styles.footerSubtitle}>
              Explore our carefully selected collections and bespoke digital environments.
            </Text>
            <Pressable style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore Collections</Text>
            </Pressable>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  experienceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C8C8C',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -2,
    marginBottom: 24,
    lineHeight: 52,
  },
  introText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 32,
  },
  heroImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 48,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginBottom: 48,
  },
  sectionHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1,
    marginBottom: 12,
  },
  metaInfo: {
    marginBottom: 24,
  },
  metaText: {
    fontSize: 13,
    color: '#8C8C8C',
    fontWeight: '500',
    marginBottom: 4,
  },
  philosophyText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 24,
  },
  blockquoteContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#111111',
    paddingLeft: 24,
    marginVertical: 32,
    marginBottom: 40,
  },
  blockquoteText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#111111',
    fontStyle: 'italic',
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  archCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  archIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  archInfo: {
    flex: 1,
  },
  archTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  archSub: {
    fontSize: 12,
    color: '#8C8C8C',
    fontWeight: '500',
  },
  footerCard: {
    backgroundColor: '#F5F5F5',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 16,
  },
  footerSubtitle: {
    fontSize: 14,
    color: '#8C8C8C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
