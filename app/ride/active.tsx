import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Phone, Share2, ShieldAlert } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { SimulatedMap } from "@/components/SimulatedMap";
import { DriverCard } from "@/components/Cards";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { DRIVERS } from "@/data/seed";

export default function Active() {
  const t = useTheme();
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const rides = useAppStore((s) => s.rides);
  const advanceRideStatus = useAppStore((s) => s.advanceRideStatus);
  const completeRide = useAppStore((s) => s.completeRide);
  const ride = rides.find((r) => r.id === rideId);
  const driver = DRIVERS.find((d) => d.id === ride?.driverId);

  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (ride?.status === "TRIP_STARTED") {
      tickRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 0.05;
          if (next >= 1) {
            clearInterval(tickRef.current!);
            const finalFare = ride.estimatedFare;
            completeRide(ride.id, finalFare);
            router.replace({ pathname: "/ride/completed", params: { rideId: ride.id } });
            return 1;
          }
          return next;
        });
      }, 350);
      return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }
  }, [ride?.status]);

  async function shareTrip() {
    if (!ride || !driver) return;
    const message =
      `I'm on a Hacker's Ride trip.\n` +
      `Driver: ${driver.name} (${driver.vehicleColor} ${driver.vehicleModel}, ${driver.licensePlate})\n` +
      `From: ${ride.pickup.label}\nTo: ${ride.destination.label}\n` +
      `Trip ID: ${ride.id}`;
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        const fileUri = FileSystem.cacheDirectory + "trip-share.txt";
        await FileSystem.writeAsStringAsync(fileUri, message);
        await Sharing.shareAsync(fileUri, { mimeType: "text/plain", dialogTitle: "Share your trip" });
      } else {
        Alert.alert("Trip Details", message);
      }
    } catch {
      Alert.alert("Trip Details", message);
    }
  }

  function callDriver() {
    if (!driver) return;
    Linking.openURL(`tel:${driver.phone}`).catch(() => Alert.alert("Unable to place call", "This demo device can't place real calls."));
  }

  if (!ride || !driver) return null;

  const arrived = ride.status === "DRIVER_ARRIVED";
  const started = ride.status === "TRIP_STARTED";

  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <SimulatedMap height={360} showRoute routeProgress={started ? progress : 0} />
      <SafeAreaView style={[styles.sheet, { backgroundColor: t.card }]}>
        <Text style={[typography.h2, { color: t.text }]}>
          {arrived ? "Your driver has arrived" : "On the way"}
        </Text>
        <Pressable onPress={() => router.push({ pathname: "/ride/driver", params: { driverId: driver.id } })}>
          <DriverCard driver={driver} eta={started ? `${Math.round((1 - progress) * ride.durationMin)} min` : undefined} />
        </Pressable>

        <View style={[styles.tripMeta, { borderColor: t.border }]}>
          <Meta label="Ride type" value={ride.rideTypeId} t={t} />
          <Meta label="Distance" value={`${ride.distanceKm.toFixed(1)} km`} t={t} />
          <Meta label="ETA" value={started ? `${Math.round((1 - progress) * ride.durationMin)} min` : `${ride.durationMin} min`} t={t} />
        </View>

        <View style={styles.actionsRow}>
          <ActionIcon icon={<Share2 size={18} color={t.text} />} label="Share Trip" t={t} onPress={shareTrip} />
          <ActionIcon icon={<Phone size={18} color={t.text} />} label="Call" t={t} onPress={callDriver} />
          <ActionIcon icon={<ShieldAlert size={18} color={t.text} />} label="Safety" t={t} onPress={() => router.push("/profile/safety")} />
        </View>

        {arrived && <PrimaryButton label="Start Trip" onPress={() => advanceRideStatus(ride.id, "TRIP_STARTED")} style={{ marginTop: spacing.lg }} />}
      </SafeAreaView>
    </View>
  );
}

function Meta({ label, value, t }: { label: string; value: string; t: any }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={[typography.tiny, { color: t.textMuted }]}>{label}</Text>
      <Text style={[typography.body, { color: t.text, marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

function ActionIcon({ icon, label, t, onPress }: { icon: React.ReactNode; label: string; t: any; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.actionIcon, { borderColor: t.border }]}>
      {icon}
      <Text style={[typography.tiny, { color: t.text, marginTop: 4 }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, marginTop: -radius.xl, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg },
  tripMeta: { flexDirection: "row", justifyContent: "space-around", borderWidth: 1, borderRadius: radius.md, paddingVertical: spacing.md, marginTop: spacing.lg },
  actionsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: spacing.lg },
  actionIcon: { alignItems: "center", padding: spacing.md, borderWidth: 1, borderRadius: radius.md, width: 96 },
});
