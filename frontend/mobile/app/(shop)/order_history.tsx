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
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function OrderHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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

  // Áp dụng bộ lọc thực tế vào danh sách
  const filteredOrders = orders.filter(order => {
    const orderDate = parseISO(order.created_at);
    const now = new Date();
    
    if (filter === 'week') return isSameWeek(orderDate, now);
    if (filter === 'month') return isSameMonth(orderDate, now);
    if (filter === 'year') return isSameYear(orderDate, now);
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
    const isRefunded = item.status === 'Paid'; // Adjusting based on your Paid status
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
              <View style={[styles.statusBadge, item.status === 'Refunded' && styles.refundedBadge]}>
                <Text style={[styles.statusText, item.status === 'Refunded' && styles.refundedText]}>
                  {item.status.toUpperCase()}
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
        <Pressable onPress={() => router.push('/(shop)/settings')} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1814" />
        </Pressable>
        <Text style={styles.headerTitle}>Orders</Text>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="settings-outline" size={24} color="#1A1814" />
        </Pressable>
      </View>

      <FlatList
        data={filteredOrders}

        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.titleSection}>
              <Text style={styles.pageTitle}>Past Orders</Text>
              <Text style={styles.pageSubtitle}>Review your transaction history.</Text>
            </View>

            <View style={styles.filterContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.filterScroll}
              >
                <FilterChip 
                  label="All" 
                  icon="layers-outline" 
                  active={filter === 'all'} 
                  onPress={() => setFilter('all')} 
                />
                <FilterChip 
                  label="This Week" 
                  icon="time-outline" 
                  active={filter === 'week'} 
                  onPress={() => setFilter('week')} 
                />
                <FilterChip 
                  label="This Month" 
                  icon="calendar-outline" 
                  active={filter === 'month'} 
                  onPress={() => setFilter('month')} 
                />
                <FilterChip 
                  label="This Year" 
                  icon="analytics-outline" 
                  active={filter === 'year'} 
                  onPress={() => setFilter('year')} 
                />
              </ScrollView>
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          loading ? (
            <ActivityIndicator color="#1A1814" style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.emptyText}>No orders found.</Text>
          )
        )}
        ListFooterComponent={() => (
          orders.length > 0 && (
            <Pressable style={styles.loadMoreBtn}>
              <Text style={styles.loadMoreText}>Load Older Orders</Text>
              <Ionicons name="chevron-down" size={16} color="#1A1814" style={{ marginLeft: 6 }} />
            </Pressable>
          )
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1814',
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
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  filterChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
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
    borderColor: '#1A1814',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
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
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  refundedBadge: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E7E34',
    letterSpacing: 0.5,
  },
  refundedText: {
    color: '#8C8478',
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
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingVertical: 12,
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
});


