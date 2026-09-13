import { useEffect } from "react";
import type { ReactNode } from "react";
import { useCurrentCheckIn } from "../store/selectors";
import { getEmotion } from "../data/emotions";

/** Applies the current emotion's colours as CSS custom properties on
 * <html>. Nothing here ever sets a background colour directly —
 * components read --accent / --accent-soft themselves.
 *
 * Dark mode is removed for now (single "glass" visual mode only) —
 * see Profile.themeMode, which is still stored but currently unused,
 * in case it comes back later. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const currentCheckIn = useCurrentCheckIn();

  useEffect(() => {
    const root = document.documentElement;
    const emotion = getEmotion(currentCheckIn?.emotionId);
    root.style.setProperty("--accent", emotion?.primaryColor ?? "var(--color-moss)");
    root.style.setProperty("--accent-soft", emotion?.calmingColor ?? "var(--color-clay)");
  }, [currentCheckIn?.emotionId]);

  return <>{children}</>;
}
