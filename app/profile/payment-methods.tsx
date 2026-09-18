import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CreditCard, Banknote, Wallet as WalletIcon, Star, Trash2 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";

function iconFor(type: string) {
  if (type === "cash") return Banknote;
  if (type === "wallet") return WalletIcon;
  return CreditCard;
}

export default function PaymentMethods() {
  const t = useTheme();
  const paymentMethods = useAppStore((s) => s.paymentMethods);
  const addPaymentMethod = useAppStore((s) => s.addPaymentMethod);
  const removePaymentMethod = useAppStore((s) => s.removePaymentMethod);
  const setDefaultPaymentMethod = useAppStore((s) => s.setDefaultPaymentMethod);
  const [adding, setAdding] = useState(false);
  const [last4, setLast4] = useState("");

  function save() {
    const digits = last4.replace(/[^0-9]/g, "");
    if (digits.length !== 4) return;
    addPaymentMethod(digits);
    setLast4("");
    setAdding(false);
  }

  function confirmRemove(id: string, label: string) {
    Alert.alert(`Remove ${label}?`, "You can add it again later.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removePaymentMethod(id) },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <Text style={[typography.h1, { color: t.text, paddingHorizontal: spacing.lg }]}>Payment Methods</Text>

      <FlatList
        data={paymentMethods}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => {
          const Icon = iconFor(item.type);
          const removable = item.type === "card";
          return (
            <View style={[styles.row, { borderColor: t.border, backgroundColor: t.card }]}>
              <Icon size={20} color={t.text} />
              <Text style={[typography.body, { color: t.text, flex: 1, marginLeft: spacing.md }]}>{item.label}</Text>
              {item.isDefault ? (
                <View style={[styles.defaultBadge, { backgroundColor: t.accentSoft }]}>
                  <Text style={[typography.tiny, { color: t.accent }]}>Default</Text>
                </View>
              ) : (
                <Pressable onPress={() => setDefaultPaymentMethod(item.id)} hitSlop={8} style={{ marginRight: spacing.md }}>
                  <Star size={16} color={t.textMuted} />
                </Pressable>
              )}
              {removable && (
                <Pressable onPress={() => confirmRemove(item.id, item.label)} hitSlop={8} style={{ marginLeft: spacing.md }}>
                  <Trash2 size={16} color={t.danger} />
                </Pressable>
              )}
            </View>
          );
        }}
      />

      {adding ? (
        <View style={[styles.form, { borderColor: t.border, backgroundColor: t.card }]}>
          <Text style={[typography.small, { color: t.textSecondary }]}>Demo card — enter any 4 digits, no real card data is collected.</Text>
          <TextInput
            value={last4}
            onChangeText={(v) => setLast4(v.replace(/[^0-9]/g, "").slice(0, 4))}
            placeholder="Last 4 digits"
            placeholderTextColor={t.textMuted}
            keyboardType="number-pad"
            style={[styles.input, { color: t.text, borderColor: t.border }]}
          />
          <PrimaryButton label="Add Card" onPress={save} disabled={last4.length !== 4} />
        </View>
      ) : (
        <View style={{ padding: spacing.lg }}>
          <PrimaryButton label="Add Card" onPress={() => setAdding(true)} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.sm },
  defaultBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  form: { padding: spacing.lg, borderTopWidth: 1, gap: spacing.sm },
  input: { borderWidth: 1, borderRadius: radius.md, height: 48, paddingHorizontal: spacing.md, marginVertical: spacing.sm },
});
