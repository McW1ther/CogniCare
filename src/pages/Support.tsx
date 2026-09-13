import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone, Globe2 } from "lucide-react";
import { Panel } from "../components/ui/Panel";

/** Reachable with or without an account, and linked quietly from
 * everywhere in the app (auth pages, sidebar footer, the diary
 * content-warning gate) — someone in crisis shouldn't have to sign
 * in first. General/international, framed in the app's own quiet,
 * non-clinical voice, never diagnostic. */
export default function Support() {
  return (
    <div className="min-h-screen px-5 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink-soft"
        >
          <ArrowLeft size={15} />
          Back to CogniCare
        </Link>

        <p className="mt-6 text-sm text-ink-faint">Support</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">
          If things feel like too much right now
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          CogniCare is a space for reflection — it isn't professional care, and it isn't built to
          handle a crisis. If you're in immediate danger, please contact your local emergency
          services. Otherwise, the people below are trained for exactly this, any hour, for free.
        </p>

        <div className="mt-8 space-y-4">
          <Panel className="flex items-start gap-4 p-5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full accent-wash">
              <Phone size={18} style={{ color: "var(--accent)" }} />
            </span>
            <div>
              <p className="font-medium text-ink">988 Suicide &amp; Crisis Lifeline</p>
              <p className="mt-1 text-sm text-ink-soft">
                Call or text <strong className="font-medium text-ink">988</strong> (US). Free,
                confidential, 24/7 — for a crisis, or just a genuinely hard moment.
              </p>
            </div>
          </Panel>

          <Panel className="flex items-start gap-4 p-5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full accent-wash">
              <MessageCircle size={18} style={{ color: "var(--accent)" }} />
            </span>
            <div>
              <p className="font-medium text-ink">Crisis Text Line</p>
              <p className="mt-1 text-sm text-ink-soft">
                Text <strong className="font-medium text-ink">HOME</strong> to{" "}
                <strong className="font-medium text-ink">741741</strong> (US &amp; Canada),{" "}
                <strong className="font-medium text-ink">85258</strong> (UK), or{" "}
                <strong className="font-medium text-ink">50808</strong> (Ireland).
              </p>
            </div>
          </Panel>

          <Panel className="flex items-start gap-4 p-5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full accent-wash">
              <Globe2 size={18} style={{ color: "var(--accent)" }} />
            </span>
            <div>
              <p className="font-medium text-ink">Outside the US?</p>
              <p className="mt-1 text-sm text-ink-soft">
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline decoration-hairline underline-offset-4 hover:text-ink-soft"
                >
                  findahelpline.com
                </a>{" "}
                lists free, confidential helplines by country.
              </p>
            </div>
          </Panel>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-ink-faint">
          Reaching out isn't a last resort — it's a reasonable thing to do whenever you need it,
          not only in an emergency.
        </p>

        <p className="mt-10 border-t border-hairline pt-6 text-xs leading-relaxed text-ink-faint">
          Want your account and everything in it deleted? Email{" "}
          <a href="mailto:privacy@cognicare.app" className="underline decoration-hairline underline-offset-4">
            privacy@cognicare.app
          </a>{" "}
          and it'll be removed.
        </p>
      </div>
    </div>
  );
}
