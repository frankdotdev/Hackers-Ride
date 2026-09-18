import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";

export default function Completed() {
  const t = useTheme();
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const ride = useAppStore((s) => s.rides.find((r) => r.id === rideId));

  if (!ride) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={[styles.iconWrap, { backgroundColor: t.accentSoft }]}>
          <CheckCircle2 size={44} color={t.accent} />
        </View>
        <Text style={[typography.h1, { color: t.text, marginTop: spacing.lg }]}>Trip Complete</Text>

        <View style={[styles.card, { borderColor: t.border, backgroundColor: t.card }]}>
          <Row label="Distance" value={`${ride.distanceKm.toFixed(1)} km`} t={t} />
          <Row label="Duration" value={`${ride.durationMin} min`} t={t} />
          <Row label="Payment" value={ride.paymentMethod === "cash" ? "Cash" : ride.paymentMethod === "card" ? "Card" : "Wallet"} t={t} />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <Row label="Fare" value={`₦${(ride.finalFare ?? ride.estimatedFare).toLocaleString()}`} t={t} bold />
        </View>
      </View>

      <PrimaryButton label="Rate Your Ride" onPress={() => router.replace({ pathname: "/ride/rating", params: { rideId: ride.id } })} />
    </SafeAreaView>
  );
}

function Row({ label, value, t, bold }: { label: string; value: string; t: any; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[typography.body, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[bold ? typography.h2 : typography.body, { color: t.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  iconWrap: { width: 84, height: 84, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  card: { width: "100%", borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
  divider: { height: 1, marginVertical: spacing.sm },
});
