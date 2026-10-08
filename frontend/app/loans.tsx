import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomSheetModal } from "@/components/bottom-sheet-modal";
import { ResourceForm } from "@/components/resource-form";
import { AddButton } from "@/components/add-button";
import { Colors } from "@/constants/theme";
import { loanFields } from "@/constants/resource-fields";
import { loanService } from "@/services";
import { useResourceList } from "@/hooks/use-resource-list";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Loan } from "@/types/loan";

export default function LoansScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = isDark ? "#1a2e33" : "#e8f4f2";

  const { data, isLoading, error, createItem, updateItem, deleteItem } =
    useResourceList(loanService);

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (item: Loan) => {
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
        await createItem(values as Partial<Loan>);
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

  const renderItem = ({ item }: { item: Loan }) => (
    <Pressable onPress={() => openEdit(item)}>
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.chartColors.teal }]}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>
          <ThemedText style={[styles.amount, { color: Colors.chartColors.orange }]}>
            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detail}>Due: {item.due_date}</ThemedText>
          <ThemedText style={styles.detail}>
            Min payment: ${item.minimum_monthly_payment.toFixed(2)}
          </ThemedText>
        </View>
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
        title={selected ? "Edit Loan" : "New Loan"}
      >
        <ResourceForm
          fields={loanFields}
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
  },
  name: { fontSize: 16, fontWeight: "700" },
  amount: { fontSize: 18, fontWeight: "700" },
  detail: { fontSize: 13, opacity: 0.6 },
});
