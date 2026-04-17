import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { COLORS, RADII, SHADOW, SPACING, TYPE } from '../constants/theme';

interface SectionCardProps {
  title?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
export default function SectionCard({ title, action, children, style }: SectionCardProps) {
  return (
    <View style={[s.card, style]}>
      {(title || action) && (
        <View style={s.head}>
          {!!title && <Text style={TYPE.h2}>{title}</Text>}
          <View>{action}</View>
        </View>
      )}
      {children}
    </View>
  );
}
const s = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADII.xl, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg, ...SHADOW.card },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
});
