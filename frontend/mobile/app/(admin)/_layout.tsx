import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSubtle,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, IoniconName> = {
            dashboard: 'grid-outline',
            products: 'pricetags-outline',
            orders: 'receipt-outline',
            inventory: 'cube-outline',
            settings: 'settings-outline',
          };
          return <Ionicons name={map[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="dashboard"      options={{ title: 'Overview' }} />
      <Tabs.Screen name="products" options={{ title: 'Catalog' }} />
      <Tabs.Screen name="orders"   options={{ title: 'Orders' }} />
      <Tabs.Screen name="inventory"      options={{ title: 'Stock' }} />
      <Tabs.Screen name="settings"       options={{ title: 'Settings' }} />
      <Tabs.Screen name="products/edit"  options={{ href: null }} />
      <Tabs.Screen name="orders/[id]"    options={{ href: null }} />
    </Tabs>
  );
}
