import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type SummaryCardProps = {
  title: string;
  count: number;
  total?: string;
  onPress: () => void;
};

export function SummaryCard({ title, count, total, onPress }: SummaryCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isDark ? "#1a2e33" : "#e8f4f2",
          borderColor: Colors.chartColors.yellow,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.row}>
        <ThemedText style={styles.count}>{count} items</ThemedText>
        {total && (
          <ThemedText style={[styles.total, { color: Colors.chartColors.orange }]}>
            {total}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    width: "48%",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    gap: 4,
  },
  count: {
    fontSize: 13,
    opacity: 0.7,
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
  },
});
