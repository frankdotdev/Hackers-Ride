import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Receipt, CreditCard } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";
import { useAppStore } from "@/store/useAppStore";

export default function Wallet() {
  const t = useTheme();
  const balance = useAppStore((s) => s.walletBalance);
  const txns = useAppStore((s) => s.walletTransactions);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Text style={[typography.h1, { color: t.text, paddingHorizontal: spacing.lg }]}>Wallet</Text>

      <View style={[styles.balanceCard, { backgroundColor: t.mode === "light" ? "#111113" : t.card }]}>
        <Text style={[typography.small, { color: "#A6A6AC" }]}>Current Balance</Text>
        <Text style={styles.balanceText}>₦{balance.toLocaleString()}</Text>
        <Pressable onPress={() => router.push("/wallet/topup")} style={styles.addBtn}>
          <Plus size={16} color="#0B0B0C" />
          <Text style={{ color: "#0B0B0C", fontWeight: "700", marginLeft: 6 }}>Add Money</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Row icon={<Receipt size={18} color={t.text} />} label="Transactions" sub={`${txns.length} records`} />
        <Row icon={<CreditCard size={18} color={t.text} />} label="Payment Methods" onPress={() => router.push("/profile/payment-methods")} />
      </View>

      <Text style={[typography.h3, { color: t.text, paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}>Recent Activity</Text>
      <FlatList
        data={txns}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={[styles.txnRow, { borderColor: t.border }]}>
            <View>
              <Text style={[typography.body, { color: t.text }]}>{item.description}</Text>
              <Text style={[typography.tiny, { color: t.textMuted }]}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <Text style={[typography.h3, { color: item.amount >= 0 ? t.success : t.danger }]}>
              {item.amount >= 0 ? "+" : ""}₦{item.amount.toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[typography.small, { color: t.textSecondary, textAlign: "center", marginTop: 40 }]}>No transactions yet</Text>
        }
      />
    </SafeAreaView>
  );
}

function Row({ icon, label, sub, onPress }: { icon: React.ReactNode; label: string; sub?: string; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.actionRow, { borderColor: t.border, backgroundColor: t.card }]}>
      {icon}
      <View style={{ marginLeft: spacing.sm }}>
        <Text style={[typography.body, { color: t.text }]}>{label}</Text>
        {sub && <Text style={[typography.tiny, { color: t.textMuted }]}>{sub}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: spacing.md },
  balanceCard: { margin: spacing.lg, padding: spacing.lg, borderRadius: radius.lg },
  balanceText: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 4 },
  addBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#33B679", alignSelf: "flex-start", paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, marginTop: spacing.md },
  row: { flexDirection: "row", gap: spacing.md, paddingHorizontal: spacing.lg },
  actionRow: { flex: 1, flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  txnRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1 },
});
