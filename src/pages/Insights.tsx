import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { getEmotion } from "../data/emotions";
import { PageContainer } from "../components/layout/PageContainer";
import { Panel } from "../components/ui/Panel";
import { EmotionDot } from "../components/ui/EmotionDot";
import { Button } from "../components/ui/Button";
import { formatDay, formatTime, currentStreak } from "../lib/date";
import { recentDayEmotions, emotionFrequency } from "../lib/patterns";

const PAGE = 8;

export default function Insights() {
  const checkIns = useStore((s) => s.checkIns);
  const journalEntries = useStore((s) => s.journalEntries);
  const [visible, setVisible] = useState(PAGE);

  const streak = useMemo(
    () => currentStreak([...checkIns.map((c) => c.timestamp), ...journalEntries.map((e) => e.createdAt)]),
    [checkIns, journalEntries],
  );
  const fortnight = useMemo(() => recentDayEmotions(checkIns, 14), [checkIns]);
  const frequency = useMemo(() => emotionFrequency(checkIns).slice(0, 6), [checkIns]);
  const maxCount = frequency[0]?.count ?? 1;

  if (checkIns.length === 0) {
    return (
      <PageContainer>
        <p className="text-sm text-ink-faint">Insights</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">Nothing to look back on yet</h1>
        <p className="mt-3 max-w-md text-[15px] text-ink-soft">
          Once you check in a few times, this page will start showing you gentle patterns — how
          you've been feeling, and when.
        </p>
        <Link to="/check-in" className="mt-5 inline-block">
          <Button variant="primary" size="sm">
            Check in now
          </Button>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer wide>
      <p className="text-sm text-ink-faint">Insights</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">Your emotional patterns</h1>
      <p className="mt-3 max-w-lg text-[15px] text-ink-soft">
        This is about noticing, not diagnosing. {checkIns.length} check-in
        {checkIns.length === 1 ? "" : "s"} so far{streak > 1 ? ` · ${streak}-day streak` : ""}.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel className="p-6">
          <h2 className="text-[15px] font-medium text-ink">Last two weeks</h2>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {fortnight.map(({ date, emotionId }) => {
              const e = getEmotion(emotionId);
              return (
                <div
                  key={date}
                  className="aspect-square rounded-lg border border-hairline"
                  style={{ background: e ? e.primaryColor : "rgba(34,38,29,0.05)" }}
                  title={`${formatDay(date)}${e ? ` · ${e.label}` : ""}`}
                />
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink-faint">Each square is one day. Blank means no check-in.</p>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-[15px] font-medium text-ink">Most felt</h2>
          <div className="mt-5 space-y-3">
            {frequency.map(({ emotionId, count }) => {
              const e = getEmotion(emotionId)!;
              return (
                <div key={emotionId} className="flex items-center gap-3">
                  <div className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-ink-soft">
                    <EmotionDot emotion={e} size="xs" />
                    {e.label}
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%`, background: e.primaryColor }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right text-xs text-ink-faint">{count}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <h2 className="text-[15px] font-medium text-ink">Check-in history</h2>
        <Panel className="mt-3 px-4 py-1">
          <ul className="divide-y divide-hairline">
            {checkIns.slice(0, visible).map((c) => {
              const e = getEmotion(c.emotionId)!;
              return (
                <li key={c.id} className="flex items-center gap-4 py-3.5">
                  <div className="w-20 shrink-0 text-xs text-ink-faint">{formatDay(c.timestamp)}</div>
                  <div className="w-16 shrink-0 text-xs text-ink-faint">{formatTime(c.timestamp)}</div>
                  <div className="flex items-center gap-2 text-sm text-ink">
                    <e.icon size={14} style={{ color: e.primaryColor }} />
                    {e.label}
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
        {visible < checkIns.length && (
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="mt-4 text-sm text-ink-soft underline decoration-hairline underline-offset-4 hover:text-ink"
          >
            Show more
          </button>
        )}
      </div>
    </PageContainer>
  );
}
