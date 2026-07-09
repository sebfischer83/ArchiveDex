# Tasks: Full Catalog Import

**Input**: Design documents from `/specs/005-full-import/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included. Project constitution mandates test-first coverage discipline.

**Organization**: Tasks are grouped by independently verifiable phases and user stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase when touching different files.
- **[Story]**: User story coverage from spec.md.
- Include exact file paths where practical.

## Path Conventions

```text
src/ArchiveDex.Domain/           # Entities, enums, value objects
src/ArchiveDex.Application/      # Contracts, DTOs, commands, queries, services
src/ArchiveDex.Infrastructure/   # EF Core, source adapters, import worker, image analyzer
src/ArchiveDex.Api/              # Wolverine HTTP handlers
src/ArchiveDex.Web/              # Blazor UI
tests/ArchiveDex.Domain.Tests/
tests/ArchiveDex.Application.Tests/
tests/ArchiveDex.Infrastructure.Tests/
tests/ArchiveDex.Api.Tests/
tests/ArchiveDex.Web.Tests/
```

---

## Phase 1: Setup - Domain and Persistence Foundation

**Purpose**: Add import, checkpoint, staging, error, and image metadata structures used by all later phases.

- [x] T001 [P] Create CatalogImportStatus enum in `src/ArchiveDex.Domain/Enums/CatalogImportStatus.cs`
- [x] T002 [P] Create CatalogImportPhase enum in `src/ArchiveDex.Domain/Enums/CatalogImportPhase.cs`
- [x] T003 [P] Create ImageEntityType enum in `src/ArchiveDex.Domain/Enums/ImageEntityType.cs`
- [x] T004 [P] Create CatalogImportRun entity in `src/ArchiveDex.Domain/Entities/CatalogImportRun.cs`
- [x] T005 [P] Create CatalogImportCheckpoint entity in `src/ArchiveDex.Domain/Entities/CatalogImportCheckpoint.cs`
- [x] T006 [P] Create SourceSetSnapshot entity in `src/ArchiveDex.Domain/Entities/SourceSetSnapshot.cs`
- [x] T007 [P] Create SourceCardSnapshot entity in `src/ArchiveDex.Domain/Entities/SourceCardSnapshot.cs`
- [x] T008 [P] Create SourceImportError entity in `src/ArchiveDex.Domain/Entities/SourceImportError.cs`
- [x] T009 [P] Create ImageCandidateMetadata entity in `src/ArchiveDex.Domain/Entities/ImageCandidateMetadata.cs`
- [x] T010 [P] Create CatalogImageAsset entity in `src/ArchiveDex.Domain/Entities/CatalogImageAsset.cs`
- [x] T011 Add DbSets and EF configuration for new entities in `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs`
- [x] T012 Create EF Core migration for full import tables in `src/ArchiveDex.Infrastructure/Migrations/`
- [x] T111 [P] Add missing-source tracking fields to existing `src/ArchiveDex.Domain/Entities/CardSetExternalId.cs`
- [x] T112 [P] Add missing-source tracking fields to existing `src/ArchiveDex.Domain/Entities/CardExternalId.cs`

**Checkpoint**: Database schema supports import runs, staging snapshots, checkpoints, errors, and image metadata.

---

## Phase 2: Tests First - Core Rules

**Purpose**: Lock down normalization, matching, idempotency, and image-scoring behavior before implementation.

- [x] T013 [P] [US2] Add language normalization tests in `tests/ArchiveDex.Application.Tests/CatalogImport/LanguageNormalizationTests.cs`
- [x] T014 [P] [US2] Add set matching tests in `tests/ArchiveDex.Application.Tests/CatalogImport/SetMatchingTests.cs`
- [x] T015 [P] [US2] Add card matching tests in `tests/ArchiveDex.Application.Tests/CatalogImport/CardMatchingTests.cs`
- [x] T016 [P] [US2] Add idempotency tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogImportIdempotencyTests.cs`
- [x] T017 [P] [US3] Add image quality scoring tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/ImageCandidateAnalyzerTests.cs`
- [x] T018 [P] [US2] Add local data protection tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogImportProtectionTests.cs`
- [x] T113 [P] [US2] Add missing-source marker tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/MissingSourceReferenceTests.cs`
- [x] T114 [P] [US1] Add single-active-import conflict tests in `tests/ArchiveDex.Api.Tests/CatalogImport/CatalogImportContractTests.cs`

**Checkpoint**: Core rule tests exist and fail before implementation.

---

## Phase 3: Application Contracts and DTOs

**Purpose**: Define source-independent import contracts used by adapters, orchestration, handlers, and UI.

- [x] T019 [P] Create import options DTOs in `src/ArchiveDex.Application/CatalogImport/Options/CatalogImportOptions.cs`
- [x] T020 [P] Create source DTOs in `src/ArchiveDex.Application/CatalogImport/DTOs/ImportedCatalogDtos.cs`
- [x] T021 [P] Create progress/report DTOs in `src/ArchiveDex.Application/CatalogImport/DTOs/CatalogImportStatusDtos.cs`
- [x] T022 [P] Create ICatalogSourceAdapter in `src/ArchiveDex.Application/Abstractions/ICatalogSourceAdapter.cs`
- [x] T023 [P] Create ICatalogImportRepository in `src/ArchiveDex.Application/Abstractions/ICatalogImportRepository.cs`
- [x] T024 [P] Create ICatalogImportOrchestrator in `src/ArchiveDex.Application/Abstractions/ICatalogImportOrchestrator.cs`
- [x] T025 [P] Create IImageCandidateAnalyzer in `src/ArchiveDex.Application/Abstractions/IImageCandidateAnalyzer.cs`

**Checkpoint**: Application layer exposes stable import contracts.

---

## Phase 4: Source Adapters

**Purpose**: Map all existing source clients into unified import DTOs.

- [x] T026 [P] [US1] Implement TCGdex source adapter in `src/ArchiveDex.Infrastructure/CatalogImport/TcgDexCatalogSourceAdapter.cs`
- [x] T027 [P] [US1] Implement Limitless source adapter in `src/ArchiveDex.Infrastructure/CatalogImport/LimitlessCatalogSourceAdapter.cs`
- [x] T028 [P] [US1] Implement Serebii source adapter in `src/ArchiveDex.Infrastructure/CatalogImport/SerebiiCatalogSourceAdapter.cs`
- [x] T029 [P] [US1] Add fixture-backed TCGdex adapter tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/TcgDexCatalogSourceAdapterTests.cs`
- [x] T030 [P] [US1] Add fixture-backed Limitless adapter tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/LimitlessCatalogSourceAdapterTests.cs`
- [x] T031 [P] [US1] Add fixture-backed Serebii adapter tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/SerebiiCatalogSourceAdapterTests.cs`

**Checkpoint**: All sources can emit common import DTOs.

---

## Phase 5: Repository and Checkpointing

**Purpose**: Persist import runs, snapshots, checkpoints, errors, image metadata, and report counters.

- [x] T032 [US1] Implement CatalogImportRepository in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportRepository.cs`
- [x] T033 [US1] Implement create/update import run methods in CatalogImportRepository
- [x] T034 [US1] Implement checkpoint upsert methods in CatalogImportRepository
- [x] T035 [US1] Implement source set/card snapshot persistence in CatalogImportRepository
- [x] T036 [US1] Implement structured error/warning persistence in CatalogImportRepository
- [x] T037 [US3] Implement image candidate metadata persistence in CatalogImportRepository
- [x] T038 [US1] Register repository in `src/ArchiveDex.Infrastructure/DependencyInjection.cs`
- [x] T039 [US1] Add repository integration tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogImportRepositoryTests.cs`
- [x] T115 [US1] Implement repository guard that permits only one active CatalogImportRun at a time in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportRepository.cs`

**Checkpoint**: Import state is durable and resumable.

---

## Phase 6: Normalization and Reconciliation

**Purpose**: Convert source DTOs to canonical records and merge without duplicates.

- [x] T040 [US2] Implement language normalization in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogNormalizer.cs`
- [x] T041 [US2] Implement set field normalization in CatalogNormalizer
- [x] T042 [US2] Implement card field normalization in CatalogNormalizer
- [x] T043 [US2] Implement set matching by external ID in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [x] T044 [US2] Implement set fallback matching by normalized name, release date, and totals in CatalogReconciler
- [x] T045 [US2] Implement pending mapping creation for ambiguous set matches in CatalogReconciler
- [x] T046 [US2] Implement card matching by external ID in CatalogReconciler
- [x] T047 [US2] Implement card fallback matching by set, number, and language in CatalogReconciler
- [x] T048 [US2] Implement CardTranslation upsert logic in CatalogReconciler
- [x] T049 [US2] Implement source priority rules for field updates in CatalogReconciler
- [x] T050 [US2] Protect CollectionEntry, LocalCorrection, and manually selected image fields in CatalogReconciler
- [x] T116 [US2] Implement missing-source reference marking for CardSetExternalId and CardExternalId in CatalogReconciler

**Checkpoint**: Source data can merge into canonical catalog tables idempotently.

---

## Phase 7: Image Download and Quality Selection

**Purpose**: Evaluate source image candidates and permanently store only the best image.

- [x] T051 [US3] Implement temporary image download in `src/ArchiveDex.Infrastructure/CatalogImport/ImageCandidateAnalyzer.cs`
- [x] T052 [US3] Extract image metadata: width, height, format, file size, hash in ImageCandidateAnalyzer
- [x] T053 [US3] Implement image decode validation in ImageCandidateAnalyzer
- [x] T054 [US3] Implement quality score calculation in ImageCandidateAnalyzer
- [x] T055 [US3] Implement deterministic best-candidate selection with invalid exclusion, resolution/aspect ranking, source priority tie-breaker, and source URL final tie-breaker in ImageCandidateAnalyzer
- [x] T056 [US3] Implement permanent storage for selected image only in ImageCandidateAnalyzer
- [x] T057 [US3] Delete non-selected temporary image files after scoring
- [x] T058 [US3] Persist candidate metadata and selected asset metadata through CatalogImportRepository
- [x] T059 [US3] Add integration test proving only best image remains on disk

**Checkpoint**: Image import selects best image and avoids local cache bloat.

---

## Phase 8: Orchestration and Background Worker

**Purpose**: Execute complete import with resumable, cancellable, error-isolated processing.

- [x] T060 [US1] Implement CatalogImportOrchestrator in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [x] T061 [US1] Implement source/language/set iteration in CatalogImportOrchestrator
- [x] T062 [US1] Implement dry-run behavior in CatalogImportOrchestrator
- [x] T063 [US1] Implement checkpoint resume behavior in CatalogImportOrchestrator
- [x] T064 [US1] Implement cancellation behavior in CatalogImportOrchestrator
- [x] T065 [US1] Implement record-level error isolation in CatalogImportOrchestrator
- [x] T066 [US3] Integrate image candidate scoring into CatalogImportOrchestrator
- [x] T067 [US1] Implement CatalogImportWorker hosted service in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportWorker.cs`
- [x] T068 [US1] Register orchestrator, adapters, image analyzer, and worker in DI
- [x] T069 [US1] Add orchestration integration tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogImportOrchestratorTests.cs`

**Checkpoint**: Full import can run, resume, cancel, and isolate failures.

---

## Phase 9: API Handlers

**Purpose**: Expose import control and reporting to the Web UI through Wolverine HTTP handlers.

- [x] T070 [US4] Implement POST `/api/catalog-imports` start handler in `src/ArchiveDex.Api/Handlers/CatalogImportHandlers.cs`
- [x] T071 [US4] Implement GET `/api/catalog-imports/active` handler in CatalogImportHandlers
- [x] T072 [US4] Implement GET `/api/catalog-imports/{importRunId}` status handler in CatalogImportHandlers
- [x] T073 [US4] Implement POST `/api/catalog-imports/{importRunId}/cancel` handler in CatalogImportHandlers
- [x] T074 [US4] Implement POST `/api/catalog-imports/{importRunId}/resume` handler in CatalogImportHandlers
- [x] T075 [US4] Implement GET `/api/catalog-imports/{importRunId}/report` handler in CatalogImportHandlers
- [x] T076 [US4] Implement GET `/api/catalog-imports/{importRunId}/errors` handler in CatalogImportHandlers
- [x] T077 [US4] Implement GET `/api/catalog-imports/{importRunId}/image-quality` handler in CatalogImportHandlers
- [x] T078 [US4] Add API contract tests in `tests/ArchiveDex.Api.Tests/CatalogImport/CatalogImportContractTests.cs`
- [x] T117 [US4] Return 409 Conflict from POST `/api/catalog-imports` when another import is active

**Checkpoint**: Web UI can start, monitor, cancel, resume, and report imports.

---

## Phase 10: Web UI `/admin/import`

**Purpose**: Provide admin-facing import controls and visibility.

- [x] T079 [US4] Create admin import page in `src/ArchiveDex.Web/Components/Pages/Admin/ImportAdmin.razor`
- [x] T080 [US4] Add route `/admin/import` to ImportAdmin.razor
- [x] T081 [US4] Implement source and language selection form
- [x] T082 [US4] Implement dry-run and image-download options
- [x] T083 [US4] Show price import as deferred/disabled option
- [x] T084 [US4] Implement start import action
- [x] T085 [US4] Implement cancel and resume actions
- [x] T086 [US4] Implement progress display grouped by source, language, and set
- [x] T118 [US4] Implement progress refresh so persisted state changes appear in the Web UI within 5 seconds
- [x] T087 [US4] Implement errors and warnings display
- [x] T088 [US4] Implement pending mappings summary display
- [x] T089 [US4] Implement image quality summary display
- [x] T090 [US4] Implement final report display
- [x] T091 [US4] Add localization strings in `src/ArchiveDex.Web/Resources/SharedResources.de.resx`
- [x] T092 [US4] Add localization strings in `src/ArchiveDex.Web/Resources/SharedResources.en.resx`
- [x] T093 [US4] Add localization strings in `src/ArchiveDex.Web/Resources/SharedResources.ru.resx`
- [x] T094 [US4] Add bUnit tests in `tests/ArchiveDex.Web.Tests/Pages/ImportAdminPageTests.cs`
- [x] T119 [US4] Add bUnit or component test verifying progress refresh observes persisted updates within 5 seconds

**Checkpoint**: Admin can control and inspect imports from the browser.

---

## Phase 11: Validation and Reporting

**Purpose**: Produce trustworthy completion reports and surface data quality problems.

- [x] T095 [US4] Implement duplicate set validation in CatalogReconciler or reporting service
- [x] T096 [US4] Implement duplicate CardPrint validation
- [x] T097 [US4] Implement missing image validation
- [x] T098 [US4] Implement unknown language validation
- [x] T099 [US4] Implement sets-without-cards validation
- [x] T100 [US4] Implement import report aggregation in CatalogImportRepository
- [x] T101 [US4] Add report validation tests in `tests/ArchiveDex.Application.Tests/CatalogImport/CatalogImportReportTests.cs`
- [x] T120 [US4] Add source-missing counts and details to import report aggregation
- [x] T121 [US4] Display source-missing counts and details in the import report UI

**Checkpoint**: Completed imports produce actionable reports.

---

## Phase 12: End-to-End Verification and Polish

**Purpose**: Verify the full feature works end-to-end and meets non-functional requirements.

- [x] T102 [P] Run `dotnet format` on the solution
- [x] T103 [P] Run domain and application test suites
- [x] T104 [P] Run infrastructure tests, including fixture imports and image scoring
- [x] T105 [P] Run API contract tests
- [x] T106 [P] Run Web UI tests
- [x] T107 Run full fixture-backed import twice and verify idempotency
- [x] T108 Run resume-after-cancel verification
- [x] T109 Verify non-selected temporary images are deleted
- [x] T110 Verify prices are not imported and UI marks them as deferred
- [x] T122 Verify single-active-import blocking end-to-end
- [x] T123 Verify source-missing records are marked and canonical catalog records are not deleted

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** blocks all implementation phases.
- **Phase 2** should be completed before implementation of matching, scoring, and protection rules.
- **Phase 3** blocks adapters, repository, orchestrator, handlers, and UI.
- **Phase 4** can run after Phase 3 and before full orchestration.
- **Phase 5** blocks orchestration, API status, and reporting.
- **Phase 6** blocks canonical upsert and idempotency completion.
- **Phase 7** can run in parallel with Phase 6 after repository contracts exist.
- **Phase 8** depends on Phases 4-7.
- **Phase 9** depends on repository/orchestrator contracts.
- **Phase 10** depends on Phase 9 API contracts.
- **Phase 11** depends on repository and reconciliation outputs.
- **Phase 12** runs after all user stories are implemented.

### Parallel Opportunities

- T001-T010 and T111-T112 can run in parallel.
- T013-T018 and T113-T114 can run in parallel.
- T019-T025 can run in parallel.
- T026-T031 can run in parallel by source.
- T040-T050 and T051-T059 can partially overlap.
- T070-T078 and T079-T094 can overlap after API DTO shapes stabilize.
- Localization tasks T091-T093 can run in parallel.

## MVP Cut

Minimum independently useful internal milestone, not feature-complete acceptance and not sufficient to close this feature:

1. Phase 1 schema foundation.
2. Phase 3 contracts.
3. TCGdex adapter only from Phase 4.
4. Phase 5 repository/checkpoints.
5. Phase 6 canonical merge.
6. Phase 8 orchestrator with dry-run and resume.
7. Basic Phase 9 API and Phase 10 Web UI.

Limitless, Serebii, image scoring, and richer reporting can then be layered in without changing the core import contract.
