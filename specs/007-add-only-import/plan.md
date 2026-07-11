# Implementation Plan: Add-Only Full Catalog Import

**Branch**: `007-add-only-import` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-add-only-import/spec.md`

## Summary

Extend the existing full-catalog-import workflow (`CatalogImportRun`) with an add-only mode that creates new cards and their prerequisite sets while skipping all existing catalog items unchanged. The mode is selected at import start, persisted in the run entity, and honored throughout classification, reconciliation, snapshot, and reporting — with no changes to existing cards, sets, relationships, source references, corrections, or images.

## Technical Context

**Language/Version**: C# 13 / .NET 10

**Primary Dependencies**: ASP.NET Core 10 controllers, Blazor Interactive Server, EF Core 10 with Npgsql/PostgreSQL, Hangfire 1.8, WolverineFx 6, Microsoft.Extensions.Localization

**Storage**: PostgreSQL (EF Core + migrations), local filesystem for catalog images

**Testing**: xUnit 2.9.3, WebApplicationFactory API tests, EF Core integration tests (PostgreSQL testcontainers / SQLite), bUnit for Blazor components

**Target Platform**: Self-hosted Linux server with desktop/mobile web browser

**Project Type**: Single-administrator web application (Clean Architecture: Domain → Application → Infrastructure → Api/Web)

**Performance Goals**: Same as existing full import: 100,000 card prints in ≤60 minutes (4 cores, 8 GB RAM, 200 MB/s storage). Add-only mode is not expected to degrade throughput; skipping existing cards may improve it.

**Constraints**: No changes to existing cards/sets/data under add-only mode; mode recorded immutably for the run; existing update-capable mode behavior preserved unchanged; only one import or transfer operation at a time (existing lease enforcement); existing administrator access control applies.

**Scale/Scope**: Extends `CatalogImportRun` (entity, enums, orchestrator, reconciler, API, UI). New types: `CatalogImportMode` and internal reconciliation result records. Modified entities: `CatalogImportRun` (+Mode field, +mode-specific counts). Modified DTOs: request, status, report. Modified UI: mode selector in import start form.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality & Maintainability

| Check | Status |
|-------|--------|
| Follow Domain → Application → Infrastructure → Api/Web boundaries | PASS: Mode enum in Domain; options and DTO changes in Application; classification/orchestration logic in Infrastructure; API/UI surfaces thin |
| Keep responsibilities focused | PASS: Add-only classification is a focused extension of the existing reconciler; reporting extends existing DTOs |
| Avoid speculative dependencies | PASS: No new packages; reuses existing import infrastructure |

### II. Test-First & Coverage Discipline (NON-NEGOTIABLE)

| Check | Status |
|-------|--------|
| Define tests before implementation | PASS: Unit, integration, API contract, and bUnit coverage specified in quickstart.md |
| Cover persistence and interface contracts | PASS: Mode column migration, API contracts, and classification logic are independently testable |
| Prevent coverage regression | PASS: Existing import tests remain passing; new mode paths are independently testable |

### III. User Experience Consistency

| Check | Status |
|-------|--------|
| Follow existing controller, polling, and `ad-` UI conventions | PASS: Mode selector follows existing form pattern in ImportAdmin.razor; API retains existing route structure |
| Preserve localization and administrator access | PASS: New mode labels and report headings use existing resource infrastructure |
| Avoid breaking existing contracts | PASS: New optional `Mode` field in request/response DTOs; defaults to update mode; existing clients unaffected |

### IV. Performance & Resource Efficiency

| Check | Status |
|-------|--------|
| Performance budget specified | PASS: Inherits 60-minute budget; add-only skip path is strictly less work than full upsert |
| Stream large artifacts and bound memory | PASS: No new memory pressure; skipping is an early return with no additional buffering |
| Avoid unbounded quadratic processing | PASS: Classification reuses existing identity lookups; no new nested loops |
| Make operations diagnosable | PASS: Mode and all required outcome counts, including supporting items, are recorded; structured logs include mode and classification outcome |

**Gate Result Before Design**: PASS. No deviation requires justification.

**Gate Result After Design**: PASS. The mode enum and skip-early pattern add minimal surface area without new architectural layers.

## Project Structure

### Documentation (this feature)

```text
specs/007-add-only-import/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/
    └── catalog-import-mode.openapi.yaml
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Domain/
│   ├── Enums/
│   │   └── CatalogImportMode.cs           # NEW: Update, AddOnly
│   └── Entities/
│       └── CatalogImportRun.cs            # MODIFY: +Mode, +AddedCount, +AmbiguousCount
├── ArchiveDex.Application/
│   ├── CatalogImport/Options/
│   │   └── CatalogImportOptions.cs        # MODIFY: +Mode field
│   └── CatalogImport/DTOs/
│       └── CatalogImportStatusDtos.cs     # MODIFY: +Mode, +AddedCount, +AmbiguousCount, +Mode in request
├── ArchiveDex.Infrastructure/
│   ├── CatalogImport/
│   │   ├── CatalogImportOrchestrator.cs   # MODIFY: mode-aware ExecuteAsync, ProcessSourceLanguageAsync, ProcessCardsAsync
│   │   ├── CatalogReconciler.cs           # MODIFY: classification and mutation paths return explicit outcomes
│   │   ├── CatalogImportReconciliationResults.cs # NEW: card/set outcomes and resolved set ID
│   │   └── CatalogImportRepository.cs     # MODIFY: persist/read new run counts
│   └── Persistence/
│       └── Migrations/                    # NEW: migration adding Mode, AddedCount, AmbiguousCount columns
├── ArchiveDex.Api/
│   └── Controllers/
│       └── CatalogImportController.cs     # MODIFY: MapRunDto includes Mode, AddedCount, AmbiguousCount
└── ArchiveDex.Web/
    ├── Components/Pages/Admin/
    │   └── ImportAdmin.razor              # MODIFY: mode selector, mode-specific status display
    └── Resources/
        ├── SharedResources.resx           # MODIFY: add mode labels, report headings
        ├── SharedResources.de.resx        # MODIFY: add German translations
        └── SharedResources.ru.resx        # MODIFY: add Russian translations

tests/
├── ArchiveDex.Domain.Tests/
├── ArchiveDex.Infrastructure.Tests/CatalogImport/
│   ├── AddOnlyImportTests.cs              # NEW: add-only classification, skip behavior, idempotency
│   └── CatalogImportProtectionTests.cs    # MODIFY: add-only protection guarantees
│   └── AddOnlyImportPerformanceTests.cs   # NEW: opt-in 100,000-card throughput benchmark
├── ArchiveDex.Api.Tests/CatalogImport/
│   └── AddOnlyImportContractTests.cs       # NEW: API contract tests with mode
└── ArchiveDex.Web.Tests/
    └── ImportAdminModeTests.cs            # NEW: bUnit mode selection and display tests
```

**Structure Decision**: Extend the existing `CatalogImport` feature within the Clean Architecture. The add-only mode is a behavioral variant within the same import workflow, not a separate feature. A new `CatalogImportMode` enum in Domain drives branching in Infrastructure. Reconciliation returns typed outcomes so the orchestrator can count real and dry-run classifications consistently, pass the resolved set ID to card reconciliation, and avoid mutating existing items. No new projects or top-level directories are required.

## Complexity Tracking

> No constitution violations. The add-only mode is implemented as an early-return branch within the existing reconciler methods, avoiding duplication of the import pipeline.
