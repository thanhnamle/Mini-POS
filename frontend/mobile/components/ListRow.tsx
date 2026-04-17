import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SPACING, TYPE } from '../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ListRowProps {
  icon?: IoniconName;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}

export default function ListRow({ icon, title, subtitle, right, onPress, danger, last }: ListRowProps) {
  const Comp: React.ElementType = onPress ? TouchableOpacity : View;
  return (
    <Comp activeOpacity={0.7} onPress={onPress} style={[s.row, !last && s.divider]}>
      {icon && (
        <View style={[s.icon, danger && { backgroundColor: '#fbeae5' }]}>
          <Ionicons name={icon} size={18} color={danger ? COLORS.danger : COLORS.primary} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[TYPE.title, danger && { color: COLORS.danger }]}>{title}</Text>
        {!!subtitle && <Text style={[TYPE.caption, { marginTop: 2 }]}>{subtitle}</Text>}
      </View>
      <View style={s.right}>
        {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={COLORS.textSubtle} /> : null)}
      </View>
    </Comp>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
  divider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  icon: { width: 36, height: 36, borderRadius: RADII.md, backgroundColor: COLORS.surfaceMuted, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  right: { marginLeft: SPACING.sm },
});
