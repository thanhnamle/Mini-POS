import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Set up your terminal, connect hardware, and start selling.',
      icon: 'rocket-outline',
    },
    {
      id: '2',
      title: 'Inventory Management',
      description: 'Add products, track stock, and manage variations.',
      icon: 'cube-outline',
    },
    {
      id: '3',
      title: 'Payments & Payouts',
      description: 'Understand fees, refunds, and bank transfers.',
      icon: 'card-outline',
    },
    {
      id: '4',
      title: 'Staff & Permissions',
      description: 'Manage team access and track performance.',
      icon: 'people-outline',
    },
    {
      id: '5',
      title: 'Reports & Analytics',
      description: 'Dive deep into sales data and insights.',
      icon: 'bar-chart-outline',
    },
  ];

  const popularArticles = [
    { id: '1', title: 'How to process a refund', icon: 'document-text-outline' },
    { id: '2', title: 'Connecting a receipt printer', icon: 'print-outline' },
    { id: '3', title: 'Updating your business details', icon: 'business-outline' },
  ];

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
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>How can we help?</Text>
            <Text style={styles.welcomeSubtitle}>
              Search for answers or browse our knowledge base below.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#737373" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search articles..."
                placeholderTextColor="#737373"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBorder} />
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>

          {categories.map((item) => (
            <Pressable key={item.id} style={styles.categoryCard}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryDescription}>{item.description}</Text>
              </View>
            </Pressable>
          ))}

          {/* Popular Articles */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBorder} />
            <Text style={styles.sectionTitle}>Popular Articles</Text>
          </View>

          <View style={styles.articlesCard}>
            {popularArticles.map((article, index) => (
              <Pressable
                key={article.id}
                style={[
                  styles.articleItem,
                  index !== popularArticles.length - 1 && styles.articleDivider,
                ]}
              >
                <Ionicons name={article.icon as any} size={20} color="#737373" />
                <Text style={styles.articleTitle}>{article.title}</Text>
              </Pressable>
            ))}
          </View>

          {/* Still need help? */}
          <View style={[styles.ctaCard, { marginBottom: 50 }]}>
            <Text style={styles.ctaTitle}>Still need help?</Text>
            <Text style={styles.ctaSubtitle}>
              Our support team is available 24/7. Reach out via chat, email, or phone.
            </Text>
            <Pressable style={styles.chatButton}>
              <Ionicons name="chatbubble" size={18} color="#111111" />
              <Text style={styles.chatButtonText}>Live Chat</Text>
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
    backgroundColor: '#FFFFFF',
  },
  backButton: {
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleBorder: {
    width: 4,
    height: 24,
    backgroundColor: '#111111',
    marginRight: 12,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#737373',
    lineHeight: 18,
  },
  articlesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  articleDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  ctaCard: {
    backgroundColor: '#000000',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    gap: 10,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
});
