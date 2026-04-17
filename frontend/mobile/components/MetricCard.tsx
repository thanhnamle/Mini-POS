import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface MetricCardProps {
  label: string;
  value: string;
  icon: IoniconName;
  accent?: boolean;
}

export default function MetricCard({ label, value, icon, accent }: MetricCardProps) {
  return (
    <View style={s.card}>
      <View style={[s.iconBubble, accent && { backgroundColor: COLORS.accent + '22' }]}>
        <Ionicons name={icon} size={18} color={accent ? COLORS.accent : COLORS.primary} />
      </View>
      <Text style={[TYPE.caption, { marginTop: SPACING.sm }]}>{label}</Text>
      <Text style={[TYPE.metric, { marginTop: 2 }]}>{value}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  card: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADII.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.soft },
  iconBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
});
