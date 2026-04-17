import type { ReactNode } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export type AdminTabKey = 'catalog' | 'sales' | 'inventory' | 'settings';

type AdminBottomNavProps = {
  activeTab: AdminTabKey;
  onSelect: (tab: AdminTabKey) => void;
};

const NAV_ITEMS: {
  key: AdminTabKey;
  label: string;
  renderIcon: (color: string) => ReactNode;
}[] = [
  {
    key: 'catalog',
    label: 'CATALOG',
    renderIcon: (color) => <Ionicons name="grid-outline" size={20} color={color} />,
  },
  {
    key: 'sales',
    label: 'SALES',
    renderIcon: (color) => <MaterialCommunityIcons name="cash-register" size={20} color={color} />,
  },
  {
    key: 'inventory',
    label: 'INVENTORY',
    renderIcon: (color) => <Ionicons name="cube-outline" size={20} color={color} />,
  },
  {
    key: 'settings',
    label: 'SETTINGS',
    renderIcon: (color) => <Ionicons name="settings-outline" size={20} color={color} />,
  },
];

export function AdminBottomNav({ activeTab, onSelect }: AdminBottomNavProps) {
  return (
    <View style={styles.shell}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeTab;
        const iconColor = isActive ? Colors.white : Colors.textSubtle;

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={({ pressed }) => [
              styles.item,
              isActive && styles.itemActive,
              pressed && styles.itemPressed,
            ]}>
            {item.renderIcon(iconColor)}
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 86,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  item: {
    alignItems: 'center',
    borderRadius: Radius.lg,
    gap: 6,
    minWidth: 74,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  itemActive: {
    backgroundColor: Colors.primary,
  },
  itemPressed: {
    opacity: 0.82,
  },
  label: {
    color: Colors.textSubtle,
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  labelActive: {
    color: Colors.white,
  },
});
