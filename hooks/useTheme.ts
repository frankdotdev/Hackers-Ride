import { useAppStore } from "@/store/useAppStore";
import { lightTheme, darkTheme } from "@/theme/tokens";

export function useTheme() {
  const mode = useAppStore((s) => s.themeMode);
  return mode === "dark" ? darkTheme : lightTheme;
}
