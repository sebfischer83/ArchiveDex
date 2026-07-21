# Implementation Plan: Multi-Source Catalog Merge

**Branch**: `009-multi-source-merge` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-multi-source-merge/spec.md`

## Summary

Rework the catalog import so that TCGdex, Limitless, and Serebii data merge into one canonical, duplicate-free catalog: set identity is resolved via external IDs → persisted `SetMapping`s (curated seed + manual decisions) → scored heuristic, uncertain matches become reviewable `PendingSetMapping`s instead of duplicates; card fields merge deterministically through a per-field-group source-precedence policy with provenance, replacing the current order-dependent `??=`/overwrite logic in `CatalogReconciler`; the import becomes a staged two-phase pipeline (fetch → snapshots → resolve/merge) so all sources are merged together instead of sequentially. Includes a one-time migration that normalizes card numbers and merges pre-existing duplicate sets.

## Technical Context

**Language/Version**: C# / .NET 10 (`net10.0`), Angular (TypeScript) frontend in `src/ArchiveDex.Web/ClientApp`

**Primary Dependencies**: EF Core 10 + Npgsql, Hangfire (PostgreSql storage) for background import jobs, WolverineFx (messaging/handlers), SkiaSharp (already referenced — used for image dimension decoding), Taiga UI (Angular admin area)

**Storage**: PostgreSQL 16 (docker-compose); catalog entities `CardSet`, `CardPrint`, `CardSetExternalId`, `CardExternalId`, `SetMapping`, `PendingSetMapping`, `SourceSetSnapshot`, `SourceCardSnapshot`, `CatalogImageAsset` already exist

**Testing**: xUnit (one test project per src project under `tests/`), Playwright e2e for ClientApp

**Target Platform**: Linux server (Docker), browser UI

**Project Type**: Web application (ASP.NET Core backend + Angular frontend)

**Performance Goals**: Full multi-source import must not regress beyond the current single-source import's order of magnitude (SC-007); card-detail fetching must be O(1) set-list fetches per set instead of O(cards) (fixes current N+1 in TCGdex/Serebii adapters); merge phase operates from local snapshots, no network

**Constraints**: Import runs inside Hangfire job with cancel/resume (existing `CatalogImportCheckpoint`); no destructive deletes of entities referenced by `CollectionEntry`; merge must be idempotent (SC-005) and order-independent (SC-002); dry run writes zero catalog rows (FR-019)

**Scale/Scope**: ~150–300 logical sets, ~20k–50k card prints per language, up to 17 languages (TCGdex); seed mapping file ~200 entries; touches `ArchiveDex.Infrastructure/CatalogImport/*`, domain entities (2 new columns + 1 new entity), Application queries/commands, `ImportController`, Angular admin feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Code Quality | Merge policy centralized in one tested unit (`FieldMergePolicy`) instead of scattered `??=`; no duplication of precedence rules; doc comments on new public surfaces | PASS (design goal of this feature) |
| II. Test-First (NON-NEGOTIABLE) | Every task in tasks.md orders failing test before implementation; contract tests for new/changed API endpoints; integration tests for reconciliation + merge (data-schema change); regression tests reproduce P1–P7 defects before fixing | PASS — tasks.md enforces ordering |
| III. UX Consistency | Pending-review UI follows existing admin area patterns (Taiga UI, i18n parity spec); API errors actionable; run report extends existing import status endpoint shapes | PASS |
| IV. Performance | Budgets recorded here: full import ≤ same order of magnitude as today (SC-007); adapter set-list fetches cached per (source, language, set) → O(sets) network calls; merge phase DB-bound, batched SaveChanges; migration preview mode before apply | PASS — budgets defined pre-implementation |

No violations → Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/009-multi-source-merge/
├── plan.md              # This file
├── research.md          # Phase 0 output — current-state defects P1–P7, decisions D1–D8
├── data-model.md        # Phase 1 output — entity changes, provenance, mapping lifecycle
├── quickstart.md        # Phase 1 output — validation scenarios
├── contracts/           # Phase 1 output — API contracts (pending mappings, run report)
│   └── pending-mappings-api.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (done)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Domain/
│   └── Entities/                    # CardPrint.FieldSourcesJson (new column),
│                                    # PendingCardMapping (new entity), existing SetMapping/PendingSetMapping
├── ArchiveDex.Application/
│   ├── Abstractions/                # ICatalogImportRepository extensions, ISetResolver
│   ├── CatalogImport/               # Options, DTOs, precedence configuration
│   ├── Commands/Import/             # ResolvePendingMapping command
│   └── Queries/Import/              # LoadPendingMappings, run-report extensions
├── ArchiveDex.Infrastructure/
│   ├── CatalogImport/
│   │   ├── CatalogImportOrchestrator.cs   # two-phase pipeline (fetch → merge)
│   │   ├── CatalogReconciler.cs           # uses SetResolver + FieldMergePolicy
│   │   ├── SetResolver.cs                 # NEW: ID → mapping → heuristic → pending
│   │   ├── FieldMergePolicy.cs            # NEW: per-field-group precedence + provenance
│   │   ├── SeedMappingLoader.cs           # NEW: data/set-mappings.json → SetMapping rows
│   │   ├── ImageCandidateAnalyzer.cs      # decode dimensions (SkiaSharp), new score
│   │   └── ...adapters (per-run set-list cache)
│   ├── Migrations/                        # EF migrations + one-time duplicate-set merge
│   └── Persistence/
├── ArchiveDex.Api/
│   └── Controllers/ImportController.cs    # pending-mapping endpoints, extended report
└── ArchiveDex.Web/ClientApp/src/app/
    └── features/admin/                    # pending-mapping review UI

data/
└── set-mappings.json                # curated cross-source seed (new)

tests/
├── ArchiveDex.Domain.Tests/
├── ArchiveDex.Application.Tests/
├── ArchiveDex.Infrastructure.Tests/ # SetResolver, FieldMergePolicy, reconciler integration
├── ArchiveDex.Api.Tests/            # contract tests for new endpoints
└── ArchiveDex.Web/ClientApp/e2e/    # admin review flow
```

**Structure Decision**: Existing clean-architecture layout is kept. All merge logic stays in `ArchiveDex.Infrastructure/CatalogImport/`; two new focused classes (`SetResolver`, `FieldMergePolicy`) replace implicit logic inside `CatalogReconciler` rather than growing it. Frontend work is confined to the existing admin feature.

## Complexity Tracking

> No Constitution Check violations — table intentionally empty.
