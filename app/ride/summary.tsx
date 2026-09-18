import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { VEHICLE_TYPES, haversineKm, estimateFare, applyPromo, PROMO_CODES } from "@/data/seed";

export default function Summary() {
  const t = useTheme();
  const { draftPickup, draftDestination, draftRideTypeId, draftPaymentMethod, draftPromoCode, draftScheduledAt, requestRide, resetDraft, paymentMethods } = useAppStore();

  const vehicle = VEHICLE_TYPES.find((v) => v.id === draftRideTypeId)!;
  const distanceKm = useMemo(() => (draftPickup && draftDestination ? Math.max(haversineKm(draftPickup.coords, draftDestination.coords), 1.2) : 0), [draftPickup, draftDestination]);
  const durationMin = Math.max(Math.round(distanceKm * 2.6), 6);
  const baseFare = estimateFare(vehicle, distanceKm, durationMin);
  const promo = PROMO_CODES.find((p) => p.code === draftPromoCode);
  const { discount, total } = applyPromo(baseFare, promo);
  const paymentLabel = paymentMethods.find((m) => m.type === draftPaymentMethod)?.label ?? draftPaymentMethod;

  function handleRequest() {
    const rideId = requestRide(total, distanceKm, durationMin, discount, draftScheduledAt ?? undefined);
    if (draftScheduledAt) {
      router.replace("/(tabs)/trips");
    } else {
      router.replace({ pathname: "/ride/matching", params: { rideId } });
    }
  }

  if (!draftPickup || !draftDestination || !vehicle) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Text style={[typography.h1, { color: t.text }]}>Review your ride</Text>

      <ScrollView style={{ flex: 1, marginTop: spacing.lg }}>
        <View style={[styles.card, { borderColor: t.border, backgroundColor: t.card }]}>
          <Row label="Pickup" value={draftPickup.label} t={t} />
          <Row label="Destination" value={draftDestination.label} t={t} />
          <Row label="Ride type" value={vehicle.name} t={t} />
          <Row label="Distance" value={`${distanceKm.toFixed(1)} km`} t={t} />
          <Row label="Duration" value={`${durationMin} min`} t={t} />
          {draftScheduledAt && <Row label="Scheduled for" value={new Date(draftScheduledAt).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} t={t} />}
          <Row label="Payment" value={paymentLabel} t={t} />
          {promo && <Row label="Promo" value={`-₦${discount.toLocaleString()} (${promo.code})`} t={t} valueColor={t.success} />}
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <Row label="Estimated Fare" value={`₦${total.toLocaleString()}`} t={t} bold />
        </View>
      </ScrollView>

      <PrimaryButton label={draftScheduledAt ? "Schedule Ride" : "Request Ride"} onPress={handleRequest} />
      <SecondaryButton label="Back" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
    </SafeAreaView>
  );
}

function Row({ label, value, t, bold, valueColor }: { label: string; value: string; t: any; bold?: boolean; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <Text style={[typography.body, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[bold ? typography.h2 : typography.body, { color: valueColor ?? t.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
  divider: { height: 1, marginVertical: spacing.sm },
});
