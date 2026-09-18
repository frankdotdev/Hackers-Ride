import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Car, Bike, Star, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { radius, spacing, typography } from "@/theme/tokens";
import { VehicleType, Driver, Ride } from "@/types";

export function VehicleCard({ vehicle, price, selected, onPress }: { vehicle: VehicleType; price: number; selected: boolean; onPress: () => void }) {
  const t = useTheme();
  const Icon = vehicle.icon === "bike" ? Bike : Car;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.vehicleCard,
        { borderColor: selected ? t.accent : t.border, backgroundColor: selected ? t.accentSoft : t.card },
      ]}
    >
      <View style={[styles.vehicleIconWrap, { backgroundColor: t.surface }]}>
        <Icon size={26} color={t.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.h3, { color: t.text }]}>{vehicle.name}</Text>
        <Text style={[typography.small, { color: t.textSecondary }]}>{vehicle.description} · {vehicle.capacity} seats</Text>
        <Text style={[typography.tiny, { color: t.textMuted }]}>{vehicle.etaMins} min away</Text>
      </View>
      <Text style={[typography.h3, { color: t.text }]}>₦{price.toLocaleString()}</Text>
    </Pressable>
  );
}

export function DriverCard({ driver, eta }: { driver: Driver; eta?: string }) {
  const t = useTheme();
  return (
    <View style={[styles.driverRow, { borderColor: t.border }]}>
      <View style={[styles.avatar, { backgroundColor: t.surface }]}>
        <Text style={[typography.h3, { color: t.text }]}>{driver.name.split(" ").map((n) => n[0]).join("")}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.h3, { color: t.text }]}>{driver.name}</Text>
        <Text style={[typography.small, { color: t.textSecondary }]}>{driver.vehicleColor} {driver.vehicleModel} · {driver.licensePlate}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
          <Star size={12} color="#E8B923" fill="#E8B923" />
          <Text style={[typography.tiny, { color: t.textMuted, marginLeft: 4 }]}>{driver.rating.toFixed(1)} · {driver.tripCount} trips</Text>
        </View>
      </View>
      {eta && <Text style={[typography.small, { color: t.accent, fontWeight: "700" }]}>{eta}</Text>}
    </View>
  );
}

export function TripCard({ ride, onPress }: { ride: Ride; onPress: () => void }) {
  const t = useTheme();
  const statusColor =
    ride.status === "TRIP_COMPLETED" ? t.success : ride.status === "CANCELLED" ? t.danger : t.textSecondary;
  const statusLabel =
    ride.status === "TRIP_COMPLETED" ? "Completed" :
    ride.status === "CANCELLED" ? "Cancelled" :
    ride.status === "SCHEDULED" ? "Scheduled" : "In progress";

  return (
    <Pressable onPress={onPress} style={[styles.tripCard, { borderColor: t.border, backgroundColor: t.card }]}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.small, { color: t.textMuted }]}>{new Date(ride.createdAt).toLocaleDateString()}</Text>
        <Text style={[typography.h3, { color: t.text, marginTop: 2 }]} numberOfLines={1}>{ride.pickup.label} → {ride.destination.label}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
          <Text style={[typography.small, { color: statusColor, fontWeight: "600" }]}>{statusLabel}</Text>
          <Text style={[typography.small, { color: t.text }]}>₦{(ride.finalFare ?? ride.estimatedFare).toLocaleString()}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={t.textMuted} />
    </Pressable>
  );
}

export function RatingStars({ value, onChange, size = 32 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => onChange?.(i)} hitSlop={8}>
          <Star size={size} color="#E8B923" fill={i <= value ? "#E8B923" : "transparent"} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  vehicleIconWrap: {
    width: 48, height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center",
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center",
  },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});
