import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { RatingStars } from "@/components/Cards";
import { useAppStore } from "@/store/useAppStore";

const TAGS = ["Clean vehicle", "Friendly driver", "Safe driving", "On time", "Smooth ride"];

export default function Rating() {
  const t = useTheme();
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const rateRide = useAppStore((s) => s.rateRide);
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t2) => t2 !== tag) : [...prev, tag]));
  }

  function submit() {
    rateRide(rideId!, rating, tags, comment);
    router.replace("/(tabs)/trips");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Text style={[typography.h1, { color: t.text, textAlign: "center", marginTop: spacing.xl }]}>How was your ride?</Text>

      <View style={{ marginTop: spacing.xl }}>
        <RatingStars value={rating} onChange={setRating} />
      </View>

      <Text style={[typography.h3, { color: t.textSecondary, marginTop: spacing.xl }]}>Tell us about your experience</Text>
      <View style={styles.tagWrap}>
        {TAGS.map((tag) => {
          const selected = tags.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[styles.tag, { borderColor: selected ? t.accent : t.border, backgroundColor: selected ? t.accentSoft : t.card }]}
            >
              <Text style={[typography.small, { color: selected ? t.accent : t.text }]}>{tag}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Additional comments..."
        placeholderTextColor={t.textMuted}
        multiline
        style={[styles.commentBox, { borderColor: t.border, color: t.text, backgroundColor: t.surface }]}
      />

      <View style={{ flex: 1 }} />
      <PrimaryButton label="Submit Feedback" onPress={submit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1 },
  commentBox: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, height: 90, marginTop: spacing.lg, textAlignVertical: "top" },
});
