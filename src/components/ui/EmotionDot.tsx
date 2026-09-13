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
        background: emotion?.primaryColor ?? "var(--color-mist-strong)",
      }}
    />
  );
}
