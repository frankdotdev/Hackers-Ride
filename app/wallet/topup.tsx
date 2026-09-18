import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";

const OPTIONS = [1000, 2500, 5000, 10000];

export default function Topup() {
  const t = useTheme();
  const addWalletFunds = useAppStore((s) => s.addWalletFunds);
  const [selected, setSelected] = useState<number | null>(2500);
  const [custom, setCustom] = useState("");

  const amount = custom ? parseInt(custom, 10) || 0 : selected ?? 0;

  function confirm() {
    if (amount <= 0) return;
    addWalletFunds(amount);
    router.back();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: t.text }]}>Add Money</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}><X size={22} color={t.text} /></Pressable>
      </View>

      <View style={styles.grid}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o}
            onPress={() => { setSelected(o); setCustom(""); }}
            style={[styles.option, { borderColor: selected === o && !custom ? t.accent : t.border, backgroundColor: selected === o && !custom ? t.accentSoft : t.card }]}
          >
            <Text style={[typography.h3, { color: t.text }]}>₦{o.toLocaleString()}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.lg }]}>Or enter a custom amount</Text>
      <TextInput
        value={custom}
        onChangeText={(v) => { setCustom(v.replace(/[^0-9]/g, "")); }}
        placeholder="Custom amount"
        placeholderTextColor={t.textMuted}
        keyboardType="number-pad"
        style={[styles.customInput, { borderColor: t.border, color: t.text, backgroundColor: t.surface }]}
      />

      <View style={[styles.notice, { backgroundColor: t.accentSoft }]}>
        <Text style={[typography.small, { color: t.accent }]}>Demo wallet — no real money is transferred.</Text>
      </View>

      <View style={{ flex: 1 }} />
      <PrimaryButton label={`Add ₦${amount.toLocaleString()}`} onPress={confirm} disabled={amount <= 0} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg },
  option: { width: "47%", borderWidth: 1.5, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" },
  customInput: { borderWidth: 1, borderRadius: radius.md, height: 50, paddingHorizontal: spacing.md, marginTop: spacing.sm },
  notice: { padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
});
