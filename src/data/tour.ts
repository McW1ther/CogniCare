export interface TourStep {
  /** Matches a key registered via `tourRef()` on the target element. */
  key: string;
  title: string;
  body: string;
  /** Preferred side of the target to place the bubble on. Falls back
   * automatically if there isn't room. */
  side: "right" | "bottom" | "top";
}

/** Kept short on purpose — this is meant to be glanced through in a
 * few seconds, not read like documentation. One idea per step. */
export const TOUR_STEPS: TourStep[] = [
  {
    key: "emotion-pill",
    title: "How you're feeling",
    body: "This always shows your current check-in. Tap it anytime to update it.",
    side: "right",
  },
  {
    key: "nav-diary",
    title: "Your diary",
    body: "A private space to write. Entries save automatically as you type.",
    side: "right",
  },
  {
    key: "nav-quotes",
    title: "Quotes",
    body: "Something supportive, matched to how you're feeling right now.",
    side: "right",
  },
  {
    key: "nav-insights",
    title: "Insights",
    body: "A gentle look back at your patterns over time — noticing, not diagnosing.",
    side: "right",
  },
  {
    key: "profile-avatar",
    title: "Your profile",
    body: "Change your name, photo, email, or password here whenever you like.",
    side: "bottom",
  },
  {
    key: "support-link",
    title: "Support",
    body: "If things ever feel like too much, help is one tap away — no judgment.",
    side: "right",
  },
];
