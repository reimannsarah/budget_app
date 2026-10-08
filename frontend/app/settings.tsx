import { StyleSheet, Text, View, Pressable } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemePreference, ThemePreference } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { useConfirmLogout } from '@/hooks/use-confirm-logout';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const OPTIONS: { value: ThemePreference; label: string; icon: 'sun.max.fill' | 'moon.fill' | 'gearshape.fill' }[] = [
  { value: 'system', label: 'System', icon: 'gearshape.fill' },
  { value: 'light', label: 'Light', icon: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', icon: 'moon.fill' },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { themePreference, setThemePreference } = useThemePreference();
  const colors = Colors[colorScheme];
  const { email } = useAuth();
  const handleLogout = useConfirmLogout();
  const cardBg = colorScheme === 'dark' ? '#2a2d2e' : '#f0f0f0';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
      <View style={styles.optionsRow}>
        {OPTIONS.map((option) => {
          const isActive = themePreference === option.value;
          return (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isActive ? colors.tint : colorScheme === 'dark' ? '#2a2d2e' : '#f0f0f0',
                  borderColor: isActive ? colors.tint : 'transparent',
                },
              ]}
              onPress={() => setThemePreference(option.value)}
            >
              <IconSymbol
                name={option.icon}
                size={24}
                color={isActive ? (colorScheme === 'dark' ? '#151718' : '#fff') : colors.icon}
              />
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: isActive ? (colorScheme === 'dark' ? '#151718' : '#fff') : colors.text,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, styles.sectionSpacing, { color: colors.text }]}>Account</Text>
      <View style={[styles.accountCard, { backgroundColor: cardBg }]}>
        <Text style={[styles.accountLabel, { color: colors.icon }]}>Signed in as</Text>
        <Text style={[styles.accountEmail, { color: colors.text }]} numberOfLines={1}>
          {email ?? 'Unknown account'}
        </Text>
      </View>
      <Pressable
        style={[styles.logoutButton, { borderColor: Colors.chartColors.red }]}
        onPress={handleLogout}
      >
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={Colors.chartColors.red} />
        <Text style={[styles.logoutLabel, { color: Colors.chartColors.red }]}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
  },
  sectionSpacing: {
    marginTop: 32,
  },
  accountCard: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  accountLabel: {
    fontSize: 12,
  },
  accountEmail: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
