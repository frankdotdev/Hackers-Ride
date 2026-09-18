import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Trash2, MapPin, Plus } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { CITY_CENTER } from "@/data/seed";

export default function Places() {
  const t = useTheme();
  const savedPlaces = useAppStore((s) => s.savedPlaces);
  const addSavedPlace = useAppStore((s) => s.addSavedPlace);
  const removeSavedPlace = useAppStore((s) => s.removeSavedPlace);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");

  function save() {
    if (!label || !address) return;
    addSavedPlace({
      id: `place-${Date.now()}`,
      label, address,
      coords: { latitude: CITY_CENTER.latitude + Math.random() * 0.02, longitude: CITY_CENTER.longitude + Math.random() * 0.02 },
      category: "other",
    });
    setLabel(""); setAddress(""); setAdding(false);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <Text style={[typography.h1, { color: t.text, paddingHorizontal: spacing.lg }]}>Saved Places</Text>

      <FlatList
        data={savedPlaces}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={[styles.placeRow, { borderColor: t.border }]}>
            <MapPin size={18} color={t.accent} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[typography.body, { color: t.text }]}>{item.label}</Text>
              <Text style={[typography.small, { color: t.textMuted }]} numberOfLines={1}>{item.address}</Text>
            </View>
            <Pressable onPress={() => removeSavedPlace(item.id)} hitSlop={8}>
              <Trash2 size={18} color={t.danger} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={[typography.small, { color: t.textSecondary, textAlign: "center", marginTop: 40 }]}>No saved places</Text>}
      />

      {adding ? (
        <View style={[styles.form, { borderColor: t.border, backgroundColor: t.card }]}>
          <TextInput value={label} onChangeText={setLabel} placeholder="Label (e.g. Gym)" placeholderTextColor={t.textMuted} style={[styles.input, { color: t.text, borderColor: t.border }]} />
          <TextInput value={address} onChangeText={setAddress} placeholder="Address" placeholderTextColor={t.textMuted} style={[styles.input, { color: t.text, borderColor: t.border }]} />
          <PrimaryButton label="Save Place" onPress={save} />
        </View>
      ) : (
        <View style={{ padding: spacing.lg }}>
          <PrimaryButton label="Add Place" onPress={() => setAdding(true)} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  placeRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1 },
  form: { padding: spacing.lg, borderTopWidth: 1, gap: spacing.sm },
  input: { borderWidth: 1, borderRadius: radius.md, height: 48, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
});
