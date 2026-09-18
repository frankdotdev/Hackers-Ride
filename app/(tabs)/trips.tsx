import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography } from "@/theme/tokens";
import { useAppStore } from "@/store/useAppStore";
import { TripCard } from "@/components/Cards";

export default function Trips() {
  const t = useTheme();
  const rides = useAppStore((s) => s.rides);
  const upcoming = rides.filter((r) => ["SCHEDULED", "REQUESTED", "DRIVER_MATCHED", "DRIVER_EN_ROUTE", "DRIVER_ARRIVED", "TRIP_STARTED"].includes(r.status));
  const past = rides.filter((r) => ["TRIP_COMPLETED", "CANCELLED"].includes(r.status));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Text style={[typography.h1, { color: t.text, paddingHorizontal: spacing.lg }]}>Your Trips</Text>
      <FlatList
        data={[...(upcoming.length ? [{ header: "Upcoming" }, ...upcoming] : []), ...(past.length ? [{ header: "Past" }, ...past] : [])]}
        keyExtractor={(item: any, i) => item.id ?? `h-${i}`}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }: any) =>
          item.header ? (
            <Text style={[typography.h3, { color: t.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm }]}>{item.header}</Text>
          ) : (
            <TripCard ride={item} onPress={() => router.push({ pathname: "/trip/[id]", params: { id: item.id } })} />
          )
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Clock size={36} color={t.textMuted} />
            <Text style={[typography.h3, { color: t.text, marginTop: spacing.md }]}>No trips yet</Text>
            <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.xs, textAlign: "center" }]}>
              Your ride history will show up here once you book your first trip.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: spacing.md },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80 },
});
