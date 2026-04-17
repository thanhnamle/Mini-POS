import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLORS, RADII, SPACING, TYPE } from '../constants/theme';

type Variant = 'primary' | 'ghost' | 'danger';

interface ActionButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function ActionButton({ title, onPress, variant = 'primary', loading, icon, disabled, style }: ActionButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost   = variant === 'ghost';
  const isDanger  = variant === 'danger';
  const bg     = isPrimary ? COLORS.primary : isDanger ? COLORS.danger : 'transparent';
  const fg     = isGhost ? COLORS.primary : COLORS.white;
  const border = isGhost ? COLORS.border : 'transparent';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[s.btn, { backgroundColor: bg, borderColor: border, borderWidth: isGhost ? 1 : 0, opacity: (disabled || loading) ? 0.6 : 1 }, style]}
    >
      {loading ? <ActivityIndicator color={fg} /> : (
        <View style={s.row}>
          {icon}
          <Text style={[TYPE.title, { color: fg, marginLeft: icon ? SPACING.sm : 0 }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  btn: { paddingVertical: 14, paddingHorizontal: SPACING.lg, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
