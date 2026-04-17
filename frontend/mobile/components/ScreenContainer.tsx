import React from 'react';
import { RefreshControl, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';

interface ScreenContainerProps {
  children?: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({ children, scroll = true, refreshing, onRefresh, contentStyle }: ScreenContainerProps) {
  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[s.content, contentStyle]}
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} /> : undefined}
          showsVerticalScrollIndicator={false}
        >{children}</ScrollView>
      ) : (
        <View style={[s.content, contentStyle, { flex: 1 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxxl },
});
