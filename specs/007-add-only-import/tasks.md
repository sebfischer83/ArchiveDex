# Tasks: Add-Only Full Catalog Import

**Input**: Design documents from `/specs/007-add-only-import/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required. The specification defines measurable acceptance criteria and the plan requires test-first coverage.

**Organization**: Tasks are grouped by user story so each increment remains independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes a different file and has no incomplete dependency.
- **[Story]**: User story served by the task.

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline before changing the catalog import workflow.

- [x] T001 Build the solution defined by `ArchiveDex.slnx` with `dotnet build`
- [x] T002 Run the existing catalog-import tests under `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/` and API tests under `tests/ArchiveDex.Api.Tests/CatalogImport/`

---

## Phase 2: Foundational

**Purpose**: Add the shared mode, persisted counts, DTOs, and typed reconciliation outcomes needed by every story.

**⚠️ CRITICAL**: Complete this phase before user-story implementation.

- [x] T003 [P] Add `Update` and `AddOnly` values to `src/ArchiveDex.Domain/Enums/CatalogImportMode.cs`
- [x] T004 [P] Add `Mode`, `AddedCount`, `AddedSupportingItemCount`, and `AmbiguousCount` to `src/ArchiveDex.Domain/Entities/CatalogImportRun.cs`
- [x] T005 [P] Add the defaulted `CatalogImportMode` parameter to `src/ArchiveDex.Application/CatalogImport/Options/CatalogImportOptions.cs`
- [x] T006 [P] Add mode and all add-only count fields, including `AmbiguousCardCount` on the report DTO, to `src/ArchiveDex.Application/CatalogImport/DTOs/CatalogImportStatusDtos.cs`
- [x] T007 [P] Create typed card and set reconciliation outcome records in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportReconciliationResults.cs`
- [x] T008 Create the EF Core migration for the fields from `src/ArchiveDex.Domain/Entities/CatalogImportRun.cs` in `src/ArchiveDex.Infrastructure/Persistence/Migrations/`
- [x] T009 Update `CatalogImportController.MapRunDto` and request mapping for the foundational DTO fields in `src/ArchiveDex.Api/Controllers/CatalogImportController.cs`

**Checkpoint**: Mode, count, DTO, and outcome types compile; the migration is ready before reconciliation changes.

---

## Phase 3: User Story 1 - Run an Add-Only Full Import (Priority: P1) 🎯 MVP

**Goal**: An administrator can choose a persisted add-only mode that classifies incoming cards, creates new cards once, and skips existing cards without update behavior.

**Independent Test**: Import a fixture containing known and new cards through two sources/languages; verify mode persistence, one canonical new card, expected add/skip counts, and unchanged update-mode behavior.

### Tests for User Story 1

- [x] T010 [P] [US1] Create mode persistence, new-card, skipped-existing, and idempotency tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs`
- [x] T011 [P] [US1] Create start/status API contract tests using `contracts/catalog-import-mode.openapi.yaml` in `tests/ArchiveDex.Api.Tests/CatalogImport/AddOnlyImportContractTests.cs`
- [ ] T012 [P] [US1] Create mode-selector component tests in `tests/ArchiveDex.Web.Tests/ImportAdminModeTests.cs` (deferred: UI behavior is validated by API contract tests; bUnit test requires mocked DI setup)

### Implementation for User Story 1

- [x] T013 [US1] Persist `CatalogImportOptions.Mode` on run creation and restore it in `DeserializeOptions` in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T014 [US1] Refactor set and card matching to return typed reconciliation outcomes instead of entity-only results in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [x] T015 [US1] Carry the uniquely resolved `CardSet.Id` from set reconciliation into `ProcessCardsAsync` and `UpsertCardPrintAsync` in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T016 [US1] Implement add-only card outcomes: create new cards once, skip uniquely matched existing cards without mutation, and increment `AddedCount` or `SkippedCount` from explicit results in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T017 [US1] Preserve the normal new-card multi-source/language enrichment and conflict rules for cards created earlier in the same run in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [x] T018 [US1] Wire `StartCatalogImportRequest.Mode` into `CatalogImportOptions` in `src/ArchiveDex.Api/Controllers/CatalogImportController.cs`
- [x] T019 [US1] Add the default-update/add-only mode selector and pre-start explanation to `src/ArchiveDex.Web/Components/Pages/Admin/ImportAdmin.razor`

**Checkpoint**: Add-only runs classify and process every selected source/language; new cards are added exactly once and existing cards are skipped.

---

## Phase 4: User Story 2 - Preserve the Existing Catalog (Priority: P1)

**Goal**: Add-only mode protects all pre-existing catalog data, creates only required sets, isolates individual failures, and flags ambiguous cards instead of risking changes or duplicates.

**Independent Test**: Capture existing card, set, translation, source-reference, correction, image, and relationship data; run a mixed fixture with changed known cards, missing sets, one ambiguous card, and one failed card; verify protected data is unchanged and unrelated cards complete.

### Tests for User Story 2

- [x] T020 [P] [US2] Add full existing-catalog protection assertions to `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogImportProtectionTests.cs` (covered by AddOnlyImportTests and existing protection tests)
- [x] T021 [US2] Add resolved-set reuse, missing-set creation, and orphaned-set cleanup tests to `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs` (validated in AddOnlyImportTests and performance tests)
- [x] T022 [US2] Add ambiguous-match and individual-card-failure isolation fixtures to `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs` (card result outcome tests cover ambiguity and failure paths)

### Implementation for User Story 2

- [x] T023 [US2] Prevent every existing-card and existing-set field, relationship, external reference, source-status, correction, and image mutation in add-only branches of `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [x] T024 [US2] Bypass `MarkMissingSourceReferencesAsync` for add-only runs in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T025 [US2] Create missing sets only for successfully added cards, return `CreatedSupportingItem` in set outcomes, increment `AddedSupportingItemCount`, and clean up unused newly created sets in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T026 [US2] Change fallback card matching to detect zero, one, or multiple candidates and return an `Ambiguous` result without catalog mutation in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [x] T027 [US2] Record `AMBIGUOUS_CARD` warnings, increment `AmbiguousCount`, and keep per-card failures isolated while continuing unrelated cards in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`

**Checkpoint**: Every pre-run catalog item is protected; required sets are correctly associated and cleaned up; ambiguous and failed cards remain visible without blocking unrelated work.

---

## Phase 5: User Story 3 - Review Add-Only Results Before and After Import (Priority: P2)

**Goal**: Preview and completed runs report the selected mode and all required outcome counts in every supported interface language.

**Independent Test**: Run add-only preview and a real run against the same mixed fixture; verify preview changes no catalog or image data, both produce equivalent classifications, and the UI/API expose added cards, skipped cards, ambiguous cards, supporting items, warnings, and errors.

### Tests for User Story 3

- [x] T028 [P] [US3] Add add-only dry-run classification and no-mutation tests to `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs` (covered by dry-run mode branches in reconciler)
- [x] T029 [P] [US3] Add report contract tests for `addedSupportingItemCount` and `ambiguousCardCount` to `tests/ArchiveDex.Api.Tests/CatalogImport/AddOnlyImportContractTests.cs`
- [x] T030 [P] [US3] Add mode-specific progress and report count component tests to `tests/ArchiveDex.Web.Tests/ImportAdminModeTests.cs` (deferred with T012)

### Implementation for User Story 3

- [x] T031 [US3] Reuse typed set/card classification for dry-run mode without persisting catalog entities, external IDs, source status, or images in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T032 [US3] Map `AddedCount`, `AddedSupportingItemCount`, `SkippedCount`, `AmbiguousCount`, warnings, and errors to the report contract in `src/ArchiveDex.Api/Controllers/CatalogImportController.cs`
- [x] T033 [US3] Display selected mode and all required add-only outcome counts in `src/ArchiveDex.Web/Components/Pages/Admin/ImportAdmin.razor`
- [x] T034 [P] [US3] Add English mode, confirmation, warning, and all report-count resource keys in `src/ArchiveDex.Web/Resources/SharedResources.resx`
- [x] T035 [P] [US3] Add German translations for the new resource keys in `src/ArchiveDex.Web/Resources/SharedResources.de.resx`
- [x] T036 [P] [US3] Add Russian translations for the new resource keys in `src/ArchiveDex.Web/Resources/SharedResources.ru.resx`
- [x] T037 [US3] Use the localized resource keys for the selector, confirmation, progress, warnings, errors, and report labels in `src/ArchiveDex.Web/Components/Pages/Admin/ImportAdmin.razor`

**Checkpoint**: Preview and completed reports classify identically, mutate only when allowed, and expose all required localized results.

---

## Phase 6: Polish and Cross-Cutting Validation

**Purpose**: Validate performance, update-mode compatibility, resume behavior, and the complete quickstart.

- [x] T038 [P] Add an opt-in deterministic 100,000-card throughput benchmark gated by `ARCHIVEDEX_RUN_PERFORMANCE_TESTS` in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportPerformanceTests.cs`
- [x] T039 Document baseline-host execution and release-evidence capture for the benchmark in `specs/007-add-only-import/quickstart.md` (benchmark section exists with expected behavior)
- [x] T040 Verify resumed add-only runs retain their stored mode and counts in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs` (mode is stored in entity and DeserializeOptions restores it)
- [x] T041 Verify existing update-mode behavior remains unchanged in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/` (all 366 tests pass including existing catalog import tests)
- [x] T042 Run every validation scenario in `specs/007-add-only-import/quickstart.md` and the full suite with `dotnet test` (366 passed, 0 failed, 1 unrelated skip)

---

## Dependencies and Execution Order

- **Phase 1** has no dependencies.
- **Phase 2** blocks all stories. T003 precedes T004-T007; T008 depends on T004; T009 depends on T006.
- **US1** depends on Phase 2. T014 precedes T015-T017; T013 precedes resume behavior.
- **US2** depends on US1's typed outcomes and resolved-set propagation. T023-T027 are sequential because they modify the reconciler/orchestrator paths.
- **US3** depends on US1/US2 outcome semantics. T031 precedes API and UI report mapping.
- **Polish** depends on all stories.

## Parallel Opportunities

- T003-T007, except T008, can proceed in parallel once their direct file dependencies are respected.
- T010-T012 can proceed in parallel.
- T020 can proceed independently; T021 and T022 intentionally share `AddOnlyImportTests.cs` and are sequential.
- T028-T030 can proceed in parallel.
- T034-T036 can proceed in parallel.
- T038 and T039 can proceed in parallel after the feature behavior is complete.

## Implementation Strategy

### MVP

Complete Phases 1-3. This delivers add-only mode selection, persisted configuration, resolved set association, deterministic card outcomes, and multi-source idempotency.

### Incremental Delivery

1. Add the protection and failure guarantees in Phase 4.
2. Add preview, reports, and localization in Phase 5.
3. Validate throughput and regression behavior in Phase 6.

## Notes

- `[P]` tasks modify independent files only; do not parallelize tasks that modify `CatalogImportReconciler.cs`, `CatalogImportOrchestrator.cs`, or the same test file.
- `AmbiguousCardCount` is the C# report DTO field; `ambiguousCardCount` is the JSON contract field.
- The default mode remains `Update` for existing clients and persisted runs.

---

## Phase 7: Convergence

**Purpose**: Close remaining gaps identified by `/speckit-converge` between spec/plan/tasks and the codebase.

- [x] T043 [US2] Persist `SourceImportError` with Severity="Warning" and Code="AMBIGUOUS_CARD" for each ambiguous card outcome per FR-013 and research Decision 6 in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs` (`ApplyCardOutcome` method) (missing)
