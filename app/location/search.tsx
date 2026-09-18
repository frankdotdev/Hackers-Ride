import React, { useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, MapPin, Star, Clock3 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { DEMO_PLACES } from "@/data/seed";
import { useAppStore } from "@/store/useAppStore";
import { Place } from "@/types";

export default function LocationSearch() {
  const t = useTheme();
  const [query, setQuery] = useState("");
  const savedPlaces = useAppStore((s) => s.savedPlaces);
  const setDraftPickup = useAppStore((s) => s.setDraftPickup);
  const setDraftDestination = useAppStore((s) => s.setDraftDestination);
  const draftPickup = useAppStore((s) => s.draftPickup);

  const results = useMemo(() => {
    if (!query) return DEMO_PLACES;
    return DEMO_PLACES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  function choose(place: Place) {
    if (!draftPickup) {
      setDraftPickup(place);
    } else {
      setDraftDestination(place);
      router.replace("/ride/type");
      return;
    }
    // stay to pick destination next, or user can tap current-location for pickup
  }

  function useCurrentLocationAsPickup() {
    setDraftPickup({ id: "current", label: "Current Location", address: "Your current location (demo)", coords: { latitude: 6.4413, longitude: 7.4988 }, category: "recent" });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: t.text }]}>{draftPickup ? "Where are you going?" : "Set pickup location"}</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <X size={22} color={t.text} />
        </Pressable>
      </View>

      <View style={[styles.searchBar, { borderColor: t.border, backgroundColor: t.surface }]}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search destination"
          placeholderTextColor={t.textMuted}
          style={[typography.body, { color: t.text, flex: 1 }]}
          autoFocus
        />
      </View>

      {!draftPickup && (
        <Pressable onPress={useCurrentLocationAsPickup} style={[styles.currentLoc, { borderColor: t.border }]}>
          <MapPin size={18} color={t.accent} />
          <Text style={[typography.body, { color: t.text, marginLeft: spacing.sm }]}>Use current location</Text>
        </Pressable>
      )}

      {!query && savedPlaces.length > 0 && (
        <>
          <Text style={[typography.h3, { color: t.textSecondary, marginTop: spacing.lg }]}>Saved Places</Text>
          {savedPlaces.map((p) => (
            <PlaceRow key={p.id} place={p} icon={<Star size={16} color={t.accent} />} onPress={() => choose(p)} />
          ))}
        </>
      )}

      <Text style={[typography.h3, { color: t.textSecondary, marginTop: spacing.lg }]}>{query ? "Results" : "Popular Places"}</Text>
      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PlaceRow place={item} icon={<Clock3 size={16} color={t.textMuted} />} onPress={() => choose(item)} />}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      />
    </SafeAreaView>
  );
}

function PlaceRow({ place, icon, onPress }: { place: Place; icon: React.ReactNode; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.placeRow, { borderColor: t.border }]}>
      {icon}
      <View style={{ marginLeft: spacing.md, flex: 1 }}>
        <Text style={[typography.body, { color: t.text }]}>{place.label}</Text>
        <Text style={[typography.small, { color: t.textMuted }]} numberOfLines={1}>{place.address}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  searchBar: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: radius.md, height: 50, paddingHorizontal: spacing.md },
  currentLoc: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1, marginTop: spacing.sm },
  placeRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1 },
});
