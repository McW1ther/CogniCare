import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { useCurrentCheckIn } from "../store/selectors";
import { getEmotion } from "../data/emotions";
import { EmotionGrid } from "../components/checkin/EmotionGrid";
import { PageContainer } from "../components/layout/PageContainer";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { EmotionIcon } from "../components/ui/EmotionIcon";
import { NotebookPen, Quote as QuoteIcon, ArrowRight } from "lucide-react";
import type { Emotion } from "../types";

export default function CheckIn() {
  const currentCheckIn = useCurrentCheckIn();
  const checkIn = useStore((s) => s.checkIn);
  const navigate = useNavigate();
  const [pickedId, setPickedId] = useState<string | null>(currentCheckIn?.emotionId ?? null);

  const picked: Emotion | undefined = getEmotion(pickedId);

  function handleSelect(emotion: Emotion) {
    setPickedId(emotion.id);
    checkIn(emotion.id);
  }

  return (
    <PageContainer>
      <p className="text-sm text-ink-faint">Emotional check-in</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">How are you feeling right now?</h1>
      <p className="mt-3 text-[15px] text-ink-soft">
        Emotions aren't simply good or bad — CogniCare just wants to meet you where you actually
        are. Pick what fits, even if it's more than one thing at once.
      </p>

      <div className="mt-8">
        <EmotionGrid selectedId={pickedId} onSelect={handleSelect} />
      </div>

      <AnimatePresence mode="wait">
        {picked && (
          <motion.div
            key={picked.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Panel className="mt-8 p-6 sm:p-7" glow>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <EmotionIcon emotion={picked} size="md" />
                </motion.div>
                <h2 className="font-display text-2xl text-white">Feeling {picked.label.toLowerCase()}</h2>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">{picked.support}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Something small: {picked.suggestion}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  icon={<NotebookPen size={16} />}
                  onClick={() => navigate(`/diary/new?emotion=${picked.id}`)}
                >
                  Write about it
                </Button>
                <Button
                  variant="secondary"
                  icon={<QuoteIcon size={16} />}
                  onClick={() => navigate(`/quotes?emotion=${picked.id}`)}
                >
                  See a quote for this
                </Button>
                <Button variant="secondary" icon={<ArrowRight size={16} />} onClick={() => navigate("/")}>
                  Continue to your space
                </Button>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
