import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPE } from '../constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}

export default function Header({ title, subtitle, back, right }: HeaderProps) {
  const router = useRouter();
  return (
    <View style={s.wrap}>
      <View style={s.row}>
        {back ? (
          <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={s.iconBtn}>
            <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        ) : <View style={s.iconBtn} />}
        <View style={s.center}>
          <Text style={TYPE.brand} numberOfLines={1}>{title}</Text>
          {!!subtitle && <Text style={[TYPE.caption, { marginTop: 2 }]}>{subtitle}</Text>}
        </View>
        <View style={s.iconBtn}>{right}</View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md, backgroundColor: COLORS.background },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'flex-start' },
});
