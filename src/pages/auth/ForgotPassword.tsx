import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout, FormStep, fieldClass, FieldLabel, FormError } from "../../components/auth/AuthLayout";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";

export default function ForgotPassword() {
  const sendPasswordReset = useAuthStore((s) => s.sendPasswordReset);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send that reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <FormStep>
        {sent ? (
          <>
            <h1 className="font-display text-3xl leading-[1.05] text-ink">Check your inbox</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              If <strong className="font-medium text-ink">{email}</strong> has an account, a
              password reset link is on its way.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl leading-[1.05] text-ink">Reset your password</h1>
            <p className="mt-3 text-[15px] text-ink-soft">
              We'll email you a link to choose a new one.
            </p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <div>
                <FieldLabel>Email</FieldLabel>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  autoFocus
                  className={fieldClass}
                />
              </div>

              <FormError message={error} />

              <Button type="submit" variant="primary" disabled={loading} className="w-full">
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link to="/sign-in" className="text-ink underline decoration-hairline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </FormStep>
    </AuthLayout>
  );
}
