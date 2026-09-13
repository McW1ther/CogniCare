import { useStore } from "./useStore";

/** The most recent check-in — checkIns is always kept newest-first,
 * so this is "the current emotion" without a separate field to keep
 * in sync. Returns null if the person hasn't checked in yet. */
export function useCurrentCheckIn() {
  return useStore((s) => s.checkIns[0] ?? null);
}
