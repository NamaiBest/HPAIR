# 🏆 READY Hub · VietHope

### 🥇 Impact Challenge Winners (2026) · Hanoi, Vietnam
**The Harvard College Project for Asian and International Relations (HPAIR)**

---

## 🚀 Live Interactive Demo

# [👉 **LAUNCH READY HUB LIVE WEBSITE** 👈](https://namaibest.github.io/HPAIR/)
> **Live URL:** [https://namaibest.github.io/HPAIR/](https://namaibest.github.io/HPAIR/)

---

## 🌟 About READY Hub

**READY Hub** is VietHope's curated gateway to digital-skills courses for university students across the Mekong region. It features a transparent, deterministic **Multi-Criteria Decision Scoring Model (V-Score)** that indexes, rates, and personalizes thousands of online learning resources for students.

See [`ready-hub/README.md`](ready-hub/README.md) for the complete demo walkthrough, technical architecture, and scoring model breakdown.

### Run it locally

```bash
cd ready-hub
npm install
npm run dev      # http://localhost:5173
```

### Deployment

Pushing to `main` builds `ready-hub` and publishes it to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## 🎨 Typography & Design System (Presentation Reference)

READY Hub uses a curated 3-tier typography system imported via Google Fonts, designed to balance high editorial personality, crisp screen legibility, and tabular mathematical precision.

### Font System Overview

| Role | Font Family | Variable / Token | Weights Loaded | Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headings** | **[Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque)** | `--font-display`<br>`font-display` | `400`, `500`, `600`, `700`, `800`<br>(Optical sizing `12..96`) | Main titles (`h1`, `h2`, `h3`), hero display typography, certificate names, and section headers |
| **Interface / Body** | **[Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)** | `--font-sans`<br>`font-sans` | `400` (+ Italic), `500`, `600`, `700` | Default body copy (`p`), navigation, buttons, filter chips, dropdowns, and course descriptions |
| **Metrics / Data** | **[IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)** | `--font-mono`<br>`font-mono` | `400`, `500`, `600` | READY Scores (`9.6/10`), factor percentages, slider values, duration badges, and tabular data |

---

### Font Details & Presentation Talking Points

#### 1. Bricolage Grotesque (Display & Headlines)
* **Designer / Foundry**: Mathieu Triay
* **Fallback Stack**: `"Trebuchet MS", sans-serif`
* **Why it was chosen**:
  * **Expressive & Modern**: Blends traditional British eccentric sans-serifs with contemporary grotesque styles, giving VietHope's portal an energetic, memorable editorial identity rather than a generic tech feel.
  * **Variable Optical Sizing (`opsz 12..96`)**: Adjusts letterforms dynamically depending on header scale to retain readability and personality at both large hero scales and mid-sized card headers.
  * **Paired with `text-wrap: balance`**: Prevents awkward single-word wraps on headlines across varied screen widths.

#### 2. Instrument Sans (Body & UI Components)
* **Designer / Foundry**: Instrument / Rodrigo Fuenzalida & Jordan Bell
* **Fallback Stack**: `ui-sans-serif, system-ui, sans-serif`
* **Why it was chosen**:
  * **Optimized for Digital Interfaces**: Geometric neo-grotesque designed specifically for screen readability, clean navigation hierarchy, and interactive states.
  * **Subtle Warmth & Clean Geometry**: Pairs seamlessly with Bricolage Grotesque without competing for visual attention.
  * **Paired with `text-wrap: pretty`**: Avoids typographic orphans on paragraph copy and course descriptions.

#### 3. IBM Plex Mono (READY Scores & Dynamic Metrics)
* **Designer / Foundry**: Mike Abbink / Bold Monday (IBM)
* **Fallback Stack**: `ui-monospace, monospace`
* **Why it was chosen**:
  * **Tabular Rhythm**: Provides fixed-width glyphs so that numbers do not jitter or shift layout when weights and scores recompute live as sliders move.
  * **Credibility & Precision**: Gives the READY scoring algorithm and factor breakdown (Relevance, Engagement, Density, Currency) an engineered, institutional feel.
  * **Paired with `font-variant-numeric: tabular-nums`**: Standardizes digit widths across all numeric data displays.

---

### Technical Implementation

* **Google Fonts Import** (`ready-hub/src/index.css`):
  ```css
  @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap");
  ```
* **Tailwind v4 Theme Tokens**:
  ```css
  @theme {
    --font-display: "Bricolage Grotesque", "Trebuchet MS", sans-serif;
    --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
    --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  }
  ```
* **Color Palette Alignment**:
  * Ink: `#06272c`, `#0c3a41`, `#11525b`
  * Brand Highlights: VietHope Flow Cyan (`#14bdd0`), Leaf Green (`#9dc73c`), Deep Teal (`#008081`)
  * Background Paper: `#f7fafa`

---

### 🎙️ Presentation Cheat-Sheet (30-Second Summary)

> *"We built READY Hub with a purpose-driven 3-tier font system:*
> 1. * **Bricolage Grotesque** for headlines, giving our mission high visual personality and editorial warmth.*
> 2. * **Instrument Sans** for interface and body copy, ensuring high readability and clean UI interactions.*
> 3. * **IBM Plex Mono** with tabular numerals for READY Scores, ensuring that as users adjust weights in real-time, the data displays with jitter-free mathematical precision."*

