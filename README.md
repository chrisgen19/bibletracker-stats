# Selah · Bible Reading Journal

A quiet, free-form way to track Bible reading — log whole chapters or a handful of
verses, then watch your rhythm grow across the week, month and year. No rigid
plans, no guilt: just a journal and a gently-kept streak.

> **Selah** (סֶלָה) — a word in the Psalms meaning *pause and reflect*.

## Design

A bespoke **"Modern Scriptorium"** aesthetic — warm parchment & deep ink with
gold-leaf accents, inspired by illuminated manuscripts but pared down to refined
editorial minimalism.

- **Type** — [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) ·
  [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) (body) ·
  [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (references)
- **Two themes** — *Parchment* (light) and *Vespers* (dark, "reading by
  candlelight"), with a no-flash inline theme script
- **Texture** — film-grain overlay, candle-glow gradients, a flickering streak lamp
- **Layout** — bento grid on the dashboard, a desktop sidebar, and a mobile
  bottom-nav with a raised center "log" action

## Features

- **Free-form logging** — pick any of the 66 books, then whole-chapter ranges
  *or* a verse range, with optional minutes, a mood, and a reflection note
- **Overview dashboard** — current/longest streak, week/month/year toggle,
  per-period stats, a reading-rhythm bar chart, a daily verse, and recent entries
- **Year in light** — a contribution-style heatmap rendered in gold intensity
- **Journal** — entries grouped by day, filterable by period, with delete
- **Scripture map** — Bible coverage rings (whole Bible / OT / NT) and a
  per-book progress map colored by canonical group
- **Local persistence** — entries are saved to `localStorage` (seeded with
  ~7 months of realistic sample data on first run); reset to the sample set
  anytime from the Journal

## Tech

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) · React 19 · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme` tokens)
- [Zustand](https://github.com/pmndrs/zustand) (+ persist) for state
- [Motion](https://motion.dev) for animation · [Lucide](https://lucide.dev) icons ·
  [date-fns](https://date-fns.org)

All data visualizations (rings, bars, heatmap) are hand-built SVG/CSS — no chart
dependency.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint         # eslint
```

## Project structure

```
src/
  app/
    page.tsx          Dashboard / Overview (bento grid)
    log/page.tsx      Log a reading (form + searchable book combobox)
    journal/page.tsx  History timeline grouped by day
    progress/page.tsx Bible coverage map
    layout.tsx        Fonts, theme script, app shell
    globals.css       Design tokens + theme (light/dark)
  components/         App shell, nav, cards, charts, combobox, theme
  lib/
    books.ts          66-book metadata (chapters, verses, group)
    reading.ts        Stats, streaks, periods, coverage, references
    store.ts          Zustand store with localStorage persistence
    mock-data.ts      Deterministic seeded sample history
    types.ts          Shared types
```

The data model is intentionally simple — a `ReadingEntry` records a book, a
chapter (or verse) range, and optional minutes/mood/note. Verse counts are
estimated from each book's average verses-per-chapter (KJV versification).
