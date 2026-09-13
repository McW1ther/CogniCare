import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useCurrentCheckIn } from "../store/selectors";
import { getEmotion } from "../data/emotions";
import { PageContainer } from "../components/layout/PageContainer";
import { Modal } from "../components/ui/Modal";
import { EmotionGrid } from "../components/checkin/EmotionGrid";
import { EmotionDot } from "../components/ui/EmotionDot";
import { formatFullDate, formatTime } from "../lib/date";
import { ArrowLeft, Trash2, X } from "lucide-react";
import type { Emotion } from "../types";

export default function DiaryEntry() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const isNew = !id || id === "new";
  const entries = useStore((s) => s.journalEntries);
  const currentCheckIn = useCurrentCheckIn();
  const addEntry = useStore((s) => s.addEntry);
  const updateEntry = useStore((s) => s.updateEntry);
  const deleteEntry = useStore((s) => s.deleteEntry);

  const existing = !isNew ? entries.find((e) => e.id === id) : undefined;
  const notFound = !isNew && !existing;

  const emotionFromLink = params.get("emotion");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [emotionId, setEmotionId] = useState<string | null>(
    existing?.emotionId ?? emotionFromLink ?? currentCheckIn?.emotionId ?? null,
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  const entryIdRef = useRef<string | null>(existing?.id ?? null);
  const firstRun = useRef(true);

  const emotion = getEmotion(emotionId);
  const createdAt = existing?.createdAt ?? Date.now();

  useEffect(() => {
    if (notFound) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const hasContent = title.trim() || body.trim();
    if (!hasContent) return;

    const t = setTimeout(() => {
      if (entryIdRef.current) {
        updateEntry(entryIdRef.current, { title, body, emotionId });
      } else {
        const newId = addEntry({ title, body, emotionId });
        entryIdRef.current = newId;
        navigate(`/diary/${newId}`, { replace: true });
      }
      setStatus("saved");
    }, 500);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body, emotionId]);

  if (notFound) {
    return (
      <PageContainer>
        <p className="text-[15px] text-ink-soft">This entry doesn't exist, or was deleted.</p>
        <Link to="/diary" className="mt-4 inline-block text-sm text-ink-soft underline decoration-mist-strong underline-offset-4">
          Back to diary
        </Link>
      </PageContainer>
    );
  }

  function handleDelete() {
    if (entryIdRef.current) deleteEntry(entryIdRef.current);
    navigate("/diary");
  }

  function handlePick(e: Emotion) {
    setEmotionId(e.id);
    setPickerOpen(false);
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Link
          to="/diary"
          className="inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink-soft"
        >
          <ArrowLeft size={15} />
          Diary
        </Link>
        {!isNew && (
          <div className="flex items-center gap-3">
            {status === "saved" && <span className="text-xs text-ink-faint">Saved</span>}
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setConfirmDelete(false)} className="text-sm text-ink-faint hover:text-ink-soft">
                  Keep
                </button>
                <button onClick={handleDelete} className="rounded-full bg-ink px-3 py-1.5 text-sm text-paper">
                  Delete entry
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete entry"
                className="rounded-full p-2 text-ink-faint hover:bg-paper-2 hover:text-ink"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-faint">
        <span>{formatFullDate(createdAt)}</span>
        <span aria-hidden>·</span>
        <span>{formatTime(createdAt)}</span>
        <span
          className="emo-pill ml-1 flex items-center gap-1 rounded-full border border-mist pl-3 pr-1 py-1"
          style={emotion ? { ["--emo-color" as string]: emotion.primaryColor } : undefined}
        >
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 py-0.5 text-sm text-ink-soft"
          >
            {emotion ? (
              <>
                <EmotionDot emotion={emotion} size="xs" />
                {emotion.label}
              </>
            ) : (
              "Tag a feeling"
            )}
          </button>
          {emotion && (
            <button
              type="button"
              onClick={() => setEmotionId(null)}
              aria-label="Remove emotion tag"
              className="rounded-full p-1 text-ink-faint hover:text-ink"
            >
              <X size={12} />
            </button>
          )}
        </span>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="mt-5 w-full bg-transparent font-display text-2xl text-ink outline-none placeholder:text-ink-faint sm:text-3xl"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={emotion ? emotion.journalPrompt : "Write whatever is on your mind..."}
        rows={16}
        autoFocus={isNew}
        className="mt-5 w-full resize-y bg-transparent text-[16px] leading-[1.8] text-ink outline-none placeholder:text-ink-faint"
      />

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Tag this entry">
        <EmotionGrid selectedId={emotionId} onSelect={handlePick} compact />
      </Modal>
    </PageContainer>
  );
}
