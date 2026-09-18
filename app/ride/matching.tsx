import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Modal } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { SimulatedMap } from "@/components/SimulatedMap";
import { DriverCard } from "@/components/Cards";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { DRIVERS } from "@/data/seed";

const CANCEL_REASONS = ["Driver taking too long", "Changed my mind", "Wrong pickup location", "Found another ride", "Other"];

export default function Matching() {
  const t = useTheme();
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const rides = useAppStore((s) => s.rides);
  const advanceRideStatus = useAppStore((s) => s.advanceRideStatus);
  const cancelRide = useAppStore((s) => s.cancelRide);
  const ride = rides.find((r) => r.id === rideId);
  const [cancelVisible, setCancelVisible] = useState(false);

  useEffect(() => {
    if (!rideId) return;
    const t1 = setTimeout(() => advanceRideStatus(rideId, "DRIVER_MATCHED"), 2200);
    return () => clearTimeout(t1);
  }, [rideId]);

  useEffect(() => {
    if (ride?.status === "DRIVER_MATCHED") {
      const t2 = setTimeout(() => advanceRideStatus(rideId!, "DRIVER_EN_ROUTE"), 1600);
      return () => clearTimeout(t2);
    }
    if (ride?.status === "DRIVER_EN_ROUTE") {
      const t3 = setTimeout(() => {
        advanceRideStatus(rideId!, "DRIVER_ARRIVED");
        router.replace({ pathname: "/ride/active", params: { rideId } });
      }, 3000);
      return () => clearTimeout(t3);
    }
  }, [ride?.status]);

  function doCancel(reason: string) {
    cancelRide(rideId!, reason);
    setCancelVisible(false);
    router.replace("/(tabs)");
  }

  const driver = DRIVERS.find((d) => d.id === ride?.driverId);

  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <SimulatedMap height={340} routeProgress={ride?.status === "DRIVER_EN_ROUTE" ? 0.6 : 0.15} showRoute />
      <SafeAreaView style={[styles.sheet, { backgroundColor: t.card }]}>
        {(!ride || ride.status === "REQUESTED") && (
          <View style={styles.centered}>
            <ActivityIndicator color={t.accent} size="large" />
            <Text style={[typography.h2, { color: t.text, marginTop: spacing.lg }]}>Finding a driver nearby...</Text>
            <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.xs }]}>This usually takes a few seconds</Text>
          </View>
        )}
        {ride?.status === "DRIVER_MATCHED" && driver && (
          <View style={styles.centered}>
            <Text style={[typography.h2, { color: t.success, marginBottom: spacing.md }]}>Driver Found</Text>
            <Pressable onPress={() => router.push({ pathname: "/ride/driver", params: { driverId: driver.id } })} style={{ width: "100%" }}>
              <DriverCard driver={driver} eta={`${driver.responseTimeSec < 30 ? 3 : 5} min`} />
            </Pressable>
          </View>
        )}
        {ride?.status === "DRIVER_EN_ROUTE" && driver && (
          <View style={styles.centered}>
            <Text style={[typography.h2, { color: t.text, marginBottom: spacing.md }]}>Driver is heading to pickup</Text>
            <Pressable onPress={() => router.push({ pathname: "/ride/driver", params: { driverId: driver.id } })} style={{ width: "100%" }}>
              <DriverCard driver={driver} eta="Arriving" />
            </Pressable>
          </View>
        )}
        <SecondaryButton label="Cancel Ride" onPress={() => setCancelVisible(true)} style={{ marginTop: spacing.lg, borderColor: t.danger }} />
      </SafeAreaView>

      <Modal visible={cancelVisible} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: t.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: t.card }]}>
            <Text style={[typography.h2, { color: t.text }]}>Cancel ride?</Text>
            {CANCEL_REASONS.map((r) => (
              <Pressable key={r} onPress={() => doCancel(r)} style={[styles.reasonRow, { borderColor: t.border }]}>
                <Text style={[typography.body, { color: t.text }]}>{r}</Text>
              </Pressable>
            ))}
            <SecondaryButton label="Never mind" onPress={() => setCancelVisible(false)} style={{ marginTop: spacing.md }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, marginTop: -radius.xl, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalCard: { padding: spacing.lg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  reasonRow: { paddingVertical: spacing.md, borderBottomWidth: 1 },
});
