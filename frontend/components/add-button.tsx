import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";

type Props = {
  onPress: () => void;
};

export function AddButton({ onPress }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <ThemedText style={styles.text}>+</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 30,
  },
});
