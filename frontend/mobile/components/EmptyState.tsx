import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPE } from '../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?: IoniconName;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = 'sparkles-outline', title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={s.wrap}>
      <View style={s.bubble}><Ionicons name={icon} size={24} color={COLORS.accent} /></View>
      <Text style={[TYPE.h2, { textAlign: 'center', marginTop: SPACING.md }]}>{title}</Text>
      {!!subtitle && <Text style={[TYPE.caption, { textAlign: 'center', marginTop: 6 }]}>{subtitle}</Text>}
      {action ? <View style={{ marginTop: SPACING.lg, alignSelf: 'stretch' }}>{action}</View> : null}
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  bubble: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
});
