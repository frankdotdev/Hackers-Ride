import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User, MapPin, Bell, Shield, Gift, Settings, HelpCircle, LogOut, ChevronRight,
} from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { useAppStore } from "@/store/useAppStore";

export default function Profile() {
  const t = useTheme();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  const items = [
    { icon: MapPin, label: "Saved Places", href: "/profile/places" },
    { icon: Bell, label: "Notifications", href: "/profile/settings" },
    { icon: Shield, label: "Safety", href: "/profile/safety" },
    { icon: Gift, label: "Invite Friends", href: "/profile/invite" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/profile/help" },
  ] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Pressable onPress={() => router.push("/profile/edit")} style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: t.card, borderColor: t.border }]}>
            <User size={28} color={t.text} />
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={[typography.h2, { color: t.text }]}>{user ? `${user.firstName} ${user.lastName}` : "Rider"}</Text>
            <Text style={[typography.small, { color: t.textSecondary }]}>{user?.phone}</Text>
          </View>
        </Pressable>

        <View style={{ marginTop: spacing.xl }}>
          {items.map((item) => (
            <Pressable key={item.label} onPress={() => router.push(item.href as any)} style={[styles.row, { borderColor: t.border }]}>
              <item.icon size={20} color={t.text} />
              <Text style={[typography.body, { color: t.text, flex: 1, marginLeft: spacing.md }]}>{item.label}</Text>
              <ChevronRight size={18} color={t.textMuted} />
            </Pressable>
          ))}

          <Pressable
            onPress={() => { logout(); router.replace("/(auth)/welcome"); }}
            style={[styles.row, { borderColor: t.border }]}
          >
            <LogOut size={20} color={t.danger} />
            <Text style={[typography.body, { color: t.danger, flex: 1, marginLeft: spacing.md }]}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1 },
});
