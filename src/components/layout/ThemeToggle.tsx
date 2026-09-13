import { SunMedium, MoonStar } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

function resolvedIsDark(mode: string): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const themeMode = useAuthStore((s) => s.profile?.themeMode ?? "system");
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const dark = resolvedIsDark(themeMode);

  return (
    <button
      type="button"
      onClick={() => updateProfile({ themeMode: dark ? "light" : "dark" })}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-paper-2 hover:text-ink"
    >
      {dark ? <SunMedium size={17} /> : <MoonStar size={17} />}
    </button>
  );
}
