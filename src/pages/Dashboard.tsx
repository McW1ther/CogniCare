import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCurrentCheckIn } from "../store/selectors";
import { getEmotion } from "../data/emotions";
import { quoteOfDay, randomQuote } from "../data/quotes";
import { PageContainer } from "../components/layout/PageContainer";
import { QuoteCard } from "../components/quotes/QuoteCard";
import { EmotionGrid } from "../components/checkin/EmotionGrid";
import { EmotionDot } from "../components/ui/EmotionDot";
import { EmotionIcon } from "../components/ui/EmotionIcon";
import { Button } from "../components/ui/Button";
import { Panel } from "../components/ui/Panel";
import { formatDay, timeOfDayGreeting, currentStreak } from "../lib/date";
import { recentDayEmotions, hasCheckedInToday, recentDifficultRun } from "../lib/patterns";
import { NotebookPen, Quote as QuoteIcon, LifeBuoy } from "lucide-react";

const GREETING: Record<ReturnType<typeof timeOfDayGreeting>, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Still up",
};

export default function Dashboard() {
  const name = useAuthStore((s) => s.profile?.displayName);
  const currentCheckIn = useCurrentCheckIn();
  const checkIns = useStore((s) => s.checkIns);
  const journalEntries = useStore((s) => s.journalEntries);
  const checkIn = useStore((s) => s.checkIn);
  const navigate = useNavigate();
  const [dismissedNudge, setDismissedNudge] = useState(false);

  const emotion = getEmotion(currentCheckIn?.emotionId);
  const [quote, setQuote] = useState(() => (emotion ? quoteOfDay(emotion.id) : null));

  const greeting = GREETING[timeOfDayGreeting()];
  const checkedInToday = hasCheckedInToday(checkIns);
  const week = useMemo(() => recentDayEmotions(checkIns, 7), [checkIns]);
  const streak = useMemo(
    () => currentStreak([...checkIns.map((c) => c.timestamp), ...journalEntries.map((e) => e.createdAt)]),
    [checkIns, journalEntries],
  );
  const recentEntries = journalEntries.slice(0, 3);
  const showSupportNudge = !dismissedNudge && recentDifficultRun(checkIns);

  function reshuffle() {
    if (!emotion) return;
    setQuote(randomQuote(emotion.id, quote?.id));
  }

  return (
    <PageContainer wide>
      <section className="relative overflow-hidden rounded-[var(--radius-panel)] glass-hero accent-glow px-6 py-9 sm:px-9 sm:py-12">
        <div className="aurora" />
        <div className="relative z-10">
          <p className="text-sm text-white/70">
            {greeting}
            {name ? `, ${name}` : ""}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-[1.05] text-balance text-white sm:text-5xl">
            {emotion ? emotion.description : "How are you feeling right now?"}
          </h1>

          {emotion ? (
            <div className="mt-6 max-w-lg">
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <EmotionIcon emotion={emotion} size="sm" />
                <span>
                  Feeling <strong className="font-medium text-white">{emotion.label}</strong>
                  {currentCheckIn ? ` since ${formatDay(currentCheckIn.timestamp).toLowerCase()}` : ""}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">{emotion.support}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<NotebookPen size={15} />}
                  onClick={() => navigate(`/diary/new?emotion=${emotion.id}`)}
                >
                  Write about it
                </Button>
                <Link to="/quotes">
                  <Button variant="secondary" size="sm" icon={<QuoteIcon size={15} />}>
                    See more quotes
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative z-10 mt-6 max-w-xl">
              <p className="text-[15px] text-white/80">
                Take a moment to notice what's actually going on for you. Pick whatever fits —
                there's no wrong answer.
              </p>
              <div className="mt-5">
                <EmotionGrid onSelect={(e) => checkIn(e.id)} compact />
              </div>
            </div>
          )}
        </div>
      </section>

      {!checkedInToday && emotion && (
        <p className="mt-4 text-sm text-ink-faint">
          You haven't checked in today yet —{" "}
          <Link to="/check-in" className="text-ink-soft underline decoration-hairline underline-offset-4 hover:text-ink">
            see how you're feeling now
          </Link>
          .
        </p>
      )}

      {quote && emotion && (
        <Panel className="mt-8 p-6 sm:p-8" glow>
          <p className="mb-4 text-sm text-white/70">Today's quote, for feeling {emotion.label.toLowerCase()}</p>
          <QuoteCard quote={quote} large dark onShuffle={reshuffle} />
        </Panel>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-medium text-ink">Recent reflections</h2>
            <Link to="/diary" className="text-sm text-ink-faint hover:text-ink-soft">
              View diary
            </Link>
          </div>

          {recentEntries.length === 0 ? (
            <Panel className="mt-3 p-6">
              <p className="text-[15px] text-ink-soft">
                Nothing written yet. Your diary is a private place to put words to whatever
                you're carrying.
              </p>
              <Link to="/diary/new" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  Start your first entry
                </Button>
              </Link>
            </Panel>
          ) : (
            <Panel className="mt-3 px-2 py-1">
              <ul className="divide-y divide-hairline">
                {recentEntries.map((entry) => {
                  const entryEmotion = getEmotion(entry.emotionId);
                  return (
                    <li key={entry.id}>
                      <Link
                        to={`/diary/${entry.id}`}
                        className="flex items-center gap-4 rounded-[calc(var(--radius-panel)-14px)] px-3 py-4 hover:bg-white/50"
                      >
                        <div className="w-16 shrink-0 text-xs text-ink-faint">{formatDay(entry.createdAt)}</div>
                        <EmotionDot emotion={entryEmotion} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] text-ink">
                            {entry.title || entry.body.slice(0, 60) || "Untitled entry"}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel className="p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[15px] font-medium text-ink">This week</h2>
              <Link to="/insights" className="text-sm text-ink-faint hover:text-ink-soft">
                Insights
              </Link>
            </div>
            <div className="mt-4 flex justify-between">
              {week.map(({ date, emotionId }, i) => {
                const e = getEmotion(emotionId);
                const label = new Date(date).toLocaleDateString(undefined, { weekday: "narrow" });
                return (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 420, damping: 20, delay: i * 0.04 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className="h-7 w-7 rounded-full"
                      style={
                        e
                          ? {
                              background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${e.primaryColor} 70%, white 30%), ${e.primaryColor})`,
                              boxShadow: `0 4px 12px -2px color-mix(in srgb, ${e.primaryColor} 55%, transparent)`,
                            }
                          : { background: "rgba(34,38,29,0.06)", boxShadow: "inset 0 0 0 1px rgba(34,38,29,0.15)" }
                      }
                      title={e ? e.label : "No check-in"}
                    />
                    <span className="text-[11px] text-ink-faint">{label}</span>
                  </motion.div>
                );
              })}
            </div>
            {streak > 1 && (
              <p className="mt-4 text-sm text-ink-soft">
                {streak}-day reflection streak. Quietly consistent.
              </p>
            )}
          </Panel>

          {showSupportNudge ? (
            <Panel className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[15px] font-medium text-ink">Just checking in</h2>
                <button
                  type="button"
                  onClick={() => setDismissedNudge(true)}
                  className="text-xs text-ink-faint hover:text-ink-soft"
                >
                  Dismiss
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Things have looked heavy for a few days. That's worth noticing, not judging — and
                if you want another voice, that's always available.
              </p>
              <Link
                to="/support"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink underline decoration-hairline underline-offset-4 hover:text-ink-soft"
              >
                <LifeBuoy size={14} />
                See support options
              </Link>
            </Panel>
          ) : (
            <Panel className="p-5">
              <h2 className="text-[15px] font-medium text-ink">A gentle reminder</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                There's no streak to protect and no score to keep. Checking in even once,
                honestly, is enough.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
