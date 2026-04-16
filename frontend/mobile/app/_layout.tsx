import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppNavigationTheme } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={AppNavigationTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)/dashboard" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Merchant Access' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
