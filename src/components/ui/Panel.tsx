import type { HTMLAttributes, ReactNode } from "react";

export function Panel({
  children,
  className = "",
  glow = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; glow?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-panel)] border border-mist bg-paper-2/60 ${glow ? "accent-glow" : "panel-shadow"} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
