import { useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy } from "lucide-react";
import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";

/** A caring pause before the Difficult archive, not a legal
 * disclaimer — content, not a popup, since this is meant to feel
 * like part of the page rather than an interruption. */
export function DifficultTabGate({
  onContinue,
  onCancel,
  onDontAskAgain,
}: {
  onContinue: () => void;
  onCancel: () => void;
  onDontAskAgain: () => void;
}) {
  const [dontAsk, setDontAsk] = useState(false);

  return (
    <Panel className="p-6 sm:p-7">
      <h2 className="font-display text-2xl text-ink">A quieter moment, first</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        These are entries written during harder feelings. Reading back through them can bring
        some of that back up — that's worth knowing before you go in. Only continue if it feels
        like the right moment.
      </p>

      <label className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={dontAsk}
          onChange={(e) => setDontAsk(e.target.checked)}
          className="h-4 w-4 rounded border-mist accent-[var(--accent)]"
        />
        Don't show this again
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            if (dontAsk) onDontAskAgain();
            onContinue();
          }}
        >
          I'm ready
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Not now
        </Button>
      </div>

      <Link
        to="/support"
        className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink-soft"
      >
        <LifeBuoy size={14} />
        If you need support right now, see support options
      </Link>
    </Panel>
  );
}
