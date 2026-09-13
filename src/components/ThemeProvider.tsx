import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCurrentCheckIn } from "../store/selectors";
import { getEmotion } from "../data/emotions";

/** Applies the current emotion's colours as CSS custom properties on
 * <html>, and keeps the light/dark class in sync with the user's
 * preference. Nothing here ever sets a background colour directly —
 * components read --accent / --accent-soft themselves. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const currentCheckIn = useCurrentCheckIn();
  const themeMode = useAuthStore((s) => s.profile?.themeMode ?? "system");

  useEffect(() => {
    const root = document.documentElement;
    const emotion = getEmotion(currentCheckIn?.emotionId);
    root.style.setProperty("--accent", emotion?.primaryColor ?? "var(--color-moss)");
    root.style.setProperty("--accent-soft", emotion?.calmingColor ?? "var(--color-clay)");
  }, [currentCheckIn?.emotionId]);

  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const dark = themeMode === "dark" || (themeMode === "system" && mql.matches);
      root.classList.toggle("dark", dark);
    };

    apply();
    if (themeMode === "system") {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
  }, [themeMode]);

  return <>{children}</>;
}
