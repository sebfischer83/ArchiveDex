# Tasks: Pack Collection Stats & Images in Catalog

**Input**: Design documents from `specs/003-pack-collection-stats/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/catalog-api.md, quickstart.md

**Tests**: Tests are included per the Constitution (II. Test-First & Coverage Discipline — NON-NEGOTIABLE). All new logic ships with tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Static assets and project preparation

- [x] T001 Create placeholder SVG for sets without images at `src/ArchiveDex.Web/wwwroot/set-placeholder.svg`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Entity and DTO changes that both P1 user stories depend on. Must complete before US1 or US2 implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Add `ImagePath` property (string?) to `CardSet` entity in `src/ArchiveDex.Domain/Entities/CardSet.cs`
- [x] T003 [P] Extend `SetSummary` record with `LogoUrl` (string?) and `SymbolUrl` (string?) optional parameters in `src/ArchiveDex.Application/Abstractions/ITcgDataSource.cs`
- [x] T004 [P] Extend `CatalogSetSummary` record with `OwnedCount` (int) and `ImageUrl` (string?) parameters in `src/ArchiveDex.Application/Abstractions/ICatalogRepository.cs`
- [x] T005 Add `GetOwnedCountsBySetIdAsync` method signature to `ICatalogRepository` in `src/ArchiveDex.Application/Abstractions/ICatalogRepository.cs`
- [x] T006 Configure `CardSet.ImagePath` property as nullable string column in EF Core (OnModelCreating or entity config) in `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs`
- [x] T007 Create EF Core migration for `CardSet.ImagePath` column (run `dotnet ef migrations add AddCardSetImagePath`)
- [x] T008 Populate `LogoUrl` and `SymbolUrl` from TCGdex `SetResume`/`Set` in `TcgDexDataSource` (update both `GetAvailableSetsAsync` and `GetSetMetaAsync` in `src/ArchiveDex.Infrastructure/Tcg/TcgDexDataSource.cs`)
- [x] T009 [P] Write contract test for extended `GET /api/catalog/sets` response (verify `ownedCount` and `imageUrl` fields present) in `tests/ArchiveDex.Api.Tests/Catalog/CatalogImportContractTests.cs` — test MUST fail initially

**Checkpoint**: Foundation ready — entities, DTOs, and migration in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - View Collection Progress per Pack (Priority: P1) 🎯 MVP

**Goal**: Display owned-card count per set in the catalog pack list (e.g., "15/100"). The API returns `ownedCount` and the Blazor UI renders it under each set card.

**Independent Test**: Import a set with 100 cards, add 15 distinct cards from that set to the collection, open `/catalog`, verify "15/100" appears under that set card.

### Tests for User Story 1

> **Write these FIRST, ensure they FAIL before implementation**

- [x] T010 [P] [US1] Write repository test for owned-count DISTINCT query (verify duplicate cards count as 1, positive quantities only, per-language counts, etc.) in `tests/ArchiveDex.Infrastructure.Tests/Catalog/CatalogSearchTests.cs`
- [x] T011 [P] [US1] Write bUnit component test for progress fraction rendering on set cards in `tests/ArchiveDex.Web.Tests/Components/CatalogBrowseTests.cs`

### Implementation for User Story 1

- [x] T012 [US1] Implement `GetOwnedCountsBySetIdAsync` in `CatalogRepository` using EF Core `DISTINCT` + `GROUP BY` over `CollectionEntries → CardPrints → CardSets` in `src/ArchiveDex.Infrastructure/Persistence/CatalogRepository.cs`
- [x] T013 [US1] Update `GetCatalogSetsHandler` to inject `ICatalogRepository`, call `GetOwnedCountsBySetIdAsync`, and merge `OwnedCount` into each `CatalogSetSummary` in `src/ArchiveDex.Application/Queries/Catalog/GetCatalogSets.cs`
- [x] T014 [US1] Extend local `CatalogSetDto` record in `CatalogBrowse.razor` code block to include `OwnedCount` and `TotalCount` fields in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor`
- [x] T015 [US1] Render progress fraction text (e.g., `<span>15/100</span>`) under each set card's name and language chip in the `@foreach` loop in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor`
- [x] T016 [US1] Add CSS styles for the progress text element (`.set-progress`) in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor.css`

**Checkpoint**: User Story 1 is fully functional — owned counts appear and update correctly. Can be demoed independently.

---

## Phase 4: User Story 2 - View Pack Image in Catalog (Priority: P1)

**Goal**: Display set logo/symbol images in the catalog pack list. Images are captured from TCGdex during import. Placeholder shown for sets without images.

**Independent Test**: Import a set with an image available (or re-import an existing set), verify the set image appears in the catalog pack list. Verify sets without images show the placeholder.

### Tests for User Story 2

> **Write these FIRST, ensure they FAIL before implementation**

- [x] T017 [P] [US2] Write repository test for `ImageUrl` in `CatalogSetSummary` (non-null when `CardSet.ImagePath` is set, null when not) in `tests/ArchiveDex.Infrastructure.Tests/Catalog/CatalogSearchTests.cs`
- [x] T018 [P] [US2] Write bUnit component test for set image and placeholder rendering in `tests/ArchiveDex.Web.Tests/Components/CatalogBrowseTests.cs`

### Implementation for User Story 2

- [x] T019 [US2] Implement set image download in `ImportJobService`: after resolving a `CardSet`, download image from `LogoUrl`/`SymbolUrl` via `ImageDownloadHelper` + `IImageStore`, store `RelativePath` on `CardSet.ImagePath`, skip if already set in `src/ArchiveDex.Infrastructure/Importing/ImportJobService.cs`
- [x] T020 [US2] Update `CatalogRepository.GetSetSummariesAsync` and `GetSetSummariesByLanguageAsync` to include `CardSet.ImagePath` in each `CatalogSetSummary` row; construct `ImageUrl` as `/api/images/{ImagePath}` or null in `src/ArchiveDex.Infrastructure/Persistence/CatalogRepository.cs`
- [x] T021 [US2] Update `GetCatalogSetsHandler` to include `ImageUrl` in `CatalogSetSummary` (the handler already returns the repository result; ImageUrl is populated in T020) in `src/ArchiveDex.Application/Queries/Catalog/GetCatalogSets.cs`
- [x] T022 [US2] Extend local `CatalogSetDto` record in `CatalogBrowse.razor` to include `ImageUrl` field in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor`
- [x] T023 [US2] Render set image `<img>` element with `src="@set.ImageUrl"` or fallback to `/set-placeholder.svg` when null in the `@foreach` loop for set cards; include `alt` text with set name in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor`
- [x] T024 [US2] Add CSS styles for the set image thumbnail (`.set-image`) and placeholder in the set card grid in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor.css`

**Checkpoint**: User Story 2 is fully functional — set images display for imported sets, placeholder for others. Combined with US1, the complete catalog enrichment is delivered.

---

## Phase 5: User Story 3 - Cross-Session Persistence & Data Integrity (Priority: P2)

**Goal**: Verify that progress counts and images survive application restarts and collection modifications. Primarily a data-integrity verification phase (the implementation is already correct from US1+US2).

**Independent Test**: Add cards to collection, restart app, verify counts preserved. Modify collection in another tab, refresh, verify counts updated.

### Tests for User Story 3

- [x] T025 [P] [US3] Write integration test verifying owned counts update correctly after adding and then removing a collection entry in `tests/ArchiveDex.Infrastructure.Tests/Catalog/CatalogSearchTests.cs`
- [x] T026 [P] [US3] Write repository test verifying `CardSet.ImagePath` survives idempotent re-import (image not re-downloaded or cleared) in `tests/ArchiveDex.Infrastructure.Tests/Importing/ImportJobServiceMergeTests.cs`

### Implementation for User Story 3

- [x] T027 [US3] Verify `DownloadImageIfNeeded`-style guard in `ImportJobService` skips set image download when `CardSet.ImagePath` is already set (idempotent re-import) — confirm existing code from T019 handles this correctly, add guard if missing in `src/ArchiveDex.Infrastructure/Importing/ImportJobService.cs`
- [x] T028 [US3] Verify `CatalogBrowse.razor` calls `LoadSets()` on navigation/page-init to refresh counts per FR-005 — confirm `OnInitializedAsync` already loads sets; add explicit refresh if missing in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor`

**Checkpoint**: All data integrity requirements verified — counts and images are durable and consistent.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and final quality checks

- [ ] T029 Run quickstart.md validation scenarios (all 6 scenarios from `specs/003-pack-collection-stats/quickstart.md`)
- [ ] T030 Run `dotnet format` and verify all lint/format checks pass (targeted whitespace format for changed C# files passed; full `dotnet format ArchiveDex.slnx --no-restore` is blocked by workspace document-property error)
- [ ] T031 Run full test suite (`dotnet test`) and verify no regressions, all new tests green (currently blocked by Docker/Testcontainers access for API tests)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — Independent of US2
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — Independent of US1 but shares `CatalogBrowse.razor` file; coordinate T014-T016 with T022-T024
- **User Story 3 (Phase 5)**: Depends on US1 + US2 (Phase 3+4) — Verifies data integrity of implemented features
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational. No dependency on US2.
- **User Story 2 (P1)**: Can start after Foundational. No dependency on US1. Shares `CatalogBrowse.razor` — coordinate edits to avoid conflicts (US1 adds progress; US2 adds image).
- **User Story 3 (P2)**: Depends on US1 and US2 implementation. Primarily test/verification tasks.

### Within Each User Story

- Tests MUST be written and fail before implementation
- Repository methods before handler updates
- Handler updates before frontend changes
- Frontend: record extension → markup → CSS
- Story complete before moving to next phase

### Parallel Opportunities

- T002, T003, T004 can run in parallel (different files)
- T005 and T006 can run in parallel (different files)
- T010 and T011 can run in parallel (different test projects)
- T017 and T018 can run in parallel (different test projects)
- T025 and T026 can run in parallel (different test files)
- US1 and US2 phases can run in parallel (if coordinated on `CatalogBrowse.razor`)

---

## Parallel Example: Foundational Phase

```bash
# Launch independent foundational tasks together:
Task: "Add ImagePath property to CardSet entity in src/ArchiveDex.Domain/Entities/CardSet.cs"
Task: "Extend SetSummary record in src/ArchiveDex.Application/Abstractions/ITcgDataSource.cs"
Task: "Extend CatalogSetSummary record in src/ArchiveDex.Application/Abstractions/ICatalogRepository.cs"
Task: "Write contract test for extended GET /api/catalog/sets in tests/ArchiveDex.Api.Tests/"
```

## Parallel Example: User Story 1 Tests

```bash
# Launch all US1 tests together (they must FAIL first):
Task: "Repository test for owned-count DISTINCT query in tests/ArchiveDex.Infrastructure.Tests/"
Task: "bUnit component test for progress rendering in tests/ArchiveDex.Web.Tests/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T009)
3. Complete Phase 3: User Story 1 (T010–T016)
4. **STOP and VALIDATE**: Verify `GET /api/catalog/sets` returns `ownedCount`, verify `/catalog` page shows progress text
5. Deploy/demo — users can see collection progress per pack

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Progress display (MVP!)
3. Add User Story 2 → Images + placeholder → Complete catalog enrichment
4. Add User Story 3 → Data integrity verified
5. Polish → Ready for merge

### Single Developer Strategy

Recommended execution order for a single developer:
1. T001 → T002–T009 (Foundational)
2. T010–T011 (US1 tests → fail) → T012–T016 (US1 implementation → pass)
3. T017–T018 (US2 tests → fail) → T019–T024 (US2 implementation → pass)
4. T025–T026 (US3 tests → fail) → T027–T028 (US3 verification → pass)
5. T029–T031 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- The constitution mandates TDD: write tests first, see them fail, then implement
- `CatalogBrowse.razor` is shared between US1 and US2 — implement sequentially or coordinate carefully
- The EF Core migration (T007) must be created before US1/US2 repository work begins
- Commit after each phase or logical task group
- Stop at any checkpoint to validate the story independently
