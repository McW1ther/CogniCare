# CogniCare

A digital emotional wellbeing and self-reflection space, built for students and young
adults dealing with academic pressure, loneliness, stress, and everyday mental fatigue.

> Understanding how you feel is the first step toward understanding yourself.

CogniCare is not a diagnostic tool and makes no medical claims. It's a quiet place to
check in with yourself, write freely, and be met with something steadying — whatever
you're feeling, including the difficult feelings that most "wellness" apps rush past.

## Running it

```bash
npm install
npm run dev       # starts the dev server (Vite prints the local URL)
npm run build     # type-checks and builds a production bundle to dist/
npm run preview   # serves the production build locally
```

You'll need a Supabase project — copy `.env.example` to `.env.local` and fill in your
project's URL and publishable key (Settings → API in the Supabase dashboard), then apply
the schema described in [Backend](#backend) below.

## What's in it

- **Accounts** — email + password, required to use the app (this is a personal journal,
  not a demo). Your name, theme preference, check-ins, diary, and saved quotes all live
  on your account, not just one browser.
- **Emotional check-in** — 20 emotions (not just "good/bad"), each with its own colour
  pair, icon, plain-language description, an acknowledgment that doesn't try to fix or
  dismiss the feeling, a small grounding suggestion, and a tailored journal prompt. The
  current emotion travels with you everywhere via a quick-switch pill in the nav.
- **Diary** — a private, distraction-free writing space. Entries autosave and can be
  tagged with an emotion. An archive view splits entries into **Positive / Mixed /
  Negative**, with a quiet, dismissible content-warning pause before the Negative tab
  rather than a jump-scare popup.
- **Quotes** — ~100 hand-written supportive lines, five per emotion, matched to how that
  specific feeling tends to need to be met rather than generic positivity. Save the ones
  worth keeping; a new one rotates in daily.
- **Dashboard** — a personal landing space: a greeting, your current emotional state, a
  quote for it, recent diary entries, a quiet 7-day pattern strip, and (only if it's
  actually warranted) a gentle, dismissible pointer toward Support.
- **Insights** — a non-clinical look back at your check-in history: a two-week pattern
  grid, which feelings show up most, and a plain timeline. Framed around noticing, not
  diagnosing.
- **Support** — crisis resources (988, Crisis Text Line, an international directory),
  reachable with or without signing in, in the app's own supportive voice.
- **Profile** — change your name, email, password, and pick from a small set of curated
  icon-badge avatars.

## Design approach

The interface deliberately avoids two common traps: looking like a generic SaaS
dashboard, and turning into an overwhelming wall of mood colour. The base UI stays a
quiet "paper and ink" surface (warm paper / soft ink, a fine grain texture, Fraunces for
emotional moments, Manrope for structure); the *currently selected emotion* shows up as
a soft accent — an atmospheric glow behind hero content, a coloured icon badge, a thin
border — built at runtime from each emotion's primary + calming colour pair via CSS
`color-mix`. Colour and motion are concentrated in a few deliberate places (the check-in
grid, quote cards, the week strip) rather than spread across every hover state. Full
dark mode is supported and swaps the same token system rather than being bolted on.

## Backend

Supabase (Postgres + Auth), with four tables — `profiles`, `check_ins`,
`journal_entries`, `saved_quotes` — each owned by `user_id` and locked down with row
level security, plus a trigger that creates a `profiles` row automatically on sign-up.
The emotion and quote catalogues stay as static app code (`src/data/`), never database
rows, since nothing ever needs to query "which emotions exist."

## Tech stack

- **React 19 + TypeScript + Vite**
- **Supabase** (`@supabase/supabase-js`) for auth + data, with RLS as the actual access
  control — the client does optimistic local updates against a Zustand store, then
  persists to Postgres.
- **Tailwind CSS v4** (CSS-first `@theme`/`@utility` config) for the design token system.
- **Zustand** — one store for session/profile (`useAuthStore`), one for content
  (`useStore`, check-ins/diary/saved quotes).
- **React Router v7** for the app shell, auth flow, and onboarding.
- **Framer Motion** for the deliberate motion moments (the check-in grid's stagger, the
  check-in confirmation reveal, quote crossfades, route transitions) — nothing scattered.
- **lucide-react** for iconography.

## Project layout

```
src/
  data/         emotion catalogue, quote bank, avatar catalogue (the editorial content)
  store/        useAuthStore (session/profile) + useStore (check-ins/diary/quotes)
  lib/          date/streak/pattern helpers + the Supabase client
  components/   ui/ (primitives), layout/ (shell, nav), checkin/, quotes/, diary/, auth/
  pages/        one file per route, including pages/auth/
```

## Extending it

- New emotions/quotes: edit `src/data/emotions.ts` / `src/data/quotes.ts` — everything
  else (check-in grid, theming, insights, the diary archive's valence split) reads from
  those two files.
- New avatar options: edit `src/data/avatars.ts`.
- Database changes: apply a migration in Supabase, then update the row↔type mappers in
  `src/store/useAuthStore.ts` / `src/store/useStore.ts` — those are the only places that
  touch the database directly.
