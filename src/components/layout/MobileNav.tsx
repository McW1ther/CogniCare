import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navConfig";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-paper/95 backdrop-blur md:hidden">
      <div className="flex items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-ink-soft"
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  strokeWidth={1.75}
                  style={isActive ? { color: "var(--accent)" } : undefined}
                />
                <span style={isActive ? { color: "var(--color-ink)" } : undefined}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
