import { useState } from "react";
import { useCurrentCheckIn } from "../../store/selectors";
import { getEmotion } from "../../data/emotions";
import { EmotionSwitcher } from "../checkin/EmotionSwitcher";

export function EmotionPill({ full = false }: { full?: boolean }) {
  const [open, setOpen] = useState(false);
  const currentCheckIn = useCurrentCheckIn();
  const emotion = getEmotion(currentCheckIn?.emotionId);
  const Icon = emotion?.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-full border accent-border bg-paper py-2 text-sm text-ink transition-colors hover:accent-wash ${
          full ? "w-full justify-start px-3.5" : "px-3.5"
        }`}
      >
        {Icon ? (
          <Icon size={15} strokeWidth={1.75} style={{ color: emotion?.primaryColor }} />
        ) : (
          <span className="h-2 w-2 rounded-full bg-mist-strong" />
        )}
        <span className="truncate">
          {emotion ? emotion.label : "How are you feeling?"}
        </span>
      </button>
      <EmotionSwitcher open={open} onClose={() => setOpen(false)} />
    </>
  );
}
