import type { ReactNode } from "react";

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
        active ? "bg-ink text-paper" : "glass text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
