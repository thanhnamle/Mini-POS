import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { format, isSameMonth, isSameWeek, isSameYear, parseISO } from 'date-fns';

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
  };
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items_count: number;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'shipping', 'delivered'
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Tự động làm mới dữ liệu mỗi khi người dùng vào trang này
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            products (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Fetch orders error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    
    const status = order.status?.toLowerCase();
    if (statusFilter === 'pending') return status === 'pending' || status === 'confirmed';
    if (statusFilter === 'shipping') return status === 'shipping';
    if (statusFilter === 'delivered') return status === 'delivered';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const FilterChip = ({ label, icon, active, onPress }: { label: string, icon: any, active: boolean, onPress: () => void }) => (
    <Pressable 
      onPress={onPress}
      style={[styles.filterChip, active && styles.filterChipActive]}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={active ? "#FFFFFF" : "#8C8478"} 
        style={{ marginRight: 6 }} 
      />
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item.id;
    const date = new Date(item.created_at);
    
    return (
      <Pressable 
        style={[styles.orderCard, isExpanded && styles.orderCardExpanded]} 
        onPress={() => toggleExpand(item.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={item.status === 'Refunded' ? "refresh-circle" : "bag-handle"} 
              size={24} 
              color={item.status === 'Refunded' ? "#D1D1D1" : "#1A1814"} 
            />
          </View>
          <View style={styles.orderInfo}>
            <View style={styles.orderNumberRow}>
              <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
              <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#8C8C8C" />
            </View>
            <Text style={styles.orderDate}>
              {format(date, 'MMM dd, yyyy • HH:mm')}
            </Text>
            <View style={styles.statusRow}>
              <View style={[
                styles.statusBadge, 
                item.status === 'Delivered' && styles.deliveredBadge,
                item.status === 'Shipping' && styles.shippingBadge,
                item.status === 'Pending' && styles.pendingBadge,
                item.status === 'Confirmed' && styles.confirmedBadge,
                item.status === 'Refunded' && styles.refundedBadge,
              ]}>
                <Text style={[
                  styles.statusText, 
                  item.status === 'Delivered' && styles.deliveredText,
                  item.status === 'Shipping' && styles.shippingText,
                  item.status === 'Pending' && styles.pendingText,
                  item.status === 'Confirmed' && styles.confirmedText,
                  item.status === 'Refunded' && styles.refundedText,
                ]}>
                  {item.status === 'Pending' ? 'WAITING' : item.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.itemCount}>{item.items_count} {item.items_count > 1 ? 'items' : 'item'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, item.status === 'Refunded' && styles.refundedAmount]}>
            ${item.total_amount.toFixed(2)}
          </Text>
        </View>

        {isExpanded && (
          <View style={styles.detailsSection}>
            <View style={styles.detailsDivider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>{item.payment_method || 'Credit Card'}</Text>
            </View>

            <View style={styles.itemsBreakdown}>
              <Text style={styles.itemsTitle}>Items Purchased</Text>
              {item.order_items?.map((subItem) => (
                <View key={subItem.id} style={styles.subItemRow}>
                  <Text style={styles.subItemName} numberOfLines={1}>
                    {subItem.products?.name} x{subItem.quantity}
                  </Text>
                  <Text style={styles.subItemPrice}>
                    ${(subItem.unit_price * subItem.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Pressable style={styles.headerBtn} onPress={() => router.push('/(shop)/settings')}>
          <Ionicons name="person-outline" size={24} color="#1A1814" />
        </Pressable>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.titleSection}>
              <Text style={styles.pageTitle}>Your Orders</Text>
              <Text style={styles.pageSubtitle}>Manage and track your purchases.</Text>
            </View>

            <View style={styles.filterContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.filterScroll}
              >
                <FilterChip 
                  label="All" 
                  icon="grid-outline" 
                  active={statusFilter === 'all'} 
                  onPress={() => setStatusFilter('all')} 
                />
                <FilterChip 
                  label="Processing" 
                  icon="time-outline" 
                  active={statusFilter === 'pending'} 
                  onPress={() => setStatusFilter('pending')} 
                />
                <FilterChip 
                  label="Shipping" 
                  icon="bicycle-outline" 
                  active={statusFilter === 'shipping'} 
                  onPress={() => setStatusFilter('shipping')} 
                />
                <FilterChip 
                  label="Delivered" 
                  icon="checkmark-done-circle-outline" 
                  active={statusFilter === 'delivered'} 
                  onPress={() => setStatusFilter('delivered')} 
                />
              </ScrollView>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          loading ? (
            <ActivityIndicator color="#111111" style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.emptyText}>No orders found.</Text>
          )
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 8,
    letterSpacing: -1,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#8C8478',
    fontWeight: '500',
  },
  filterContainer: {
    marginHorizontal: -24,
    marginBottom: 32,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
  },
  filterChipActive: {
    backgroundColor: '#111111',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C8478',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  orderCardExpanded: {
    borderColor: '#111111',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  orderDate: {
    fontSize: 12,
    color: '#8C8478',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F3F3',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  confirmedBadge: {
    backgroundColor: '#E3F2FD',
  },
  shippingBadge: {
    backgroundColor: '#E1F5FE',
  },
  deliveredBadge: {
    backgroundColor: '#E8F5E9',
  },
  refundedBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#757575',
    letterSpacing: 0.5,
  },
  pendingText: {
    color: '#F57C00',
  },
  confirmedText: {
    color: '#1976D2',
  },
  shippingText: {
    color: '#0288D1',
  },
  deliveredText: {
    color: '#2E7D32',
  },
  refundedText: {
    color: '#C62828',
  },
  itemCount: {
    fontSize: 12,
    color: '#8C8478',
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
  },
  refundedAmount: {
    color: '#D1D1D1',
    textDecorationLine: 'line-through',
  },
  detailsSection: {
    marginTop: 20,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8C8478',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  itemsBreakdown: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
  },
  itemsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  subItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
    flex: 1,
    marginRight: 10,
  },
  subItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
    color: '#8C8478',
    fontWeight: '500',
  },
});
