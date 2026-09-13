import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useAuthStore } from "../store/useAuthStore";
import { getEmotion, getValence } from "../data/emotions";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { EmotionDot } from "../components/ui/EmotionDot";
import { Panel } from "../components/ui/Panel";
import { FilterChip } from "../components/ui/FilterChip";
import { DifficultTabGate } from "../components/diary/DifficultTabGate";
import { formatDay } from "../lib/date";
import { Plus, Search, Trash2 } from "lucide-react";
import type { Valence } from "../types";

const TABS: { id: Valence; label: string }[] = [
  { id: "good", label: "Positive" },
  { id: "mixed", label: "Mixed" },
  { id: "difficult", label: "Negative" },
];

const SESSION_ACK_KEY = "cognicare-difficult-ack-session";

export default function Diary() {
  const entries = useStore((s) => s.journalEntries);
  const deleteEntry = useStore((s) => s.deleteEntry);
  const diaryDifficultAck = useAuthStore((s) => s.profile?.diaryDifficultAck ?? false);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [tab, setTab] = useState<Valence>("good");
  const [gateClearedThisSession, setGateClearedThisSession] = useState(
    () => sessionStorage.getItem(SESSION_ACK_KEY) === "1",
  );

  const showGate = tab === "difficult" && !diaryDifficultAck && !gateClearedThisSession;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entries.filter((e) => getValence(e.emotionId) === tab);
    if (q) list = list.filter((e) => e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q));
    return list;
  }, [entries, query, tab]);

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-faint">Your diary</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">A private place to think out loud</h1>
        </div>
        <Link to="/diary/new" className="shrink-0">
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>
            New entry
          </Button>
        </Link>
      </div>

      {entries.length > 0 && (
        <>
          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter by how it felt">
            {TABS.map((t) => (
              <FilterChip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
                {t.label}
              </FilterChip>
            ))}
          </div>

          <div className="relative mt-4 max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your entries"
              className="w-full rounded-full border border-hairline bg-paper py-2.5 pl-9 pr-4 text-sm text-ink outline-none focus:accent-ring"
            />
          </div>
        </>
      )}

      {entries.length === 0 ? (
        <Panel className="mt-8 p-8 text-center">
          <p className="font-display text-xl text-ink">Nothing written yet</p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-soft">
            Your diary isn't a task list — it's just space. Write about your day, a feeling, or
            nothing in particular.
          </p>
          <Link to="/diary/new" className="mt-5 inline-block">
            <Button variant="primary" size="sm">
              Start writing
            </Button>
          </Link>
        </Panel>
      ) : showGate ? (
        <div className="mt-6">
          <DifficultTabGate
            onContinue={() => {
              sessionStorage.setItem(SESSION_ACK_KEY, "1");
              setGateClearedThisSession(true);
            }}
            onCancel={() => setTab("good")}
            onDontAskAgain={() => updateProfile({ diaryDifficultAck: true })}
          />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-[15px] text-ink-soft">
          {query ? `No entries match “${query}”.` : "Nothing tagged this way yet."}
        </p>
      ) : (
        <Panel className="mt-6 px-2 py-1">
          <ul className="divide-y divide-hairline">
            {filtered.map((entry) => {
              const emotion = getEmotion(entry.emotionId);
              const confirming = confirmId === entry.id;
              return (
                <li key={entry.id} className="group flex items-center gap-4 rounded-[calc(var(--radius-panel)-14px)] px-3 py-4">
                  <Link to={`/diary/${entry.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="w-20 shrink-0 text-xs text-ink-faint">{formatDay(entry.createdAt)}</div>
                    <EmotionDot emotion={emotion} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] text-ink">{entry.title || "Untitled entry"}</p>
                      <p className="truncate text-sm text-ink-faint">{entry.body.slice(0, 90)}</p>
                    </div>
                  </Link>
                  {confirming ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-sm text-ink-faint hover:text-ink-soft"
                      >
                        Keep
                      </button>
                      <button
                        onClick={() => {
                          deleteEntry(entry.id);
                          setConfirmId(null);
                        }}
                        className="rounded-full bg-ink px-3 py-1.5 text-sm text-paper"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(entry.id)}
                      aria-label="Delete entry"
                      className="shrink-0 rounded-full p-2 text-ink-faint opacity-0 hover:bg-white/60 hover:text-ink group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </PageContainer>
  );
}
