import { ThemeProvider as ExpoThemeProvider, DarkTheme, DefaultTheme, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider } from '@/contexts/theme-context';
import { DrawerProvider } from '@/contexts/drawer-context';
import { DrawerMenu } from '@/components/drawer-menu';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();

  return (
    <DrawerProvider>
      <ExpoThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="budget-items" options={{ title: 'Budget Items' }} />
          <Stack.Screen name="credit-cards" options={{ title: 'Credit Cards' }} />
          <Stack.Screen name="incomes" options={{ title: 'Incomes' }} />
          <Stack.Screen name="loans" options={{ title: 'Loans' }} />
          <Stack.Screen name="payment-methods" options={{ title: 'Payment Methods' }} />
          <Stack.Screen name="subscriptions" options={{ title: 'Subscriptions' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
        <DrawerMenu />
        <StatusBar style="auto" />
      </ExpoThemeProvider>
    </DrawerProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
