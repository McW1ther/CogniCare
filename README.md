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

Everything is stored locally in the browser (`localStorage`) — there's no backend, no
account, and nothing leaves the device.

## What's in it

- **Emotional check-in** — 20 emotions (not just "good/bad"), each with its own colour
  pair, icon, plain-language description, an acknowledgment that doesn't try to fix or
  dismiss the feeling, a small grounding suggestion, and a tailored journal prompt. The
  current emotion travels with you everywhere via a quick-switch pill in the nav — you're
  never more than one click from re-checking in.
- **Diary** — a private, distraction-free writing space. Entries autosave, can be tagged
  with an emotion (defaulting to whatever you last checked in as), and are searchable.
- **Quotes** — ~100 hand-written supportive lines, five per emotion, matched to how that
  specific feeling tends to need to be met rather than generic positivity. Save the ones
  worth keeping; a new one rotates in daily.
- **Dashboard** — a personal landing space: a greeting, your current emotional state, a
  quote for it, recent diary entries, and a quiet 7-day pattern strip.
- **Insights** — a non-clinical look back at your check-in history: a two-week pattern
  grid, which feelings show up most, and a plain timeline. Framed around noticing, not
  diagnosing.

## Design approach

The interface deliberately avoids two common traps: looking like a generic SaaS
dashboard, and turning into an overwhelming wall of mood colour. The base UI stays a
quiet "paper and ink" surface (warm paper / soft ink, Fraunces for emotional moments,
Manrope for structure); the *currently selected emotion* only ever shows up as a soft
accent — a blurred light wash behind hero content, a coloured icon, a thin border glow —
built at runtime from each emotion's primary + calming colour pair via CSS `color-mix`.
Full dark mode is supported and swaps the same token system rather than being bolted on.

## Tech stack

- **React 19 + TypeScript + Vite** — standard, fast, no backend needed for a
  local-first product like this.
- **Tailwind CSS v4** (CSS-first `@theme`/`@utility` config) for the design token system.
- **Zustand** (`persist` middleware) for state — one small store holding the emotion
  catalogue selection, check-in history, journal entries, and saved quotes, all synced to
  `localStorage`.
- **React Router v7** for the five-section app shell (Home, Check in, Diary, Quotes,
  Insights) plus the onboarding flow.
- **Framer Motion** for the handful of deliberate motion moments (onboarding steps, the
  check-in confirmation panel, modals) — nothing decorative or scattered.
- **lucide-react** for iconography.

## Project layout

```
src/
  data/         emotion catalogue + quote bank (the editorial content)
  store/        the single persisted Zustand store
  lib/          date/streak/pattern helpers
  components/   ui/ (primitives), layout/ (shell, nav), checkin/, quotes/
  pages/        one file per route
```

## Extending it

- New emotions/quotes: edit `src/data/emotions.ts` / `src/data/quotes.ts` — everything
  else (check-in grid, theming, insights) reads from those two files.
- Swapping local storage for a real backend: the Zustand store in `src/store/useStore.ts`
  is the only place that would need to change (e.g. swap `persist` for API calls) —
  nothing else touches storage directly.
