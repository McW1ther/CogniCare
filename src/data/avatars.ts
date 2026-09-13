import {
  Sun,
  Moon,
  Leaf,
  Flower2,
  Sparkles,
  Heart,
  Compass,
  Feather,
  Waves,
  Cloud,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AvatarOption {
  id: string;
  icon: LucideIcon;
  color: string;
}

/** A small curated set of profile pictures — solid-colour icon
 * badges rather than uploaded photos, so there's no storage/upload
 * infrastructure needed and every option already fits Orbis's
 * own visual language. */
export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "sun", icon: Sun, color: "#D89A3E" },
  { id: "moon", icon: Moon, color: "#6B7A99" },
  { id: "leaf", icon: Leaf, color: "#5C8A5C" },
  { id: "flower", icon: Flower2, color: "#BE7FA0" },
  { id: "sparkles", icon: Sparkles, color: "#C2A23D" },
  { id: "heart", icon: Heart, color: "#BE6363" },
  { id: "compass", icon: Compass, color: "#C2793F" },
  { id: "feather", icon: Feather, color: "#7A93A8" },
  { id: "waves", icon: Waves, color: "#3D8F9D" },
  { id: "cloud", icon: Cloud, color: "#8B8B9A" },
];

export const AVATAR_MAP: Record<string, AvatarOption> = Object.fromEntries(
  AVATAR_OPTIONS.map((a) => [a.id, a]),
);

export function getAvatar(id: string | null | undefined): AvatarOption | undefined {
  if (!id) return undefined;
  return AVATAR_MAP[id];
}
