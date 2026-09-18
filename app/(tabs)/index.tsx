import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Home as HomeIcon, Briefcase, Clock3, Search } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius, brand } from "@/theme/tokens";
import { SimulatedMap } from "@/components/SimulatedMap";
import { useAppStore } from "@/store/useAppStore";
import { CITY_CENTER } from "@/data/seed";
import { Place } from "@/types";

const CURRENT_LOCATION: Place = {
  id: "current",
  label: "Current Location",
  address: "Your current location (demo)",
  coords: CITY_CENTER,
  category: "recent",
};

export default function Home() {
  const t = useTheme();
  const user = useAppStore((s) => s.user);
  const notifications = useAppStore((s) => s.notifications);
  const savedPlaces = useAppStore((s) => s.savedPlaces);
  const rides = useAppStore((s) => s.rides);
  const setDraftPickup = useAppStore((s) => s.setDraftPickup);
  const setDraftDestination = useAppStore((s) => s.setDraftDestination);
  const unread = notifications.filter((n) => !n.read).length;

  const homePlace = savedPlaces.find((p) => p.category === "home");
  const workPlace = savedPlaces.find((p) => p.category === "work");
  const recentRide = rides.find((r) => r.status !== "CANCELLED");

  function goToDestination(destination: Place) {
    setDraftPickup(CURRENT_LOCATION);
    setDraftDestination(destination);
    router.push("/ride/type");
  }

  function handleQuickPlace(kind: "home" | "work" | "recent") {
    if (kind === "home") {
      if (homePlace) goToDestination(homePlace);
      else router.push("/profile/places");
    } else if (kind === "work") {
      if (workPlace) goToDestination(workPlace);
      else router.push("/profile/places");
    } else {
      if (recentRide) goToDestination(recentRide.destination);
      else router.push("/location/search");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <Pressable onPress={() => router.push("/(tabs)/profile")} style={[styles.avatar, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={{ color: t.text, fontWeight: "700" }}>{(user?.firstName?.[0] ?? "H")}</Text>
        </Pressable>
        <Text style={[typography.h3, { color: t.text }]}>{brand.name}</Text>
        <Pressable onPress={() => router.push("/profile/settings")} style={[styles.avatar, { backgroundColor: t.card, borderColor: t.border }]}>
          <Bell size={18} color={t.text} />
          {unread > 0 && <View style={[styles.badge, { backgroundColor: t.danger }]} />}
        </Pressable>
      </SafeAreaView>

      <SimulatedMap height={300} />

      <ScrollView style={[styles.sheet, { backgroundColor: t.card }]} contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: t.text }]}>Where are you going?</Text>
        <Pressable
          onPress={() => router.push("/location/search")}
          style={[styles.searchBar, { borderColor: t.border, backgroundColor: t.surface }]}
        >
          <Search size={18} color={t.textMuted} />
          <Text style={[typography.body, { color: t.textMuted, marginLeft: spacing.sm }]}>Search destination</Text>
        </Pressable>

        <View style={styles.quickRow}>
          <QuickPlace icon={<HomeIcon size={18} color={t.text} />} label="Home" present={!!homePlace} onPress={() => handleQuickPlace("home")} />
          <QuickPlace icon={<Briefcase size={18} color={t.text} />} label="Work" present={!!workPlace} onPress={() => handleQuickPlace("work")} />
          <QuickPlace icon={<Clock3 size={18} color={t.text} />} label="Recent" present={!!recentRide} onPress={() => handleQuickPlace("recent")} />
        </View>
      </ScrollView>
    </View>
  );
}

function QuickPlace({ icon, label, present, onPress }: { icon: React.ReactNode; label: string; present: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.quickPlace, { borderColor: t.border, backgroundColor: t.surface, opacity: present ? 1 : 0.6 }]}
    >
      {icon}
      <Text style={[typography.small, { color: t.text, marginTop: spacing.xs }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  badge: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  sheet: { flex: 1, marginTop: -radius.xl, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  searchBar: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: radius.md,
    height: 52, paddingHorizontal: spacing.md, marginTop: spacing.md,
  },
  quickRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  quickPlace: { flex: 1, alignItems: "center", padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
});
