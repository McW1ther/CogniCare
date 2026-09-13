import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, FormStep, fieldClass, FieldLabel, FormError } from "../../components/auth/AuthLayout";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignIn() {
  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <FormStep>
        <h1 className="font-display text-3xl leading-[1.05] text-ink">Welcome back</h1>
        <p className="mt-3 text-[15px] text-ink-soft">Continue where you left off.</p>

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
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <FieldLabel>Password</FieldLabel>
              <Link to="/forgot-password" className="text-sm text-ink-faint hover:text-ink-soft">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={fieldClass}
            />
          </div>

          <FormError message={error} />

          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link to="/sign-up" className="text-ink underline decoration-mist-strong underline-offset-4">
            Create a space
          </Link>
        </p>
      </FormStep>
    </AuthLayout>
  );
}
