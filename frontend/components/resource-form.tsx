import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { FieldConfig } from "@/constants/resource-fields";

type Props = {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onDelete?: () => void;
  loading?: boolean;
};

export function ResourceForm({ fields, initialValues, onSubmit, onDelete, loading }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      const v = initialValues?.[f.key];
      init[f.key] = v != null ? String(v) : "";
    }
    return init;
  });

  const handleSubmit = () => {
    const parsed: Record<string, any> = {};
    for (const f of fields) {
      const raw = values[f.key];
      if (f.keyboard === "decimal-pad" || f.keyboard === "number-pad") {
        const num = Number(raw);
        parsed[f.key] = raw === "" ? null : isNaN(num) ? raw : num;
      } else {
        parsed[f.key] = raw;
      }
    }
    onSubmit(parsed);
  };

  const handleDelete = () => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  const inputBg = isDark ? "#1e2a2d" : "#f0f4f3";
  const inputBorder = isDark ? "#2a3a3d" : "#d0d8d6";
  const inputColor = isDark ? Colors.dark.text : Colors.light.text;
  const placeholderColor = isDark ? "#6a7a7d" : "#8a9a9d";

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      {fields.map((f) => (
        <View key={f.key} style={styles.fieldGroup}>
          <ThemedText style={styles.label}>{f.label}</ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor: inputBorder, color: inputColor },
            ]}
            value={values[f.key]}
            onChangeText={(text) => setValues((prev) => ({ ...prev, [f.key]: text }))}
            keyboardType={f.keyboard || "default"}
            placeholder={f.label}
            placeholderTextColor={placeholderColor}
          />
        </View>
      ))}

      <Pressable
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <ThemedText style={styles.saveText}>Save</ThemedText>
      </Pressable>

      {onDelete && (
        <Pressable
          style={[styles.deleteButton, loading && { opacity: 0.6 }]}
          onPress={handleDelete}
          disabled={loading}
        >
          <ThemedText style={styles.deleteText}>Delete</ThemedText>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 20 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, opacity: 0.7 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  deleteButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CC2132",
  },
  deleteText: { color: "#CC2132", fontSize: 16, fontWeight: "600" },
});
