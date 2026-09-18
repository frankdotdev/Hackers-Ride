import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Clock } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { SimulatedMap } from "@/components/SimulatedMap";
import { VehicleCard } from "@/components/Cards";
import { VEHICLE_TYPES, haversineKm, estimateFare } from "@/data/seed";
import { useAppStore } from "@/store/useAppStore";

function dayOptions() {
  const days = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
    });
  }
  return days;
}

function timeOptions(forDate: Date) {
  const isToday = forDate.toDateString() === new Date().toDateString();
  const now = new Date();
  const slots: { label: string; hour: number; minute: number }[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (const minute of [0, 30]) {
      if (isToday && (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes()))) continue;
      const label = new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      slots.push({ label, hour, minute });
    }
  }
  return slots;
}

export default function RideType() {
  const t = useTheme();
  const draftPickup = useAppStore((s) => s.draftPickup);
  const draftDestination = useAppStore((s) => s.draftDestination);
  const draftRideTypeId = useAppStore((s) => s.draftRideTypeId);
  const setDraftRideType = useAppStore((s) => s.setDraftRideType);
  const draftScheduledAt = useAppStore((s) => s.draftScheduledAt);
  const setDraftScheduledAt = useAppStore((s) => s.setDraftScheduledAt);

  const [scheduleMode, setScheduleMode] = useState<"now" | "later">(draftScheduledAt ? "later" : "now");
  const days = useMemo(dayOptions, []);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const times = useMemo(() => timeOptions(selectedDay.date), [selectedDay]);
  const [selectedTime, setSelectedTime] = useState<{ label: string; hour: number; minute: number } | null>(times[0] ?? null);

  const distanceKm = useMemo(() => {
    if (!draftPickup || !draftDestination) return 0;
    return Math.max(haversineKm(draftPickup.coords, draftDestination.coords), 1.2);
  }, [draftPickup, draftDestination]);

  const durationMin = Math.max(Math.round(distanceKm * 2.6), 6);

  function pickDay(day: typeof days[number]) {
    setSelectedDay(day);
    const opts = timeOptions(day.date);
    setSelectedTime(opts[0] ?? null);
  }

  function confirmSchedule() {
    if (!selectedTime) return;
    const d = new Date(selectedDay.date);
    d.setHours(selectedTime.hour, selectedTime.minute, 0, 0);
    setDraftScheduledAt(d.toISOString());
  }

  function handleContinue() {
    if (scheduleMode === "later") confirmSchedule();
    else setDraftScheduledAt(null);
    router.push("/ride/payment");
  }

  if (!draftPickup || !draftDestination) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: t.text }}>Select a pickup and destination first.</Text>
        <PrimaryButton label="Search Destination" onPress={() => router.replace("/location/search")} style={{ marginTop: spacing.lg }} />
      </SafeAreaView>
    );
  }

  const canContinue = !!draftRideTypeId && (scheduleMode === "now" || !!selectedTime);

  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <SimulatedMap height={220} showRoute />
      <SafeAreaView edges={["top"]} style={styles.headerAbs}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: t.card }]}>
          <ArrowLeft size={20} color={t.text} />
        </Pressable>
      </SafeAreaView>

      <View style={[styles.tripInfo, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={[typography.small, { color: t.textSecondary }]} numberOfLines={1}>{draftPickup.label} → {draftDestination.label}</Text>
        <Text style={[typography.small, { color: t.text, marginTop: 2 }]}>{distanceKm.toFixed(1)} km · {durationMin} min</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: t.text, marginBottom: spacing.md }]}>Choose a Trip</Text>
        {VEHICLE_TYPES.map((v) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            price={estimateFare(v, distanceKm, durationMin)}
            selected={draftRideTypeId === v.id}
            onPress={() => setDraftRideType(v.id)}
          />
        ))}

        <Text style={[typography.h2, { color: t.text, marginTop: spacing.xl, marginBottom: spacing.md }]}>Ride Time</Text>
        <View style={styles.segmented}>
          <Pressable
            onPress={() => setScheduleMode("now")}
            style={[styles.segment, { backgroundColor: scheduleMode === "now" ? t.accent : t.surface, borderColor: t.border }]}
          >
            <Text style={[typography.body, { color: scheduleMode === "now" ? "#fff" : t.text, fontWeight: "600" }]}>Ride Now</Text>
          </Pressable>
          <Pressable
            onPress={() => setScheduleMode("later")}
            style={[styles.segment, { backgroundColor: scheduleMode === "later" ? t.accent : t.surface, borderColor: t.border }]}
          >
            <Text style={[typography.body, { color: scheduleMode === "later" ? "#fff" : t.text, fontWeight: "600" }]}>Schedule for Later</Text>
          </Pressable>
        </View>

        {scheduleMode === "later" && (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={[typography.h3, { color: t.textSecondary, marginBottom: spacing.sm }]}>Pick a day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
              {days.map((d) => (
                <Pressable
                  key={d.label}
                  onPress={() => pickDay(d)}
                  style={[styles.chip, { borderColor: selectedDay.label === d.label ? t.accent : t.border, backgroundColor: selectedDay.label === d.label ? t.accentSoft : t.card }]}
                >
                  <Text style={[typography.small, { color: selectedDay.label === d.label ? t.accent : t.text }]}>{d.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[typography.h3, { color: t.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm }]}>Pick a time</Text>
            {times.length === 0 ? (
              <Text style={[typography.small, { color: t.textMuted }]}>No more time slots today — pick another day.</Text>
            ) : (
              <View style={styles.timeGrid}>
                {times.map((tm) => (
                  <Pressable
                    key={tm.label}
                    onPress={() => setSelectedTime(tm)}
                    style={[styles.chip, { borderColor: selectedTime?.label === tm.label ? t.accent : t.border, backgroundColor: selectedTime?.label === tm.label ? t.accentSoft : t.card }]}
                  >
                    <Clock size={12} color={selectedTime?.label === tm.label ? t.accent : t.textMuted} />
                    <Text style={[typography.small, { color: selectedTime?.label === tm.label ? t.accent : t.text, marginLeft: 4 }]}>{tm.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            <Text style={[typography.tiny, { color: t.textMuted, marginTop: spacing.md }]}>
              Your driver will be assigned closer to your pickup time.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: t.card, borderColor: t.border }]}>
        <PrimaryButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  headerAbs: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  tripInfo: { marginHorizontal: spacing.lg, marginTop: -20, padding: spacing.md, borderRadius: 14, borderWidth: 1 },
  footer: { padding: spacing.lg, borderTopWidth: 1 },
  segmented: { flexDirection: "row", gap: spacing.sm },
  segment: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: "center", borderWidth: 1 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1 },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
