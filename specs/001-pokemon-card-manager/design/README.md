# ArchiveDex — Design Docs

UI philosophy and design system for ArchiveDex. To be implemented in the
`ArchiveDex.Web` Blazor app. Read in order.

| Doc | What it is | Read when |
|-----|-----------|-----------|
| [ui-philosophy.md](./ui-philosophy.md) | The *why* — principles, personality, anti-goals. "Modern and light," defined and made testable. | First. Sets the rules of taste. |
| [design-system.md](./design-system.md) | The *what* — tokens: color, type, spacing, elevation, motion, breakpoints. The concrete values to build. | When implementing styles. |
| [component-guidelines.md](./component-guidelines.md) | The *how* — shared component vocabulary + per-screen patterns, plus a per-screen Definition of Done. | When building components/pages. |

## One-line summary

> ArchiveDex feels like a clean, well-lit display case: the cards are the
> heroes, the interface gets out of the way. Light to look at, light to use.

## Guardrails

- All visuals use **design tokens** — no literal colors, sizes, or durations in
  components (constitution Principle I).
- Light-first, single accent, whitespace as a feature; dark theme is
  first-class.
- Mobile scanner is the proving ground — design the hard case first.
- Accessibility (WCAG AA, keyboard, reduced-motion) is a constraint, not a
  tradeoff.
- UI cultures (de/en/ru) stay independent of card languages
  (de/en/ja/ko/zh-Hans/zh-Hant).

When implementation and these docs disagree: fix the code or amend the doc in a
PR. Never let them silently drift.
