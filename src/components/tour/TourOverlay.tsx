import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useTourStore, getVisibleTarget } from "../../store/useTourStore";
import { useAuthStore } from "../../store/useAuthStore";
import { TOUR_STEPS } from "../../data/tour";

const GAP = 14;
const BUBBLE_WIDTH = 264;
const MARGIN = 12;

/**
 * A short, skippable walkthrough for brand-new users — a handful of
 * glass bubbles that point at specific buttons/nav items, one at a
 * time. Deliberately not a full-screen dimmed takeover: the rest of
 * the page stays fully interactive underneath (no backdrop at all),
 * so it reads as a hint rather than a gate. Auto-starts once, right
 * after onboarding (see AppShell), and can be replayed from Profile.
 */
export function TourOverlay() {
  const active = useTourStore((s) => s.active);
  const stepIndex = useTourStore((s) => s.stepIndex);
  const next = useTourStore((s) => s.next);
  const stop = useTourStore((s) => s.stop);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = TOUR_STEPS[stepIndex];

  const finish = useCallback(() => {
    stop();
    updateProfile({ hasSeenTour: true });
  }, [stop, updateProfile]);

  const measure = useCallback(() => {
    if (!step) return;
    const el = getVisibleTarget(step.key);
    if (!el) {
      // Nothing to point at right now (e.g. the Support link only
      // exists in the desktop sidebar) — skip straight past it
      // rather than showing a bubble pointing at nothing.
      if (stepIndex < TOUR_STEPS.length - 1) next();
      else finish();
      return;
    }
    setRect(el.getBoundingClientRect());
  }, [step, stepIndex, next, finish]);

  useEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  // If the person actually navigates somewhere while the tour is up,
  // get out of the way rather than following them around.
  const [startedPath] = useState(() => location.pathname);
  useEffect(() => {
    if (active && location.pathname !== startedPath) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish]);

  if (!active || !step || !rect) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Estimated bubble height — content is short by design (title +
  // one line + controls), so a fixed estimate is good enough to keep
  // it on-screen without measuring the actual rendered height.
  const EST_HEIGHT = 130;
  const clampTop = (v: number) => Math.min(Math.max(v, MARGIN), vh - MARGIN - EST_HEIGHT);
  const clampLeft = (v: number) => Math.min(Math.max(v, MARGIN), vw - MARGIN - BUBBLE_WIDTH);

  let top: number;
  let left: number;
  let arrowSide: "left" | "top" | "bottom";

  if (step.side === "right") {
    left = rect.right + GAP;
    top = clampTop(rect.top);
    arrowSide = "left";
    if (left + BUBBLE_WIDTH > vw - MARGIN) {
      // Not enough room on the right (narrow viewport) — fall back
      // to above the target instead.
      left = clampLeft(rect.left);
      top = clampTop(rect.top - GAP - EST_HEIGHT);
      arrowSide = "bottom";
    }
  } else if (step.side === "bottom") {
    top = clampTop(rect.bottom + GAP);
    left = clampLeft(rect.left + rect.width / 2 - BUBBLE_WIDTH / 2);
    arrowSide = "top";
  } else {
    top = clampTop(rect.top - GAP - EST_HEIGHT);
    left = clampLeft(rect.left + rect.width / 2 - BUBBLE_WIDTH / 2);
    arrowSide = "bottom";
  }

  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* A soft ring around the target — no screen dimming, the rest
          of the app stays fully usable underneath. */}
      <motion.div
        key={`ring-${step.key}`}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        className="absolute rounded-2xl accent-ring accent-glow"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={reduceMotion ? undefined : { opacity: 0, y: arrowSide === "top" ? -8 : arrowSide === "bottom" ? 8 : 0, x: arrowSide === "left" ? -8 : 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto absolute rounded-2xl glass panel-shadow p-4"
          style={{ top, left, width: BUBBLE_WIDTH }}
          role="dialog"
          aria-label={step.title}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg text-ink">{step.title}</h3>
            <button
              type="button"
              onClick={finish}
              aria-label="Skip tour"
              className="-mr-1 -mt-1 rounded-full p-1 text-ink-faint hover:bg-white/50 hover:text-ink"
            >
              <X size={15} />
            </button>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>

          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex gap-1">
              {TOUR_STEPS.map((s, i) => (
                <span
                  key={s.key}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === stepIndex ? 14 : 5,
                    background: i === stepIndex ? "var(--accent)" : "var(--color-hairline)",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={finish} className="text-xs text-ink-faint hover:text-ink-soft">
                Skip
              </button>
              <button
                type="button"
                onClick={isLast ? finish : next}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-paper"
                style={{ background: "var(--accent)" }}
              >
                {isLast ? "Got it" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
}
