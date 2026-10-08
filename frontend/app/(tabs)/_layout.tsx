import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDrawer } from '@/contexts/drawer-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { openDrawer } = useDrawer();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerLeft: () => (
          <Pressable onPress={openDrawer} hitSlop={8} style={{ marginLeft: 16 }}>
            <IconSymbol name="line.3.horizontal" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Charts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.pie.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
