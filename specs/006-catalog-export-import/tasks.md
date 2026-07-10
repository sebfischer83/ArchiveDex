# Tasks: Catalog Export and Import

**Input**: Design documents from `/specs/006-catalog-export-import/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/catalog-transfer.openapi.yaml`

**Tests**: Required. The constitution mandates TDD plus contract and integration tests for public interfaces, persistence, and the catalog package format. Write test tasks first and confirm they fail before their implementation tasks.

**Organization**: Tasks are grouped by user story so each flow can be implemented and verified independently after the shared foundation is complete.

## Format: `[ID] [P?] [USn?] Description`

- **[P]**: Can run in parallel with other marked tasks when their listed dependencies are complete.
- **[USn]**: Required only for user-story tasks; setup, foundational, and polish tasks intentionally have no story label.
- Every task includes its exact implementation or test path.

## Phase 1: Setup

**Purpose**: Establish feature-local test fixtures and resource locations without changing runtime behavior.

- [x] T001 Create catalog-transfer test fixture builders for canonical records, Unicode text, image files, and temporary roots in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferFixture.cs`
- [x] T002 [P] Create package fixture and tampering helpers in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferPackageFixture.cs`
- [x] T003 [P] Add a catalog-transfer test authentication helper to `tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogTransferTestAuthentication.cs`
- [x] T004 [P] Create a catalog-transfer localization test helper that loads existing resource cultures in `tests/ArchiveDex.Web.Tests/CatalogTransfer/CatalogTransferLocalizationFixture.cs`

---

## Phase 2: Foundational

**Purpose**: Provide the durable operation model, secure administration boundary, target-local catalog image abstraction, and archive validation primitives required by every story.

**⚠️ CRITICAL**: Complete this phase before implementing any user story.

### Tests for Foundational Infrastructure

- [x] T005 [P] Write failing state-transition and exclusive-lease tests in `tests/ArchiveDex.Domain.Tests/CatalogTransfer/CatalogTransferOperationTests.cs` before T009-T010
- [x] T006 [P] Write failing manifest canonicalization, hash, version, duplicate identity, relationship, archive-path, target-local image staging-path, and capacity-validation tests in `tests/ArchiveDex.Domain.Tests/CatalogTransfer/CatalogTransferManifestTests.cs` before T011, T012, T016, and T017
- [x] T007 [P] Write failing persistence, journal recovery, and bidirectional shared-lock tests for operation, error, migration constraint, existing catalog import, and catalog mutation starts in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferRepositoryTests.cs` before T013-T015, T018, and T020
- [x] T008 [P] Write failing authorization middleware/controller tests in `tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogTransferAuthorizationTests.cs` before T019

### Implementation for Foundational Infrastructure

- [x] T009 [P] Add `CatalogTransferKind`, `CatalogTransferStatus`, and `CatalogTransferPhase` enums with documented transitions in `src/ArchiveDex.Domain/Enums/CatalogTransferKind.cs`, `src/ArchiveDex.Domain/Enums/CatalogTransferStatus.cs`, and `src/ArchiveDex.Domain/Enums/CatalogTransferPhase.cs`
- [x] T010 [P] Add documented transfer operation, error, and recovery journal entities in `src/ArchiveDex.Domain/Entities/CatalogTransferOperation.cs`, `src/ArchiveDex.Domain/Entities/CatalogTransferError.cs`, and `src/ArchiveDex.Domain/Entities/CatalogTransferJournal.cs`
- [x] T011 [P] Add package manifest, inventory entry, catalog snapshot, and image-reference DTOs in `src/ArchiveDex.Application/CatalogTransfer/Package/CatalogTransferManifest.cs`, `src/ArchiveDex.Application/CatalogTransfer/Package/CatalogSnapshot.cs`, and `src/ArchiveDex.Application/CatalogTransfer/Package/PackageImageReference.cs`
- [x] T012 [P] Define transfer repository, coordinator, package archive, catalog snapshot, catalog image storage, capacity, and recovery abstractions in `src/ArchiveDex.Application/Abstractions/ICatalogTransferRepository.cs`, `src/ArchiveDex.Application/Abstractions/ICatalogTransferOrchestrator.cs`, `src/ArchiveDex.Application/Abstractions/ICatalogTransferArchive.cs`, `src/ArchiveDex.Application/Abstractions/ICatalogSnapshotStore.cs`, `src/ArchiveDex.Application/Abstractions/ICatalogImageStore.cs`, and `src/ArchiveDex.Application/Abstractions/ICatalogTransferRecovery.cs`
- [x] T013 Extend `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs` with transfer sets, relationships, status conversions, indexes, and the database-enforced non-terminal operation lease
- [x] T014 Create the EF Core migration for transfer operation, error, journal, and shared catalog-operation lease schema in `src/ArchiveDex.Infrastructure/Migrations/`
- [x] T015 Implement operation persistence and a named shared catalog-operation lease with acquisition before snapshot/validation, durable release on terminal state, and report reads in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferRepository.cs` after T007
- [x] T016 Implement target-local catalog image path validation, staging, promotion, deletion, and capacity checks in `src/ArchiveDex.Infrastructure/Storage/CatalogTransferImageStore.cs`
- [x] T017 Implement package path safety, manifest version/category/count/relationship validation, and streamed SHA-256 verification in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferPackageValidator.cs`
- [x] T018 Register the shared catalog-operation lease and enforce it for transfer, existing full-catalog import, catalog repository writes, and set-mapping writes in `src/ArchiveDex.Infrastructure/DependencyInjection.cs`, `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`, `src/ArchiveDex.Infrastructure/Persistence/CatalogRepository.cs`, and `src/ArchiveDex.Application/Sets/SetMappingService.cs`
- [x] T019 Enable authentication and authorization middleware and define the administrator policy used by transfer routes in `src/ArchiveDex.Web/Program.cs` and `src/ArchiveDex.Infrastructure/Setup/IdentitySetup.cs`
- [x] T020 Implement startup cleanup of incomplete transfer staging/promoted roots, mark interrupted operations, and release/reconcile the shared catalog-operation lease in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferRecoveryService.cs` and register it from `src/ArchiveDex.Web/Program.cs`

**Checkpoint**: Package validation, durable coordination, target-local storage, administrator access, and restart cleanup are available to all stories.

---

## Phase 3: User Story 1 - Export the Complete Catalog (Priority: P1) 🎯 MVP

**Goal**: An administrator creates and downloads one verified, self-contained catalog package containing all in-scope canonical data and readable catalog images.

**Independent Test**: Populate all in-scope catalog entity types with multilingual data and shared images, start export, and verify the downloadable package inventory, hashes, counts, relationships, exclusions, and cancellation behavior without running import.

### Tests for User Story 1

- [x] T021 [P] [US1] Write failing package-writer tests for streaming ZIP64 output, manifest inventory, SHA-256 hashes, Unicode, and image de-duplication in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferArchiveWriterTests.cs`
- [x] T022 [P] [US1] Write failing export snapshot tests for inclusion/exclusion of every catalog entity and source-path rewriting in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogExportSnapshotTests.cs`
- [x] T023 [P] [US1] Write failing export integration tests for complete export, unreadable image failure, cancellation cleanup, and bidirectional conflicts with existing catalog imports and catalog mutations in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogExportIntegrationTests.cs`
- [x] T024 [P] [US1] Write failing HTTP contract tests for export start/status/cancel/report/download and administrator-only access in `tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogExportContractTests.cs`

### Implementation for User Story 1

- [x] T025 [US1] Implement deterministic, batched enumeration of only in-scope canonical catalog records and readable referenced images in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogSnapshotStore.cs`
- [x] T026 [US1] Implement streamed ZIP64 package writing, hash-addressed image entries, manifest creation, temporary output verification, and atomic publish in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferArchive.cs`
- [x] T027 [US1] Implement export lifecycle, repeatable catalog snapshot, cancellation checkpoints, structured error reporting, and package download eligibility in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogExportService.cs`
- [x] T028 [US1] Implement the queued export worker entry point with scoped service resolution and structured operation logs in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferExecutionService.cs`
- [x] T029 [US1] Add export/status/cancel/report/download request-response DTOs in `src/ArchiveDex.Application/CatalogTransfer/Contracts/CatalogTransferOperationDto.cs`, `src/ArchiveDex.Application/CatalogTransfer/Contracts/CatalogTransferReportDto.cs`, and `src/ArchiveDex.Application/CatalogTransfer/Contracts/CatalogTransferErrorDto.cs`
- [x] T030 [US1] Implement authorized export, active status, cancellation, report, and completed-package download endpoints from the OpenAPI contract in `src/ArchiveDex.Api/Controllers/CatalogTransferController.cs`

**Checkpoint**: User Story 1 supports trustworthy export and download independently. Verify Scenario 1 in `specs/006-catalog-export-import/quickstart.md`.

---

## Phase 4: User Story 2 - Import into Another Instance (Priority: P1)

**Goal**: An administrator validates and restores a package into an empty target without external network access, recreating catalog identities, relationships, customizations, and images together.

**Independent Test**: Import a User Story 1 package into an empty configured target with external sources disabled; compare source/target records and image bytes, then prove non-empty target, capacity, and restore failures leave no target content.

### Tests for User Story 2

- [x] T031 [P] [US2] Write failing archive-reader/staging tests for package path rejection, hash mismatch, unsupported version, capacity failure, and no external network use in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogImportValidationTests.cs`
- [x] T032 [P] [US2] Write failing round-trip PostgreSQL/filesystem tests for all catalog entities, local corrections, Unicode, shared images, target-local paths, and restored browsing/matching queries in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogImportRoundTripTests.cs`
- [x] T033 [P] [US2] Write failing rollback, cancellation, promotion failure, restart-recovery, terminal lease release, and bidirectional import-vs-mutation conflict tests in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogImportRecoveryTests.cs`
- [x] T034 [P] [US2] Write failing HTTP contract tests for validate upload, import start, empty-target rejection, and no mutation after failed validation in `tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogImportContractTests.cs`

### Implementation for User Story 2

- [x] T035 [US2] Implement streamed package upload, ZIP entry inspection, full staging extraction, and pre-mutation validation using the shared validator in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogImportValidationService.cs`
- [x] T036 [US2] Implement empty-target checks immediately after validation and immediately before restore in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogImportEligibilityService.cs`
- [x] T037 [US2] Implement ordered catalog graph restoration with preserved GUIDs, rebuilt target-local image references, and an EF Core transaction in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogImportRestoreService.cs`
- [x] T038 [US2] Implement journaled staged-image promotion, rollback cleanup, and terminal import state/report handling in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogImportFinalizationService.cs`
- [x] T039 [US2] Extend `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferExecutionService.cs` to execute validated imports with cancellation checkpoints and offline-only restore behavior
- [x] T040 [US2] Extend `src/ArchiveDex.Api/Controllers/CatalogTransferController.cs` with authorized multipart validation upload and validated-import start endpoints from `specs/006-catalog-export-import/contracts/catalog-transfer.openapi.yaml`

**Checkpoint**: User Story 2 restores a complete package into an empty target independently. Verify Scenario 2 and the rollback portions of Scenario 5 in `specs/006-catalog-export-import/quickstart.md`.

---

## Phase 5: User Story 3 - Validate and Review a Transfer (Priority: P2)

**Goal**: The administrator sees localized transfer controls, validation results, progress, conflicts, actionable failures, and final reports for both directions.

**Independent Test**: In the browser, export and import operations show phase/count/image progress; a corrupted/incompatible upload reports its failed check and remediation before mutation; final reports make completion status unambiguous in each supported UI language.

### Tests for User Story 3

- [x] T041 [P] [US3] Write failing report/status API contract tests for validation failures, progress fields persisted at most five seconds apart, conflict responses, and structured transfer errors in `tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogTransferReportContractTests.cs`
- [x] T042 [P] [US3] Write failing bUnit tests proving export and import start flows need no more than five selections/confirmations, plus upload validation, polling, cancellation, conflicts, completed reports, and localized errors in `tests/ArchiveDex.Web.Tests/CatalogTransfer/CatalogTransferPageTests.cs`
- [x] T043 [P] [US3] Write failing localization coverage tests for German, English, and Russian transfer labels/status/errors in `tests/ArchiveDex.Web.Tests/CatalogTransfer/CatalogTransferLocalizationTests.cs`

### Implementation for User Story 3

- [x] T044 [US3] Add report aggregation, elapsed time, category counts, validation outcome, and safe structured error mapping in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferReportService.cs`
- [x] T045 [US3] Complete status/report/conflict response mapping in `src/ArchiveDex.Api/Controllers/CatalogTransferController.cs` and error response definitions in `src/ArchiveDex.Api/Models/CatalogTransferErrorResponse.cs`
- [x] T046 [US3] Implement the authorized, localized catalog transfer page with export, package upload, validation, import start, cancellation, progress polling, and final reports in `src/ArchiveDex.Web/Components/Pages/Catalog/Transfer.razor`
- [x] T047 [US3] Add the catalog transfer navigation entry and transfer-specific styles in `src/ArchiveDex.Web/Components/Layout/NavMenu.razor` and `src/ArchiveDex.Web/Components/Pages/Catalog/Transfer.razor.css`
- [x] T048 [US3] Complete localized controls, phases, reports, warnings, and actionable error text in `src/ArchiveDex.Web/Resources/SharedResources.resx`, `src/ArchiveDex.Web/Resources/SharedResources.de.resx`, and `src/ArchiveDex.Web/Resources/SharedResources.ru.resx`

**Checkpoint**: All transfer states are understandable and usable. Verify Scenarios 3 through 5 in `specs/006-catalog-export-import/quickstart.md`.

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Validate the full feature against the performance, reliability, documentation, and quality gates.

- [x] T049 [P] Add deterministic streaming export/import benchmarks with proportional 60-minute throughput, 1 GiB working-set, and five-second progress-cadence thresholds in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferPerformanceTests.cs`
- [x] T050 [P] Add structured logging assertions for operation lifecycle, validation failures, cancellation, and recovery in `tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferObservabilityTests.cs`
- [x] T051 Document administrator transfer, package handling, compatibility, and recovery behavior in `README.md`
- [x] T052 Run the complete quickstart scenarios, a documented ten-administrator usability validation for the two-minute/five-interaction and 90%-report-comprehension criteria, and all transfer test filters from `specs/006-catalog-export-import/quickstart.md`, recording results in `specs/006-catalog-export-import/quickstart.md`
- [x] T053 Add CI enforcement for transfer benchmark thresholds, formatting, full tests, coverage, and migration validation in `.github/workflows/catalog-transfer.yml` using `ArchiveDex.slnx`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories because it supplies security, the named shared catalog-operation lease, persistence, archive safety, and recovery primitives. T007 is written and observed failing before T013-T015; T018 wires the lease into every existing catalog-changing entry point before story work starts.
- **Phase 3 (US1)**: Depends on Phase 2; produces a validated source package and is the MVP.
- **Phase 4 (US2)**: Depends on Phase 2 and a package fixture from US1 tests; production import does not depend on a completed US1 UI because it accepts a package upload.
- **Phase 5 (US3)**: Depends on Phase 2; final UI wiring depends on the export and import endpoints from US1 and US2.
- **Phase 6 (Polish)**: Depends on all desired user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational work; recommended first MVP.
- **US2 (P1)**: Independent target restore implementation after foundational work; its end-to-end fixture is supplied by US1 export tests.
- **US3 (P2)**: Reuses the operation/report contracts from US1 and US2 to present the complete administration flow.

### Parallel Opportunities

- T005-T008 can be authored in parallel. Each test task must be observed failing before its named implementation tasks begin: T005 before T009-T010, T006 before T011/T012/T016/T017, T007 before T013-T015/T018/T020, and T008 before T019. After those dependencies are complete, T009-T012 can run in parallel in separate files. T021-T024 can run in parallel within US1 because each changes separate test files.
- After Phase 2, US1 archive writing and US2 validation/restore tests can progress in parallel using shared fixture contracts.
- T041-T043 can run in parallel once backend report DTOs are stable. T043 must be observed failing before T048 adds catalog-transfer resource strings; T046 follows the relevant API contract tests, and T047 follows page creation.
- T049-T051 can run in parallel after user stories complete.

## Parallel Example: User Story 1

```text
Task: "T021 Archive writer tests in tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogTransferArchiveWriterTests.cs"
Task: "T022 Snapshot scope tests in tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogExportSnapshotTests.cs"
Task: "T023 Export integration tests in tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogExportIntegrationTests.cs"
Task: "T024 Export HTTP contract tests in tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogExportContractTests.cs"
```

## Parallel Example: User Story 2

```text
Task: "T031 Import validation tests in tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogImportValidationTests.cs"
Task: "T032 Import round-trip tests in tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogImportRoundTripTests.cs"
Task: "T033 Import recovery tests in tests/ArchiveDex.Infrastructure.Tests/CatalogTransfer/CatalogImportRecoveryTests.cs"
Task: "T034 Import HTTP contract tests in tests/ArchiveDex.Api.Tests/CatalogTransfer/CatalogImportContractTests.cs"
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1, including all failing-first tests.
3. Validate the exported package inventory, exclusions, hashes, cancellation cleanup, access control, and download flow.
4. Demo the export-only MVP before implementing target restore.

### Incremental Delivery

1. Deliver export after Phase 3 as the first independently demonstrable increment.
2. Add isolated, all-or-nothing import in Phase 4 and validate a full round trip.
3. Add the complete localized operator workflow and reporting in Phase 5.
4. Complete performance, observability, documentation, and full regression validation in Phase 6.

## Notes

- All tasks use the required checkbox, sequential task ID, optional parallel marker, story label, and exact path format.
- Do not start implementation tasks before their corresponding test tasks have been written and observed failing.
- Preserve existing user changes in unrelated files, including `src/ArchiveDex.Domain/Enums/CardLanguage.cs`.

---

## Phase 7: Convergence

**Purpose**: Fill the gaps between the spec/plan/tasks intent and the current implementation.

**⚠️ CRITICAL items must be resolved before the feature is considered complete.**

- [x] T054 Create the EF Core migration for `CatalogTransferOperation`, `CatalogTransferError`, and `CatalogTransferJournal` tables per T014 in `src/ArchiveDex.Infrastructure/Migrations/` (missing)

- [x] T055 [P] Write the 13 missing test files: `CatalogTransferArchiveWriterTests.cs`, `CatalogExportSnapshotTests.cs`, `CatalogExportIntegrationTests.cs`, `CatalogExportContractTests.cs`, `CatalogImportValidationTests.cs`, `CatalogImportRoundTripTests.cs`, `CatalogImportRecoveryTests.cs`, `CatalogImportContractTests.cs`, `CatalogTransferReportContractTests.cs`, `CatalogTransferPageTests.cs`, `CatalogTransferLocalizationTests.cs`, `CatalogTransferPerformanceTests.cs`, `CatalogTransferObservabilityTests.cs` in `tests/ArchiveDex.*.Tests/CatalogTransfer/` per T021-T034, T041-T043, T049-T050 (missing)

- [x] T056 [P] Rewire `CatalogTransferOperationTests.cs` and `CatalogTransferRepositoryTests.cs` to reference production `ArchiveDex.Domain.Entities.CatalogTransferOperation` instead of local shadow types per T005, T007, Constitution II (partial)

- [x] T05- [ ] T057 [P] Rewire `CatalogTransferManifestTests.cs` to reference production `ArchiveDex.Application.CatalogTransfer.Package.CatalogTransferManifest` instead of local shadow type per T006, Constitution II (partial)

- [x] T05- [ ] T058 [P] Inject `ICatalogTransferRepository` and check `HasActiveOperationAsync` before writes in `src/ArchiveDex.Infrastructure/Persistence/CatalogRepository.cs` and `src/ArchiveDex.Application/Sets/SetMappingService.cs` per T018, FR-011, FR-022 (partial)

- [x] T05- [ ] T059 [P] Revise `CatalogTransferArchive.WritePackageAsync` to stream actual image bytes into the ZIP and append image entries to the manifest in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferArchive.cs` per FR-002, SC-002 (partial)

- [x] T06- [ ] T060 [P] Extend `CatalogSnapshotStore.EnumerateImagesAsync` to open and stream actual image files from the configured storage path in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogSnapshotStore.cs` per FR-002 (partial)

- [x] T06- [ ] T061 Add a "Start Import" button to `Transfer.razor` that calls `Orchestrator.StartImportRestoreAsync()` when validation succeeds for an import operation per US2-Accept-Scenario-1 (partial)

- [x] T06- [ ] T062 Replace `AuthorizationTestHandler` in `CatalogTransferAuthorizationTests.cs` with `WebApplicationFactory`-based authenticated client tests per T008, FR-001 (partial)

- [x] T06- [ ] T063 [P] Add paged enumeration to `CatalogSnapshotStore.CreateSnapshotAsync` in `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogSnapshotStore.cs` to bound working-set memory per plan.md:31-32 (partial)

- [x] T06- [ ] T064 [P] Add `OccurredAt` to `CatalogTransferErrorDto` and update `CatalogTransferReportService` / `CatalogTransferController` error mappings in `src/ArchiveDex.Application/CatalogTransfer/Contracts/CatalogTransferErrorDto.cs`, `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogTransferReportService.cs`, `src/ArchiveDex.Api/Controllers/CatalogTransferController.cs` per FR-024 (partial)

- [x] T06- [ ] T065 [P] Add missing `CardPrint` fields (`TypesJson`, `AttacksJson`, `WeaknessesJson`, `ResistancesJson`, `Retreat`, `EvolveFrom`, `RegulationMark`, `Suffix`, `DexIdsJson`, `Level`, `LegalStandard`, `LegalExpanded`) to `CatalogCardPrintDto` and `CatalogImportRestoreService` in `src/ArchiveDex.Application/CatalogTransfer/Package/CatalogSnapshot.cs`, `src/ArchiveDex.Infrastructure/CatalogTransfer/CatalogImportRestoreService.cs` per FR-008, Edge-5 (partial)
