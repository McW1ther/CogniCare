import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useStore } from "./useStore";
import type { AuthStatus, Profile, ThemeMode } from "../types";

interface ProfileRow {
  id: string;
  display_name: string | null;
  theme_mode: ThemeMode;
  onboarded: boolean;
  diary_difficult_ack: boolean;
  avatar_id: string | null;
}

function fromRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    themeMode: row.theme_mode,
    onboarded: row.onboarded,
    diaryDifficultAck: row.diary_difficult_ack,
    avatarId: row.avatar_id,
  };
}

interface AuthState {
  status: AuthStatus;
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  authError: string | null;

  init: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updateProfile: (
    patch: Partial<Pick<Profile, "displayName" | "themeMode" | "onboarded" | "diaryDifficultAck" | "avatarId">>,
  ) => Promise<void>;
}

let initialized = false;

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !data) return null;
  return fromRow(data as ProfileRow);
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "loading",
  userId: null,
  email: null,
  profile: null,
  authError: null,

  init: async () => {
    if (initialized) return;
    initialized = true;

    const applySession = async (userId: string | null, email: string | null) => {
      if (!userId) {
        set({ status: "signedOut", userId: null, email: null, profile: null });
        useStore.getState().reset();
        return;
      }
      const profile = await loadProfile(userId);
      set({ status: "signedIn", userId, email, profile });
      useStore.getState().hydrate(userId);
    };

    const {
      data: { session },
    } = await supabase.auth.getSession();
    await applySession(session?.user.id ?? null, session?.user.email ?? null);

    supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user.id ?? null, session?.user.email ?? null);
    });
  },

  signUp: async (email, password, displayName) => {
    set({ authError: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) {
      set({ authError: error.message });
      throw error;
    }
    // If email confirmation is required, Supabase returns a user but no session.
    return { needsEmailConfirmation: !data.session };
  },

  signIn: async (email, password) => {
    set({ authError: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ authError: error.message });
      throw error;
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  sendPasswordReset: async (email) => {
    set({ authError: null });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      set({ authError: error.message });
      throw error;
    }
  },

  updatePassword: async (newPassword) => {
    set({ authError: null });
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      set({ authError: error.message });
      throw error;
    }
  },

  updateEmail: async (newEmail) => {
    set({ authError: null });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      set({ authError: error.message });
      throw error;
    }
    // The address doesn't actually change until the confirmation
    // link(s) are clicked — onAuthStateChange picks up the new email
    // automatically once that happens, nothing to set here now.
  },

  updateProfile: async (patch) => {
    const { userId, profile } = get();
    if (!userId || !profile) return;
    const next = { ...profile, ...patch };
    set({ profile: next });

    const row: Partial<ProfileRow> = {};
    if (patch.displayName !== undefined) row.display_name = patch.displayName;
    if (patch.themeMode !== undefined) row.theme_mode = patch.themeMode;
    if (patch.onboarded !== undefined) row.onboarded = patch.onboarded;
    if (patch.diaryDifficultAck !== undefined) row.diary_difficult_ack = patch.diaryDifficultAck;
    if (patch.avatarId !== undefined) row.avatar_id = patch.avatarId;

    const { error } = await supabase.from("profiles").update(row).eq("id", userId);
    if (error) {
      // Roll back optimistic update on failure.
      set({ profile });
    }
  },
}));
