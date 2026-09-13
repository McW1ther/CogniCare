import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EMOTIONS, FAMILY_LABEL, FAMILY_ORDER } from "../../data/emotions";
import { EmotionIcon } from "../ui/EmotionIcon";
import { FilterChip } from "../ui/FilterChip";
import type { Emotion, EmotionFamily } from "../../types";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025, delayChildren: 0.02 } },
};

const pillVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function EmotionGrid({
  selectedId,
  onSelect,
  compact = false,
}: {
  selectedId?: string | null;
  onSelect: (emotion: Emotion) => void;
  compact?: boolean;
}) {
  const [filter, setFilter] = useState<EmotionFamily | "all">("all");
  const reduceMotion = useReducedMotion();

  const groups = useMemo(() => {
    const families = filter === "all" ? FAMILY_ORDER : [filter];
    return families.map((family) => ({
      family,
      items: EMOTIONS.filter((e) => e.family === family),
    }));
  }, [filter]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by feeling type">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All feelings
        </FilterChip>
        {FAMILY_ORDER.map((f) => (
          <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {FAMILY_LABEL[f]}
          </FilterChip>
        ))}
      </div>

      <motion.div
        key={filter}
        variants={containerVariants}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        className={compact ? "mt-4 space-y-4" : "mt-6 space-y-7"}
      >
        {groups.map(({ family, items }) => (
          <div key={family}>
            {filter === "all" && (
              <p className="mb-2 text-sm text-ink-faint">{FAMILY_LABEL[family]}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {items.map((emotion) => {
                const selected = selectedId === emotion.id;
                return (
                  <motion.button
                    key={emotion.id}
                    variants={pillVariants}
                    whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 480, damping: 24 }}
                    type="button"
                    onClick={() => onSelect(emotion)}
                    data-selected={selected || undefined}
                    style={{ ["--emo-color" as string]: emotion.primaryColor }}
                    className="emo-pill flex items-center gap-2 rounded-full border border-hairline bg-paper py-1.5 pl-1.5 pr-4 text-sm text-ink"
                    aria-pressed={selected}
                  >
                    <EmotionIcon emotion={emotion} size="sm" />
                    {emotion.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
