import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider } from '../ctx/AuthContext';
import { CartProvider } from '../ctx/CartContext';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F6F4F1',
    card: '#FFFFFF',
    text: '#111111',
    border: '#E7E2DB',
    primary: '#111111',
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider value={appTheme}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(shop)" options={{ animation: 'fade' }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
