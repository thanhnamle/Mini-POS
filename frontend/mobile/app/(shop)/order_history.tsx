import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { format, isSameMonth, parseISO } from 'date-fns';

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items_count: number;
  created_at: string;
};

export default function OrderHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
        .select('*')
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
    if (filter === 'month') {
      return isSameMonth(parseISO(order.created_at), new Date());
    }
    return true;
  });



  const renderOrderItem = ({ item }: { item: Order }) => {
    const isRefunded = item.status === 'Refunded';
    const date = new Date(item.created_at);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isRefunded ? "cart-outline" : "bag-handle"} 
              size={24} 
              color={isRefunded ? "#D1D1D1" : "#1A1814"} 
            />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
            <Text style={styles.orderDate}>
              {format(date, 'MMM dd, yyyy • HH:mm')}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, isRefunded && styles.refundedBadge]}>
                <Text style={[styles.statusText, isRefunded && styles.refundedText]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.itemCount}>{item.items_count} {item.items_count > 1 ? 'items' : 'item'}</Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.amount, isRefunded && styles.refundedAmount]}>
          ${item.total_amount.toFixed(2)}
        </Text>
      </View>
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

            <View style={styles.filterRow}>
              <Pressable 
                style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All Orders</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.filterBtn, filter === 'month' && styles.filterBtnActive]}
                onPress={() => setFilter('month')}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={filter === 'month' ? "#FFFFFF" : "#1A1814"} 
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.filterText, filter === 'month' && styles.filterTextActive]}>This Month</Text>
              </Pressable>
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
    color: '#1A1814',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#5A5550',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  filterBtnActive: {
    backgroundColor: '#1A1814',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1814',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1814',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#8C8C8C',
    fontWeight: '500',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#1A1814',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  refundedBadge: {
    backgroundColor: '#F0F0F0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  refundedText: {
    color: '#8C8C8C',
  },
  itemCount: {
    fontSize: 13,
    color: '#8C8C8C',
    fontWeight: '500',
  },
  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1814',
    textAlign: 'right',
  },
  refundedAmount: {
    color: '#D1D1D1',
    textDecorationLine: 'line-through',
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1814',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#8C8C8C',
    fontStyle: 'italic',
  },
});
