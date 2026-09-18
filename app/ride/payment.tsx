import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Banknote, CreditCard, Wallet as WalletIcon, Check, Settings2 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { PROMO_CODES } from "@/data/seed";

function iconFor(type: string) {
  if (type === "cash") return Banknote;
  if (type === "wallet") return WalletIcon;
  return CreditCard;
}

export default function Payment() {
  const t = useTheme();
  const paymentMethods = useAppStore((s) => s.paymentMethods);
  const draftPaymentMethod = useAppStore((s) => s.draftPaymentMethod);
  const setDraftPayment = useAppStore((s) => s.setDraftPayment);
  const draftPromoCode = useAppStore((s) => s.draftPromoCode);
  const setDraftPromo = useAppStore((s) => s.setDraftPromo);
  const walletBalance = useAppStore((s) => s.walletBalance);
  const [promoInput, setPromoInput] = useState(draftPromoCode ?? "");
  const [promoError, setPromoError] = useState("");

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setDraftPromo(null); setPromoError(""); return; }
    const match = PROMO_CODES.find((p) => p.code === code);
    if (!match) { setPromoError("Promo code not recognized."); return; }
    setDraftPromo(code);
    setPromoError("");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: t.text }]}>Payment Method</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}><X size={22} color={t.text} /></Pressable>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.lg }}>
        <Text style={[typography.h3, { color: t.textSecondary }]}>Select Payment</Text>
        <Pressable onPress={() => router.push("/profile/payment-methods")} style={{ flexDirection: "row", alignItems: "center" }}>
          <Settings2 size={14} color={t.accent} />
          <Text style={[typography.small, { color: t.accent, marginLeft: 4 }]}>Manage</Text>
        </Pressable>
      </View>

      {paymentMethods.map((m) => {
        const Icon = iconFor(m.type);
        const selected = draftPaymentMethod === m.type;
        const sub = m.type === "wallet" ? `₦${walletBalance.toLocaleString()} available` : undefined;
        return (
          <Pressable
            key={m.id}
            onPress={() => setDraftPayment(m.type)}
            style={[styles.methodRow, { borderColor: selected ? t.accent : t.border, backgroundColor: selected ? t.accentSoft : t.card }]}
          >
            <Icon size={20} color={t.text} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={[typography.body, { color: t.text }]}>{m.label}</Text>
              {sub && <Text style={[typography.tiny, { color: t.textMuted }]}>{sub}</Text>}
            </View>
            {selected && <Check size={18} color={t.accent} />}
          </Pressable>
        );
      })}

      <Text style={[typography.h3, { color: t.textSecondary, marginTop: spacing.xl }]}>Promo Code</Text>
      <View style={[styles.promoRow, { borderColor: t.border }]}>
        <TextInput
          value={promoInput}
          onChangeText={(v) => { setPromoInput(v); setPromoError(""); }}
          placeholder="Enter promo code"
          placeholderTextColor={t.textMuted}
          autoCapitalize="characters"
          style={[typography.body, { color: t.text, flex: 1 }]}
        />
        <Pressable onPress={applyPromo}><Text style={[typography.body, { color: t.accent, fontWeight: "700" }]}>Apply</Text></Pressable>
      </View>
      {promoError ? <Text style={[typography.small, { color: t.danger, marginTop: spacing.xs }]}>{promoError}</Text> : null}
      {draftPromoCode ? (
        <Text style={[typography.small, { color: t.success, marginTop: spacing.xs }]}>
          {PROMO_CODES.find((p) => p.code === draftPromoCode)?.description}
        </Text>
      ) : null}

      <View style={{ flex: 1 }} />
      <PrimaryButton label="Continue" onPress={() => router.push("/ride/summary")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  methodRow: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.lg, borderWidth: 1.5, marginTop: spacing.sm },
  promoRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: radius.md, height: 50, paddingHorizontal: spacing.md, marginTop: spacing.sm },
});

