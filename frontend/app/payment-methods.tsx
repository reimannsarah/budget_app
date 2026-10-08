import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { paymentMethods } from "@/assets/test-data/data";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PaymentMethod } from "@/app/types/payment-method";

export default function PaymentMethodsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = isDark ? "#1a2e33" : "#e8f4f2";

  const renderItem = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.chartColors.three }]}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={[styles.type, { color: Colors.chartColors.two }]}>
          {item.type}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={paymentMethods as PaymentMethod[]}
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
  name: { fontSize: 16, fontWeight: "700" },
  type: { fontSize: 14, fontWeight: "600" },
});
