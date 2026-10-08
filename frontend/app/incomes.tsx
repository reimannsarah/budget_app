import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { incomes } from "@/assets/test-data/data";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Income } from "@/app/types/income";

export default function IncomesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = isDark ? "#1a2e33" : "#e8f4f2";

  const renderItem = ({ item }: { item: Income }) => (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.chartColors.three }]}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.source}>{item.source}</ThemedText>
        <ThemedText style={[styles.amount, { color: Colors.chartColors.two }]}>
          ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={incomes as Income[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 12 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  source: { fontSize: 16, fontWeight: "700" },
  amount: { fontSize: 18, fontWeight: "700" },
});
