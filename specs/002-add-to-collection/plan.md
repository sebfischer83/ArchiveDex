# Implementation Plan: Direct Add to Collection from Catalog

**Branch**: `002-add-to-collection` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-add-to-collection/spec.md`

## Summary

Add a reusable "Add to Collection" modal dialog accessible from both the catalog detail view and the catalog card list view. The form captures condition, quantity, purchase price, storage location, and notes, then creates a CollectionEntry via a new API endpoint. Duplicate detection (same card + same condition) prompts the user to either merge quantities or create a separate entry.

## Technical Context

**Language/Version**: C# 13 / .NET 9
**Primary Dependencies**: ASP.NET Core Blazor (InteractiveServer render mode), Wolverine HTTP, Entity Framework Core 9
**Storage**: PostgreSQL (primary) / SQLite (embedded fallback) via EF Core — existing `ArchiveDexDbContext`
**Testing**: xUnit (unit/contract/integration), bUnit (Blazor component tests), Testcontainers (PostgreSQL for API contract tests), SQLite in-memory (repository tests)
**Target Platform**: Linux server (Docker), browser-based UI (responsive, mobile-friendly scanner already exists)
**Project Type**: Web application — Clean Architecture: Domain → Application → Infrastructure → Api → Web
**Performance Goals**: Form submission completes in <1s server-side (supports SC-001 15s and SC-002 20s end-to-end); duplicate check is a single indexed query (O(1) with FK index)
**Constraints**: No new third-party dependencies; reuse existing Blazor component conventions and CSS class prefixes (`ad-`); single-user auth inherited from Feature 001; no image upload in this feature
**Scale/Scope**: Single-user application; typical collection size <100k entries; new code limited to 1 API endpoint, 1 Application command, 1 Blazor component, integration points in 2 existing pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality & Maintainability ✅

| Rule | Status | Evidence |
|------|--------|----------|
| Single linter/formatter, CI-enforced | PASS | Existing `.editorconfig` + CI pipeline unchanged |
| Functions single responsibility | PASS | New command handler creates entries; duplicate check is separate query; form component handles UI only |
| Public methods documented | PASS | Will add XML doc comments to new public handler and component per existing conventions |
| DRY — shared form reused | PASS | Same `AddToCollectionDialog` component used from both detail and list views |
| No dead code shipped | PASS | No commented-out blocks planned |

### II. Test-First & Coverage Discipline (NON-NEGOTIABLE) ✅

| Rule | Status | Evidence |
|------|--------|----------|
| TDD — write test before implementation | PASS | Contract test for `POST /api/collection` first; repository test for duplicate detection; bUnit test for form component |
| Contract tests for public API surface | PASS | New POST endpoint requires contract tests in `ArchiveDex.Api.Tests` |
| Integration tests for persistence | PASS | Repository-level tests for `AddAsync` + duplicate detection in `ArchiveDex.Infrastructure.Tests` |
| Coverage must not regress | PASS | All new logic paths covered by tests before merge |

### III. User Experience Consistency ✅

| Rule | Status | Evidence |
|------|--------|----------|
| Same operation behaves the same everywhere | PASS | Same form dialog, same fields, same defaults from both detail and list views |
| Errors actionable | PASS | Validation errors state what failed and why; network errors offer retry |
| Machine-readable output | PASS | API returns JSON (`CollectionEntryDto`); UI renders human-readable confirmation |
| No breaking changes | PASS | Additive feature only — no existing endpoints or pages modified |

### IV. Performance & Resource Efficiency ✅

| Rule | Status | Evidence |
|------|--------|----------|
| Performance budgets defined | PASS | SC-001 (15s detail view), SC-002 (20s list view) end-to-end; server response <1s |
| Claims backed by benchmarks | PASS | Will add benchmark assertion in contract test for response time |
| Algorithmic complexity stated | PASS | Duplicate check: O(1) single indexed query on `(CardPrintId, Condition)`; no unbounded iteration |
| No premature optimization | PASS | Simple CRUD operation — standard EF Core patterns sufficient |

### Post-Design Re-Check

*Will be re-evaluated after Phase 1 artifacts are generated.* All gates remain PASS.

## Project Structure

### Documentation (this feature)

```text
specs/002-add-to-collection/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── collection-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Domain/
│   └── Entities/
│       └── CollectionEntry.cs          # [NO CHANGE] Existing entity — no new fields needed
├── ArchiveDex.Application/
│   ├── Abstractions/
│   │   └── ICollectionRepository.cs    # [NO CHANGE] AddAsync already exists
│   ├── Commands/Collection/
│   │   └── CreateCollectionEntry.cs    # NEW — command + handler for direct add
│   └── Common/
│       └── CollectionEntryDto.cs       # [NO CHANGE] Existing DTO reused
├── ArchiveDex.Infrastructure/
│   └── Persistence/Repositories/
│       └── CollectionRepository.cs     # [NO CHANGE] AddAsync already exists
├── ArchiveDex.Api/
│   └── Handlers/
│       └── CollectionCreateHandler.cs  # NEW — Wolverine POST /api/collection
└── ArchiveDex.Web/
    └── Components/
        ├── Pages/Catalog/
        │   ├── CatalogCardView.razor   # MODIFY — integrate AddToCollection button
        │   └── CatalogBrowse.razor     # MODIFY — integrate AddToCollection button per card row
        └── Shared/
            └── AddToCollectionDialog.razor  # NEW — reusable modal dialog with form

tests/
├── ArchiveDex.Api.Tests/
│   └── CollectionCreateContractTests.cs  # NEW — POST /api/collection contract tests
├── ArchiveDex.Infrastructure.Tests/
│   └── Collection/
│       └── CollectionCreateTests.cs      # NEW — repository tests for direct add + duplicates
└── ArchiveDex.Web.Tests/
    └── Components/
        └── AddToCollectionDialogTests.cs # NEW — bUnit component tests
```

**Structure Decision**: Clean Architecture with existing project layout. No new projects created. New files follow existing namespace and folder conventions. The `AddToCollectionDialog` is placed in `Shared/` since it is reused from multiple pages.

## Complexity Tracking

> No violations — all Constitution Check gates pass without justification needed.
