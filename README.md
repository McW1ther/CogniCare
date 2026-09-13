<div align="center">

# 🧠 CogniCare

### A quiet digital space for emotional check-ins, journaling, and self-reflection

*Understanding how you feel is the first step toward understanding yourself.*

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-EF0055?logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/status-personal%20project-8A8577)

</div>

---

## 🚀 Overview

Most "wellness" apps rush straight to positivity — a quote, a breathing GIF, "just smile."
CogniCare doesn't. It's built for students and young adults dealing with academic
pressure, loneliness, stress, and everyday mental fatigue, on the idea that **difficult
feelings deserve to be acknowledged, not managed away.**

It isn't a diagnostic tool and makes no medical claims — just a private, judgment-free
place to notice how you feel, write about it, and be met with something steadying.

---

## ✨ Features

- 🎭 **20-emotion check-in** — not just "good/bad." Each emotion carries its own colour
  pair, an acknowledgment that doesn't try to fix or dismiss the feeling, a small
  grounding suggestion, and a tailored journal prompt.
- 🔐 **Real accounts** — email + password via Supabase Auth. Your check-ins, diary, and
  preferences live on your account, not just one browser.
- 📓 **Private diary** — autosaving, emotion-tagged entries, archived into
  **Positive / Mixed / Negative** — with a quiet, dismissible content-warning pause
  before Negative rather than a jump-scare popup.
- 💬 **~100 hand-written supportive quotes** — five per emotion, matched to how that
  specific feeling actually needs to be met, not generic positivity. Save the ones worth
  keeping.
- 🏠 **A real dashboard** — greeting, current emotional state, today's quote, recent
  entries, a 7-day pattern strip, and (only if genuinely warranted) a gentle nudge
  toward Support.
- 📊 **Insights, not analytics** — a two-week pattern grid and a plain timeline, framed
  around noticing, never diagnosing.
- 🆘 **Crisis resources** — reachable with or without signing in, in the app's own
  supportive voice, never clinical.
- 🎨 **A profile that's actually yours** — name, email, password, and a pick from ten
  curated icon-badge avatars.

---

## 🎨 Design Philosophy

CogniCare deliberately avoids two traps: looking like a generic SaaS dashboard, and
turning into an overwhelming wall of mood colour.

The base UI stays a quiet **paper-and-ink** surface — warm paper, soft ink, a fine grain
texture, Fraunces serif for emotional moments, Manrope sans for structure. The
*currently selected emotion* only ever shows up as a soft accent — an atmospheric glow,
a coloured icon badge, a thin border — built at runtime from each emotion's colour pair
via CSS `color-mix()`. Colour and motion are concentrated in a few deliberate places
(the check-in grid, quote cards, the week strip) instead of spread across every hover
state. Full dark mode swaps the same token system rather than being bolted on.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (CSS-first `@theme` / `@utility` design tokens)
- Zustand — `useAuthStore` (session/profile) + `useStore` (check-ins/diary/quotes)
- React Router v7
- Framer Motion — a handful of deliberate motion moments, nothing scattered
- lucide-react

**Backend**
- Supabase — Postgres + Auth, with **Row Level Security as the actual access control**
- Optimistic client-side updates, persisted to Postgres in the background

**Deployment**
- Vercel, auto-deploying from `main` on every push

---

## 🗄️ Backend

Four tables — `profiles`, `check_ins`, `journal_entries`, `saved_quotes` — each owned by
`user_id` and locked down with RLS, plus a trigger that creates a `profiles` row
automatically on sign-up. The emotion, quote, and avatar catalogues stay as static app
code (`src/data/`), never database rows — nothing ever needs to query "which emotions
exist."

---

## 📂 Project Structure

```
src/
├── data/         emotion catalogue, quote bank, avatar catalogue — the editorial content
├── store/        useAuthStore (session/profile) + useStore (check-ins/diary/quotes)
├── lib/          date/streak/pattern helpers + the Supabase client
├── components/
│   ├── ui/       Button, Panel, Modal, EmotionIcon, AvatarBadge…
│   ├── layout/   app shell, sidebar, nav
│   ├── checkin/  the emotion grid + quick-switcher
│   ├── diary/    the difficult-tab content-warning gate
│   └── auth/     shared auth-page shell
└── pages/        one file per route, including pages/auth/
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/McW1ther/cognicare.git
cd cognicare
npm install
```

Create a Supabase project, then copy the env template and fill in your project's URL +
publishable key (Settings → API in the Supabase dashboard):

```bash
cp .env.example .env.local
```

```bash
npm run dev       # start the dev server
npm run build     # type-check + production build
npm run preview   # serve the production build locally
```

---

## 🔮 Roadmap

- [ ] Dynamic-import code-splitting (bundle's grown past 500 KB with Supabase JS in it)
- [ ] A real account-settings page for data export / deletion (currently a support-email
      line on `/support`)
- [ ] Optional region-aware crisis resources on the Support page

---

## 💡 Vision

CogniCare exists on one idea: **you don't have to feel better before you're allowed to
feel understood.** No streaks to protect, no score to keep — checking in honestly, even
once, is enough.

