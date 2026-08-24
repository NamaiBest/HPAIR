# 🏆 READY Hub · VietHope

### 🥇 Impact Challenge Winners (2026) · Hanoi, Vietnam
**The Harvard College Project for Asian and International Relations (HPAIR)**

---

## 🚀 Live Demo: [https://namaibest.github.io/HPAIR/](https://namaibest.github.io/HPAIR/)

A clickable, production-ready demo of READY Hub, VietHope's curated gateway to digital-skills
courses for university students across the Mekong region.

Frontend only. All data is seeded locally, progress is kept in `localStorage`,
and there is no auth, backend, database, or network call to any learning platform.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

For the pitch, prefer the production build. It starts instantly and does not
recompile mid-demo:

```bash
npm run build && npm run preview
```

## The 90-second demo path

1. **Onboarding**: pick Vietnam, any institution, Finance, Beginner,
   "Move into a technical role". Three steps, visible progress.
2. **Catalogue**: 16 courses ranked for that profile. Each card carries a
   READY Score out of 10 and one line saying why *this* learner got *this* course.
3. **The moment to slow down for.** Drag **Engagement** to 100 and the others to 0.
   Every score recomputes and the list re-sorts, animated. The top of the list goes
   from Git/Python/AI to Canva/communication/design. Drag **Density** up instead and
   "Artificial Intelligence with Python" climbs from last place to first.
4. **Why this score?** opens the breakdown: a radar of the four raw factors, and
   each factor's live contribution in points. The weight panel and a running
   leaderboard sit alongside, so the reordering is visible while you drag.
5. **Start this course**: real lectures play, embedded from the source platform.
6. **Mark all lectures complete → Claim your certificate**: dual certificate plus
   the opportunity ladder.

Use the **"Editing as Finance · Beginner · Vietnam"** chip to switch profile.
Flipping Finance → Engineering visibly reorders the catalogue.

## The scoring model

All of it is in [`src/lib/score.ts`](src/lib/score.ts). Open it if anyone asks.
It is pure and deterministic: no randomness, no dates, no hidden state.

Every course is rated 0 to 10 on four factors:

| Factor | What it measures |
| --- | --- |
| Relevance | Match to what regional employers are hiring for |
| Engagement | Whether the delivery is sustainable to sit through |
| Density | How much you learn per minute, filler stripped out |
| Currency | How recently updated, against how fast the topic decays |

The learner's weights are normalised to sum to 1, then applied. A separate
**fit adjustment** (`fitAdjustment`) moves a score by at most ±1.2 points based on
field, level, language and goal. That is enough to change the ranking, never enough to
overwhelm the quality signal.

Rounding happens once, in `finalScore`, so a course can never read 9.6 on the card
and 9.7 on the certificate.

## What is real and what is mocked

**Real:** the VietHope logo and photography (pulled from viethope.org), the brand
palette (sampled from the logo: `#14BDD0`, `#9DC73C`, `#008081`), the platform
brand marks, every embedded lecture video, and all four case statistics with their
sources.

**Mocked:** course metadata, the four factor ratings, certificate IDs, and the
placement listings. No partnership with any platform is claimed or implied.

## Data collected

Country, institution, field of study, level, goal, language. Nothing else: no
date of birth, no ethnicity, no name. This is deliberate.

## Layout

```
┌───────────────────────────────────────────┬──────────────────┐
│ header: brand · search · "Editing as …"   │                  │
│ platform strip: All · Coursera · Udemy …  │                  │
├───────────────────────────────────────────┤   weight panel   │
│ filters: language · length · min score    │   ───────────    │
│                                           │   presets        │
│  ┌──────┬──────────────────────────────┐  │   Relevance  ▓▓░ │
│  │ thumb│ platform · field · level      │  │   Engagement ▓▓░ │
│  │      │ Title                   9.6/10│  │   Density    ▓▓░ │
│  │      │ why you got this  ▓▓▓▓░░      │  │   Currency   ▓▓░ │
│  └──────┴──────────────────────────────┘  │                  │
│  … list re-sorts live as weights move …   │   leaderboard    │
└───────────────────────────────────────────┴──────────────────┘
```

The score is the one place the interface raises its voice. The numeral counts
rather than snapping, and the bar beneath it is not decoration. Each segment is
that factor's actual contribution in points, so when a weight moves you can see
which factor moved the score.

## Screenshots

```bash
npm run dev &
node scripts/shots.mjs   # writes to /tmp/shots
```

## Stack

React 18 · Vite · TypeScript · Tailwind 4 · Motion · Recharts · Playwright (review only)
