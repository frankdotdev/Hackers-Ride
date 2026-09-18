import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Star } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { DRIVERS } from "@/data/seed";

const REPORT_REASONS = ["Overcharged", "Driver behavior", "Wrong route taken", "Vehicle condition", "Safety concern", "Other"];

export default function TripDetails() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const ride = useAppStore((s) => s.rides.find((r) => r.id === id));
  const setDraftPickup = useAppStore((s) => s.setDraftPickup);
  const setDraftDestination = useAppStore((s) => s.setDraftDestination);
  const setDraftRideType = useAppStore((s) => s.setDraftRideType);
  const reportIssue = useAppStore((s) => s.reportIssue);
  const [reportVisible, setReportVisible] = useState(false);

  if (!ride) return null;
  const driver = DRIVERS.find((d) => d.id === ride.driverId);

  function bookAgain() {
    setDraftPickup(ride!.pickup);
    setDraftDestination(ride!.destination);
    setDraftRideType(ride!.rideTypeId);
    router.push("/ride/type");
  }

  function submitReport(reason: string) {
    reportIssue(ride!.id, reason);
    setReportVisible(false);
    Alert.alert("Report submitted", "Thanks — our team will review this trip within 24 hours.");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}>
        <Text style={[typography.h1, { color: t.text }]}>Trip Details</Text>
        <Text style={[typography.small, { color: t.textMuted, marginTop: spacing.xs }]}>ID: {ride.id}</Text>
        <Text style={[typography.small, { color: t.textMuted }]}>{new Date(ride.createdAt).toLocaleString()}</Text>

        <View style={[styles.card, { borderColor: t.border, backgroundColor: t.card }]}>
          <Row label="Pickup" value={ride.pickup.label} t={t} />
          <Row label="Destination" value={ride.destination.label} t={t} />
          <Row label="Ride type" value={ride.rideTypeId} t={t} />
          <Row label="Distance" value={`${ride.distanceKm.toFixed(1)} km`} t={t} />
          <Row label="Duration" value={`${ride.durationMin} min`} t={t} />
          {driver && <Row label="Driver" value={`${driver.name} · ${driver.vehicleModel}`} t={t} />}
          <Row label="Payment" value={ride.paymentMethod} t={t} />
          {ride.discount ? <Row label="Discount" value={`-₦${ride.discount.toLocaleString()}`} t={t} /> : null}
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <Row label="Fare" value={`₦${(ride.finalFare ?? ride.estimatedFare).toLocaleString()}`} t={t} bold />
        </View>

        {ride.rating && (
          <View style={[styles.card, { borderColor: t.border, backgroundColor: t.card, marginTop: spacing.md }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} color="#E8B923" fill={i <= ride.rating! ? "#E8B923" : "transparent"} />
              ))}
            </View>
            {ride.reviewComment ? <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.sm }]}>{ride.reviewComment}</Text> : null}
          </View>
        )}

        {ride.reportedIssue && (
          <View style={[styles.card, { borderColor: t.border, backgroundColor: t.card, marginTop: spacing.md }]}>
            <Text style={[typography.small, { color: t.textSecondary }]}>Reported issue</Text>
            <Text style={[typography.body, { color: t.text, marginTop: 2 }]}>{ride.reportedIssue}</Text>
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton label="Book Again" onPress={bookAgain} />
          {ride.reportedIssue ? (
            <SecondaryButton label="Issue Reported" onPress={() => {}} disabled style={{ marginTop: spacing.sm }} />
          ) : (
            <SecondaryButton label="Report Issue" onPress={() => setReportVisible(true)} style={{ marginTop: spacing.sm }} />
          )}
        </View>
      </ScrollView>

      <Modal visible={reportVisible} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: t.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: t.card }]}>
            <Text style={[typography.h2, { color: t.text }]}>What went wrong?</Text>
            {REPORT_REASONS.map((r) => (
              <Pressable key={r} onPress={() => submitReport(r)} style={[styles.reasonRow, { borderColor: t.border }]}>
                <Text style={[typography.body, { color: t.text }]}>{r}</Text>
              </Pressable>
            ))}
            <SecondaryButton label="Cancel" onPress={() => setReportVisible(false)} style={{ marginTop: spacing.md }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Row({ label, value, t, bold }: { label: string; value: string; t: any; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[typography.body, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[bold ? typography.h2 : typography.body, { color: t.text }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
  divider: { height: 1, marginVertical: spacing.sm },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalCard: { padding: spacing.lg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  reasonRow: { paddingVertical: spacing.md, borderBottomWidth: 1 },
});
