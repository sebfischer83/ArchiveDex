# ArchiveDex — UI Philosophy

**Status**: Design guidance (to be implemented) · **Date**: 2026-06-17
**Scope**: Visual and interaction philosophy for the Blazor Web App UI.
**Companions**: [design-system.md](./design-system.md) · [component-guidelines.md](./component-guidelines.md)

---

## 1. The one sentence

> **ArchiveDex feels like a clean, well-lit display case: the cards are the
> heroes, the interface gets out of the way.**

Everything below serves that sentence. When a decision is unclear, choose the
option that makes the collection more visible and the chrome less visible.

---

## 2. Design intent: "modern and light"

The product brief asks for an interface that feels **modern and light**. We
translate that into concrete, testable commitments rather than mood words.

| Brief word | What it means here | How it shows up |
|------------|-------------------|-----------------|
| **Modern** | Current, calm, content-first. Not skeuomorphic, not trend-chasing. | Generous whitespace, soft neutral surfaces, a single restrained accent, system-native type. |
| **Light** | Visually light (airy, low ink) **and** light to use (low friction, fast). | High background-to-content ratio, few borders, motion under 200 ms, ≤ 3 taps to any core action. |

"Light" is the load-bearing word. It governs both *how it looks* (airy) and
*how it feels* (effortless). We optimize both.

---

## 3. Core principles

### P1 — Cards are the hero, UI is the frame
The card image is the brightest, most saturated thing on any screen. Chrome
(nav, toolbars, labels) stays neutral and quiet so card art carries the color.
Never let a button compete with a Charizard for attention.

### P2 — Light by default, calm by structure
Default theme is light: near-white surfaces, soft shadows instead of hard
borders, ink kept to a minimum. Structure comes from **spacing and elevation**,
not from lines and boxes. A dark theme is a first-class option (see P8), not an
afterthought — but the design language is authored light-first.

### P3 — One accent, used sparingly
A single accent color signals interactivity and the primary action on a screen.
If everything is accented, nothing is. Reserve it for the *one* thing the user
most likely wants next. Status colors (success/warn/error) are functional, not
decorative.

### P4 — Whitespace is a feature, not waste
Air around content is intentional. Crowding is the enemy of "light." Prefer
fewer items with more room over dense grids. Let the collection breathe.

### P5 — Speed is part of the look
Perceived performance is a visual property. Skeletons over spinners, optimistic
UI where safe, instant feedback on every tap. The performance budgets in the
constitution (search < 2 s, scan flow < 60 s) are UX requirements, not just
engineering ones. A slow light UI is not light.

### P6 — Mobile scanning is the proving ground
The scanner is used one-handed, on a phone, possibly at a flea market in bad
light. If a pattern works there — thumb-reachable, glanceable, forgiving — it
works everywhere. Design the hard case first, then scale up to desktop.

### P7 — Honest, gentle feedback
Every action confirms itself. Errors say what failed, why, and the next step
(constitution Principle III). Tone is calm and human, never blaming. OCR is
probabilistic — present matches as *suggestions to confirm*, never as facts to
fight.

### P8 — Consistency you can build muscle memory on
The same action looks and behaves the same everywhere. One button hierarchy, one
card component, one way to show a list, one empty-state pattern. Predictability
is what makes a tool feel light to a returning user.

### P9 — Accessible is non-negotiable
Light visuals must never cost contrast. All text meets WCAG AA (4.5:1 body,
3:1 large). Full keyboard reachability, visible focus rings, honored
`prefers-reduced-motion` and `prefers-color-scheme`, touch targets ≥ 44 px.
Accessibility is a constraint on the aesthetic, not a tradeoff against it.

### P10 — Language-neutral layout
UI cultures (de/en/ru) and card languages (de/en/ja/ko/zh-Hans/zh-Hant) are
independent. Layout must survive German compound words (long), Russian
(wider), and CJK card text (different metrics) without breaking. Never bake
text into images; never hardcode widths to a single language.

---

## 4. Personality

If ArchiveDex were a person: a **knowledgeable, tidy curator**. Quietly
competent, never loud. Helps you find things, remembers where everything is,
doesn't lecture. Speaks plainly. The opposite of a noisy marketplace or a
gamified app with badges and confetti.

**We embrace**: calm, clarity, craft, focus, restraint.
**We avoid**: clutter, novelty for its own sake, gamification, dark patterns,
hard sells, visual noise.

---

## 5. The signature moments

These three flows define the product. They get the most polish.

1. **The first scan** — the wizard hands off to the scanner; the first card a
   user captures and confirms must feel magical and effortless. This is the
   moment that earns trust.
2. **Browsing the collection** — the grid of card art is the home a user
   returns to. It should feel like opening a binder: pleasurable, fast,
   yours.
3. **Confirming an OCR match** — the human-in-the-loop step. Big imagery, clear
   confidence ranking, one obvious "yes this one." Correcting a wrong guess must
   be as easy as accepting a right one.

---

## 6. What success looks like (testable)

This philosophy is met when:

- A new user completes their first scan-to-collection in under 60 s without
  reading instructions (ties to SC-005).
- Every screen has a single, obvious primary action.
- No screen needs a horizontal scroll on a 360 px-wide phone in any UI culture.
- The collection grid renders perceptibly instantly (skeleton < 100 ms, content
  within search budget).
- Switching to dark theme changes nothing about layout or behavior — only
  surface.
- A colorblind user and a keyboard-only user can do everything a mouse user can.

---

## 7. Anti-goals (what we will not do)

- No dense, spreadsheet-first default view. (A power table is an *option*, not
  the home.)
- No more than one accent color in the palette.
- No decorative illustration that competes with card art.
- No motion over ~250 ms; no motion that blocks input.
- No gamification, streaks, badges, or confetti.
- No modal stacking; no dialog that opens another dialog.
- No text baked into images (breaks localization and accessibility).
- No feature that only works with a mouse.

---

## 8. How to use these docs

- **This file** = the *why* and the *rules of taste*. Read first.
- **[design-system.md](./design-system.md)** = the *what*: tokens, color, type,
  spacing, elevation, motion — the concrete values to implement.
- **[component-guidelines.md](./component-guidelines.md)** = the *how*: the
  shared Blazor component vocabulary and per-screen patterns.

When implementation and philosophy disagree, fix the implementation or amend the
philosophy in a PR — never let them silently drift (constitution Principle I).
