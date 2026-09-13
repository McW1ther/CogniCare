import type { LucideIcon } from "lucide-react";

/** Broad emotional "families" used only to help people browse the
 * check-in grid — never shown as a diagnosis or category label. */
export type EmotionFamily = "uplifted" | "steady" | "tense" | "heavy" | "low";

export interface Emotion {
  id: string;
  label: string;
  family: EmotionFamily;
  icon: LucideIcon;
  /** Original CogniCare colour concept. */
  primaryColor: string;
  calmingColor: string;
  /** A short, plain-language description shown on the check-in grid. */
  description: string;
  /** Two or three sentences that acknowledge the feeling without trying
   * to fix or dismiss it. */
  support: string;
  /** One small, concrete thing the person could do right now. */
  suggestion: string;
  /** A reflective prompt used to seed a new diary entry. */
  journalPrompt: string;
}

export interface Quote {
  id: string;
  emotionId: string;
  text: string;
}

export interface CheckIn {
  id: string;
  emotionId: string;
  timestamp: number;
  note?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  emotionId: string | null;
  createdAt: number;
  updatedAt: number;
}

export type ThemeMode = "light" | "dark" | "system";

/** Broad "how did this feel" bucket used only for the diary archive —
 * derived from EmotionFamily, never shown as a diagnosis. */
export type Valence = "good" | "difficult" | "mixed";

export interface Profile {
  id: string;
  displayName: string | null;
  themeMode: ThemeMode;
  onboarded: boolean;
  diaryDifficultAck: boolean;
  avatarId: string | null;
}

export type AuthStatus = "loading" | "signedOut" | "signedIn";
