import { EmotionPill } from "./EmotionPill";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-mist bg-paper/90 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <span className="brand-dot h-2.5 w-2.5 rounded-full accent-dot" />
        <span className="font-display text-base text-ink">CogniCare</span>
      </div>
      <div className="flex items-center gap-2">
        <EmotionPill />
        <ThemeToggle />
      </div>
    </header>
  );
}
