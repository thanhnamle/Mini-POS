import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
// Note: Ensure you have react-native-vector-icons installed
import Icon from 'react-native-vector-icons/Feather'; 

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F8" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>THE SERENE{'\n'}MERCHANT</Text>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} // Placeholder avatar
            style={styles.avatar} 
          />
        </View>

        {/* --- HERO SECTION --- */}
        <View style={styles.heroSection}>
          <Text style={styles.subtext}>STORE OVERVIEW</Text>
          <Text style={styles.heroTitle}>Daily{'\n'}Operations</Text>
          
          <Text style={[styles.subtext, { marginTop: 24 }]}>TOTAL SALES (TODAY)</Text>
          <View style={styles.salesRow}>
            <Text style={styles.salesAmount}>$12,480</Text>
            <Text style={styles.salesDecimals}>.00</Text>
          </View>
        </View>

        {/* --- ACTION CARDS --- */}
        <View style={styles.actionGrid}>
          {/* Products Card */}
          <TouchableOpacity style={styles.actionCardWhite}>
            <View style={[styles.iconBox, { backgroundColor: '#0A192F' }]}>
              <Icon name="grid" size={20} color="#FFF" />
            </View>
            <Text style={styles.cardTitleBlack}>Products</Text>
            <Text style={styles.cardSub}>Manage 1,240 items</Text>
          </TouchableOpacity>

          {/* Orders Card */}
          <TouchableOpacity style={styles.actionCardWhite}>
            <View style={[styles.iconBox, { backgroundColor: '#80DFDE' }]}>
              <Icon name="file-text" size={20} color="#0A192F" />
            </View>
            <Text style={styles.cardTitleBlack}>Orders</Text>
            <Text style={styles.cardSub}>48 pending today</Text>
          </TouchableOpacity>

          {/* Add Product Card */}
          <TouchableOpacity style={styles.actionCardDark}>
            <View style={[styles.iconBox, { backgroundColor: '#1A2942' }]}>
              <Icon name="plus" size={20} color="#FFF" />
            </View>
            <Text style={styles.cardTitleWhite}>Add Product</Text>
            <Text style={styles.cardSubWhite}>List a new item</Text>
            {/* Background decorative plus */}
            <Icon name="plus" size={120} color="#1A2942" style={styles.bgPlus} />
          </TouchableOpacity>
        </View>

        {/* --- INVENTORY ALERTS --- */}
        <View style={styles.alertsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INVENTORY ALERTS</Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>!</Text>
            </View>
          </View>

          <View style={styles.alertItem}>
            <View style={styles.alertImageMock} />
            <View>
              <Text style={styles.itemName}>Serene Ceramic Vase</Text>
              <Text style={styles.itemWarning}>Stock: 2 units left</Text>
            </View>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertImageMock, { backgroundColor: '#2C3E50' }]} />
            <View>
              <Text style={styles.itemName}>Organic Night Oil</Text>
              <Text style={styles.itemWarning}>Stock: 1 unit left</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.linkText}>Go to Inventory →</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* --- BOTTOM NAVIGATION (MOCK) --- */}
      <View style={styles.bottomNav}>
        <View style={styles.navItemActive}>
          <Icon name="grid" size={20} color="#FFF" />
          <Text style={styles.navTextActive}>CATALOG</Text>
        </View>
        <View style={styles.navItem}>
          <Icon name="file-text" size={20} color="#A0AAB2" />
          <Text style={styles.navText}>ORDERS</Text>
        </View>
        <View style={styles.navItem}>
          <Icon name="box" size={20} color="#A0AAB2" />
          <Text style={styles.navText}>INVENTORY</Text>
        </View>
        <View style={styles.navItem}>
          <Icon name="settings" size={20} color="#A0AAB2" />
          <Text style={styles.navText}>SETTINGS</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F8', // Warm off-white from design
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    color: '#000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heroSection: {
    marginBottom: 32,
  },
  subtext: {
    fontSize: 12,
    color: '#8A94A6',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0A192F',
    lineHeight: 52,
    letterSpacing: -1,
  },
  salesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  salesAmount: {
    fontSize: 56,
    fontWeight: '900',
    color: '#0A192F',
    letterSpacing: -2,
  },
  salesDecimals: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A192F',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionCardWhite: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  actionCardDark: {
    width: '100%',
    backgroundColor: '#0A192F',
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleBlack: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A192F',
    marginBottom: 4,
  },
  cardTitleWhite: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#8A94A6',
  },
  cardSubWhite: {
    fontSize: 14,
    color: '#8A94A6',
  },
  bgPlus: {
    position: 'absolute',
    right: -20,
    top: -20,
    opacity: 0.5,
  },
  alertsContainer: {
    backgroundColor: '#F2F1ED', // Slightly darker section bg
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#8A94A6',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  alertBadge: {
    backgroundColor: '#FFD7D7',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBadgeText: {
    color: '#D8000C',
    fontWeight: 'bold',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertImageMock: {
    width: 48,
    height: 48,
    backgroundColor: '#D1C8B4',
    borderRadius: 10,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A192F',
    marginBottom: 4,
  },
  itemWarning: {
    fontSize: 13,
    color: '#E06D6D',
    fontWeight: '500',
  },
  linkText: {
    color: '#137C7B',
    fontWeight: '700',
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 15,
    borderTopWidth: 1,
    borderColor: '#EFEFEF',
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: '#0A192F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0AAB2',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});