import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { subscriptions } from "@/assets/test-data/data";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Subscription } from "@/app/types/subscription";

export default function SubscriptionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = isDark ? "#1a2e33" : "#e8f4f2";

  const renderItem = ({ item }: { item: Subscription }) => (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.chartColors.three }]}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={[styles.amount, { color: Colors.chartColors.two }]}>
          ${item.amount.toFixed(2)}
        </ThemedText>
      </View>
      <ThemedText style={styles.detail}>Due: {item.due_date}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={subscriptions as Subscription[]}
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
    marginBottom: 4,
  },
  name: { fontSize: 16, fontWeight: "700" },
  amount: { fontSize: 18, fontWeight: "700" },
  detail: { fontSize: 13, opacity: 0.6 },
});
