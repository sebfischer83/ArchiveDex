# Implementation Plan: Full Catalog Import

**Branch**: `005-full-import` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-full-import/spec.md`

## Summary

Add a full catalog import capability to ArchiveDex. An admin starts and monitors a long-running import from `/admin/import`. The import processes all supported languages from TCGdex, Limitless, and Serebii, persists staging snapshots and checkpoints, normalizes source data, reconciles it into canonical `CardSet`, `CardPrint`, external ID, and translation records, and downloads image candidates to select only the best-quality permanent image. Price import is explicitly deferred.

## Technical Context

**Language/Version**: C# 13 / .NET 9

**Primary Dependencies**: ASP.NET Core 9, Blazor (InteractiveServer), Wolverine HTTP, EF Core 9 (PostgreSQL/SQLite), existing TCGdex/Limitless/Serebii clients

**Storage**: PostgreSQL or SQLite via EF Core; file system for selected permanent images; temporary file storage for image scoring

**Testing**: xUnit, bUnit, WebApplicationFactory, EF Core integration tests, fixture-backed source clients

**Target Platform**: Linux server (Docker) + web browser

**Project Type**: Web application (single-admin, self-hosted)

**Performance Goals**: Long-running import must be resumable; UI progress visible within 5 seconds of persisted updates; image candidates processed without retaining non-selected files

**Constraints**: External sources may be slow or unavailable; import must isolate record-level errors; no price import in this feature; only best image is stored permanently

**Scale/Scope**: Complete catalog import across all implemented source clients and languages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality & Maintainability

| Check | Status |
|-------|--------|
| Follow existing Clean Architecture layers | WILL comply |
| Domain entities remain source-agnostic where possible | WILL comply |
| Source-specific logic remains in source adapter/infrastructure code | WILL comply |
| Public types and methods include doc comments | WILL comply |
| No dead code or commented-out blocks shipped | WILL comply |

### II. Test-First & Coverage Discipline

| Check | Status |
|-------|--------|
| Unit tests for normalization, matching, scoring, and options | WILL comply |
| Integration tests for canonical upsert and idempotency | WILL comply |
| Fixture-backed tests for all source adapters | WILL comply |
| Blazor component tests for `/admin/import` UI | WILL comply |
| Coverage must not regress below baseline | WILL comply |

### III. User Experience Consistency

| Check | Status |
|-------|--------|
| Web UI follows existing Blazor patterns and localization infrastructure | WILL comply |
| API follows existing Wolverine HTTP endpoint conventions | WILL comply |
| Errors are actionable and source-specific | WILL comply |
| No breaking changes to existing catalog, collection, scan, or batch flows | WILL comply |

### IV. Performance & Resource Efficiency

| Check | Status |
|-------|--------|
| Import is checkpointed and resumable | WILL comply |
| External requests are rate-limited/retryable | WILL comply |
| Transactions are scoped per import unit instead of entire run | WILL comply |
| Non-selected image files are deleted after scoring | WILL comply |
| No unbounded parallelism or full-catalog in-memory accumulation | WILL comply |

**Gate Result**: All checks PASS. No violations requiring justification.

## Project Structure

### Documentation

```text
specs/005-full-import/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── catalog-import.openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code

```text
src/ArchiveDex.Domain/
├── Entities/
│   ├── CatalogImportRun.cs              # New
│   ├── CatalogImportCheckpoint.cs       # New
│   ├── SourceSetSnapshot.cs             # New
│   ├── SourceCardSnapshot.cs            # New
│   ├── SourceImportError.cs             # New
│   ├── ImageCandidateMetadata.cs        # New
│   └── CatalogImageAsset.cs             # New selected catalog image entity
├── Enums/
│   ├── CatalogImportStatus.cs           # New
│   ├── CatalogImportPhase.cs            # New
│   └── ImageEntityType.cs               # New

src/ArchiveDex.Application/
├── CatalogImport/
│   ├── DTOs/                            # ImportRun, progress, report, source DTOs
│   ├── Commands/                        # Start, cancel, resume import
│   ├── Queries/                         # Get status/report/pending mappings
│   ├── Services/                        # Normalization, matching, scoring contracts
│   └── Options/                         # Import options, source/language options
├── Abstractions/
│   ├── ICatalogImportRepository.cs      # New
│   ├── ICatalogSourceAdapter.cs         # New
│   ├── IImageCandidateAnalyzer.cs       # New
│   └── ICatalogImportOrchestrator.cs    # New

src/ArchiveDex.Infrastructure/
├── CatalogImport/
│   ├── CatalogImportOrchestrator.cs     # New
│   ├── CatalogImportWorker.cs           # New hosted/background worker
│   ├── CatalogImportRepository.cs       # New
│   ├── TcgDexCatalogSourceAdapter.cs    # New
│   ├── LimitlessCatalogSourceAdapter.cs # New
│   ├── SerebiiCatalogSourceAdapter.cs   # New
│   ├── CatalogNormalizer.cs             # New
│   ├── CatalogReconciler.cs             # New
│   └── ImageCandidateAnalyzer.cs        # New
├── Persistence/
│   └── ArchiveDexDbContext.cs           # Add DbSets/configuration
└── Migrations/                          # New migration

src/ArchiveDex.Api/
└── Handlers/
    └── CatalogImportHandlers.cs         # New Wolverine handlers

src/ArchiveDex.Web/
├── Components/Pages/Admin/
│   └── ImportAdmin.razor                # New `/admin/import`
└── Resources/
    └── SharedResources.*.resx           # New localization keys
```

## Import Architecture

```text
Web UI /admin/import
→ Wolverine handlers
→ CatalogImportRun + checkpoints
→ Background import worker
→ Source adapters
→ Staging snapshots
→ Normalizer
→ Reconciler
→ Canonical upsert
→ Image candidate scoring
→ Import report
```

## Source Coverage

| Source | Languages | Role |
|--------|-----------|------|
| TCGdex | en, fr, es, it, pt, pt-br, de, nl, pl, ru, ja, ko, zh-hans, zh-hant, zh, id, th | Primary structured catalog source |
| Limitless | en, ja, de, fr, es, it, pt | Supplemental card/set details and images |
| Serebii | en, ja | Supplemental English/Japanese set, card, image, and illustrator data |

## Language Normalization

| Source Input | Canonical |
|--------------|-----------|
| TCGdex `ptBr` | `pt-br` |
| TCGdex `zhHans` | `zh-hans` |
| TCGdex `zhHant` | `zh-hant` |
| Limitless `jp` | `ja` |
| Serebii Japanese | `ja` |

## Image Strategy

Images are imported during the catalog import, but only the best image is stored permanently.

1. Collect image candidates from enabled sources.
2. Temporarily download each candidate.
3. Decode image and extract width, height, format, file size, and hash.
4. Compute `ImageQualityScore`.
5. Select the best candidate.
6. Store only the selected image permanently as a catalog image asset.
7. Delete non-selected temporary files.
8. Keep candidate metadata and scores for traceability.
9. Never overwrite manually selected images automatically.

### Quality Score Inputs

| Criterion | Purpose |
|-----------|---------|
| Resolution | Prefer larger usable images |
| Aspect ratio | Prefer expected card/set-logo dimensions |
| Format | Prefer supported, high-quality formats |
| File size | Penalize suspiciously tiny files |
| Decode success | Exclude invalid images |
| Hash | Detect duplicates |
| Source priority | Tie-breaker when technical quality is equal |

Tie handling is deterministic: invalid images are excluded; resolution and expected aspect ratio are primary factors; format and file size are secondary factors; source priority is the first tie-breaker; source URL is the final stable tie-breaker.

## Data Merge Rules

### Set Matching

1. Match by existing `CardSetExternalId`.
2. Fallback by normalized name, release date, and set total.
3. Create pending mapping if ambiguous.
4. Create new `CardSet` if unique and unmatched.

### Card Matching

1. Match by existing `CardExternalId`.
2. Fallback by canonical set, card number, and language.
3. Create or update `CardPrint`.
4. Add translations through `CardTranslation` where source data represents translated fields.

### Protection Rules

- Never delete or overwrite `CollectionEntry` records.
- Never overwrite `LocalCorrection` records automatically.
- Never overwrite manually selected images automatically.
- Mark source references as missing when previously imported records disappear from a source; never delete canonical catalog records automatically.
- Do not import prices in this feature.

## Complexity Tracking

| Concern | Decision |
|---------|----------|
| Long-running workflow | Background worker with persisted checkpoints |
| Multiple sources/languages | Unified source adapter contracts |
| Ambiguous matching | Pending mappings instead of automatic merge |
| Image storage growth | Only best image stored permanently |
| External instability | Retry, record-level errors, resumable checkpoints |

No constitution violations. Complexity is inherent to full-catalog import and is contained through adapters, staging, checkpoints, and explicit merge rules.
