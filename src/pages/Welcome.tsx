import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStore } from "../store/useStore";
import { EmotionGrid } from "../components/checkin/EmotionGrid";
import { FormStep } from "../components/auth/AuthLayout";
import type { Emotion } from "../types";

/** The one-step welcome a brand-new account lands on right after
 * sign-up — name capture already happened in the sign-up form, so
 * this is purely the first check-in. */
export default function Welcome() {
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const checkIn = useStore((s) => s.checkIn);
  const navigate = useNavigate();

  async function finish(emotion?: Emotion) {
    if (emotion) checkIn(emotion.id);
    await updateProfile({ onboarded: true });
    navigate("/", { replace: true });
  }

  const name = profile?.displayName?.trim();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-5 py-10">
      <div className="aurora" />
      <div className="relative z-10 w-full max-w-xl">
        <FormStep>
          <p className="text-sm text-ink-faint">CogniCare</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink text-balance sm:text-5xl">
            {name ? `How are you feeling, ${name}?` : "How are you feeling right now?"}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
            There's no wrong answer. This just helps CogniCare meet you where you are — you can
            change it again any time.
          </p>
          <div className="mt-7">
            <EmotionGrid onSelect={(emotion) => finish(emotion)} compact />
          </div>
          <button
            type="button"
            onClick={() => finish()}
            className="mt-6 text-sm text-ink-faint underline decoration-mist-strong underline-offset-4 hover:text-ink-soft"
          >
            I'd rather not say right now
          </button>
        </FormStep>
      </div>
    </div>
  );
}
