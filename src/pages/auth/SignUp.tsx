import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, FormStep, fieldClass, FieldLabel, FormError } from "../../components/auth/AuthLayout";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignUp() {
  const signUp = useAuthStore((s) => s.signUp);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

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
      const { needsEmailConfirmation } = await signUp(email, password, displayName.trim());
      if (needsEmailConfirmation) {
        setCheckEmail(true);
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong creating your account.");
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <AuthLayout>
        <FormStep>
          <h1 className="font-display text-3xl leading-[1.05] text-ink">Check your inbox</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            We've sent a confirmation link to <strong className="font-medium text-ink">{email}</strong>.
            Open it to finish setting up your space — you can close this tab.
          </p>
        </FormStep>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <FormStep>
        <h1 className="font-display text-3xl leading-[1.05] text-ink">Create your space</h1>
        <p className="mt-3 text-[15px] text-ink-soft">
          A private account for your check-ins, diary, and saved quotes.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel>Your first name</FieldLabel>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Asha"
              autoComplete="given-name"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <FieldLabel>Confirm password</FieldLabel>
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
            {loading ? "Creating your space…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have a space?{" "}
          <Link to="/sign-in" className="text-ink underline decoration-hairline underline-offset-4">
            Sign in
          </Link>
        </p>
      </FormStep>
    </AuthLayout>
  );
}
