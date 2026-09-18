import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, User } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";

export default function EditProfile() {
  const t = useTheme();
  const user = useAppStore((s) => s.user);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  function save() {
    completeOnboarding(firstName || "Rider", lastName || "");
    router.back();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h1, { color: t.text }]}>Edit Profile</Text>

        <View style={[styles.avatarWrap, { backgroundColor: t.card, borderColor: t.border }]}>
          <User size={32} color={t.text} />
        </View>

        <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.lg }]}>First Name</Text>
        <TextInput value={firstName} onChangeText={setFirstName} style={[styles.input, { borderColor: t.border, color: t.text }]} />

        <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.md }]}>Last Name</Text>
        <TextInput value={lastName} onChangeText={setLastName} style={[styles.input, { borderColor: t.border, color: t.text }]} />

        <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.md }]}>Phone</Text>
        <Text style={[typography.body, { color: t.textMuted, marginTop: spacing.xs }]}>{user?.phone} (verified)</Text>

        <PrimaryButton label="Save" onPress={save} style={{ marginTop: spacing.xl }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  avatarWrap: { width: 72, height: 72, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", borderWidth: 1, marginTop: spacing.lg },
  input: { borderWidth: 1, borderRadius: radius.md, height: 48, paddingHorizontal: spacing.md, marginTop: spacing.xs },
});
