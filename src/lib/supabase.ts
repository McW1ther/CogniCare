import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "Missing Supabase env vars — copy .env.example to .env.local and fill in your project's URL and publishable key.",
  );
}

export const supabase = createClient(url, publishableKey);
