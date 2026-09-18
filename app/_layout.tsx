import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initDatabase } from "@/database/db";
import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "@/hooks/useTheme";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadFromDb = useAppStore((s) => s.loadFromDb);
  const t = useTheme();

  useEffect(() => {
    initDatabase();
    loadFromDb();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0B0B0C" }}>
        <ActivityIndicator color="#33B679" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={t.mode === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.background } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="location/search" options={{ presentation: "modal" }} />
          <Stack.Screen name="ride/type" />
          <Stack.Screen name="ride/payment" options={{ presentation: "modal" }} />
          <Stack.Screen name="ride/summary" />
          <Stack.Screen name="ride/matching" options={{ gestureEnabled: false }} />
          <Stack.Screen name="ride/driver" options={{ presentation: "modal" }} />
          <Stack.Screen name="ride/active" options={{ gestureEnabled: false }} />
          <Stack.Screen name="ride/completed" options={{ gestureEnabled: false }} />
          <Stack.Screen name="ride/rating" options={{ gestureEnabled: false }} />
          <Stack.Screen name="trip/[id]" />
          <Stack.Screen name="wallet/topup" options={{ presentation: "modal" }} />
          <Stack.Screen name="profile/settings" />
          <Stack.Screen name="profile/places" />
          <Stack.Screen name="profile/edit" />
          <Stack.Screen name="profile/payment-methods" />
          <Stack.Screen name="profile/safety" />
          <Stack.Screen name="profile/help" />
          <Stack.Screen name="profile/invite" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
