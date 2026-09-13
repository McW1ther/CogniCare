import { useNavigate } from "react-router-dom";
import { Modal } from "../ui/Modal";
import { EmotionGrid } from "./EmotionGrid";
import { useStore } from "../../store/useStore";
import { useCurrentCheckIn } from "../../store/selectors";
import type { Emotion } from "../../types";

export function EmotionSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const currentCheckIn = useCurrentCheckIn();
  const checkIn = useStore((s) => s.checkIn);
  const navigate = useNavigate();

  function handleSelect(emotion: Emotion) {
    checkIn(emotion.id);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="How are you feeling right now?">
      <p className="mb-4 -mt-2 text-sm text-ink-soft">
        Pick whatever fits best. You can change this again any time.
      </p>
      <EmotionGrid selectedId={currentCheckIn?.emotionId} onSelect={handleSelect} compact />
      <button
        type="button"
        onClick={() => {
          onClose();
          navigate("/check-in");
        }}
        className="mt-6 text-sm text-ink-soft underline decoration-mist-strong underline-offset-4 hover:text-ink"
      >
        Open the full check-in instead
      </button>
    </Modal>
  );
}
