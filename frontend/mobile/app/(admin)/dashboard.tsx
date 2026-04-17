import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AdminBottomNav, type AdminTabKey } from '@/components/admin-bottom-nav';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
};

type OrderStatus = 'Pending' | 'Ready' | 'Completed';

type Order = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  time: string;
};

const INITIAL_PRODUCTS: Product[] = [
  { id: 'SKU-104', title: 'Serene Ceramic Vase', category: 'Decor', price: 120, stock: 2 },
  { id: 'SKU-212', title: 'Organic Night Oil', category: 'Wellness', price: 68, stock: 1 },
  { id: 'SKU-310', title: 'Linen Table Runner', category: 'Home', price: 42, stock: 18 },
  { id: 'SKU-411', title: 'Scented Sandal Candle', category: 'Aromatics', price: 36, stock: 7 },
];

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-2201', customer: 'Sophia Tran', total: 2480, status: 'Pending', time: '09:15' },
  { id: 'ORD-2202', customer: 'Noah Nguyen', total: 5840, status: 'Ready', time: '10:40' },
  { id: 'ORD-2203', customer: 'Liam Pham', total: 4160, status: 'Completed', time: '12:05' },
];

function getDisplayName(email?: string | string[]) {
  if (!email || typeof email !== 'string') {
    return 'Julian Reed';
  }

  if (email.includes('admin')) {
    return 'Julian Reed';
  }

  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getNextOrderStatus(status: OrderStatus): OrderStatus {
  if (status === 'Pending') {
    return 'Ready';
  }

  if (status === 'Ready') {
    return 'Completed';
  }

  return 'Completed';
}

function formatMoney(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function isDashboardTab(value: string | string[] | undefined): value is AdminTabKey {
  return value === 'catalog' || value === 'sales' || value === 'inventory' || value === 'settings';
}

export default function DashboardScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    role?: string;
    section?: string;
  }>();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeSection, setActiveSection] = useState<AdminTabKey>(
    isDashboardTab(params.section) && params.section !== 'settings' ? params.section : 'catalog'
  );
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (isDashboardTab(params.section) && params.section !== 'settings') {
      setActiveSection(params.section);
    }
  }, [params.section]);

  const displayName = useMemo(() => getDisplayName(params.email), [params.email]);

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= 8).sort((left, right) => left.stock - right.stock),
    [products]
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status !== 'Completed'),
    [orders]
  );

  const todaySales = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const totalUnits = useMemo(
    () => products.reduce((sum, product) => sum + product.stock, 0),
    [products]
  );

  const handleAddProduct = () => {
    const nextIndex = products.length + 1;
    const newProduct: Product = {
      id: `SKU-${520 + nextIndex}`,
      title: `New Signature Item ${nextIndex}`,
      category: 'New Arrival',
      price: 32 + nextIndex * 3,
      stock: 12,
    };

    setProducts((current) => [newProduct, ...current]);
    setActiveSection('catalog');
    setLastUpdated(new Date());
    Alert.alert('Product created', `${newProduct.title} was added to the catalog.`);
  };

  const handleAdjustPrice = (productId: string) => {
    let updatedName = '';

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        updatedName = product.title;
        return { ...product, price: product.price + 5 };
      })
    );

    setLastUpdated(new Date());
    Alert.alert('Price updated', `${updatedName} is now priced higher by $5.`);
  };

  const handleRestock = (productId: string) => {
    let updatedName = '';

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        updatedName = product.title;
        return { ...product, stock: product.stock + 10 };
      })
    );

    setLastUpdated(new Date());
    Alert.alert('Inventory restocked', `${updatedName} received 10 new units.`);
  };

  const handleAdvanceOrder = (orderId: string) => {
    let nextStatus: OrderStatus = 'Completed';
    let orderLabel = orderId;

    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        orderLabel = order.customer;
        nextStatus = getNextOrderStatus(order.status);
        return { ...order, status: nextStatus };
      })
    );

    setLastUpdated(new Date());
    Alert.alert('Order updated', `${orderLabel} moved to ${nextStatus}.`);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    Alert.alert('Dashboard refreshed', 'Store metrics and task queues were refreshed.');
  };

  const openSettings = () => {
    router.push({
      pathname: '/(admin)/settings',
      params: {
        email: params.email,
        role: params.role ?? 'Admin',
      },
    });
  };

  const handleBottomNav = (tab: AdminTabKey) => {
    if (tab === 'settings') {
      openSettings();
      return;
    }

    setActiveSection(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.screen} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() =>
              Alert.alert(
                'Merchant shortcuts',
                'Use Products to manage the catalog, Orders to advance queue status, and Inventory to restock low items.'
              )
            }
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Ionicons name="menu-outline" size={24} color={Colors.primary} />
          </Pressable>

          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>THE SERENE</Text>
            <Text style={styles.brandTitle}>MERCHANT</Text>
          </View>

          <Pressable onPress={openSettings} style={({ pressed }) => pressed && styles.pressed}>
            <Image source={{ uri: 'https://i.pravatar.cc/120?img=12' }} style={styles.avatar} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.eyebrow}>STORE OVERVIEW</Text>
              <Text style={styles.heroGreeting}>Welcome back, {displayName}</Text>
              <Text style={styles.heroTitle}>Daily{"\n"}Operations</Text>
            </View>
            <Pressable onPress={handleRefresh} style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}>
              <Ionicons name="refresh" size={16} color={Colors.primary} />
              <Text style={styles.refreshLabel}>Refresh</Text>
            </Pressable>
          </View>

          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.eyebrow}>TOTAL SALES (TODAY)</Text>
              <Text style={styles.metricValue}>{formatMoney(todaySales)}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricStack}>
              <Text style={styles.metricLabel}>Units in stock</Text>
              <Text style={styles.metricNumber}>{totalUnits}</Text>
              <Text style={styles.metricLabel}>Pending tasks {pendingOrders.length + lowStockProducts.length}</Text>
            </View>
          </View>

          <View style={styles.updatedRow}>
            <Ionicons name="time-outline" size={14} color={Colors.textSubtle} />
            <Text style={styles.updatedText}>
              Last updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <Pressable
            onPress={() => setActiveSection('catalog')}
            style={({ pressed }) => [
              styles.actionCard,
              activeSection === 'catalog' && styles.actionCardActive,
              pressed && styles.pressed,
            ]}>
            <View style={[styles.iconBadge, { backgroundColor: Colors.primary }]}>
              <Ionicons name="grid-outline" size={18} color={Colors.white} />
            </View>
            <Text style={styles.actionTitle}>Products</Text>
            <Text style={styles.actionCopy}>Manage {products.length} active catalog items</Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveSection('sales')}
            style={({ pressed }) => [
              styles.actionCard,
              activeSection === 'sales' && styles.actionCardActive,
              pressed && styles.pressed,
            ]}>
            <View style={[styles.iconBadge, { backgroundColor: '#bfe8e0' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Orders</Text>
            <Text style={styles.actionCopy}>{pendingOrders.length} orders still moving through fulfillment</Text>
          </Pressable>

          <Pressable onPress={handleAddProduct} style={({ pressed }) => [styles.actionCardWide, pressed && styles.pressed]}>
            <View style={[styles.iconBadge, { backgroundColor: '#1a385c' }]}>
              <Ionicons name="add" size={20} color={Colors.white} />
            </View>
            <Text style={styles.actionTitleDark}>Add Product</Text>
            <Text style={styles.actionCopyDark}>Create a new item and publish it to the admin catalog</Text>
            <Ionicons name="add" size={112} color="#1b3554" style={styles.backgroundIcon} />
          </Pressable>
        </View>

        <View style={styles.alertShell}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INVENTORY ALERTS</Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{lowStockProducts.length}</Text>
            </View>
          </View>

          {lowStockProducts.map((product) => (
            <View key={product.id} style={styles.alertRow}>
              <View style={styles.alertThumb} />
              <View style={styles.alertCopy}>
                <Text style={styles.alertName}>{product.title}</Text>
                <Text style={styles.alertMeta}>Stock: {product.stock} units left</Text>
              </View>
              <Pressable onPress={() => handleRestock(product.id)} style={({ pressed }) => [styles.smallAction, pressed && styles.pressed]}>
                <Text style={styles.smallActionLabel}>Restock</Text>
              </Pressable>
            </View>
          ))}

          <Pressable onPress={() => setActiveSection('inventory')} style={({ pressed }) => [styles.inlineLink, pressed && styles.pressed]}>
            <Text style={styles.inlineLinkText}>Go to Inventory</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.accent} />
          </Pressable>
        </View>

        <View style={styles.workspaceShell}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeSection === 'catalog'
                ? 'CATALOG WORKSPACE'
                : activeSection === 'sales'
                  ? 'SALES WORKSPACE'
                  : 'INVENTORY WORKSPACE'}
            </Text>
            <Text style={styles.workspaceCount}>
              {activeSection === 'catalog'
                ? `${products.length} items`
                : activeSection === 'sales'
                  ? `${orders.length} orders`
                  : `${lowStockProducts.length} alerts`}
            </Text>
          </View>

          {activeSection === 'catalog' &&
            products.map((product) => (
              <View key={product.id} style={styles.workspaceRow}>
                <View style={styles.workspaceCopy}>
                  <Text style={styles.workspaceTitle}>{product.title}</Text>
                  <Text style={styles.workspaceMeta}>
                    {product.category} · {product.id} · {formatMoney(product.price)}
                  </Text>
                </View>
                <View style={styles.workspaceActions}>
                  <Pressable onPress={() => handleAdjustPrice(product.id)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonLabel}>Edit price</Text>
                  </Pressable>
                  <Pressable onPress={() => handleRestock(product.id)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonLabel}>Restock</Text>
                  </Pressable>
                </View>
              </View>
            ))}

          {activeSection === 'sales' &&
            orders.map((order) => (
              <View key={order.id} style={styles.workspaceRow}>
                <View style={styles.workspaceCopy}>
                  <View style={styles.orderTitleRow}>
                    <Text style={styles.workspaceTitle}>{order.customer}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        order.status === 'Completed'
                          ? styles.statusCompleted
                          : order.status === 'Ready'
                            ? styles.statusReady
                            : styles.statusPending,
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          order.status === 'Completed'
                            ? styles.statusTextCompleted
                            : order.status === 'Ready'
                              ? styles.statusTextReady
                              : styles.statusTextPending,
                        ]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.workspaceMeta}>
                    {order.id} · {order.time} · {formatMoney(order.total)}
                  </Text>
                </View>
                <View style={styles.workspaceActions}>
                  <Pressable
                    onPress={() => handleAdvanceOrder(order.id)}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonLabel}>
                      {order.status === 'Completed' ? 'Completed' : 'Advance'}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Alert.alert('Receipt preview', `Receipt for ${order.id} is ready for backend wiring.`)}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonLabel}>Receipt</Text>
                  </Pressable>
                </View>
              </View>
            ))}

          {activeSection === 'inventory' &&
            lowStockProducts.map((product) => (
              <View key={product.id} style={styles.workspaceRow}>
                <View style={styles.workspaceCopy}>
                  <Text style={styles.workspaceTitle}>{product.title}</Text>
                  <Text style={styles.workspaceMeta}>
                    {product.id} · {product.category} · {product.stock} units remaining
                  </Text>
                </View>
                <View style={styles.workspaceActions}>
                  <Pressable onPress={() => handleRestock(product.id)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonLabel}>Add 10</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Alert.alert('Supplier request', `${product.title} is queued for supplier follow-up.`)}
                    style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonLabel}>Reorder</Text>
                  </Pressable>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <AdminBottomNav activeTab={activeSection} onSelect={handleBottomNav} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screen,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.82,
  },
  brandBlock: {
    alignItems: 'center',
  },
  brandTitle: {
    color: Colors.text,
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.xxl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  eyebrow: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    color: Colors.primary,
    fontFamily: Fonts.serif,
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
  },
  heroGreeting: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: '#eef4f2',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  refreshLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  metricsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metricValue: {
    color: Colors.primary,
    fontFamily: Fonts.serif,
    fontSize: 38,
    fontWeight: '800',
  },
  metricDivider: {
    backgroundColor: Colors.border,
    height: 54,
    width: 1,
  },
  metricStack: {
    gap: 2,
  },
  metricLabel: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  metricNumber: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '800',
  },
  updatedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.lg,
  },
  updatedText: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    minHeight: 164,
    padding: Spacing.xl,
    width: '48%',
  },
  actionCardActive: {
    borderColor: '#b8d7d2',
    borderWidth: 1.5,
  },
  actionCardWide: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    minHeight: 184,
    overflow: 'hidden',
    padding: Spacing.xxl,
    width: '100%',
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    width: 44,
  },
  actionTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  actionTitleDark: {
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  actionCopy: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  actionCopyDark: {
    color: '#d0dae5',
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 220,
  },
  backgroundIcon: {
    bottom: -10,
    position: 'absolute',
    right: -8,
  },
  alertShell: {
    backgroundColor: '#f1ede6',
    borderRadius: Radius.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.xxl,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  alertBadge: {
    alignItems: 'center',
    backgroundColor: '#ffd6d2',
    borderRadius: Radius.pill,
    height: 28,
    justifyContent: 'center',
    minWidth: 28,
    paddingHorizontal: 8,
  },
  alertBadgeText: {
    color: '#ab4036',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  alertRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  alertThumb: {
    backgroundColor: '#d7c6af',
    borderRadius: Radius.md,
    height: 48,
    marginRight: Spacing.md,
    width: 48,
  },
  alertCopy: {
    flex: 1,
    gap: 4,
  },
  alertName: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '800',
  },
  alertMeta: {
    color: '#c05f57',
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  smallAction: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  smallActionLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  inlineLink: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.sm,
  },
  inlineLinkText: {
    color: Colors.accent,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
  },
  workspaceShell: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.xxl,
  },
  workspaceCount: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  workspaceRow: {
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  workspaceCopy: {
    gap: 4,
  },
  workspaceTitle: {
    color: Colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
  },
  workspaceMeta: {
    color: Colors.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  workspaceActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  secondaryButton: {
    backgroundColor: '#eef4f2',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  secondaryButtonLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  orderTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  statusPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPending: {
    backgroundColor: '#fff1d7',
  },
  statusReady: {
    backgroundColor: '#d9f0e7',
  },
  statusCompleted: {
    backgroundColor: '#e7eef7',
  },
  statusText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  statusTextPending: {
    color: '#9c6b17',
  },
  statusTextReady: {
    color: '#2d7d62',
  },
  statusTextCompleted: {
    color: '#45617c',
  },
});
