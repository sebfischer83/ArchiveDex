# ArchiveDex — Component & Screen Guidelines

**Status**: Design guidance (to be implemented) · **Date**: 2026-06-17
**Parents**: [ui-philosophy.md](./ui-philosophy.md) · [design-system.md](./design-system.md)

The shared component vocabulary and per-screen patterns. One component, one
behavior, everywhere (philosophy P8). All visuals use tokens from the design
system — no exceptions.

---

## 1. Button hierarchy

Exactly four kinds. Each screen has **one** primary action (P3).

| Variant | Look | Use |
|---------|------|-----|
| **Primary** | accent fill, white text | the one main action per screen/section |
| **Secondary** | neutral surface + `--ad-gray-200` border | common alternatives |
| **Ghost** | text + accent on hover, no fill | low-emphasis, toolbars, inline |
| **Danger** | danger fill or danger text | destructive only; always confirmed |

Rules: min height 44px (touch — P6/P9); label is a verb ("Add card", not "OK");
loading state shows inline spinner + disables; never two primary buttons
adjacent.

---

## 2. The Card component (the hero — P1)

The most important component. Used in the collection grid, search results, and
OCR suggestions.

- **Aspect**: real card art at 5:7 via `aspect-ratio`; `object-fit: cover`,
  lazy-loaded, with a low-res/blur placeholder until loaded (P5).
- **Resting**: image + `--ad-shadow-sm`, `--ad-radius-md`. Minimal text below
  (name, set/number) in `--ad-text-sm`.
- **Hover/focus** (desktop): lift to `--ad-shadow-md`, `--ad-motion-fast`. Focus
  ring always visible for keyboard (P9).
- **Meta overlays**: quantity, condition, or language badge as small chips in a
  corner — never covering the card's face art.
- **Missing image**: graceful placeholder (card-back silhouette + name), never a
  broken-image icon.
- **Tap target**: whole card is the target; opens detail.

A card never carries more than ~2 chips and ~2 text lines. More detail lives in
the detail view.

---

## 3. Collection grid (the home — signature moment #2)

- Responsive CSS Grid, `minmax(150px, 1fr)`, gap `--ad-space-5`. Feels like
  opening a binder.
- **Skeleton** card placeholders within 100 ms; real cards stream in.
- **Filter/sort** in a sticky, quiet toolbar (ghost controls). Active filters
  shown as removable chips. Search honors the < 2 s budget (P5).
- **Empty state**: friendly, actionable — a single illustration-free panel with
  one primary CTA ("Scan your first card"). Empty states are onboarding, not
  dead ends.
- **Density toggle** is allowed (comfortable default / compact option) but the
  *default is comfortable and airy* (P4). A full data-table is an optional view,
  never the home (anti-goal).

---

## 4. Scanner (signature moment #1 — design the hard case first, P6)

One-handed, on a phone, in bad light. The most carefully designed screen.

- **Layout**: full-bleed capture area; the capture button is large, centered,
  bottom (thumb zone). Uses `<input type=file accept=image/* capture>` per plan.
- **One job per screen**: capture → review → match. No competing controls.
- **Immediate feedback**: on capture, show the photo instantly with an upload
  progress skeleton; never a blank wait (P5).
- **Forgiving**: easy retake, clear "use this photo." Bad-light/blurry hint if
  detectable.
- **Calm**: minimal chrome over the camera; large touch targets; nothing in the
  way of the thumb.

---

## 5. OCR match confirmation (signature moment #3 — P7)

The human-in-the-loop step. Suggestions, never verdicts.

- **Layout**: the user's captured photo pinned at top; ranked suggestions below
  as Card components.
- **Ranking is visible**: top match gets accent ring + "Best match" chip;
  others descend in emphasis. Confidence shown calmly (bar/label), low
  confidence is muted, **never alarm-red** (P3/P7).
- **One obvious yes**: confirming the top match is a single primary tap.
  Choosing a different suggestion is equally easy.
- **Always an escape hatch**: "None of these — search manually" is always
  present. OCR failure is a normal path, handled gracefully, not an error.
- **After confirm**: the add-to-collection form (condition, quantity, price,
  location, notes) appears pre-filled from the match; user adjusts and saves.

---

## 6. Forms & inputs

- One field component: label above, input, helper/error below. 16px input text
  (no iOS zoom — design system §3).
- **Inline validation** on blur, not on every keystroke; errors are calm and
  actionable (P7): "Quantity must be 1 or more," not "Invalid input."
- **Smart defaults** everywhere (condition defaults sensibly, quantity = 1) to
  cut taps (P5).
- Card-language text fields use the CJK font fallback when appropriate (§ design
  system 3, P10).
- Keyboard: logical tab order, Enter submits, Esc cancels. Fully operable
  without a mouse (P9).

---

## 7. Setup wizard (the gate)

First impression; sets the calm tone.

- Narrow, centered (~480px), one decision per step, clear progress.
- One primary "Continue" per step; back is always available; no dead ends.
- Plain-language explanations (DB choice, paths, catalog scope) — curator voice,
  not jargon dump (philosophy §4).
- Ends by handing off directly to the first scan (signature moment #1).

---

## 8. Feedback: toasts, dialogs, empty & error states

- **Toasts** (`--ad-z-toast`): brief, auto-dismiss, for success/info ("Card
  added"). Bottom on mobile, top-right desktop. One at a time; queue, don't
  stack.
- **Dialogs** (`--ad-radius-lg`, `--ad-shadow-lg`): only for decisions needing
  focus or confirmation of destructive acts. **Never a dialog from a dialog**
  (anti-goal). Esc + scrim-tap close (except destructive confirms).
- **Destructive confirms**: name what will be deleted, require explicit
  confirm, use the danger button. Prefer undo (toast with "Undo") over a
  confirm prompt where data loss is recoverable.
- **Empty states**: one calm panel, a sentence of context, one primary CTA.
  Treated as onboarding moments.
- **Error states**: what failed, why, next step (constitution III / P7). Offer
  retry. Never a raw stack trace or error code alone.

---

## 9. Navigation

- **Mobile**: bottom tab bar for top-level destinations (Collection, Scan,
  Sets/Catalog, Settings) — thumb-reachable. A prominent center Scan action.
- **Desktop**: left rail or top bar, same destinations, same order (P8).
- Active destination clearly marked with the accent. Current location always
  obvious.
- Settings (incl. theme toggle, UI culture) tucked away, never in the primary
  flow's path.

---

## 10. Localization in components (P10)

- Every string from `.resx` (de/en/ru); default-culture fallback. No hardcoded
  copy.
- No fixed widths sized to one language; let buttons/labels grow. Test all three
  cultures per screen.
- Numbers, dates, prices via culture-aware formatting.
- Card-language data (de/en/ja/ko/zh-Hans/zh-Hant) is *content*, rendered
  independent of UI culture, with correct font fallback.
- Right-to-left not required now, but avoid layout assumptions that would block
  it later (use logical CSS properties: `margin-inline`, `padding-block`).

---

## 11. Definition of done (per screen)

A screen is "done" when:

- [ ] One clear primary action.
- [ ] Works at 360px width with no horizontal scroll, in de/en/ru.
- [ ] Loading uses skeletons; meets its performance budget.
- [ ] Empty, error, and loading states all designed (not just the happy path).
- [ ] Fully keyboard-operable; visible focus; AA contrast.
- [ ] `prefers-reduced-motion` and dark theme both verified.
- [ ] Only design-system tokens used — no literal colors/sizes/durations.
- [ ] Touch targets ≥ 44px.

This checklist is the UX gate, paired with the constitution's merge gates.
