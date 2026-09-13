import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useStore } from "../store/useStore";
import { useCurrentCheckIn } from "../store/selectors";
import { EMOTIONS, getEmotion } from "../data/emotions";
import { quoteOfDay, quotesFor, randomQuote, getQuote } from "../data/quotes";
import { PageContainer } from "../components/layout/PageContainer";
import { QuoteCard } from "../components/quotes/QuoteCard";
import { Panel } from "../components/ui/Panel";
import { EmotionIcon } from "../components/ui/EmotionIcon";

export default function Quotes() {
  const [params] = useSearchParams();
  const currentCheckIn = useCurrentCheckIn();
  const savedQuoteIds = useStore((s) => s.savedQuoteIds);

  const [tab, setTab] = useState<"browse" | "saved">("browse");
  const [emotionId, setEmotionId] = useState(
    params.get("emotion") ?? currentCheckIn?.emotionId ?? EMOTIONS[0].id,
  );
  const [featuredId, setFeaturedId] = useState(() => quoteOfDay(emotionId).id);

  const emotion = getEmotion(emotionId)!;
  const featured = getQuote(featuredId) ?? quoteOfDay(emotionId);
  const others = useMemo(
    () => quotesFor(emotionId).filter((q) => q.id !== featured.id),
    [emotionId, featured.id],
  );

  function selectEmotion(id: string) {
    setEmotionId(id);
    setFeaturedId(quoteOfDay(id).id);
  }

  const reduceMotion = useReducedMotion();

  return (
    <PageContainer wide>
      <p className="text-sm text-ink-faint">Quotes</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">Something to sit with</h1>
      <p className="mt-3 max-w-lg text-[15px] text-ink-soft">
        Chosen for how you're feeling, not generic advice. Save the ones worth keeping.
      </p>

      <div className="mt-7 flex gap-1 rounded-full border border-hairline p-1 w-fit">
        <TabButton active={tab === "browse"} onClick={() => setTab("browse")}>
          Browse by feeling
        </TabButton>
        <TabButton active={tab === "saved"} onClick={() => setTab("saved")}>
          Saved {savedQuoteIds.length > 0 && `(${savedQuoteIds.length})`}
        </TabButton>
      </div>

      {tab === "browse" ? (
        <div className="mt-7">
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((e) => {
              const active = e.id === emotionId;
              const Icon = e.icon;
              return (
                <motion.button
                  key={e.id}
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 480, damping: 24 }}
                  type="button"
                  onClick={() => selectEmotion(e.id)}
                  data-selected={active || undefined}
                  style={{ ["--emo-color" as string]: e.primaryColor }}
                  className="emo-pill flex items-center gap-1.5 rounded-full border border-hairline bg-paper px-3.5 py-1.5 text-sm text-ink"
                >
                  <Icon size={13} style={{ color: e.primaryColor }} />
                  {e.label}
                </motion.button>
              );
            })}
          </div>

          <Panel className="mt-6 p-7 sm:p-9" glow>
            <div className="mb-5 flex items-center gap-2.5">
              <EmotionIcon emotion={emotion} size="sm" />
              <p className="text-sm text-ink-faint">For feeling {emotion.label.toLowerCase()}</p>
            </div>
            <QuoteCard
              quote={featured}
              large
              onShuffle={() => setFeaturedId(randomQuote(emotionId, featured.id).id)}
            />
          </Panel>

          {others.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {others.map((q) => (
                <Panel key={q.id} className="p-5">
                  <QuoteCard quote={q} />
                </Panel>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-7">
          {savedQuoteIds.length === 0 ? (
            <p className="text-[15px] text-ink-soft">
              Nothing saved yet. Tap the heart on any quote to keep it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {savedQuoteIds.map((id) => {
                const q = getQuote(id);
                if (!q) return null;
                const e = getEmotion(q.emotionId);
                return (
                  <Panel key={id} className="p-5">
                    {e && <p className="mb-3 text-xs text-ink-faint">{e.label}</p>}
                    <QuoteCard quote={q} />
                  </Panel>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
        active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
