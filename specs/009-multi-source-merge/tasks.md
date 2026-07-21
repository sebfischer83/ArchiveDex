# Tasks: Multi-Source Catalog Merge

**Input**: Design documents from `/specs/009-multi-source-merge/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/pending-mappings-api.md, quickstart.md

**Tests**: Included and mandatory (Constitution II — test-first, non-negotiable). Every test task MUST be written and observed failing before its implementation task starts.

**Organization**: Grouped by user story (US1 set identity, US2 deterministic merge, US3 review workflow, US4 images) after shared foundational work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1–US4 from spec.md

## Phase 1: Setup

- [X] T001 Create `data/set-mappings.json` skeleton (schema: `{ sets: [{ canonicalName, releaseDate, tcgdex: { id }, limitless: { code }, serebii: { en, ja } }] }`) with 5 sample sets for tests; document maintenance in file header comment
- [X] T002 [P] Add shared merge test fixtures (multi-source `ImportedSet`/`ImportedCardDetail` builders) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/Fixtures/SourceDataBuilders.cs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema, normalization, and the two-phase pipeline skeleton every story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Failing unit tests for consistent number normalization (write path + compare path, "1"/"01"/"001" equal; regression for research.md P4) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogNormalizerTests.cs`
- [X] T004 Domain changes per data-model.md: `CardPrint.FieldSourcesJson`, `CardSet.FieldSourcesJson`, `CatalogImportRun.ConflictCount/PendingCount/PerSourceStatsJson`, new `PendingCardMapping` entity in `src/ArchiveDex.Domain/Entities/`
- [X] T005 EF Core migration: new columns/entity from T004 + unique indexes `(Source, Language, ExternalId)` on `CardSetExternalId`, `CardExternalId`, `SetMapping`; snapshot index `(ImportRunId, Source, Language, ExternalSetId)` in `src/ArchiveDex.Infrastructure/Migrations/`
- [X] T006 Normalize `CardPrint.Number` on every write and compare in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs` (makes T003 green); data migration normalizing existing `CardPrint.Number` + `CardExternalId.ExternalId` suffixes with collision log in `src/ArchiveDex.Infrastructure/Migrations/`
- [X] T007 [P] Failing integration test: orchestrator Phase A stages all selected sources into snapshots with zero catalog writes; Phase B merges from snapshots; cancel/resume via `CatalogImportCheckpoint` in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/TwoPhaseOrchestratorTests.cs`
- [X] T008 Restructure `CatalogImportOrchestrator` into two-phase pipeline (Phase A fetch→snapshots, Phase B resolve+merge reading snapshots grouped per logical entity across all sources; dry run stops after Phase A + report) in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [X] T009 Extend `ICatalogImportRepository` + `CatalogImportRepository` with snapshot read/grouping queries and pending/conflict counters in `src/ArchiveDex.Application/Abstractions/ICatalogImportRepository.cs`, `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportRepository.cs`

**Checkpoint**: Two-phase import runs end-to-end with the *old* matching/merge behavior intact — user stories can now replace resolution and merge independently.

---

## Phase 3: User Story 1 — One Canonical Set Per Logical Set (P1) 🎯 MVP

**Goal**: Same logical set from any source/language resolves to one canonical `CardSet`; uncertainty becomes `PendingSetMapping`, never a duplicate.

**Independent Test**: quickstart.md Scenario 1.

### Tests (write first, observe failing)

- [X] T010 [P] [US1] Unit tests for `SetResolver` stage order (ExternalId → SetMapping → heuristic → pending/new), scoring (name + release date ±14d + card count ±5%), threshold behavior, cross-language duplicate regression (research.md P1) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/SetResolverTests.cs`
- [X] T011 [P] [US1] Unit tests for `SeedMappingLoader`: idempotent load, manual mappings never overwritten, conflict reporting in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/SeedMappingLoaderTests.cs`
- [X] T012 [P] [US1] Integration test: import same logical set from three sources × two languages → exactly one `CardSet` with per-source external ids; ambiguous fixture → `PendingSetMapping` row created and set's cards parked (regression for P3) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/SetIdentityIntegrationTests.cs`
- [X] T013 [P] [US1] Unit test: TCGdex adapter supplies `ReleaseDate` from set detail (regression: currently always null) in `tests/ArchiveDex.Tcgdex.Tests/` + adapter test in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/TcgDexAdapterTests.cs`

### Implementation

- [X] T014 [US1] Implement `SetResolver` (stages, scoring, auto-`SetMapping` above threshold, `PendingSetMapping` creation with score/`ReasonsJson`/`SuggestedCardSetId`, park semantics) in `src/ArchiveDex.Infrastructure/CatalogImport/SetResolver.cs`; replace `TryFallbackSetMatchAsync` usage in `CatalogReconciler.cs`
- [X] T015 [P] [US1] Implement `SeedMappingLoader` reading `data/set-mappings.json` → `SetMapping` rows at import start in `src/ArchiveDex.Infrastructure/CatalogImport/SeedMappingLoader.cs`; DI registration in `src/ArchiveDex.Infrastructure/DependencyInjection.cs`
- [X] T016 [P] [US1] Fetch release date in `TcgDexCatalogSourceAdapter.GetSetsAsync` via set detail endpoint (one call per set) in `src/ArchiveDex.Infrastructure/CatalogImport/TcgDexCatalogSourceAdapter.cs`
- [X] T017 [US1] Wire resolver into Phase B; parked sets excluded from card merge; `PendingCount` counted into run report in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`
- [X] T018 [US1] Curate full `data/set-mappings.json` back catalog (~150–200 sets: TCGdex id ↔ Limitless code ↔ Serebii slug), validated by a test that every entry's ids are unique per source in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/SeedMappingDataTests.cs`

**Checkpoint**: Full import produces one set per logical set (SC-001); ambiguities appear as pending rows.

---

## Phase 4: User Story 2 — Deterministic Best-Value Merge (P1)

**Goal**: Field values converge to the documented precedence regardless of import order; provenance recorded; re-runs change nothing.

**Independent Test**: quickstart.md Scenario 2.

### Tests (write first, observe failing)

- [X] T019 [P] [US2] Unit tests for `FieldMergePolicy`: precedence matrix per field group, gap-filling, provenance comparison, commutativity property test (any source order → same result), idempotence, `LocalCorrection` supremacy (regressions for P2) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/FieldMergePolicyTests.cs`
- [X] T020 [P] [US2] Integration test: three-source card merge in both orders → identical `CardPrint` incl. `FieldSourcesJson`; Serebii thumbnail cannot displace TCGdex image; conflict counter increments when sources disagree in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/DeterministicMergeIntegrationTests.cs`
- [X] T021 [P] [US2] Integration test: dry run performs zero catalog writes but reports would-be adds/conflicts/pendings (FR-019) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/DryRunTests.cs`

### Implementation

- [X] T022 [US2] Implement `FieldMergePolicy` (field-group map from data-model.md, configurable precedence constants, provenance read/write on `FieldSourcesJson`) in `src/ArchiveDex.Infrastructure/CatalogImport/FieldMergePolicy.cs`
- [X] T023 [US2] Rewrite `UpsertCardPrintAsync` and `UpsertSetAsync` to consume all staged sources per entity through `FieldMergePolicy`; remove `??=`/overwrite logic; count conflicts in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [X] T024 [US2] Ambiguous card matches → `PendingCardMapping` rows (replaces log-only path) in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogReconciler.cs`
- [X] T025 [US2] Per-source run statistics (`PerSourceStatsJson`: setsSeen/cardsSeen/added/merged/skipped/conflicts/pendingCreated/errors/incomplete; source-unreachable marks `incomplete` instead of failing run) in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`

**Checkpoint**: SC-002 and SC-005 verifiable via quickstart Scenario 2.

---

## Phase 5: User Story 3 — Reviewable Ambiguities (P2)

**Goal**: Pending set/card mappings listable and resolvable in admin UI; resolution re-merges parked staged data and persists for future runs.

**Independent Test**: quickstart.md Scenario 3.

### Tests (write first, observe failing)

- [X] T026 [P] [US3] Contract tests per contracts/pending-mappings-api.md: extended `api/sets/pending` DTO (score/reasons/candidates), new `api/cards/pending` endpoints (list/assign/create-new/reject, 404/409 guards, admin policy), extended run DTO/report fields in `tests/ArchiveDex.Api.Tests/PendingMappingContractTests.cs`
- [X] T027 [P] [US3] Integration test: accept pending set mapping → `SetMapping(IsManual=true)` written, parked snapshot cards merged into target set without new import; rejected identity skipped+counted on next run (FR-014/015, SC-004) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/PendingResolutionTests.cs`

### Implementation

- [X] T028 [US3] Re-merge service: on accept/create-new, merge parked `SourceSetSnapshot`/`SourceCardSnapshot` rows for that source identity through resolver+policy in `src/ArchiveDex.Infrastructure/CatalogImport/PendingResolutionService.cs`; hook into existing `ISetMappingService` handlers in `src/ArchiveDex.Application/Commands/SetMapping/`
- [X] T029 [P] [US3] Card-pending Application layer: `LoadPendingCardMappings` query + `ResolvePendingCardMapping` command/handlers in `src/ArchiveDex.Application/Queries/Import/`, `src/ArchiveDex.Application/Commands/Import/`
- [X] T030 [US3] `CardMappingController` (`api/cards/pending`: GET list, assign, create-new, reject per contract) in `src/ArchiveDex.Api/Controllers/CardMappingController.cs`; extend pending-set DTO with score/reasons/candidates in `src/ArchiveDex.Application/Queries/SetMapping/`
- [X] T031 [US3] Extend run DTO/report endpoint (`conflictCount`, `pendingCount`, `phase`, `perSource[]`) in `src/ArchiveDex.Api/Controllers/CatalogImportController.cs`
- [X] T032 [US3] Angular admin: card-pending queue + candidate picker alongside existing set-pending UI; run report shows per-source stats + pending count; i18n keys (en/de/ru parity per `i18n-parity.spec.ts`) in `src/ArchiveDex.Web/ClientApp/src/app/features/admin/`
- [X] T033 [US3] Playwright e2e: pending review flow (list → accept → parked cards visible) with API mocks in `src/ArchiveDex.Web/ClientApp/e2e/`

**Checkpoint**: SC-003/SC-004 verifiable via quickstart Scenario 3.

---

## Phase 6: User Story 4 — Best Available Image (P3)

**Goal**: Image selection by decoded resolution across all sources; manual picks and byte-dedupe respected.

**Independent Test**: quickstart.md Scenario 4.

### Tests (write first, observe failing)

- [X] T034 [P] [US4] Unit tests: dimension decoding sets real width/height, resolution-dominant score (small hi-res PNG beats bloated JPEG), SHA-256 dedupe, `IsManuallySelected` never displaced (regression for P6) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/ImageCandidateAnalyzerTests.cs`

### Implementation

- [X] T035 [US4] Decode dimensions with SkiaSharp in `AnalyzeAsync`; new score (resolution > format > source tiebreak); skip replacement when manual selection exists; dedupe by hash in `src/ArchiveDex.Infrastructure/CatalogImport/ImageCandidateAnalyzer.cs` + `ImageQualityScorer.cs`
- [X] T036 [US4] Collect image candidates across all staged sources per entity in Phase B (not per-source sequentially) in `src/ArchiveDex.Infrastructure/CatalogImport/CatalogImportOrchestrator.cs`

**Checkpoint**: quickstart Scenario 4 passes.

---

## Phase 7: Migration & Cleanup (FR-020)

- [X] T037 [P] Failing integration test: duplicate-cleanup preview produces plan without writes; execution merges duplicate sets, re-links prints/external ids, zero lost `CollectionEntry`s, refuses deletion of prints with entries (SC-006) in `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/DuplicateCleanupTests.cs`
- [X] T038 Duplicate-cleanup maintenance service (grouping per data-model.md Migration Set step 3, preview + execute modes, ambiguous groups → `PendingSetMapping`) in `src/ArchiveDex.Infrastructure/CatalogImport/DuplicateCleanupService.cs`
- [X] T039 `POST api/catalog-maintenance/duplicate-cleanup` endpoint (preview 200 / execute 202 background job, `IMPORT_ACTIVE` + `COLLECTION_SAFETY` guards per contract) + contract test in `src/ArchiveDex.Api/Controllers/CatalogMaintenanceController.cs`, `tests/ArchiveDex.Api.Tests/CatalogMaintenanceContractTests.cs`

---

## Phase 8: Polish & Performance

- [X] T040 [P] Per-run set-list cache in TCGdex/Serebii adapters (fixes N+1, research.md P7) with unit tests asserting one list fetch per set in `src/ArchiveDex.Infrastructure/CatalogImport/TcgDexCatalogSourceAdapter.cs`, `SerebiiCatalogSourceAdapter.cs`, `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AdapterCachingTests.cs`
- [X] T041 [P] Structured log fields for merge decisions (source wins, conflicts, pendings) sufficient to reconstruct a run (Constitution: Observability) across `CatalogImport/` classes
- [ ] T042 Performance validation per plan.md budget: timed full TCGdex-en import before/after, request-count assertion O(sets); record results in `specs/009-multi-source-merge/quickstart.md` Performance check section (SC-007)
- [X] T043 Run full quickstart.md validation (Scenarios 1–6); fix fallout
- [X] T044 [P] Docs: update `AGENTS.md`-referenced plan notes if structure drifted; document precedence matrix + seed maintenance in `data/set-mappings.json` header and `specs/009-multi-source-merge/data-model.md` if changed

---

## Dependencies & Execution Order

- **Phase 1 → 2**: T001–T002 anytime; Phase 2 blocks all stories. Within Phase 2: T003 before T006; T004 before T005; T005+T006 before T007–T009.
- **US1 (Phase 3)**: needs Foundational. T010–T013 before T014–T018. T018 (curation) parallelizable with Phase 4+.
- **US2 (Phase 4)**: needs Foundational; independent of US1 logic but shares `CatalogReconciler.cs` with T014 — coordinate merge order (T014 before T023 recommended).
- **US3 (Phase 5)**: needs US1 (pendings must exist) and US2 (re-merge uses policy). T026–T027 before T028–T033.
- **US4 (Phase 6)**: needs Foundational only; parallel to US2/US3.
- **Phase 7**: needs US1+US2 (resolver + policy define the survivor merge). 
- **Phase 8**: last; T040 anytime after Foundational.

### Parallel opportunities

- T003, T004, T007 fixtures; all test-first tasks marked [P] within a phase; US4 entirely parallel to US3; T018 curation is long-running background work.

## Implementation Strategy

MVP = Phases 1–3 (US1): duplicate-free sets alone already makes the database usable. Then US2 (data quality), US3 (review), US4 (images), migration, polish — each checkpoint independently testable per quickstart.md.
