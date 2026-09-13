const DAY_MS = 86_400_000;

export function isSameDay(a: number | Date, b: number | Date): boolean {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function startOfDay(t: number | Date): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatDay(t: number): string {
  const now = new Date();
  if (isSameDay(t, now)) return "Today";
  const yesterday = now.getTime() - DAY_MS;
  if (isSameDay(t, yesterday)) return "Yesterday";
  const d = new Date(t);
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}

export function formatTime(t: number): string {
  return new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatFullDate(t: number): string {
  return new Date(t).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function timeOfDayGreeting(t: Date = new Date()): "morning" | "afternoon" | "evening" | "night" {
  const h = t.getHours();
  if (h < 5) return "night";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

/** Count of consecutive days (ending today or yesterday) that have at
 * least one check-in or journal entry timestamp. */
export function currentStreak(timestamps: number[]): number {
  if (!timestamps.length) return 0;
  const days = new Set(timestamps.map((t) => startOfDay(t)));
  let cursor = startOfDay(Date.now());
  if (!days.has(cursor)) {
    cursor -= DAY_MS;
    if (!days.has(cursor)) return 0;
  }
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}
