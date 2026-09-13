import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { AVATAR_OPTIONS } from "../data/avatars";
import { PageContainer } from "../components/layout/PageContainer";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { AvatarBadge } from "../components/ui/AvatarBadge";
import { fieldClass, FieldLabel, FormError } from "../components/auth/AuthLayout";

export default function Profile() {
  const profile = useAuthStore((s) => s.profile);
  const email = useAuthStore((s) => s.email);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updateEmail = useAuthStore((s) => s.updateEmail);
  const updatePassword = useAuthStore((s) => s.updatePassword);

  return (
    <PageContainer>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink-soft">
        <ArrowLeft size={15} />
        Back
      </Link>

      <p className="mt-6 text-sm text-ink-faint">Your profile</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink">Make this space yours</h1>

      <div className="mt-8 space-y-6">
        <Panel className="p-6">
          <h2 className="text-[15px] font-medium text-ink">Profile picture</h2>
          <p className="mt-1 text-sm text-ink-soft">Pick whichever feels like you.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {AVATAR_OPTIONS.map((a) => {
              const selected = profile?.avatarId === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => updateProfile({ avatarId: a.id })}
                  aria-pressed={selected}
                  aria-label={`Use the ${a.id} avatar`}
                  className="rounded-full p-0.5 transition-shadow"
                  style={selected ? { boxShadow: `0 0 0 2px ${a.color}` } : undefined}
                >
                  <AvatarBadge avatarId={a.id} size="lg" />
                </button>
              );
            })}
          </div>
        </Panel>

        <NameSection displayName={profile?.displayName ?? ""} onSave={(name) => updateProfile({ displayName: name })} />
        <EmailSection currentEmail={email} onSave={updateEmail} />
        <PasswordSection onSave={updatePassword} />
      </div>
    </PageContainer>
  );
}

function NameSection({ displayName, onSave }: { displayName: string; onSave: (name: string) => Promise<void> }) {
  const [name, setName] = useState(displayName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    await onSave(name.trim());
    setStatus("saved");
  }

  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-medium text-ink">Name</h2>
      <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
        <div className="flex-1 min-w-[200px]">
          <FieldLabel>What should Orbis call you?</FieldLabel>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStatus("idle");
            }}
            className={fieldClass}
          />
        </div>
        <Button type="submit" variant="secondary" disabled={status === "saving"}>
          {status === "saved" ? "Saved" : "Save"}
        </Button>
      </form>
    </Panel>
  );
}

function EmailSection({
  currentEmail,
  onSave,
}: {
  currentEmail: string | null;
  onSave: (email: string) => Promise<void>;
}) {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSave(newEmail);
      setSent(true);
      setNewEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update your email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-medium text-ink">Email</h2>
      <p className="mt-1 text-sm text-ink-soft">Currently {currentEmail ?? "unknown"}.</p>
      {sent ? (
        <p className="mt-4 text-sm text-ink-soft">
          Check both your old and new inbox for confirmation links — the change takes effect once
          you've confirmed.
        </p>
      ) : (
        <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
          <div className="flex-1 min-w-[200px]">
            <FieldLabel>New email</FieldLabel>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
          <Button type="submit" variant="secondary" disabled={loading}>
            {loading ? "Sending…" : "Update email"}
          </Button>
        </form>
      )}
      <FormError message={error} />
    </Panel>
  );
}

function PasswordSection({ onSave }: { onSave: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("idle");

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
      await onSave(password);
      setPassword("");
      setConfirm("");
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-medium text-ink">Password</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[160px]">
            <FieldLabel>New password</FieldLabel>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FieldLabel>Confirm</FieldLabel>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>
        </div>
        <Button type="submit" variant="secondary" disabled={loading}>
          {status === "saved" ? "Password updated" : loading ? "Updating…" : "Update password"}
        </Button>
        <FormError message={error} />
      </form>
    </Panel>
  );
}
