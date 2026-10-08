import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDrawer } from '@/contexts/drawer-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const DRAWER_WIDTH = 280;

export function DrawerMenu() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isOpen]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-DRAWER_WIDTH, 0]) },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }));

  const handleSettings = () => {
    closeDrawer();
    router.push('/settings');
  };

  const bg = colorScheme === 'dark' ? '#1C1E20' : '#FFFFFF';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const separatorColor = colorScheme === 'dark' ? '#2C2E30' : '#E5E7EB';

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      <Animated.View style={[styles.drawer, drawerStyle, { backgroundColor: bg, paddingTop: insets.top + 16 }]}>
        <Text style={[styles.heading, { color: textColor }]}>Menu</Text>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        <Pressable style={styles.menuItem} onPress={handleSettings}>
          <IconSymbol name="gearshape.fill" size={22} color={iconColor} />
          <Text style={[styles.menuLabel, { color: textColor }]}>Settings</Text>
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 101,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
