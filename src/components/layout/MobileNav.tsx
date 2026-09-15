import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navConfig";
import { tourRef } from "../../store/useTourStore";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-full glass panel-shadow md:hidden">
      <div className="flex items-stretch justify-between px-2 py-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, tourKey }) => (
          <NavLink
            key={to}
            ref={tourKey ? tourRef(tourKey) : undefined}
            to={to}
            end={end}
            className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-ink-soft"
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={
                    isActive
                      ? { background: "color-mix(in srgb, var(--accent) 22%, white)" }
                      : undefined
                  }
                >
                  <Icon
                    size={18}
                    strokeWidth={1.75}
                    style={isActive ? { color: "var(--accent)" } : undefined}
                  />
                </span>
                <span style={isActive ? { color: "var(--color-ink)" } : undefined}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
