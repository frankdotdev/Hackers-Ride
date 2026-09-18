import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "lucide-react-native";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { spacing, typography, radius } from "@/theme/tokens";
import { brand } from "@/theme/tokens";
import { useAppStore } from "@/store/useAppStore";

export default function Welcome() {
  const login = useAppStore((s) => s.login);

  function simulateSocial(provider: string) {
    login("+234 800 000 0000");
    router.push({ pathname: "/(auth)/otp", params: { social: provider } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandBlock}>
        <View style={styles.logo}>
          <Navigation size={30} color="#111113" />
        </View>
        <Text style={styles.title}>Welcome to {brand.name}</Text>
        <Text style={styles.tagline}>{brand.tagline}</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Continue with Mobile Number" onPress={() => router.push("/(auth)/phone")} />
        <SecondaryButton label="Continue with Google" onPress={() => simulateSocial("google")} style={{ marginTop: spacing.md }} />
        <SecondaryButton label="Continue with Facebook" onPress={() => simulateSocial("facebook")} style={{ marginTop: spacing.md }} />
        <Text style={styles.legal}>By continuing, you agree to our Terms & Conditions and Privacy Policy.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C", justifyContent: "space-between", padding: spacing.xl },
  brandBlock: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 72, height: 72, borderRadius: radius.pill, backgroundColor: "#33B679", alignItems: "center", justifyContent: "center", marginBottom: spacing.xl },
  title: { ...typography.h1, color: "#fff", textAlign: "center" },
  tagline: { ...typography.body, color: "#A6A6AC", marginTop: spacing.sm, textAlign: "center" },
  actions: { paddingBottom: spacing.lg },
  legal: { ...typography.tiny, color: "#707076", textAlign: "center", marginTop: spacing.lg },
});
