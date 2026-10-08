import { ThemeProvider as ExpoThemeProvider, DarkTheme, DefaultTheme, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider } from '@/contexts/theme-context';
import { DrawerProvider } from '@/contexts/drawer-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { DrawerMenu } from '@/components/drawer-menu';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DrawerProvider>
      <ExpoThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {!isAuthenticated ? (
            <Stack.Screen name="login" options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="budget-items" options={{ title: 'Budget Items' }} />
              <Stack.Screen name="credit-cards" options={{ title: 'Credit Cards' }} />
              <Stack.Screen name="incomes" options={{ title: 'Incomes' }} />
              <Stack.Screen name="loans" options={{ title: 'Loans' }} />
              <Stack.Screen name="payment-methods" options={{ title: 'Payment Methods' }} />
              <Stack.Screen name="subscriptions" options={{ title: 'Subscriptions' }} />
              <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            </>
          )}
        </Stack>
        {isAuthenticated && <DrawerMenu />}
        <StatusBar style="auto" />
      </ExpoThemeProvider>
    </DrawerProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
