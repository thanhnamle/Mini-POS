import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useCart } from '../../store/CartContext';
import { COLORS } from '../../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function CartIcon({ color, size }: { color: string; size: number }) {
  const { totals } = useCart();
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {totals.count > 0 && (
        <View style={s.badge}><Text style={s.badgeText}>{totals.count}</Text></View>
      )}
    </View>
  );
}

export default function CashierLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSubtle,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'cart') return <CartIcon color={color} size={size} />;
          const map: Record<string, IoniconName> = { index: 'storefront-outline', recent: 'time-outline' };
          return <Ionicons name={map[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index"  options={{ title: 'Shop' }} />
      <Tabs.Screen name="cart"   options={{ title: 'Cart' }} />
      <Tabs.Screen name="recent" options={{ title: 'Recent' }} />
    </Tabs>
  );
}
const s = StyleSheet.create({
  badge: { position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
});
