import { create } from "zustand";

/**
 * Registry of DOM elements a tour step can point at, keyed by a
 * stable string id (e.g. "nav-diary"). Both the desktop (Sidebar)
 * and mobile (TopBar/MobileNav) chrome register under the *same*
 * key for shared concepts — both are always mounted (CSS just hides
 * whichever doesn't apply via `md:hidden`/`hidden md:flex`), so at
 * read time we pick whichever registered element currently has a
 * real, non-zero bounding rect instead of needing to know which
 * viewport we're in.
 */
interface TourState {
  targets: Record<string, Set<HTMLElement>>;
  registerTarget: (key: string, el: HTMLElement) => void;
  active: boolean;
  stepIndex: number;
  start: () => void;
  next: () => void;
  stop: () => void;
}

export const useTourStore = create<TourState>()((set, get) => ({
  targets: {},
  registerTarget: (key, el) => {
    const targets = get().targets;
    const set_ = targets[key] ?? new Set<HTMLElement>();
    set_.add(el);
    if (!targets[key]) set({ targets: { ...targets, [key]: set_ } });
  },
  active: false,
  stepIndex: 0,
  start: () => set({ active: true, stepIndex: 0 }),
  next: () => set((s) => ({ stepIndex: s.stepIndex + 1 })),
  stop: () => set({ active: false }),
}));

/** A plain ref-callback (not a hook) so it can be attached from
 * inside a `.map()` over a fixed config array without tripping the
 * rules-of-hooks — it just reads/writes the store imperatively. */
export function tourRef(key: string) {
  return (el: HTMLElement | null) => {
    if (el) useTourStore.getState().registerTarget(key, el);
  };
}

/** The first registered element for `key` that's actually visible
 * right now (width/height > 0) — i.e. whichever of the desktop/mobile
 * chrome applies at the current viewport. */
export function getVisibleTarget(key: string): HTMLElement | null {
  const set_ = useTourStore.getState().targets[key];
  if (!set_) return null;
  for (const el of set_) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return el;
  }
  return null;
}
