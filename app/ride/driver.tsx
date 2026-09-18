import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Star, Phone, MessageCircle, ShieldCheck } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { DRIVERS } from "@/data/seed";

export default function DriverProfile() {
  const t = useTheme();
  const { driverId } = useLocalSearchParams<{ driverId: string }>();
  const driver = DRIVERS.find((d) => d.id === driverId);

  if (!driver) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: t.text }]}>Driver Profile</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}><X size={22} color={t.text} /></Pressable>
      </View>

      <View style={{ alignItems: "center", marginTop: spacing.lg }}>
        <View style={[styles.avatar, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[typography.h1, { color: t.text }]}>{driver.name.split(" ").map((n) => n[0]).join("")}</Text>
        </View>
        <Text style={[typography.h2, { color: t.text, marginTop: spacing.md }]}>{driver.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Star size={14} color="#E8B923" fill="#E8B923" />
          <Text style={[typography.small, { color: t.textSecondary, marginLeft: 4 }]}>{driver.rating.toFixed(1)} · {driver.tripCount} trips · Member since {driver.memberSince}</Text>
        </View>
      </View>

      <View style={[styles.card, { borderColor: t.border, backgroundColor: t.card }]}>
        <Row label="Vehicle" value={driver.vehicleModel} t={t} />
        <Row label="Color" value={driver.vehicleColor} t={t} />
        <Row label="License Plate" value={driver.licensePlate} t={t} />
      </View>

      <View style={[styles.safetyRow, { backgroundColor: t.accentSoft }]}>
        <ShieldCheck size={16} color={t.accent} />
        <Text style={[typography.small, { color: t.accent, marginLeft: spacing.sm, flex: 1 }]}>
          Identity verified. License plate and vehicle confirmed against Hacker's Ride records.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => Linking.openURL(`tel:${driver.phone}`)} style={[styles.actionBtn, { borderColor: t.border }]}>
          <Phone size={18} color={t.text} />
          <Text style={[typography.body, { color: t.text, marginLeft: spacing.sm }]}>Call {driver.name.split(" ")[0]}</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(`sms:${driver.phone}`)} style={[styles.actionBtn, { borderColor: t.border }]}>
          <MessageCircle size={18} color={t.text} />
          <Text style={[typography.body, { color: t.text, marginLeft: spacing.sm }]}>Message</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, t }: { label: string; value: string; t: any }) {
  return (
    <View style={styles.row}>
      <Text style={[typography.small, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[typography.body, { color: t.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatar: { width: 84, height: 84, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
  safetyRow: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xl },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: radius.md, paddingVertical: spacing.md },
});
