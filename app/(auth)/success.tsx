import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2 } from "lucide-react-native";
import { PrimaryButton } from "@/components/Buttons";
import { spacing, typography, radius } from "@/theme/tokens";

export default function Success() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={styles.iconWrap}>
          <CheckCircle2 size={48} color="#0B0B0C" />
        </View>
        <Text style={styles.title}>Account Created!</Text>
        <Text style={styles.subtitle}>Your account has been created successfully. Press continue to start using the app.</Text>
      </View>
      <PrimaryButton label="Continue" onPress={() => router.replace("/(tabs)")} style={{ backgroundColor: "#33B679" }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C", padding: spacing.xl },
  iconWrap: { width: 88, height: 88, borderRadius: radius.pill, backgroundColor: "#33B679", alignItems: "center", justifyContent: "center", marginBottom: spacing.xl },
  title: { ...typography.h1, color: "#fff" },
  subtitle: { ...typography.body, color: "#A6A6AC", textAlign: "center", marginTop: spacing.md, paddingHorizontal: spacing.lg },
});
