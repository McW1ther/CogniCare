const SIZES = {
  sm: { text: "text-xl", icon: 26 },
  md: { text: "text-2xl", icon: 32 },
  lg: { text: "text-5xl", icon: 52 },
} as const;

/** Sharp, pointed-both-ends shape — the building block for the
 * sunburst rays, leaves, and root fringe below. `angle` is degrees
 * clockwise from straight up. */
function petal(bx: number, by: number, angle: number, length: number, width: number): string {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const px = -dy;
  const py = dx;
  const tx = bx + dx * length;
  const ty = by + dy * length;
  const bulge = length * 0.45;
  const c1x = bx + dx * bulge + px * (width / 2);
  const c1y = by + dy * bulge + py * (width / 2);
  const c2x = bx + dx * bulge - px * (width / 2);
  const c2y = by + dy * bulge - py * (width / 2);
  return `M ${bx} ${by} Q ${c1x} ${c1y} ${tx} ${ty} Q ${c2x} ${c2y} ${bx} ${by} Z`;
}

/** Rounded-at-the-tip shape (a real arc, not a point) — for the
 * tulip blooms and the central bud, so they read as flowers rather
 * than spikes. */
function roundPetal(bx: number, by: number, angle: number, length: number, width: number): string {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const px = -dy;
  const py = dx;
  const midLen = length - width / 2;
  const lx = bx + dx * midLen + px * (width / 2);
  const ly = by + dy * midLen + py * (width / 2);
  const rx = bx + dx * midLen - px * (width / 2);
  const ry = by + dy * midLen - py * (width / 2);
  const q1x = bx + dx * midLen * 0.55 + px * (width * 0.32);
  const q1y = by + dy * midLen * 0.55 + py * (width * 0.32);
  const q2x = bx + dx * midLen * 0.55 - px * (width * 0.32);
  const q2y = by + dy * midLen * 0.55 - py * (width * 0.32);
  return `M ${bx} ${by} Q ${q1x} ${q1y} ${lx} ${ly} A ${width / 2} ${width / 2} 0 0 0 ${rx} ${ry} Q ${q2x} ${q2y} ${bx} ${by} Z`;
}

const CX = 50;

/** A Scandinavian folk-art floral emblem — a sunburst-crowned bud
 * flanked by two tulips over a spray of leaves, rooted in a fanned
 * fringe. Built entirely from `petal()`/`roundPetal()` (generated,
 * not hand-traced) and coloured with the app's own accent gradient
 * instead of the original's flat navy — brighter, and tied to
 * whichever emotion is current. Mirrored left/right off one set of
 * numbers so the symmetry stays exact. Verified by rendering the
 * actual geometry to a PNG and reviewing it (twice — the first pass
 * had a wrong SVG arc-sweep direction that turned the tulip blooms
 * into a self-intersecting crescent; fixed before shipping). */
function EmblemMark({ size }: { size: number }) {
  const sunCenter = { x: CX, y: 13 };
  const sunR = 4;
  const rayAngles = [-62, -46, -31, -15.5, 0, 15.5, 31, 46, 62];
  const rays = rayAngles.map((a) => {
    const rad = (a * Math.PI) / 180;
    const bx = sunCenter.x + Math.sin(rad) * sunR;
    const by = sunCenter.y - Math.cos(rad) * sunR;
    return petal(bx, by, a, 7.5, 1.9);
  });

  const bud = roundPetal(CX, 27, 0, 13, 11);

  const tulip = (mirror: 1 | -1) => {
    const bx = CX + mirror * 14;
    const by = 46;
    const angles = [14, 38, 64].map((a) => a * mirror);
    const lengths = [17, 20, 15];
    const widths = [7.5, 8.5, 6.5];
    // Stem angle/length computed from the actual base -> bloom
    // geometry rather than guessed, so it always reaches cleanly.
    const stemBase = { x: CX + mirror * 1.3, y: 51 };
    const dx = bx - stemBase.x;
    const dy = by - stemBase.y;
    const stemAngle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const stemLength = Math.hypot(dx, dy) + 2;
    return {
      stem: petal(stemBase.x, stemBase.y, stemAngle, stemLength, 2.2),
      petals: angles.map((a, i) => roundPetal(bx, by, a, lengths[i], widths[i])),
    };
  };
  const tulipR = tulip(1);
  const tulipL = tulip(-1);

  const leaf = (mirror: 1 | -1) => {
    const base = { x: CX, y: 60 };
    return [petal(base.x, base.y, mirror * 106, 17, 7.5), petal(base.x, base.y, mirror * 136, 13, 6)];
  };
  const leavesR = leaf(1);
  const leavesL = leaf(-1);

  const fringeBase = { x: CX, y: 74 };
  const fringeAngles = Array.from({ length: 15 }, (_, i) => -68 + (136 / 14) * i);
  const fringe = fringeAngles.map((offset, i) => petal(fringeBase.x, fringeBase.y, 180 + offset, i % 2 === 0 ? 19 : 16, 1.7));

  const STEM_TOP = 26;
  const STEM_BOTTOM = 75;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden className="brand-orb shrink-0">
      <defs>
        <linearGradient id="emblem-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-soft)" />
        </linearGradient>
      </defs>
      <g fill="url(#emblem-grad)">
        {fringe.map((d, i) => (
          <path key={`fringe-${i}`} d={d} />
        ))}
        <rect x={CX - 1.2} y={STEM_TOP} width={2.4} height={STEM_BOTTOM - STEM_TOP} />
        <path d={leavesR[1]} />
        <path d={leavesL[1]} />
        <path d={leavesR[0]} />
        <path d={leavesL[0]} />
        <circle cx={CX} cy={56} r={2.4} />
        <path d={tulipR.stem} />
        <path d={tulipL.stem} />
        {tulipR.petals.map((d, i) => (
          <path key={`tr-${i}`} d={d} />
        ))}
        {tulipL.petals.map((d, i) => (
          <path key={`tl-${i}`} d={d} />
        ))}
        <path d={bud} />
        {rays.map((d, i) => (
          <path key={`ray-${i}`} d={d} />
        ))}
        <circle cx={sunCenter.x} cy={sunCenter.y} r={sunR} />
      </g>
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
      <EmblemMark size={icon} />
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
