import type { Emotion } from "../../types";

const SIZES = {
  sm: { box: 30, icon: 14 },
  md: { box: 40, icon: 18 },
  lg: { box: 56, icon: 25 },
} as const;

/**
 * A tinted circular badge for an emotion's icon — where a bare glyph
 * reads as decoration, this gives the emotion's colour a real (if
 * still small and contained) presence: a wash behind the icon and a
 * matching ring, rather than a single-colour dot. Used in "moment"
 * spots (check-in, hero cards, quotes); dense list rows keep the
 * plainer EmotionDot so they stay scannable.
 */
export function EmotionIcon({
  emotion,
  size = "md",
  className = "",
}: {
  emotion?: Pick<Emotion, "icon" | "primaryColor"> | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { box, icon } = SIZES[size];
  const Icon = emotion?.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: box,
        height: box,
        background: emotion
          ? `color-mix(in srgb, ${emotion.primaryColor} 24%, rgba(255,255,255,0.65))`
          : "rgba(255,255,255,0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: emotion
          ? `inset 0 0 0 1px color-mix(in srgb, ${emotion.primaryColor} 45%, white)`
          : "inset 0 0 0 1px rgba(255,255,255,0.7)",
      }}
    >
      {Icon && (
        <Icon size={icon} strokeWidth={1.75} style={{ color: emotion!.primaryColor }} />
      )}
    </span>
  );
}
