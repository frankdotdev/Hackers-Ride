import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import { PrimaryButton } from "@/components/Buttons";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { useAppStore } from "@/store/useAppStore";

export default function Phone() {
  const t = useTheme();
  const login = useAppStore((s) => s.login);
  const [phone, setPhone] = useState("");
  const valid = /^\d{7,11}$/.test(phone);

  function handleContinue() {
    login(`+234 ${phone}`);
    router.push("/(auth)/otp");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
        <ArrowLeft size={22} color={t.text} />
      </Pressable>

      <Text style={[typography.h1, { color: t.text, marginTop: spacing.xl }]}>Mobile Number</Text>
      <Text style={[typography.body, { color: t.textSecondary, marginTop: spacing.sm }]}>
        Please enter your phone number. We will send you a verification code.
      </Text>

      <View style={[styles.inputRow, { borderColor: t.border, backgroundColor: t.surface }]}>
        <Text style={[typography.h3, { color: t.text, marginRight: spacing.sm }]}>+234</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="812 345 6789"
          placeholderTextColor={t.textMuted}
          keyboardType="number-pad"
          style={[styles.input, { color: t.text }]}
          maxLength={11}
        />
      </View>

      {phone.length > 0 && !valid && (
        <Text style={[typography.small, { color: t.danger, marginTop: spacing.sm }]}>Enter a valid phone number.</Text>
      )}

      <View style={{ flex: 1 }} />
      <PrimaryButton label="Continue" onPress={handleContinue} disabled={!valid} />
      <Text style={[typography.tiny, { color: t.textMuted, textAlign: "center", marginTop: spacing.lg }]}>
        By continuing you agree that you have read and accept the Terms & Conditions and Privacy Policy.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  back: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  inputRow: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, height: 56, marginTop: spacing.xl,
  },
  input: { flex: 1, fontSize: 16 },
});
