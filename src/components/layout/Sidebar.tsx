import { NavLink, Link } from "react-router-dom";
import { LifeBuoy, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./navConfig";
import { EmotionPill } from "./EmotionPill";
import { ThemeToggle } from "./ThemeToggle";
import { AvatarBadge } from "../ui/AvatarBadge";
import { useAuthStore } from "../../store/useAuthStore";

export function Sidebar() {
  const name = useAuthStore((s) => s.profile?.displayName);
  const avatarId = useAuthStore((s) => s.profile?.avatarId);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-mist px-5 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="brand-dot h-2.5 w-2.5 rounded-full accent-dot" />
        <span className="font-display text-lg text-ink">CogniCare</span>
      </div>

      <Link
        to="/profile"
        className="mt-4 flex items-center gap-2.5 rounded-full px-2 py-1.5 hover:bg-paper-2"
      >
        <AvatarBadge avatarId={avatarId} size="sm" />
        <span className="truncate text-sm text-ink-soft">{name ? `Hi, ${name}` : "Your profile"}</span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-full px-3 py-2.5 text-[15px] transition-colors ${
                isActive ? "text-ink" : "text-ink-soft hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={
                    isActive
                      ? { background: "color-mix(in srgb, var(--accent) 16%, var(--color-paper))" }
                      : undefined
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.75}
                    style={isActive ? { color: "var(--accent)" } : undefined}
                  />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 space-y-3 border-t border-mist pt-5">
        <EmotionPill full />
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-ink-faint">Appearance</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between px-1 pt-1 text-sm">
          <Link
            to="/support"
            className="inline-flex items-center gap-1.5 text-ink-faint hover:text-ink-soft"
          >
            <LifeBuoy size={14} />
            Support
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 text-ink-faint hover:text-ink-soft"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
