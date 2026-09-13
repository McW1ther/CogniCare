import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout, FormStep, fieldClass, FieldLabel, FormError } from "../../components/auth/AuthLayout";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";

/** Landed on from the emailed reset link — Supabase turns that link
 * into a temporary recovery session automatically, so this page just
 * needs to collect the new password. */
export default function ResetPassword() {
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Your password needs to be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update your password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <FormStep>
        <h1 className="font-display text-3xl leading-[1.05] text-ink">Choose a new password</h1>
        <p className="mt-3 text-[15px] text-ink-soft">Make it something you'll remember.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel>New password</FieldLabel>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              autoFocus
              className={fieldClass}
            />
          </div>
          <div>
            <FieldLabel>Confirm new password</FieldLabel>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              className={fieldClass}
            />
          </div>

          <FormError message={error} />

          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </FormStep>
    </AuthLayout>
  );
}
