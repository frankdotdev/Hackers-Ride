import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { ArrowLeft, ShieldAlert, Users, Share2, KeyRound, Trash2 } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppStore } from "@/store/useAppStore";
import { SAFETY_TIPS } from "@/data/seed";

export default function Safety() {
  const t = useTheme();
  const trustedContacts = useAppStore((s) => s.trustedContacts);
  const addTrustedContact = useAppStore((s) => s.addTrustedContact);
  const removeTrustedContact = useAppStore((s) => s.removeTrustedContact);
  const rides = useAppStore((s) => s.rides);
  const [addingContact, setAddingContact] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const activeRide = rides.find((r) => ["DRIVER_MATCHED", "DRIVER_EN_ROUTE", "DRIVER_ARRIVED", "TRIP_STARTED"].includes(r.status));
  const ridePin = "8421"; // deterministic demo verification PIN

  function saveContact() {
    if (!name || !phone) return;
    addTrustedContact(name, phone);
    setName(""); setPhone(""); setAddingContact(false);
  }

  function emergency() {
    Alert.alert(
      "Demo feature",
      "This is a portfolio demonstration — not connected to real emergency services. In a production app this would alert local emergency responders and your trusted contacts."
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}>
        <Text style={[typography.h1, { color: t.text }]}>Safety Center</Text>

        <Pressable onPress={emergency} style={[styles.emergencyBtn, { backgroundColor: t.danger }]}>
          <ShieldAlert size={20} color="#fff" />
          <Text style={[typography.h3, { color: "#fff", marginLeft: spacing.sm }]}>Emergency Assistance</Text>
        </Pressable>
        <Text style={[typography.tiny, { color: t.textMuted, marginTop: spacing.xs }]}>Demo feature — not connected to emergency services.</Text>

        <Section title="Ride Verification" t={t}>
          <View style={[styles.pinCard, { borderColor: t.border, backgroundColor: t.card }]}>
            <KeyRound size={18} color={t.accent} />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={[typography.small, { color: t.textSecondary }]}>Share this PIN with your driver to confirm you're getting into the right vehicle</Text>
              <Text style={[typography.h1, { color: t.text, letterSpacing: 4, marginTop: spacing.xs }]}>{ridePin}</Text>
            </View>
          </View>
        </Section>

        <Section title="Trusted Contacts" t={t}>
          {trustedContacts.length === 0 && (
            <Text style={[typography.small, { color: t.textSecondary }]}>No trusted contacts yet. Add someone who should know when you're on a ride.</Text>
          )}
          {trustedContacts.map((c) => (
            <View key={c.id} style={[styles.contactRow, { borderColor: t.border }]}>
              <Users size={16} color={t.text} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={[typography.body, { color: t.text }]}>{c.name}</Text>
                <Text style={[typography.tiny, { color: t.textMuted }]}>{c.phone}</Text>
              </View>
              <Pressable onPress={() => removeTrustedContact(c.id)} hitSlop={8}><Trash2 size={16} color={t.danger} /></Pressable>
            </View>
          ))}

          {addingContact ? (
            <View style={{ marginTop: spacing.sm }}>
              <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={t.textMuted} style={[styles.input, { borderColor: t.border, color: t.text }]} />
              <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor={t.textMuted} keyboardType="phone-pad" style={[styles.input, { borderColor: t.border, color: t.text }]} />
              <PrimaryButton label="Save Contact" onPress={saveContact} />
            </View>
          ) : (
            <SecondaryButton label="Add Trusted Contact" onPress={() => setAddingContact(true)} style={{ marginTop: spacing.sm }} />
          )}
        </Section>

        <Section title="Share Trip" t={t}>
          <Pressable
            disabled={!activeRide}
            onPress={() => router.push({ pathname: "/ride/active", params: { rideId: activeRide?.id } })}
            style={[styles.contactRow, { borderColor: t.border, opacity: activeRide ? 1 : 0.5 }]}
          >
            <Share2 size={16} color={t.text} />
            <Text style={[typography.body, { color: t.text, marginLeft: spacing.sm }]}>
              {activeRide ? "Share your current trip" : "No active trip to share right now"}
            </Text>
          </Pressable>
        </Section>

        <Section title="Safety Tips" t={t}>
          {SAFETY_TIPS.map((tip, i) => (
            <Text key={i} style={[typography.small, { color: t.textSecondary, marginBottom: spacing.sm }]}>• {tip}</Text>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, t, children }: { title: string; t: any; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={[typography.h3, { color: t.textSecondary, marginBottom: spacing.sm }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  emergencyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: spacing.lg, borderRadius: radius.lg, marginTop: spacing.lg },
  pinCard: { flexDirection: "row", alignItems: "center", padding: spacing.lg, borderWidth: 1, borderRadius: radius.lg },
  contactRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1 },
  input: { borderWidth: 1, borderRadius: radius.md, height: 48, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
});
