# Data Model: Multi-Source Catalog Merge

**Feature**: 009-multi-source-merge | **Date**: 2026-07-14

Existing canonical model is kept (see [research.md](research.md)); this feature adds provenance, one entity, and report counters, and finally *uses* entities that already exist (`SetMapping`, `PendingSetMapping`, snapshots).

## Changed Entities

### CardPrint (changed)

| Field | Type | New? | Purpose |
|---|---|---|---|
| `FieldSourcesJson` | `string?` (JSON object) | ✚ | Field-group → source provenance, e.g. `{"GameData":"TCGdex","Rarity":"Limitless","Identity":"TCGdex","Image":"TCGdex"}` |
| `Number` | `string` | changed semantics | Always stored **normalized** (`CatalogNormalizer.NormalizeCardNumber`); migration normalizes existing rows |

Field groups (merge granularity, keys of `FieldSourcesJson`):

| Group | CardPrint fields |
|---|---|
| `Identity` | `Name`, `Number` (per language) |
| `GameData` | `Hp`, `TypesJson`, `Stage`, `EvolveFrom`, `Description`, `AttacksJson`, `WeaknessesJson`, `ResistancesJson`, `Retreat`, `VariantNormal/Holo/Reverse/FirstEdition`, `RegulationMark`, `LegalStandard`, `LegalExpanded`, `Level`, `Suffix`, `DexIdsJson` |
| `Classification` | `Rarity`, `Category`, `Illustrator` |
| `Image` | `ImagePath` (until superseded by `CatalogImageAsset` selection) |

**Validation**: `FieldSourcesJson` values must be registered source names. A group without provenance entry is treated as "unknown/legacy" — any source may claim it (enables gradual adoption on existing data).

### CardSet (changed semantics only)

`Series`, `ReleaseDate`, `PrintedTotal`, `OfficialTotal` become policy-merged (same mechanism); set-level provenance JSON column `FieldSourcesJson` added analogously.

### CatalogImportRun (changed)

| Field | Type | New? | Purpose |
|---|---|---|---|
| `ConflictCount` | `int` | ✚ | Distinct fields where ≥2 sources supplied different non-empty values (FR-018) |
| `PendingCount` | `int` | ✚ | Pending set + card mappings created by this run (FR-018, SC-003) |
| `PerSourceStatsJson` | `string?` | ✚ | Per-source added/merged/skipped/errors breakdown for the run report |

### CatalogImageAsset / ImageCandidateMetadata (changed semantics)

`Width`/`Height` become mandatory-on-success: candidate analysis decodes real dimensions (SkiaSharp). Quality score recomputed as resolution-dominant. No schema change.

## New Entity

### PendingCardMapping (new — FR-007)

Ambiguous card matches, sibling of existing `PendingSetMapping`.

| Field | Type | Notes |
|---|---|---|
| `Id` | `Guid` | PK |
| `ImportRunId` | `Guid` | Run that detected the ambiguity |
| `Source` / `Language` | `string` | Incoming namespace |
| `ExternalSetId` / `ExternalCardId` | `string` | Incoming identity |
| `CardSetId` | `Guid` | Resolved canonical set the card belongs to |
| `IncomingNumber` / `IncomingName` | `string` | Normalized display data |
| `CandidatesJson` | `string` | Candidate `CardPrintId`s with per-candidate reasons |
| `Status` | `MappingStatus` | Same enum/lifecycle as `PendingSetMapping` |
| `CreatedAt` / `UpdatedAt` | `DateTime` | |

## Reused (now actually written/read)

| Entity | Change in usage |
|---|---|
| `SetMapping` | Written by: seed loader (`data/set-mappings.json`, `IsManual=false`), auto-accepts above threshold, manual resolutions (`IsManual=true`). Read as resolution stage 2 (before heuristic). Manual rows are never overwritten by seed reloads; conflicts reported. |
| `PendingSetMapping` | Actually created on uncertain matches (today: log-only). Existing review API (`SetMappingController`, `api/sets/pending`) and admin UI resolve them. |
| `SourceSetSnapshot` / `SourceCardSnapshot` | Become merge input (Phase B reads them) and re-merge input after pending resolution. Retention: latest completed run per (source, language) kept; older runs prunable. |
| `CatalogImportCheckpoint` | Tracks two-phase progress (per source/language in Phase A, per logical set in Phase B) for cancel/resume. |

## Indexes & Constraints

| Table | Index/Constraint | Reason |
|---|---|---|
| `CardSetExternalId` | UNIQUE `(Source, Language, ExternalId)` | One source identity → one canonical set |
| `CardExternalId` | UNIQUE `(Source, Language, ExternalId)` | Same for cards |
| `SetMapping` | UNIQUE `(Source, Language, ExternalId)` | One decision per source identity |
| `SourceCardSnapshot` | INDEX `(ImportRunId, Source, Language, ExternalSetId)` | Phase B / re-merge lookups |
| `PendingCardMapping` | INDEX `(Status)` | Review queue |

## State Transitions

### PendingSetMapping / PendingCardMapping (`MappingStatus`)

```
Pending ──accept(targetId)──► Approved      → SetMapping/CardExternalId written, parked snapshots re-merged
Pending ──create-new───────► Approved      → new canonical entity created, then as above
Pending ──reject───────────► Rejected      → source identity ignored by future runs until source data changes
```

Re-detection rule: a later import that encounters the same `(Source, Language, ExternalId)` with an existing resolution applies it silently (FR-015); a `Rejected` identity is skipped and counted in the run report.

### Merge write rule (invariant)

A field group is written by source S iff:
1. entity has no `LocalCorrection` covering it, AND
2. group provenance is empty/unknown, OR precedence(S) ≥ precedence(provenance source) for that group.

This yields commutativity (SC-002) and idempotence (SC-005).

## Migration Set

1. **Schema**: add `CardPrint.FieldSourcesJson`, `CardSet.FieldSourcesJson`, `CatalogImportRun` counters, `PendingCardMapping` table, indexes above.
2. **Data — number normalization** (D5): normalize `CardPrint.Number`; collision report (same set+language+normalized number) feeds step 3.
3. **Data — duplicate-set merge** (D8, guarded maintenance command with preview): group by seed mapping + normalized name + release-date proximity; survivor = set with most prints (tiebreak: oldest); re-link `CardSetExternalId`, `CardPrint`, `SetMapping`; merge prints only when unambiguous; **never delete a print with `CollectionEntry`s** — re-link instead; ambiguous groups → `PendingSetMapping`.
