import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "./useAuthStore";
import type { CheckIn, JournalEntry } from "../types";
import { makeId } from "../lib/id";

interface CheckInRow {
  id: string;
  emotion_id: string;
  note: string | null;
  created_at: string;
}

interface JournalRow {
  id: string;
  title: string;
  body: string;
  emotion_id: string | null;
  created_at: string;
  updated_at: string;
}

const checkInFromRow = (r: CheckInRow): CheckIn => ({
  id: r.id,
  emotionId: r.emotion_id,
  timestamp: new Date(r.created_at).getTime(),
  note: r.note ?? undefined,
});

const entryFromRow = (r: JournalRow): JournalEntry => ({
  id: r.id,
  title: r.title,
  body: r.body,
  emotionId: r.emotion_id,
  createdAt: new Date(r.created_at).getTime(),
  updatedAt: new Date(r.updated_at).getTime(),
});

interface DataState {
  checkIns: CheckIn[];
  journalEntries: JournalEntry[];
  savedQuoteIds: string[];
  dataStatus: "idle" | "loading" | "ready";
  syncError: string | null;

  hydrate: (userId: string) => Promise<void>;
  reset: () => void;

  checkIn: (emotionId: string, note?: string) => Promise<void>;
  addEntry: (input: { title: string; body: string; emotionId: string | null }) => string;
  updateEntry: (id: string, patch: Partial<Pick<JournalEntry, "title" | "body" | "emotionId">>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  toggleSaveQuote: (quoteId: string) => Promise<void>;
}

function userId(): string | null {
  return useAuthStore.getState().userId;
}

export const useStore = create<DataState>()((set, get) => ({
  checkIns: [],
  journalEntries: [],
  savedQuoteIds: [],
  dataStatus: "idle",
  syncError: null,

  hydrate: async (uid) => {
    set({ dataStatus: "loading", syncError: null });
    const [checkInsRes, entriesRes, savedRes] = await Promise.all([
      supabase.from("check_ins").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("journal_entries").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("saved_quotes").select("quote_id").eq("user_id", uid),
    ]);

    if (checkInsRes.error || entriesRes.error || savedRes.error) {
      set({
        dataStatus: "ready",
        syncError: "Some of your data couldn't be loaded. Try refreshing.",
      });
      return;
    }

    set({
      checkIns: (checkInsRes.data as CheckInRow[]).map(checkInFromRow),
      journalEntries: (entriesRes.data as JournalRow[]).map(entryFromRow),
      savedQuoteIds: (savedRes.data as { quote_id: string }[]).map((r) => r.quote_id),
      dataStatus: "ready",
    });
  },

  reset: () => set({ checkIns: [], journalEntries: [], savedQuoteIds: [], dataStatus: "idle", syncError: null }),

  checkIn: async (emotionId, note) => {
    const uid = userId();
    if (!uid) return;
    const entry: CheckIn = { id: makeId(), emotionId, timestamp: Date.now(), note };
    set((s) => ({ checkIns: [entry, ...s.checkIns] }));

    const { error } = await supabase.from("check_ins").insert({
      id: entry.id,
      user_id: uid,
      emotion_id: entry.emotionId,
      note: entry.note ?? null,
      created_at: new Date(entry.timestamp).toISOString(),
    });
    if (error) {
      set((s) => ({
        checkIns: s.checkIns.filter((c) => c.id !== entry.id),
        syncError: "That check-in didn't save. Please try again.",
      }));
    }
  },

  addEntry: ({ title, body, emotionId }) => {
    const id = makeId();
    const now = Date.now();
    const entry: JournalEntry = { id, title, body, emotionId, createdAt: now, updatedAt: now };
    set((s) => ({ journalEntries: [entry, ...s.journalEntries] }));

    const uid = userId();
    if (uid) {
      supabase
        .from("journal_entries")
        .insert({
          id,
          user_id: uid,
          title,
          body,
          emotion_id: emotionId,
          created_at: new Date(now).toISOString(),
          updated_at: new Date(now).toISOString(),
        })
        .then(({ error }) => {
          if (error) {
            set((s) => ({
              journalEntries: s.journalEntries.filter((e) => e.id !== id),
              syncError: "That entry didn't save. Please try again.",
            }));
          }
        });
    }
    return id;
  },

  updateEntry: async (id, patch) => {
    const uid = userId();
    if (!uid) return;
    const now = Date.now();
    const previous = get().journalEntries.find((e) => e.id === id);
    set((s) => ({
      journalEntries: s.journalEntries.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: now } : e)),
    }));

    const row: Record<string, unknown> = { updated_at: new Date(now).toISOString() };
    if (patch.title !== undefined) row.title = patch.title;
    if (patch.body !== undefined) row.body = patch.body;
    if (patch.emotionId !== undefined) row.emotion_id = patch.emotionId;

    const { error } = await supabase.from("journal_entries").update(row).eq("id", id).eq("user_id", uid);
    if (error && previous) {
      set((s) => ({
        journalEntries: s.journalEntries.map((e) => (e.id === id ? previous : e)),
        syncError: "That change didn't save. Please try again.",
      }));
    }
  },

  deleteEntry: async (id) => {
    const uid = userId();
    if (!uid) return;
    const previous = get().journalEntries;
    set((s) => ({ journalEntries: s.journalEntries.filter((e) => e.id !== id) }));

    const { error } = await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", uid);
    if (error) {
      set({ journalEntries: previous, syncError: "That entry couldn't be deleted. Please try again." });
    }
  },

  toggleSaveQuote: async (quoteId) => {
    const uid = userId();
    if (!uid) return;
    const wasSaved = get().savedQuoteIds.includes(quoteId);
    set((s) => ({
      savedQuoteIds: wasSaved ? s.savedQuoteIds.filter((q) => q !== quoteId) : [...s.savedQuoteIds, quoteId],
    }));

    const { error } = wasSaved
      ? await supabase.from("saved_quotes").delete().eq("user_id", uid).eq("quote_id", quoteId)
      : await supabase.from("saved_quotes").insert({ user_id: uid, quote_id: quoteId });

    if (error) {
      set((s) => ({
        savedQuoteIds: wasSaved ? [...s.savedQuoteIds, quoteId] : s.savedQuoteIds.filter((q) => q !== quoteId),
        syncError: "That didn't save. Please try again.",
      }));
    }
  },
}));
