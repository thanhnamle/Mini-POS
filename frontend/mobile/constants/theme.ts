import type { Theme } from '@react-navigation/native';
import type { TextStyle, ViewStyle } from 'react-native';

export const COLORS = {
  background: '#f7f3ee',
  screen: '#f7f3ee',
  surface: '#fffdf9',
  surfaceMuted: '#f4efe8',
  primary: '#07294d',
  primaryPressed: '#0c3969',
  accent: '#4d8f88',
  text: '#16181d',
  textSecondary: '#686f7c',
  textMuted: '#686f7c',
  textSubtle: '#8f95a1',
  border: '#e8e1d8',
  inputBorder: '#e8e1d8',
  placeholder: '#b4b9c3',
  icon: '#6d7480',
  success: '#3f8a6b',
  warning: '#c98a3c',
  danger: '#b3503e',
  white: '#ffffff',
  overlay: 'rgba(7,41,77,0.45)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
  hero: 40,
} as const;

export const RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const FONTS = {
  serif: 'Georgia',
  sans: 'System',
  rounded: 'System',
  mono: 'monospace',
} as const;

export const TYPE: Record<string, TextStyle> = {
  brand: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  h1: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  h2: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  title: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.text,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  caption: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textSubtle,
  },
  metric: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },
};

export const SHADOW: Record<'card' | 'soft', ViewStyle> = {
  card: {
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  soft: {
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
};

export const Colors = {
  ...COLORS,
  light: {
    text: COLORS.text,
    background: COLORS.background,
    tint: COLORS.primary,
    icon: COLORS.icon,
    tabIconDefault: COLORS.textSubtle,
    tabIconSelected: COLORS.primary,
  },
  dark: {
    text: COLORS.white,
    background: COLORS.primary,
    tint: COLORS.accent,
    icon: '#9aa8ba',
    tabIconDefault: '#9aa8ba',
    tabIconSelected: COLORS.white,
  },
} as const;

export const Fonts = FONTS;
export const Spacing = SPACING;
export const Radius = RADII;

export const AppNavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.accent,
  },
  fonts: {
    regular: {
      fontFamily: FONTS.sans,
      fontWeight: '400',
    },
    medium: {
      fontFamily: FONTS.sans,
      fontWeight: '500',
    },
    bold: {
      fontFamily: FONTS.sans,
      fontWeight: '700',
    },
    heavy: {
      fontFamily: FONTS.sans,
      fontWeight: '800',
    },
  },
};
