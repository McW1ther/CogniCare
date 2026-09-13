import type { CheckIn } from "../types";
import { getValence } from "../data/emotions";
import { startOfDay, isSameDay } from "./date";

export interface DayEmotion {
  date: number;
  emotionId: string | null;
}

/** Most recent check-in for each of the last `days` days (oldest first). */
export function recentDayEmotions(checkIns: CheckIn[], days = 7): DayEmotion[] {
  const today = startOfDay(Date.now());
  const out: DayEmotion[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = today - i * 86_400_000;
    const match = checkIns.find((c) => isSameDay(c.timestamp, date));
    out.push({ date, emotionId: match?.emotionId ?? null });
  }
  return out;
}

/** How often each emotion was picked, most frequent first. */
export function emotionFrequency(checkIns: CheckIn[]): { emotionId: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of checkIns) counts.set(c.emotionId, (counts.get(c.emotionId) ?? 0) + 1);
  return [...counts.entries()]
    .map(([emotionId, count]) => ({ emotionId, count }))
    .sort((a, b) => b.count - a.count);
}

export function hasCheckedInToday(checkIns: CheckIn[]): boolean {
  return checkIns.some((c) => isSameDay(c.timestamp, Date.now()));
}

/** True when check-ins have skewed "difficult" lately — used only to
 * offer a quiet, dismissible pointer toward Support. Never a popup,
 * never framed as a diagnosis, just a gentle "worth noticing". */
export function recentDifficultRun(checkIns: CheckIn[], withinDays = 7, minCount = 3): boolean {
  const cutoff = Date.now() - withinDays * 86_400_000;
  const recent = checkIns.filter((c) => c.timestamp >= cutoff);
  const difficultCount = recent.filter((c) => getValence(c.emotionId) === "difficult").length;
  return difficultCount >= minCount;
}
