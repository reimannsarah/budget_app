import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="budget-items" options={{ title: 'Budget Items' }} />
        <Stack.Screen name="credit-cards" options={{ title: 'Credit Cards' }} />
        <Stack.Screen name="incomes" options={{ title: 'Incomes' }} />
        <Stack.Screen name="loans" options={{ title: 'Loans' }} />
        <Stack.Screen name="payment-methods" options={{ title: 'Payment Methods' }} />
        <Stack.Screen name="subscriptions" options={{ title: 'Subscriptions' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
