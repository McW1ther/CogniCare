import { Heart, Shuffle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useStore } from "../../store/useStore";
import type { Quote } from "../../types";

export function QuoteCard({
  quote,
  large = false,
  onShuffle,
}: {
  quote: Quote;
  large?: boolean;
  onShuffle?: () => void;
}) {
  const saved = useStore((s) => s.savedQuoteIds.includes(quote.id));
  const toggleSaveQuote = useStore((s) => s.toggleSaveQuote);
  const reduceMotion = useReducedMotion();

  return (
    <div className={large ? "" : "flex items-start justify-between gap-4"}>
      <div className={large ? "min-h-[1em]" : "min-h-[1em] flex-1"}>
        <AnimatePresence mode="wait">
          <motion.p
            key={quote.id}
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={
              large
                ? "font-display text-balance text-4xl leading-[1.25] text-ink sm:text-5xl"
                : "font-display text-balance text-xl leading-snug text-ink"
            }
          >
            “{quote.text}”
          </motion.p>
        </AnimatePresence>
      </div>
      <div className={large ? "mt-5 flex items-center gap-2" : "flex shrink-0 items-center gap-1"}>
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.8 }}
          animate={saved && !reduceMotion ? { scale: [1, 1.25, 1] } : undefined}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          type="button"
          onClick={() => toggleSaveQuote(quote.id)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved quotes" : "Save this quote"}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-paper-2 hover:text-ink"
        >
          <Heart size={17} fill={saved ? "var(--accent)" : "none"} color={saved ? "var(--accent)" : "currentColor"} />
        </motion.button>
        {onShuffle && (
          <motion.button
            whileHover={reduceMotion ? undefined : { rotate: 25 }}
            whileTap={reduceMotion ? undefined : { scale: 0.85 }}
            type="button"
            onClick={onShuffle}
            aria-label="Show another quote"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-paper-2 hover:text-ink"
          >
            <Shuffle size={16} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
