# Research: Multi-Source Catalog Merge

**Feature**: 009-multi-source-merge | **Date**: 2026-07-14

## Current-State Analysis (defect inventory)

Code review of `src/ArchiveDex.Infrastructure/CatalogImport/` and the three source adapters produced the defect list below. These are the concrete reasons the current import cannot produce a duplicate-free, deterministic catalog; each maps to spec requirements.

| # | Defect | Location | Consequence | Spec |
|---|---|---|---|---|
| P1 | Set fallback match is name-only (`CanonicalName == NormalizeSetName(RawName)`); non-English names never match; TCGdex adapter supplies `ReleaseDate: null` so the date tiebreak is dead | `CatalogReconciler.TryFallbackSetMatchAsync`, `TcgDexCatalogSourceAdapter.GetSetsAsync` | One duplicate set per source+language for the same logical set | FR-001..004 |
| P2 | Field merge is order-dependent: `??=` (first source wins) for most fields, hard overwrite (last source wins) for `Name`/`Number`; a Serebii thumbnail can block a TCGdex image via `ImagePath ??=` | `CatalogReconciler.UpsertCardPrintAsync` | Final data quality is accidental, unreproducible | FR-008, FR-011, SC-002 |
| P3 | Ambiguous matches only produce `LogWarning("PendingMapping needed…")`; no `PendingSetMapping` row is written despite the entity existing | `CatalogReconciler` (both fallback paths) | Ambiguities are unrecoverable data loss | FR-004, FR-013..015, SC-003 |
| P4 | Number normalization inconsistent: fallback compares normalized (`PadLeft(3,'0')` → "001") against raw stored `CardPrint.Number` ("1") | `CatalogNormalizer.NormalizeCardNumber` vs. `CatalogReconciler` write paths | Fallback card matches systematically fail → more duplicates | FR-005..006 |
| P5 | No field provenance; snapshots (`SourceSetSnapshot`/`SourceCardSnapshot`) are written but never read for merging | orchestrator + reconciler | Cannot re-merge, review conflicts, or explain values | FR-010, FR-012 |
| P6 | Image score never decodes dimensions (`Width`/`Height` stay null → stored as 0×0); score = file size + format + source bonus | `ImageCandidateAnalyzer` | Bloated JPEG beats clean smaller PNG; quality unknown | FR-016 |
| P7 | N+1 fetches: TCGdex and Serebii `GetCardDetailAsync` re-fetch the entire set card list per card | both adapters | ~250 redundant set fetches per 250-card set | SC-007 |

## Decisions

### D1 — Set identity resolution order: ExternalId → SetMapping → scored heuristic → PendingSetMapping

- **Decision**: Resolve incoming sets strictly in this order: existing `CardSetExternalId` link; persisted `SetMapping` (curated seed, prior auto-accept, or manual decision); scoring heuristic over normalized name + release date (±14 days) + card count (±5%); above threshold → link and persist an auto `SetMapping`; below threshold with candidates → `PendingSetMapping` row and park the set; no candidates → create new canonical set.
- **Rationale**: External IDs are the only stable identity a source offers. Name matching across languages is inherently unreliable (P1), so it is demoted to last resort and its uncertain outcomes become reviewable instead of silently creating duplicates (P3).
- **Alternatives considered**: (a) Pure heuristic matching with better normalization — rejected: cross-language names ("Verborgene Mächte" vs "Hidden Fates") cannot be string-matched reliably. (b) Translation-based matching via TCGdex multilingual set names — kept as a heuristic *input* where available, but not required infrastructure.

### D2 — Curated seed mapping file `data/set-mappings.json`

- **Decision**: Ship a curated JSON seed linking each known set across sources (TCGdex id ↔ Limitless code ↔ Serebii slug), loaded idempotently into `SetMapping` (`IsManual=false`, `Confidence=High`) at import start. Manual decisions (`IsManual=true`) always win over seed rows; conflicts are reported, not overwritten.
- **Rationale**: The back catalog is finite (~150–200 sets) and static; a one-time curation eliminates ~95% of heuristic risk. New sets appear every 6–8 weeks and are covered by heuristic + review queue until the seed is updated — seed is an accelerator, not a correctness requirement.
- **Alternatives considered**: (a) No seed, heuristic only — rejected: avoidable review load and risk on the entire back catalog. (b) External mapping service/API — rejected: new dependency, nothing authoritative exists.

### D3 — Deterministic per-field-group merge policy with provenance

- **Decision**: Central `FieldMergePolicy`: for each field group, a configured source precedence; a value is written iff the writing source has precedence ≥ the recorded provenance source of the current value (or fills a gap). Provenance stored as JSON column `CardPrint.FieldSourcesJson` (`{"GameData":"TCGdex","Rarity":"Limitless",…}`). `LocalCorrection` remains the absolute override. Default precedence: game data (HP, attacks, weaknesses/resistances, retreat, stage, evolve-from, variants, legalities, regulation mark) TCGdex > Limitless > Serebii; rarity + release date + series/era Limitless > Serebii > TCGdex; totals TCGdex > Limitless > Serebii; name/number per language TCGdex > Limitless > Serebii.
- **Rationale**: Precedence-vs-provenance comparison makes the merge commutative — the same final state regardless of import order (SC-002) and idempotent on re-runs (SC-005), which `??=`/overwrite can never be (P2). Field-group granularity (not per-field) keeps the JSON small and the policy explainable.
- **Alternatives considered**: (a) Per-field provenance table — rejected: row explosion, no added user value. (b) Fixed global source order for whole records — rejected: no single source is best at everything (Limitless has dates, TCGdex has game data). (c) Timestamp-based last-write-wins — rejected: reintroduces order dependence.

### D4 — Two-phase import: fetch-to-staging, then merge-from-staging

- **Decision**: Restructure `CatalogImportOrchestrator`: Phase A fetches all selected sources/languages into `SourceSetSnapshot`/`SourceCardSnapshot` (no catalog writes); Phase B resolves and merges per logical entity from the staged rows of **all** sources at once. Dry run = Phase A + diff report. `CatalogImportCheckpoint` tracks phase progress for cancel/resume. Resolving a `PendingSetMapping` re-merges from existing staged rows without re-fetching.
- **Rationale**: Merging all sources simultaneously makes precedence trivially correct and removes any meaning from source ordering (FR-012). Staging also makes dry runs exact (FR-019) and pending-resolution cheap (FR-014). The snapshot tables already exist and are already populated — they are just never read (P5).
- **Alternatives considered**: (a) Keep sequential per-source merge but with the new policy — acceptable interim (policy alone already guarantees convergence), rejected as end-state because pending re-merge and exact dry-run need staging anyway. (b) Full ETL into a separate staging database — rejected: overkill for this volume.

### D5 — Consistent number normalization at write and compare

- **Decision**: `CatalogNormalizer.NormalizeCardNumber` is applied on every write of `CardPrint.Number` and every comparison; a data migration normalizes existing rows (including `CardExternalId.ExternalId` suffixes) and outputs a collision report feeding the duplicate-merge migration (D8).
- **Rationale**: P4 makes fallback matching fail today; normalizing on only one side is the root cause.
- **Alternatives considered**: Normalize only at compare time via computed/functional index — rejected: leaves inconsistent stored data visible to UI and exports.

### D6 — Image selection by decoded dimensions, SkiaSharp

- **Decision**: Decode width/height with SkiaSharp (already a dependency) during candidate analysis; new score: resolution dominant, format second, source only as tiebreak; SHA-256 dedupe (field exists); manual selections (`IsManuallySelected`) untouched.
- **Rationale**: Fixes P6 with zero new dependencies (constitution dependency rule).
- **Alternatives considered**: ImageSharp — rejected: SkiaSharp already present; two image libraries unjustifiable.

### D7 — Per-run set-list cache in adapters

- **Decision**: Cache the fetched card list per (source, language, set) for the lifetime of one import run (scoped service), so `GetCardDetailAsync` reuses it.
- **Rationale**: Removes P7's O(cards) set-list fetches; required for SC-007.
- **Alternatives considered**: Cross-run HTTP cache — rejected: staleness management not worth it; per-run is sufficient.

### D8 — One-time cleanup migration for existing duplicates

- **Decision**: A guarded maintenance operation (preview mode first) that: normalizes numbers (D5), groups duplicate sets by seed mapping + normalized name + release date proximity, re-links `CardSetExternalId`s/`CardPrint`s to the surviving set, merges duplicate prints only when unambiguous, re-links `CollectionEntry`s, and never deletes a print that has collection entries. Ambiguous groups go to the review queue.
- **Rationale**: New matching only prevents *future* duplicates; existing databases (FR-020, SC-006) must converge too. Collection safety is the hard constraint.
- **Alternatives considered**: Fresh re-import into empty catalog — rejected: loses collection entries, corrections, and manual image picks tied to existing print IDs.

## Resolved Technical Context Unknowns

None remained — stack, storage, testing, and platform were taken from the existing codebase (see plan.md Technical Context).
