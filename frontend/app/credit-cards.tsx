import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomSheetModal } from "@/components/bottom-sheet-modal";
import { ResourceForm } from "@/components/resource-form";
import { AddButton } from "@/components/add-button";
import { Colors } from "@/constants/theme";
import { creditCardFields } from "@/constants/resource-fields";
import { creditCardService } from "@/services";
import { useResourceList } from "@/hooks/use-resource-list";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { CreditCard } from "@/types/credit-card";

export default function CreditCardsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = isDark ? "#1a2e33" : "#e8f4f2";

  const { data, isLoading, error, createItem, updateItem, deleteItem } =
    useResourceList(creditCardService);

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<CreditCard | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (item: CreditCard) => {
    setSelected(item);
    setModalVisible(true);
  };

  const openCreate = () => {
    setSelected(null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSaving(true);
    try {
      if (selected) {
        await updateItem(selected.id, values);
      } else {
        await createItem(values as Partial<CreditCard>);
      }
      setModalVisible(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await deleteItem(selected.id);
      setModalVisible(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: CreditCard }) => (
    <Pressable onPress={() => openEdit(item)}>
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.chartColors.teal }]}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>
          <ThemedText style={[styles.limit, { color: Colors.chartColors.orange }]}>
            ${item.credit_limit.toLocaleString()}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detail}>Due: {item.due_date}</ThemedText>
          <ThemedText style={styles.detail}>
            Annual fee: ${item.annual_fee.toFixed(2)}
          </ThemedText>
        </View>
        <ThemedText style={styles.detail}>
          Min payment: ${item.minimum_monthly_payment.toFixed(2)}
        </ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <AddButton onPress={openCreate} />
      <BottomSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selected ? "Edit Credit Card" : "New Credit Card"}
      >
        <ResourceForm
          fields={creditCardFields}
          initialValues={selected ?? undefined}
          onSubmit={handleSubmit}
          onDelete={selected ? handleDelete : undefined}
          loading={saving}
        />
      </BottomSheetModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 12, paddingBottom: 100 },
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  name: { fontSize: 16, fontWeight: "700" },
  limit: { fontSize: 18, fontWeight: "700" },
  detail: { fontSize: 13, opacity: 0.6 },
});
