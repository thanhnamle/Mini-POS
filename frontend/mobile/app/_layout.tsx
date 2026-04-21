import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

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
    <ThemeProvider value={appTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#F6F4F1' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(auth)"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="(cashier)"
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="(admin)"
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'transparentModal',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
