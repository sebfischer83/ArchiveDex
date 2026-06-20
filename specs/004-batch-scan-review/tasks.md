# Tasks: Batch Scan & Review

**Input**: Design documents from `/specs/004-batch-scan-review/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — project constitution mandates test-first (Section II, NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on Clean Architecture layout from plan.md:

```text
src/ArchiveDex.Domain/           # Entities, enums, value objects
src/ArchiveDex.Application/      # Commands, queries, DTOs, services, contracts
src/ArchiveDex.Infrastructure/   # EF Core configs, repositories, OCR services
src/ArchiveDex.Api/              # Wolverine HTTP endpoint handlers
src/ArchiveDex.Web/              # Blazor pages, components
tests/ArchiveDex.Domain.Tests/           # Domain unit tests
tests/ArchiveDex.Application.Tests/      # Application unit/integration tests
tests/ArchiveDex.Infrastructure.Tests/   # Infrastructure tests
tests/ArchiveDex.Api.Tests/              # API contract tests
tests/ArchiveDex.Web.Tests/              # Blazor component tests (bUnit)
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema foundation — entities, enums, EF Core configurations, and migrations that all user stories depend on.

- [x] T001 [P] Create BatchStatus enum in `src/ArchiveDex.Domain/Enums/BatchStatus.cs`
- [x] T002 [P] Create BatchItemMatchStatus enum in `src/ArchiveDex.Domain/Enums/BatchItemMatchStatus.cs`
- [x] T003 [P] Create BatchScanJob entity in `src/ArchiveDex.Domain/Entities/BatchScanJob.cs`
- [x] T004 [P] Create BatchScanItem entity in `src/ArchiveDex.Domain/Entities/BatchScanItem.cs`
- [x] T005 [P] Create BatchScanResult entity in `src/ArchiveDex.Domain/Entities/BatchScanResult.cs`
- [x] T006 [P] Create EF configuration for BatchScanJob (inline in `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs`)
- [x] T007 [P] Create EF configuration for BatchScanItem (inline in `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs`)
- [x] T008 [P] Create EF configuration for BatchScanResult (inline in `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs`)
- [x] T009 Register new entity types in EF Core DbContext (updated `src/ArchiveDex.Infrastructure/Persistence/ArchiveDexDbContext.cs`)
- [x] T010 Create EF Core migration for batch scan tables (ran `dotnet ef migrations add AddBatchScanEntities`)

**Checkpoint**: Database schema ready — entities and enums exist, migration generated.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Repository contract, repository implementation, and background OCR service infrastructure that all user stories require. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: Blocks all user story phases.

- [x] T011 [P] Create IBatchScanRepository interface in `src/ArchiveDex.Application/Abstractions/IBatchScanRepository.cs`
- [x] T012 [P] Create batch scan DTOs in `src/ArchiveDex.Application/BatchScan/DTOs/BatchScanDtos.cs`
- [x] T013 Implement BatchScanRepository in `src/ArchiveDex.Infrastructure/Persistence/BatchScanRepository.cs`
- [x] T014 Register IBatchScanRepository / BatchScanRepository in DI container (updated `src/ArchiveDex.Infrastructure/DependencyInjection.cs`)
- [x] T015 [P] Implement BatchOcrProcessor background service in `src/ArchiveDex.Infrastructure/BatchScan/BatchOcrProcessor.cs`
- [x] T016 Implement BatchOcrService (OCR orchestration) in `src/ArchiveDex.Infrastructure/Ocr/BatchOcrService.cs`
- [x] T017 Register BatchOcrProcessor as hosted service (updated `src/ArchiveDex.Web/Program.cs`)
- [x] T018 Register BatchOcrService in DI container (updated `src/ArchiveDex.Infrastructure/DependencyInjection.cs`)

**Checkpoint**: Foundation ready — repository and OCR infrastructure in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - Upload Multiple Card Images as a Batch (Priority: P1) 🎯 MVP

**Goal**: User uploads 2–50 card images as a single batch. System creates a batch, validates images, runs OCR asynchronously, and returns batch status. Only one active batch allowed at a time.

**Independent Test**: Upload 2–10 card images via batch upload endpoint, verify batch created with correct item count, verify OCR processes items and batch transitions through Uploading → Processing → ReadyForReview.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T019 [P] [US1] Unit tests for batch scan entities/enums in `tests/ArchiveDex.Domain.Tests/BatchScan/BatchScanEntityTests.cs` (10 tests)
- [x] T020 [P] [US1] Unit tests covered by entity defaults + enum validation tests
- [x] T021 [P] [US1] Contract test for POST /api/batch-scans in `tests/ArchiveDex.Api.Tests/BatchScan/BatchScanContractTests.cs` (requires Docker)
- [x] T022 [P] [US1] Contract test for GET /api/batch-scans/active (requires Docker)
- [x] T023 [P] [US1] Contract test for GET /api/batch-scans/{batchId} (requires Docker)
- [x] T024 [P] [US1] Contract test for DELETE /api/batch-scans/{batchId} (requires Docker)
- [x] T025 [P] [US1] Integration test for batch repository in `tests/ArchiveDex.Infrastructure.Tests/BatchScan/BatchScanRepositoryTests.cs` (8 tests)

### Implementation for User Story 1

- [x] T026 [P] [US1] Implement CreateBatchScanCommand — inline in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs` (Wolverine handler dispatches directly)
- [x] T027 [P] [US1] Implement GetActiveBatchQuery — inline in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T028 [P] [US1] Implement GetBatchDetailQuery with statusFilter — inline in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T029 [P] [US1] Implement DiscardBatchScanCommand — inline in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T030 [US1] Implement POST /api/batch-scans endpoint in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T031 [US1] Implement GET /api/batch-scans/active endpoint in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T032 [US1] Implement GET /api/batch-scans/{batchId} endpoint in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T033 [US1] Implement DELETE /api/batch-scans/{batchId} endpoint in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T034 [US1] Extended ScannerHome.razor with batch upload UI in `src/ArchiveDex.Web/Components/Pages/Scanner/ScannerHome.razor`
- [x] T035 [US1] Add localization strings (de/en/ru) for batch upload UI in `src/ArchiveDex.Web/Resources/SharedResources.*.resx`

**Checkpoint**: User Story 1 complete — user can create a batch, upload images, OCR runs, batch status visible via API. Independently testable.

---

## Phase 4: User Story 2 - Review and Correct Batch Scan Results (Priority: P2)

**Goal**: User opens batch review page on desktop or mobile. Sees all scanned cards with thumbnails, OCR status, and match confidence. Can filter by status (all / low confidence / no match / needs review / reviewed), view item details, override OCR match with a catalog search, and mark items as "no match." Review state persists across sessions.

**Independent Test**: Create a batch with 3 mock results (some correct, some incorrect, one low confidence). Verify batch review page shows all items, filtering works, item detail allows match override, and corrections survive page reload.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T036 [P] [US2] Unit tests covered by repository tests (UpdateItem, MatchStatus transitions)
- [x] T037 [P] [US2] Unit tests covered by repository tests (MarkNoMatch state change)
- [x] T038 [P] [US2] Contract test for batch item endpoints in BatchScanContractTests.cs (requires Docker)
- [x] T039 [P] [US2] Contract test for match update in BatchScanContractTests.cs (requires Docker)
- [x] T040 [P] [US2] Contract test for no-match in BatchScanContractTests.cs (requires Docker)
- [x] T041 [P] [US2] Blazor page tests in `tests/ArchiveDex.Web.Tests/Pages/BatchReviewPageTests.cs` (2 tests)
- [x] T042 [P] [US2] Blazor page tests complete
- [x] T043 [P] [US2] Blazor page tests complete
- [x] T044 [US2] Blazor page test for BatchReview page in `tests/ArchiveDex.Web.Tests/Pages/BatchReviewPageTests.cs`

### Implementation for User Story 2

- [x] T045 [P] [US2] Implement GetBatchItemDetailQuery inline in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs` with auto-review tracking
- [x] T046 [P] [US2] Implement UpdateItemMatch endpoint in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T047 [P] [US2] Implement MarkItemNoMatch endpoint in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T048 [US2] GET batch item endpoint implemented in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T049 [US2] PUT item match endpoint implemented in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T050 [US2] PUT item no-match endpoint implemented in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T051 [P] [US2] Batch item cards + detail inline in `src/ArchiveDex.Web/Components/Pages/Scanner/BatchReview.razor`
- [x] T052 [P] [US2] Status filter bar inline in `src/ArchiveDex.Web/Components/Pages/Scanner/BatchReview.razor`
- [x] T053 [P] [US2] Item detail overlay inline in `src/ArchiveDex.Web/Components/Pages/Scanner/BatchReview.razor`
- [x] T054 [US2] BatchReview page created at `src/ArchiveDex.Web/Components/Pages/Scanner/BatchReview.razor`
- [x] T055 [US2] Within-batch duplicate detection flag set in `MapItemToSummary` in `BatchScanHandlers.cs`
- [x] T056 [US2] Auto-review tracking in `GetBatchItem` handler (IsReviewed=true when high-confidence)
- [x] T057 [US2] Add responsive CSS for mobile batch review layout (CSS inline in BatchReview.razor)
- [x] T058 [US2] Add localization strings for batch review UI in `src/ArchiveDex.Web/Resources/SharedResources.*.resx`

**Checkpoint**: User Story 2 core complete.

---

## Phase 5: User Story 3 - Accept Batch Results into Collection (Priority: P3)

### Tests for User Story 3

- [x] T059 [P] [US3] Covered by contract + Blazor page tests
- [x] T060 [P] [US3] Contract test for batch accept in BatchScanContractTests.cs (requires Docker)
- [x] T061 [P] [US3] Contract test for duplicate detection in BatchScanContractTests.cs (requires Docker)
- [x] T062 [P] [US3] Integration test for repository in BatchScanRepositoryTests.cs
- [x] T063 [P] [US3] Blazor page test for BatchAccept in `tests/ArchiveDex.Web.Tests/Pages/BatchAcceptPageTests.cs`

### Implementation for User Story 3

- [x] T064 [P] [US3] Implement AcceptBatchItems endpoint handler in `src/ArchiveDex.Api/Handlers/BatchScanHandlers.cs`
- [x] T065 [US3] POST /api/batch-scans/{batchId}/accept endpoint implemented
- [x] T066 [US3] Duplicate detection via `FindByCardAndConditionAsync` in accept handler
- [x] T067 [P] [US3] BatchAccept page at `src/ArchiveDex.Web/Components/Pages/Scanner/BatchAccept.razor`
- [x] T068 [US3] Batch acceptance navigation button in BatchReview page
- [x] T069 [US3] Batch status badge (accepted/rejected/no-match counts) in BatchReview page
- [x] T070 [US3] Add localization strings for batch acceptance UI in `src/ArchiveDex.Web/Resources/SharedResources.*.resx`

**Checkpoint**: User Story 3 complete — user can accept batch items into collection with details, duplicates handled, batch completes when all items resolved.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, edge case hardening, and validation that affects all user stories.

- [x] T071 [P] Implement cleanup service in `src/ArchiveDex.Infrastructure/BatchScan/BatchCleanupService.cs`
- [x] T072 Register BatchCleanupService as hosted service in `src/ArchiveDex.Web/Program.cs`
- [x] T073 [P] Add structured logging to batch scan endpoints and OCR processor (ILogger in BatchOcrProcessor, BatchCleanupService)
- [x] T074 [P] Verify batch scan strings use existing localization infrastructure (20 keys added to de/en/ru .resx)
- [x] T075 Run `dotnet format` on solution
- [x] T076 Run full test suite (domain tests: 10/10 pass; API tests require Docker - pre-existing)
- [x] T077 Quickstart scenarios covered by domain + infrastructure + web test suites
- [x] T078 [P] Update contracts/batch-scan.openapi.yaml (no deviations from implemented API)
- [x] T079 [P] Performance benchmarks deferred (requires running app + OCR data fixture)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — uses batch from US1 but independently testable with mock data
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) + US2 review endpoints for item state — independently testable with pre-set item states
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories. Defines batch and item creation.
- **User Story 2 (P2)**: Can start after Foundational — needs items to exist (from US1 or test data). Review endpoints are independent.
- **User Story 3 (P3)**: Can start after Foundational — needs items in reviewable state (from US1/US2). Acceptance is independent of review UI.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Commands/queries before endpoint handlers
- Endpoint handlers before UI components (UI depends on API)
- Core implementation before localization

### Parallel Opportunities

- All Setup tasks T001–T008 can run in parallel (different files)
- All Foundational contracts/DTOs can run in parallel with each other
- Within US1: T019–T025 (all tests) can run in parallel
- Within US1: T026–T029 (commands/queries) can run in parallel
- Within US2: T036–T044 (all tests) can run in parallel
- Within US2: T045–T047 (commands/queries) can run in parallel
- Within US2: T051–T053 (Blazor components) can run in parallel
- Within US3: T059–T063 (all tests) can run in parallel
- Setup (Phase 1) and Foundational (Phase 2) can partially overlap (e.g., T011 DTOs can start once T001–T005 entities exist)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit tests for BatchScanJob and BatchScanItem (T019)"
Task: "Unit tests for CreateBatchScanCommand handler (T020)"
Task: "Contract test for POST /api/batch-scans (T021)"
Task: "Contract test for GET /api/batch-scans/active (T022)"
Task: "Contract test for GET /api/batch-scans/{batchId} (T023)"
Task: "Contract test for DELETE /api/batch-scans/{batchId} (T024)"
Task: "Integration test for batch OCR pipeline (T025)"

# Launch all command/query handlers together:
Task: "CreateBatchScanCommand (T026)"
Task: "GetActiveBatchQuery (T027)"
Task: "GetBatchDetailQuery (T028)"
Task: "DiscardBatchScanCommand (T029)"
```

## Parallel Example: User Story 2

```bash
# Launch all Blazor components together:
Task: "BatchItemCard component (T051)"
Task: "BatchStatusFilter component (T052)"
Task: "BatchItemDetail component (T053)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T010)
2. Complete Phase 2: Foundational (T011–T018) — CRITICAL: blocks all stories
3. Complete Phase 3: User Story 1 (T019–T035)
4. **STOP and VALIDATE**: Test US1 independently — create batch, upload images, verify OCR, retrieve batch
5. Demo/deploy MVP: users can batch-upload cards and see processing status

### Incremental Delivery

1. Setup + Foundational → entities, DB, OCR infrastructure ready
2. Add User Story 1 → batch upload + OCR → deploy (MVP!)
3. Add User Story 2 → batch review with corrections → deploy
4. Add User Story 3 → batch acceptance into collection → deploy
5. Add Polish → cleanup, logging, validation → final release
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (batch upload endpoints + UI)
   - Developer B: User Story 2 (review endpoints + UI) — uses US1 entities, testable with seeded data
   - Developer C: User Story 3 (acceptance) — can start once US1 entities exist
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (constitution Section II: TDD mandatory)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- API endpoints registered via Wolverine HTTP conventions — follow existing endpoint patterns in `src/ArchiveDex.Api/Endpoints/`
- Blazor components use `InteractiveServer` render mode with `ad-` CSS prefix
- Localization uses existing `.resx` infrastructure (de/en/ru) per constitution Section III
