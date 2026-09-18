import React from "react";
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronRight, Gift, ShieldCheck, HelpCircle, CreditCard, Globe, Lock, FileText } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius, brand } from "@/theme/tokens";
import { SecondaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";

export default function Settings() {
  const t = useTheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setTheme = useAppStore((s) => s.setTheme);
  const notifications = useAppStore((s) => s.notifications);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const resetDemoData = useAppStore((s) => s.resetDemoData);

  function confirmReset() {
    Alert.alert("Reset all local demo data?", "This clears trips, wallet history and settings.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: () => { resetDemoData(); router.replace("/(auth)/welcome"); } },
    ]);
  }

  function notImplemented(label: string) {
    Alert.alert(label, "This is a static demo screen — no additional configuration is needed here.");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}>
        <Text style={[typography.h1, { color: t.text }]}>Settings</Text>

        <Section title="Appearance" t={t}>
          <View style={styles.settingRow}>
            <Text style={[typography.body, { color: t.text }]}>Dark Mode</Text>
            <Switch value={themeMode === "dark"} onValueChange={(v) => setTheme(v ? "dark" : "light")} trackColor={{ true: t.accent }} />
          </View>
        </Section>

        <Section title="Notifications" t={t} action={{ label: "Mark all read", onPress: markAllNotificationsRead }}>
          {notifications.length === 0 ? (
            <Text style={[typography.small, { color: t.textSecondary }]}>You're all caught up</Text>
          ) : (
            notifications.slice(0, 6).map((n) => (
              <Pressable key={n.id} onPress={() => markNotificationRead(n.id)} style={[styles.notifRow, { borderColor: t.border }]}>
                <View style={[styles.dot, { backgroundColor: n.read ? "transparent" : t.accent }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.body, { color: t.text }]}>{n.title}</Text>
                  <Text style={[typography.small, { color: t.textSecondary }]}>{n.body}</Text>
                </View>
              </Pressable>
            ))
          )}
        </Section>

        <Section title="More" t={t}>
          <LinkRow icon={<CreditCard size={18} color={t.text} />} label="Payment Methods" onPress={() => router.push("/profile/payment-methods")} t={t} />
          <LinkRow icon={<ShieldCheck size={18} color={t.text} />} label="Safety Center" onPress={() => router.push("/profile/safety")} t={t} />
          <LinkRow icon={<Gift size={18} color={t.text} />} label="Invite Friends" onPress={() => router.push("/profile/invite")} t={t} />
          <LinkRow icon={<HelpCircle size={18} color={t.text} />} label="Help & Support" onPress={() => router.push("/profile/help")} t={t} />
          <LinkRow icon={<Globe size={18} color={t.text} />} label="Language" onPress={() => notImplemented("Language")} t={t} />
          <LinkRow icon={<Lock size={18} color={t.text} />} label="Privacy & Security" onPress={() => notImplemented("Privacy & Security")} t={t} />
          <LinkRow icon={<FileText size={18} color={t.text} />} label="Terms & Conditions" onPress={() => notImplemented("Terms & Conditions")} t={t} last />
        </Section>

        <Section title="About" t={t}>
          <Text style={[typography.small, { color: t.textSecondary }]}>
            {brand.name} is a portfolio demonstration application. Ride requests, payments, driver matching, GPS
            tracking and wallet transactions are simulated locally and do not represent real services.
          </Text>
        </Section>

        <SecondaryButton label="Reset Demo Data" onPress={confirmReset} style={{ marginTop: spacing.xl, borderColor: t.danger }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, t, children, action }: { title: string; t: any; children: React.ReactNode; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={[typography.h3, { color: t.textSecondary }]}>{title}</Text>
        {action && <Pressable onPress={action.onPress}><Text style={[typography.small, { color: t.accent }]}>{action.label}</Text></Pressable>}
      </View>
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </View>
  );
}

function LinkRow({ icon, label, onPress, t, last }: { icon: React.ReactNode; label: string; onPress: () => void; t: any; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.linkRow, { borderColor: t.border, borderBottomWidth: last ? 0 : 1 }]}>
      {icon}
      <Text style={[typography.body, { color: t.text, flex: 1, marginLeft: spacing.md }]}>{label}</Text>
      <ChevronRight size={16} color={t.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm },
  notifRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: spacing.sm },
  linkRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md },
});
