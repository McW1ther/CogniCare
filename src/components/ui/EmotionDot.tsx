import type { Emotion } from "../../types";

const SIZES = { xs: 6, sm: 8, md: 10 } as const;

export function EmotionDot({
  emotion,
  size = "sm",
  className = "",
}: {
  emotion?: Pick<Emotion, "primaryColor"> | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const px = SIZES[size];
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{
        width: px,
        height: px,
        background: emotion?.primaryColor ?? "rgba(34,38,29,0.25)",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.8)",
      }}
    />
  );
}
