import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function LoginScreen() {
  const { sendCode, verifyCode } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? "#1e2a2d" : "#f0f4f3",
      color: isDark ? Colors.dark.text : Colors.light.text,
      borderColor: isDark ? "#2a3a3d" : "#d0d8d6",
    },
  ];

  const handleSendCode = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendCode(email.trim());
      setCodeSent(true);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await verifyCode(email.trim(), code.trim());
    } catch (e: any) {
      Alert.alert("Error", e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedText type="title" style={styles.title}>
          Budget App
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {codeSent ? "Enter the code sent to your email" : "Sign in with your email"}
        </ThemedText>

        {!codeSent ? (
          <>
            <TextInput
              style={inputStyle}
              placeholder="Email address"
              placeholderTextColor={isDark ? "#6a7a7d" : "#8a9a9d"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Send Code</ThemedText>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              style={inputStyle}
              placeholder="6-digit code"
              placeholderTextColor={isDark ? "#6a7a7d" : "#8a9a9d"}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Verify</ThemedText>
              )}
            </Pressable>
            <Pressable onPress={() => setCodeSent(false)}>
              <ThemedText style={styles.backLink}>Use a different email</ThemedText>
            </Pressable>
          </>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: { textAlign: "center", marginBottom: 8 },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 32,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backLink: {
    textAlign: "center",
    marginTop: 16,
    color: "#0a7ea4",
    fontSize: 14,
  },
});
