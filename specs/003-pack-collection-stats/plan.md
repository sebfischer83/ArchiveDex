# Implementation Plan: Pack Collection Stats & Images in Catalog

**Branch**: `003-pack-collection-stats` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-pack-collection-stats/spec.md`

## Summary

Enrich the catalog pack/set list with two new pieces of information per pack: (1) a collection progress indicator showing how many distinct cards from that set the user owns, and (2) the pack's image (set logo/symbol). Set images are captured from TCGdex during import and stored alongside existing card images via the established `IImageStore` infrastructure. The `GET /api/catalog/sets` endpoint is extended to return owned counts and image URLs. The `CatalogBrowse.razor` Blazor component is updated to render images and progress text under each set card.

## Technical Context

**Language/Version**: C# 13 / .NET 9
**Primary Dependencies**: ASP.NET Core Blazor (InteractiveServer render mode), Wolverine HTTP, Entity Framework Core 9
**Storage**: PostgreSQL (primary) / SQLite (embedded fallback) via EF Core — existing `ArchiveDexDbContext`
**Testing**: xUnit (unit/contract/integration), bUnit (Blazor component tests), Testcontainers (PostgreSQL for API contract tests), SQLite in-memory (repository tests)
**Target Platform**: Linux server (Docker), browser-based UI
**Project Type**: Web application — Clean Architecture: Domain → Application → Infrastructure → Api → Web
**Performance Goals**: Catalog pack list loads with progress counts in under 3s for 50 sets / 10k collection entries (SC-001); owned-count query is O(S×C) where S = sets, C = collection entries, bounded by indexed FK joins
**Constraints**: No new third-party dependencies; reuse existing image store, import pipeline, and Blazor conventions; `ad-` CSS prefix; single-user auth inherited from Feature 001; image placeholder is a static SVG shipped with the app
**Scale/Scope**: Single-user application; typical catalog < 200 sets, < 100k cards, < 100k collection entries; new code limited to 1 modified entity, 2 modified DTOs, 1 modified API response, 1 modified Blazor component, 1 modified import service

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality & Maintainability ✅

| Rule | Status | Evidence |
|------|--------|----------|
| Single linter/formatter, CI-enforced | PASS | Existing `.editorconfig` + CI pipeline unchanged |
| Functions single responsibility | PASS | Owned-count query is a separate repository method; image download in import follows existing pattern |
| Public methods documented | PASS | Will add XML doc comments to new public members per existing conventions |
| DRY — shared infrastructure reused | PASS | Reuses `IImageStore`, `ImageDownloadHelper`, existing import pipeline; placeholder image is a single static asset |
| No dead code shipped | PASS | No commented-out blocks planned |

### II. Test-First & Coverage Discipline (NON-NEGOTIABLE) ✅

| Rule | Status | Evidence |
|------|--------|----------|
| TDD — write test before implementation | PASS | Contract test for updated `GET /api/catalog/sets` response first; repository test for owned-count query; bUnit test for set card rendering |
| Contract tests for public API surface | PASS | Updated endpoint requires contract test changes in `ArchiveDex.Api.Tests` |
| Integration tests for persistence | PASS | Repository-level tests for new query in `ArchiveDex.Infrastructure.Tests` |
| Coverage must not regress | PASS | All new logic paths covered by tests before merge |

### III. User Experience Consistency ✅

| Rule | Status | Evidence |
|------|--------|----------|
| Same operation behaves the same everywhere | PASS | Set image display follows same pattern as card image display (`/api/images/...`); progress count format consistent across all packs |
| Errors actionable | PASS | Missing image shows placeholder (not broken image); zero cards set shows "0/0" or "—" |
| Machine-readable output | PASS | API returns JSON with structured `CatalogSetSummary` including new fields |
| No breaking changes | PASS | Adds new fields to existing response — additive only; existing `CatalogSetSummary` callers can ignore unknown JSON fields |

### IV. Performance & Resource Efficiency ✅

| Rule | Status | Evidence |
|------|--------|----------|
| Performance budgets defined | PASS | SC-001 (3s for 50 sets); owned-count query is a single indexed JOIN + COUNT DISTINCT |
| Claims backed by benchmarks | PASS | Will add benchmark assertion in contract test for response time |
| Algorithmic complexity stated | PASS | Owned-count: O(S×C) per set but amortized to one query via GROUP BY; image download: O(1) per set |
| No premature optimization | PASS | Simple EF Core LINQ query sufficient for single-user scale |

### Post-Design Re-Check

*Will be re-evaluated after Phase 1 artifacts are generated.* All gates remain PASS.

## Project Structure

### Documentation (this feature)

```text
specs/003-pack-collection-stats/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── catalog-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Domain/
│   └── Entities/
│       └── CardSet.cs                     # MODIFY — add ImagePath field
├── ArchiveDex.Application/
│   ├── Abstractions/
│   │   ├── ICatalogRepository.cs          # MODIFY — extend CatalogSetSummary, add new query method
│   │   ├── ITcgDataSource.cs              # MODIFY — extend SetSummary with LogoUrl/SymbolUrl
│   │   └── ISetServices.cs                # NO CHANGE
│   └── Queries/Catalog/
│       └── GetCatalogSets.cs              # MODIFY — pass ICollectionRepository for owned count
├── ArchiveDex.Infrastructure/
│   ├── Importing/
│   │   └── ImportJobService.cs            # MODIFY — download & store set image during import
│   ├── Persistence/
│   │   ├── CatalogRepository.cs           # MODIFY — compute owned card counts + include ImagePath
│   │   └── ArchiveDexDbContext.cs         # POSSIBLY MODIFY — add ImagePath to CardSet config
│   ├── Tcg/
│   │   └── TcgDexDataSource.cs            # MODIFY — populate LogoUrl/SymbolUrl in SetSummary
│   └── Migrations/                        # NEW — EF Core migration for CardSet.ImagePath
├── ArchiveDex.Api/
│   └── Handlers/
│       └── CatalogSetsHandler.cs          # NO CHANGE (Wolverine auto-maps from handler return type)
└── ArchiveDex.Web/
    ├── Components/Pages/Catalog/
    │   ├── CatalogBrowse.razor            # MODIFY — display set image + progress per pack
    │   └── CatalogBrowse.razor.css        # MODIFY — style new elements
    └── wwwroot/
        └── set-placeholder.svg            # NEW — placeholder image for sets without images

tests/
├── ArchiveDex.Api.Tests/
│   └── CatalogSetsContractTests.cs        # MODIFY — verify new fields in response
├── ArchiveDex.Infrastructure.Tests/
│   └── Catalog/
│       └── CatalogRepositoryTests.cs      # MODIFY — test owned-count query accuracy
└── ArchiveDex.Web.Tests/
    └── Components/
        └── CatalogBrowseTests.cs          # NEW — bUnit tests for set card rendering
```

**Structure Decision**: Clean Architecture with existing project layout. No new projects created. The `ImagePath` field follows the exact same pattern as `CardPrint.ImagePath` (nullable string, relative path to stored image). The owned-count computation follows the existing query pattern — added as a new repository method that joins `CollectionEntries` → `CardPrints` → `CardSet`.

## Complexity Tracking

> No violations — all Constitution Check gates pass without justification needed.
