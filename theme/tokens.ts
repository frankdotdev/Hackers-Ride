// Hacker's Ride — design tokens
// One restrained green accent, charcoal/black/white base. No gradients.

export const brand = {
  name: "Hacker's Ride",
  tagline: "Your ride. Your route. Your way.",
  referralCode: "HACKRIDE",
};

const green = "#1E8E5A";
const greenSoft = "#E6F4EC";
const danger = "#D64545";

export const lightTheme = {
  mode: "light" as const,
  background: "#FFFFFF",
  surface: "#F7F7F8",
  card: "#FFFFFF",
  border: "#E7E7EA",
  text: "#111113",
  textSecondary: "#6B6B70",
  textMuted: "#9A9AA0",
  accent: green,
  accentSoft: greenSoft,
  danger,
  success: green,
  mapRoad: "#EDEDEF",
  mapBlock: "#F7F7F8",
  mapLine: "#D8D8DC",
  overlay: "rgba(0,0,0,0.45)",
};

export const darkTheme = {
  mode: "dark" as const,
  background: "#0B0B0C",
  surface: "#151517",
  card: "#1B1B1E",
  border: "#2A2A2E",
  text: "#F5F5F6",
  textSecondary: "#A6A6AC",
  textMuted: "#707076",
  accent: "#33B679",
  accentSoft: "#12241A",
  danger: "#E5695F",
  success: "#33B679",
  mapRoad: "#1E1E21",
  mapBlock: "#151517",
  mapLine: "#2A2A2E",
  overlay: "rgba(0,0,0,0.6)",
};

export type Theme = typeof lightTheme;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 20, fontWeight: "700" as const },
  h3: { fontSize: 16, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  tiny: { fontSize: 11, fontWeight: "500" as const },
};
