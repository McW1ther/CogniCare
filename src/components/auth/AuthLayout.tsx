import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/** Shared shell for every auth-adjacent screen (sign up, sign in,
 * password reset, and the trimmed-down Welcome check-in) — the same
 * aurora + centered-card look, so account creation feels like part
 * of the app rather than a bolted-on form. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="aurora" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="brand-dot h-2.5 w-2.5 rounded-full accent-dot" />
          <span className="font-display text-lg text-ink">CogniCare</span>
        </div>
        <div className="rounded-[var(--radius-panel)] glass panel-shadow p-7 sm:p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-ink-faint">
          <Link to="/support" className="underline decoration-hairline underline-offset-4 hover:text-ink-soft">
            Need to talk to someone right now?
          </Link>
        </p>
      </div>
    </div>
  );
}

export function FormStep({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const fieldClass =
  "w-full rounded-[var(--radius-field)] border border-hairline bg-paper px-4 py-3 text-[15px] text-ink outline-none accent-border focus:accent-ring";

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-sm text-ink-soft">{children}</label>;
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-4 rounded-[var(--radius-field)] border border-clay/40 bg-paper-2/60 px-4 py-3 text-sm text-ink-soft">
      {message}
    </p>
  );
}
