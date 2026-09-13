const SIZES = {
  sm: { text: "text-xl", icon: 20 },
  md: { text: "text-2xl", icon: 24 },
  lg: { text: "text-5xl", icon: 40 },
} as const;

/** A small diary silhouette — a closed book with a bookmark ribbon
 * poking out the top — rendered as flat two-tone shapes (not a
 * Lucide line icon) so the mark reads as a logo, not another UI
 * glyph. Uses the same two emotion colours as everything else
 * (--accent / --accent-soft), so it stays "in world" while still
 * standing apart from the outline-icon language used everywhere
 * else in the app. */
function DiaryMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="brand-orb shrink-0 rounded-md"
    >
      <rect x="4" y="4.5" width="16" height="17" rx="2.3" fill="var(--accent)" />
      <line x1="7.6" y1="4.5" x2="7.6" y2="21.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <path d="M12.5 7V1.5L14.25 3.3L16 1.5V7Z" fill="var(--accent-soft)" />
    </svg>
  );
}

/** The Orbis wordmark — used in the sidebar, mobile top bar, and the
 * auth pages. One shared component so the treatment (and any future
 * tuning of it) stays identical everywhere it appears. Deliberately
 * unlike any other text in the app: bold, upper-case Fraunces at a
 * display optical size (nothing else in the app is bold serif or
 * upper-case), coloured as a gradient of the current emotion's own
 * two colours instead of plain ink. */
export function BrandMark({ size = "md" }: { size?: keyof typeof SIZES }) {
  const { text, icon } = SIZES[size];
  return (
    <span className="inline-flex items-center gap-2.5">
      <DiaryMark size={icon} />
      <span
        className={`logotype ${text}`}
        style={{
          backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-soft))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Orbis
      </span>
    </span>
  );
}
