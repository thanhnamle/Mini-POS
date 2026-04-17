import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, TYPE } from '../constants/theme';

interface StatusPillProps { status?: string; label?: string; }
interface PillStyle { bg: string; fg: string; label: string; }

const MAP: Record<string, PillStyle> = {
  pending:   { bg: '#fff3df', fg: COLORS.warning, label: 'Pending' },
  paid:      { bg: '#e3f1ea', fg: COLORS.success, label: 'Paid' },
  completed: { bg: '#e3f1ea', fg: COLORS.success, label: 'Completed' },
  cancelled: { bg: '#fbeae5', fg: COLORS.danger,  label: 'Cancelled' },
  low:       { bg: '#fbeae5', fg: COLORS.danger,  label: 'Low stock' },
  ok:        { bg: '#e8efe7', fg: COLORS.accent,  label: 'In stock' },
};

export default function StatusPill({ status, label }: StatusPillProps) {
  const k = String(status ?? '').toLowerCase();
  const v: PillStyle = MAP[k] ?? { bg: COLORS.surfaceMuted, fg: COLORS.textSecondary, label: label ?? status ?? '—' };
  return (
    <View style={[s.pill, { backgroundColor: v.bg }]}>
      <Text style={[TYPE.caption, { color: v.fg, fontWeight: '600' }]}>{label ?? v.label}</Text>
    </View>
  );
}
const s = StyleSheet.create({ pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADII.pill, alignSelf: 'flex-start' } });
