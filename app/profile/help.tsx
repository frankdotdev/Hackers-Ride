import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Send, MessageSquare } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography, radius } from "@/theme/tokens";

const FAQ = [
  { q: "How do I request a ride?", a: "Search a destination on Home, choose a ride type, review the fare, then tap Request Ride." },
  { q: "How do I cancel a ride?", a: "While a driver is matching or en route, tap Cancel Ride and select a reason." },
  { q: "How is my fare calculated?", a: "Fare = base fare + distance rate + time component, based on your selected ride type." },
  { q: "How do I use promo codes?", a: "Enter a code on the Payment screen before requesting your ride." },
  { q: "How do I add money?", a: "Go to Wallet → Add Money, choose an amount, and confirm." },
  { q: "How do I change my pickup location?", a: "On the destination search screen, tap 'Use current location' or search for a different pickup point." },
];

interface ChatMessage { id: string; from: "user" | "agent"; text: string; }

const AGENT_REPLIES = [
  "Thanks for reaching out! Could you tell me a bit more about the issue?",
  "Got it — I've noted that down. Is there anything else I can help with?",
  "I understand. For this demo, a real support agent would follow up shortly.",
];

export default function Help() {
  const t = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m0", from: "agent", text: "Hi! I'm a Hacker's Ride support agent (demo). How can I help today?" },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = AGENT_REPLIES[Math.min(messages.length, AGENT_REPLIES.length - 1)];
      setMessages((m) => [...m, { id: `a-${Date.now()}`, from: "agent", text: reply }]);
    }, 700);
  }

  if (showChat) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
          <View style={styles.header}>
            <Pressable onPress={() => setShowChat(false)} hitSlop={10}><ArrowLeft size={22} color={t.text} /></Pressable>
            <Text style={[typography.h2, { color: t.text, marginLeft: spacing.md }]}>Contact Support</Text>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: spacing.lg }}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.from === "user" ? { alignSelf: "flex-end", backgroundColor: t.accent } : { alignSelf: "flex-start", backgroundColor: t.surface }]}>
                <Text style={{ color: item.from === "user" ? "#fff" : t.text }}>{item.text}</Text>
              </View>
            )}
          />
          <View style={[styles.inputRow, { borderColor: t.border }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor={t.textMuted}
              style={[typography.body, { color: t.text, flex: 1 }]}
              onSubmitEditing={send}
            />
            <Pressable onPress={send} hitSlop={8}><Send size={20} color={t.accent} /></Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={t.text} /></Pressable>
      <Text style={[typography.h1, { color: t.text, paddingHorizontal: spacing.lg }]}>Help & Support</Text>

      <FlatList
        data={FAQ}
        keyExtractor={(f) => f.q}
        contentContainerStyle={{ padding: spacing.lg }}
        ListHeaderComponent={
          <Pressable onPress={() => setShowChat(true)} style={[styles.contactRow, { borderColor: t.border, backgroundColor: t.card, marginBottom: spacing.lg }]}>
            <MessageSquare size={18} color={t.accent} />
            <Text style={[typography.body, { color: t.text, marginLeft: spacing.sm, flex: 1 }]}>Contact Support</Text>
          </Pressable>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => setOpenFaq(openFaq === item.q ? null : item.q)} style={[styles.faqRow, { borderColor: t.border }]}>
            <Text style={[typography.body, { color: t.text }]}>{item.q}</Text>
            {openFaq === item.q && <Text style={[typography.small, { color: t.textSecondary, marginTop: spacing.xs }]}>{item.a}</Text>}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg },
  contactRow: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.lg, borderWidth: 1 },
  faqRow: { paddingVertical: spacing.md, borderBottomWidth: 1 },
  bubble: { maxWidth: "80%", padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.sm },
  inputRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, padding: spacing.md },
});
