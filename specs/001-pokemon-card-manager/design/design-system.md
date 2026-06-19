# ArchiveDex — Design System (Tokens)

**Status**: Design guidance (to be implemented) · **Date**: 2026-06-17
**Parent**: [ui-philosophy.md](./ui-philosophy.md) · **Sibling**: [component-guidelines.md](./component-guidelines.md)

The concrete values that make the philosophy real. All values are **design
tokens** — defined once as CSS custom properties, referenced everywhere. No raw
hex, px, or ms literals in component styles. Tokens are the single source of
truth (constitution Principle I: one authoritative configuration).

---

## 1. Token strategy

Two layers:

1. **Primitive tokens** — raw scales (`--ad-gray-100`, `--ad-space-4`). Never
   used directly by components.
2. **Semantic tokens** — role-based aliases (`--ad-surface`, `--ad-text`,
   `--ad-accent`). Components reference *only* these.

Theming (light ⇄ dark) swaps the semantic layer; primitives stay fixed. This is
what lets P8 (consistency) and P2 (dark as first-class) coexist.

```css
:root {                 /* light theme — the authored default */
  --ad-surface:     var(--ad-gray-0);
  --ad-surface-sunk: var(--ad-gray-50);
  --ad-text:        var(--ad-gray-900);
  --ad-text-muted:  var(--ad-gray-500);
  --ad-accent:      var(--ad-blue-500);
  /* ...full set below */
}
[data-theme="dark"] {   /* same roles, dark surfaces */
  --ad-surface:     var(--ad-gray-900);
  --ad-surface-sunk: var(--ad-gray-950);
  --ad-text:        var(--ad-gray-50);
  --ad-text-muted:  var(--ad-gray-400);
  --ad-accent:      var(--ad-blue-400);
}
```

Theme resolution: respect `prefers-color-scheme` by default; an explicit user
choice (stored in settings) overrides it via `data-theme` on `<html>`.

---

## 2. Color

### Philosophy
Light-first: near-white surfaces, ink kept low, **one** accent. Card art
supplies the saturation (P1, P3). The neutral ramp does 90% of the work.

### Neutral ramp (primitives)
A single warm-leaning gray scale. Warm grays read friendlier than pure cool
grays and keep card colors looking true.

| Token | Light role | Approx value |
|-------|-----------|--------------|
| `--ad-gray-0` | app/base surface | `#FFFFFF` |
| `--ad-gray-50` | sunken / subtle fill | `#F7F7F6` |
| `--ad-gray-100` | hover fill, dividers | `#EEEEEC` |
| `--ad-gray-200` | borders (rare) | `#E2E2DF` |
| `--ad-gray-300` | disabled border | `#CFCFCB` |
| `--ad-gray-400` | placeholder | `#A8A8A2` |
| `--ad-gray-500` | muted text | `#6E6E68` |
| `--ad-gray-700` | secondary text | `#3C3C38` |
| `--ad-gray-900` | primary text | `#1B1B19` |
| `--ad-gray-950` | dark base surface | `#0E0E0D` |

### Accent (one only — P3)
A calm, modern blue. Signals interactivity and the single primary action.

| Token | Use | Light | Dark |
|-------|-----|-------|------|
| `--ad-blue-500` | accent / primary | `#2563EB` | — |
| `--ad-blue-400` | accent (dark theme) | — | `#60A5FA` |
| `--ad-blue-600` | accent pressed | `#1D4ED8` | `#3B82F6` |
| `--ad-accent-soft` | accent tint bg | `#EFF4FF` | `#1E293B` |

> Accent choice is deliberate and reversible. If a future brand color is chosen,
> change *one* primitive; semantics and components don't move.

### Functional / status (not decorative — P3)
Used only to convey state. Each has text + soft-background pairs that pass AA.

| Role | Token | Light | Meaning |
|------|-------|-------|---------|
| Success | `--ad-success` | `#15803D` | saved, matched, healthy |
| Warning | `--ad-warning` | `#B45309` | low confidence, attention |
| Danger | `--ad-danger` | `#B91C1C` | destructive, failed |
| Info | `--ad-info` | `#0369A1` | neutral notice |

### OCR confidence (domain-specific)
Match suggestions are ranked; confidence must be glanceable but calm — no
alarm-red for a merely-low guess (P7).

| Confidence | Visual treatment |
|-----------|------------------|
| High (top match) | accent ring + "Best match" chip |
| Medium | neutral card, subtle confidence bar |
| Low | muted card, "less likely" label, never red |

### Contrast rule
Every text/background pair MUST meet **WCAG AA** (4.5:1 normal, 3:1 large/UI).
This is a hard gate (P9), checked in design review. Light visuals never win over
legibility.

---

## 3. Typography

### Family
System font stack — fast (no web-font load, supports P5), native, and covers
de/en/ru cleanly. For CJK *card data*, fall through to system CJK fonts; never
force a Latin font onto CJK text.

```css
--ad-font-sans:
  system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
  "Noto Sans", sans-serif;
--ad-font-cjk:   /* applied to card-language fields when CJK */
  "Noto Sans CJK", "Microsoft YaHei", "Hiragino Sans", system-ui, sans-serif;
--ad-font-mono:  ui-monospace, "Cascadia Code", Consolas, monospace; /* IDs, card numbers */
```

### Type scale (1.250 — major third, rounded)
Few sizes, used consistently (P8). One scale, no ad-hoc sizes.

| Token | Size | Line | Use |
|-------|------|------|-----|
| `--ad-text-xs` | 12px | 16px | meta, captions, chips |
| `--ad-text-sm` | 14px | 20px | secondary, table cells |
| `--ad-text-base` | 16px | 24px | body (never below 16 on mobile — prevents iOS zoom) |
| `--ad-text-lg` | 20px | 28px | card titles, section leads |
| `--ad-text-xl` | 25px | 32px | page headings |
| `--ad-text-2xl` | 31px | 38px | hero / wizard headings |

### Weights
Only three. `400` body, `500` emphasis/labels, `600` headings. No `700+` —
keeps the page feeling light, not shouty.

### Localization rule
Layout never assumes string length. German runs ~30% longer than English;
Russian wider; CJK metrics differ. Test every screen in all UI cultures (P10).
Use `text-wrap: balance` on headings; never truncate without a tooltip/title.

---

## 4. Spacing

### Scale (4px base, geometric-ish)
One spacing scale, used for margin, padding, and gap. Whitespace is a feature
(P4) — when unsure, choose the larger step.

| Token | px | Typical use |
|-------|----|-----|
| `--ad-space-1` | 4 | icon↔label, tight inline |
| `--ad-space-2` | 8 | inside chips/badges |
| `--ad-space-3` | 12 | compact control padding |
| `--ad-space-4` | 16 | default control padding, list gap |
| `--ad-space-5` | 24 | card padding, between groups |
| `--ad-space-6` | 32 | section spacing |
| `--ad-space-7` | 48 | page section rhythm |
| `--ad-space-8` | 64 | hero / large breathing room |

### Layout
- **Content max-width**: ~1200px for management views; wizard/scanner narrower
  (~480px) for focus.
- **Page gutters**: `--ad-space-4` (16) on mobile, `--ad-space-6` (32) on
  desktop.
- **Grid**: collection uses CSS Grid, `auto-fill, minmax(150px, 1fr)`, gap
  `--ad-space-5`. Cards keep the standard **5:7 (~0.714) Pokémon card aspect
  ratio** via `aspect-ratio`.

---

## 5. Elevation & radius

Structure through soft shadow and rounding, not hard borders (P2).

### Radius
| Token | px | Use |
|-------|----|-----|
| `--ad-radius-sm` | 6 | chips, inputs, small buttons |
| `--ad-radius-md` | 10 | buttons, cards, fields |
| `--ad-radius-lg` | 16 | panels, sheets, modals |
| `--ad-radius-full` | 999 | avatars, pills, FAB |

Card thumbnails use `--ad-radius-md`; the *image itself* keeps the card's own
corner look — don't over-round real card art.

### Shadow (soft, layered — light theme)
| Token | Use |
|-------|-----|
| `--ad-shadow-sm` | resting cards, inputs on hover |
| `--ad-shadow-md` | raised cards, popovers, dropdowns |
| `--ad-shadow-lg` | modals, bottom sheets, scanner overlay |

```css
--ad-shadow-sm: 0 1px 2px rgb(0 0 0 / .05), 0 1px 3px rgb(0 0 0 / .06);
--ad-shadow-md: 0 4px 12px rgb(0 0 0 / .08);
--ad-shadow-lg: 0 12px 32px rgb(0 0 0 / .14);
```

In dark theme, shadows weaken and elevation is carried more by surface
lightening — define dark variants rather than reusing light shadows.

Borders exist but are the exception: `1px var(--ad-gray-200)` only where shadow
can't disambiguate (e.g., adjacent same-elevation surfaces, table rules).

---

## 6. Motion

Motion confirms cause and effect; it never decorates and never blocks (P1, P5).

### Duration
| Token | ms | Use |
|-------|----|-----|
| `--ad-motion-fast` | 120 | hover, focus, taps, toggles |
| `--ad-motion-base` | 180 | dropdowns, tooltips, small reveals |
| `--ad-motion-slow` | 240 | sheets, page-region transitions, modals |

Nothing exceeds ~250 ms. Anything slower feels heavy — the opposite of light.

### Easing
| Token | Curve | Use |
|-------|-------|-----|
| `--ad-ease-standard` | `cubic-bezier(.2,0,0,1)` | most transitions |
| `--ad-ease-emphasis` | `cubic-bezier(.2,0,0,1.2)` | a single confirm "pop" (e.g., card added) |

### Reduced motion (hard rule — P9)
Honor `prefers-reduced-motion: reduce`: drop transforms/animation, keep instant
opacity/state changes. No exceptions.

### Loading
Skeletons, not spinners, for content (P5). A spinner is allowed only for an
indeterminate action under ~1 s with no layout to skeletonize. Skeleton shimmer
respects reduced-motion.

---

## 7. Iconography

- One icon set, line style, ~1.5px stroke, 24px grid (matches the light, modern
  tone). Pick one library and stick to it (P8).
- Icons support labels; they don't replace them for primary actions. Icon-only
  buttons MUST carry `aria-label`.
- No multicolor or skeuomorphic icons — they'd compete with card art (P1).

---

## 8. Breakpoints (mobile-first — P6)

| Token | Min width | Target |
|-------|-----------|--------|
| (base) | 0 | phone, one-handed, scanner |
| `--ad-bp-sm` | 480px | large phone |
| `--ad-bp-md` | 768px | tablet, split layouts |
| `--ad-bp-lg` | 1024px | desktop, multi-column |
| `--ad-bp-xl` | 1280px | wide desktop, max content width |

Design and review the base (phone) layout first; enhance upward. Bottom-anchored
primary actions on mobile (thumb zone); top/inline on desktop.

---

## 9. Z-index scale

One ordered scale; no magic numbers. Prevents the modal-stacking chaos P7's
anti-goals forbid.

| Token | Value | Layer |
|-------|-------|-------|
| `--ad-z-base` | 0 | content |
| `--ad-z-sticky` | 100 | sticky headers, toolbars |
| `--ad-z-dropdown` | 200 | menus, popovers |
| `--ad-z-overlay` | 300 | scrims |
| `--ad-z-modal` | 400 | dialogs, bottom sheets |
| `--ad-z-toast` | 500 | toasts (above all) |

---

## 10. Implementation notes (Blazor)

- Define all tokens in a single `app.css` `:root` / `[data-theme]` block,
  imported once at the app host. This is the authoritative config.
- Prefer **CSS isolation** (`.razor.css`) for component styles; reference
  semantic tokens only — never primitives, never literals.
- Theme toggle sets `data-theme` on `<html>` and persists to user settings; SSR
  reads the stored preference to avoid a flash of wrong theme.
- No CSS framework is mandated, but if one is adopted it MUST map onto these
  tokens, not override them. Tokens win.
- Provide a `/design` preview page (dev-only) rendering every token and
  component state — the living reference and the visual-regression target.
