import { Platform } from 'react-native';
import type { Theme } from '@react-navigation/native';

export const Colors = {
  background: '#0f1115',
  screen: '#f7f3ee',
  surface: '#fffdf9',
  surfaceMuted: '#f4efe8',
  primary: '#07294d',
  primaryPressed: '#0c3969',
  accent: '#4d8f88',
  text: '#16181d',
  textMuted: '#686f7c',
  textSubtle: '#8f95a1',
  border: '#e8e1d8',
  inputBorder: '#e5ddd4',
  placeholder: '#b4b9c3',
  icon: '#6d7480',
  white: '#ffffff',
  danger: '#b55252',
  success: '#2f7d62',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const AppNavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.screen,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.accent,
  },
  fonts: {
    regular: {
      fontFamily: Fonts.sans,
      fontWeight: '400',
    },
    medium: {
      fontFamily: Fonts.sans,
      fontWeight: '500',
    },
    bold: {
      fontFamily: Fonts.sans,
      fontWeight: '700',
    },
    heavy: {
      fontFamily: Fonts.sans,
      fontWeight: '800',
    },
  },
};
