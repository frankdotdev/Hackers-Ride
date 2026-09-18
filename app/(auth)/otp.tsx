import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { PrimaryButton } from "@/components/Buttons";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { useAppStore } from "@/store/useAppStore";

export default function Otp() {
  const t = useTheme();
  const verifyOtp = useAppStore((s) => s.verifyOtp);
  const pendingPhone = useAppStore((s) => s.pendingPhone);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function handleVerify() {
    if (verifyOtp(code)) {
      router.replace("/(auth)/success");
    } else {
      setError(true);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={12}>
        <ArrowLeft size={22} color={t.text} />
      </Pressable>

      <Text style={[typography.h1, { color: t.text, marginTop: spacing.xl }]}>OTP Verification</Text>
      <Text style={[typography.body, { color: t.textSecondary, marginTop: spacing.sm }]}>
        Enter the 6-digit code sent to {pendingPhone || "your number"}.
      </Text>

      <TextInput
        value={code}
        onChangeText={(v) => { setCode(v); setError(false); }}
        placeholder="••••••"
        placeholderTextColor={t.textMuted}
        keyboardType="number-pad"
        maxLength={6}
        style={[styles.otpInput, { borderColor: error ? t.danger : t.border, color: t.text, backgroundColor: t.surface }]}
      />

      {error && <Text style={[typography.small, { color: t.danger, marginTop: spacing.sm }]}>Incorrect code. Try again.</Text>}

      <View style={[styles.hint, { backgroundColor: t.accentSoft }]}>
        <Text style={[typography.small, { color: t.accent }]}>Demo OTP: 123456</Text>
      </View>

      <View style={{ flex: 1 }} />
      <PrimaryButton label="Verify & Continue" onPress={handleVerify} disabled={code.length < 6} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  back: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  otpInput: {
    borderWidth: 1, borderRadius: radius.md, height: 56, marginTop: spacing.xl,
    paddingHorizontal: spacing.lg, fontSize: 22, letterSpacing: 8, textAlign: "center",
  },
  hint: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.md, alignSelf: "flex-start" },
});
