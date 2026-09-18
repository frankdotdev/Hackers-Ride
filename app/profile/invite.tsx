import React from "react";
import { View, Text, StyleSheet, Pressable, Share } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { ArrowLeft, Copy, Gift, Share2 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius, brand } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";

export default function Invite() {
  const t = useTheme();

  async function copyCode() {
    await Clipboard.setStringAsync(brand.referralCode);
  }

  async function shareInvite() {
    try {
      await Share.share({
        message: `Join me on ${brand.name}! Use my code ${brand.referralCode} and we both get ₦1,000 in ride credit.`,
      });
    } catch {
      // Sharing was dismissed or unavailable — no action needed for this demo.
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>

      <View style={{ padding: spacing.lg, alignItems: "center" }}>
        <View style={[styles.iconWrap, { backgroundColor: t.accentSoft }]}>
          <Gift size={32} color={t.accent} />
        </View>
        <Text style={[typography.h1, { color: t.text, marginTop: spacing.lg, textAlign: "center" }]}>Invite Friends</Text>
        <Text style={[typography.body, { color: t.textSecondary, marginTop: spacing.sm, textAlign: "center" }]}>
          Give ₦1,000, Get ₦1,000{"\n"}When your friend signs up with your code and takes their first ride, you both earn ride credit.
        </Text>

        <Pressable onPress={copyCode} style={[styles.codeRow, { borderColor: t.border, backgroundColor: t.card }]}>
          <Text style={[typography.h2, { color: t.text, letterSpacing: 3 }]}>{brand.referralCode}</Text>
          <Copy size={18} color={t.textMuted} />
        </Pressable>

        <PrimaryButton label="Invite Friends" onPress={shareInvite} style={{ marginTop: spacing.xl, width: "100%" }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  iconWrap: { width: 72, height: 72, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  codeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.xl, width: "100%" },
});
