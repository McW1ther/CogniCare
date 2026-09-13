const SIZES = {
  sm: { text: "text-xl", dot: 9 },
  md: { text: "text-2xl", dot: 11 },
  lg: { text: "text-4xl", dot: 15 },
} as const;

/** The Orbis wordmark — used in the sidebar, mobile top bar, and the
 * auth pages. One shared component so the treatment (and any future
 * tuning of it) stays identical everywhere it appears. */
export function BrandMark({ size = "md" }: { size?: keyof typeof SIZES }) {
  const { text, dot } = SIZES[size];
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="brand-dot brand-orb shrink-0 rounded-full accent-dot"
        style={{ width: dot, height: dot }}
        aria-hidden
      />
      <span className={`logotype ${text} text-ink`}>Orbis</span>
    </span>
  );
}
