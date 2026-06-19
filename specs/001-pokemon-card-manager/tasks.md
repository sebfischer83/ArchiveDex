---
description: "Task list for ArchiveDex — Pokémon Card Collection Manager"
---

# Tasks: ArchiveDex — Pokémon Card Collection Manager

**Input**: Design documents from `/specs/001-pokemon-card-manager/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: REQUIRED. Constitution v1.0.0 Principle II (Test-First, NON-NEGOTIABLE) mandates
tests authored and failing before implementation. Each story phase lists tests first.

**Organization**: Tasks grouped by user story (US1–US6) for independent implementation/testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: US1–US6 mapping to spec user stories
- Exact file paths included

## Path Conventions

Clean Architecture per plan.md: `src/ArchiveDex.{Domain,Application,Infrastructure,Api,Web}`,
tests under `tests/ArchiveDex.*.Tests`, deploy under `deploy/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Solution + project scaffolding and tooling.

- [X] T001 Create solution `ArchiveDex.slnx` and five source projects (`src/ArchiveDex.Domain`, `src/ArchiveDex.Application`, `src/ArchiveDex.Infrastructure`, `src/ArchiveDex.Api`, `src/ArchiveDex.Web`) with Clean Architecture project references per plan.md
- [X] T002 [P] Create five test projects (`tests/ArchiveDex.Domain.Tests`, `Application.Tests`, `Infrastructure.Tests`, `Api.Tests`, `Web.Tests`) referencing xUnit, bUnit, Testcontainers, WebApplicationFactory
- [X] T003 [P] Add `.editorconfig`, analyzers, and `dotnet format` config at repo root; enable warnings-as-errors for analyzer rules (Constitution I)
- [X] T004 [P] Add `deploy/Dockerfile`, `deploy/docker-compose.yml` (app + postgres + image/traineddata volumes), `deploy/.dockerignore` per plan.md
- [X] T005 [P] Add CI gate config running `dotnet format --verify-no-changes`, `dotnet build`, `dotnet test` (Constitution merge gates)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure all stories depend on.

**⚠️ CRITICAL**: No user story work begins until this phase completes.

- [X] T006 [P] Define domain enums in `src/ArchiveDex.Domain/Enums/` — `CardCondition` (NM/LP/MP/HP/DMG), `CardLanguage`, `UiCulture`, `DatabaseMode`, `Origin` (per data-model.md)
- [X] T007 [P] Create base entity + value object scaffolding in `src/ArchiveDex.Domain/Entities/` and `ValueObjects/`
- [X] T008 Define Application port interfaces in `src/ArchiveDex.Application/Abstractions/` — `ICatalogRepository`, `ICollectionRepository`, `IImageStore`, `IOcrEngine`, `ITcgDataSource`, `IConfigStore`, `ISetupState`, `IUnitOfWork`
- [X] T009 Implement EF Core `ArchiveDexDbContext` in `src/ArchiveDex.Infrastructure/Persistence/` with provider switch (Npgsql / SQLite) bound from configuration (research D2)
- [X] T010 [P] Add provider-specific migration setup for PostgreSQL and SQLite in `src/ArchiveDex.Infrastructure/Persistence/Migrations/`
- [X] T011 Implement composition root + DI registration in `src/ArchiveDex.Web/Program.cs` and `src/ArchiveDex.Api` wiring (Blazor Web App InteractiveServer)
- [X] T012 [P] Configure structured logging + RFC7807 problem-details error handling middleware in `src/ArchiveDex.Api` and `src/ArchiveDex.Web` (Constitution I/III observability)
- [X] T013 [P] Configure request localization middleware + `.resx` resource scaffolding (de/en/ru, en fallback) in `src/ArchiveDex.Web/Resources/` (research D6) — shared UI infra used by all stories
- [X] T014 Implement `IConfigStore` + `ISetupState` (ApplicationConfiguration singleton persistence) in `src/ArchiveDex.Infrastructure/Setup/`

**Checkpoint**: Foundation ready — user stories can begin.

---

## Phase 3: User Story 1 — First-Run Setup Wizard (Priority: P1) 🎯 MVP

**Goal**: Gate all usage behind a one-time wizard that provisions admin + config and validates
DB/storage atomically.

**Independent Test**: Fresh install redirects every non-setup route to the wizard; completing
all steps signs in admin and the wizard never reappears.

### Tests for User Story 1 ⚠️ (write first, must fail)

- [X] T015 [P] [US1] Contract test for setup endpoints (`/api/setup/state|validate|complete`) against `contracts/setup.openapi.yaml` in `tests/ArchiveDex.Api.Tests/Setup/SetupContractTests.cs`
- [X] T016 [P] [US1] Integration test: pre-setup access to `/catalog`,`/collection`,`/scan` redirects to wizard; post-setup wizard redirects away, in `tests/ArchiveDex.Api.Tests/Setup/SetupGateTests.cs`
- [X] T017 [P] [US1] Integration test: setup completion is atomic; invalid DB/unwritable path blocks completion (FR-005), in `tests/ArchiveDex.Api.Tests/Setup/SetupContractTests.cs`
- [X] T018 [P] [US1] Component test: setup-gate routing + interrupted/concurrent wizard handling in `tests/ArchiveDex.Web.Tests/Setup/SetupWizardTests.cs`
- [X] T019 [P] [US1] Create `Administrator` + `ApplicationConfiguration` entities in `src/ArchiveDex.Domain/Entities/`
- [X] T020 [US1] Configure ASP.NET Core Identity (single admin, PBKDF2 hashing) in `src/ArchiveDex.Infrastructure/Setup/IdentitySetup.cs` (FR-007, research D7)
- [X] T021 [US1] Implement setup use cases (`GetSetupState`, `ValidateSetup`, `CompleteSetup` atomic transaction) in `src/ArchiveDex.Application/Setup/`
- [X] T022 [US1] Implement DB-reachability + storage-writability validators in `src/ArchiveDex.Infrastructure/Setup/`
- [X] T023 [US1] Implement setup API endpoints in `src/ArchiveDex.Api/Endpoints/SetupEndpoints.cs` per contract
- [X] T024 [US1] Implement setup-gate middleware blocking non-setup routes until `IsSetupComplete` in `src/ArchiveDex.Web/Program.cs` (+ exempt wizard/static assets)
- [X] T025 [US1] Build Blazor setup wizard pages (admin, UI culture, currency, storage path, DB mode, optional import/OCR/scanner steps) in `src/ArchiveDex.Web/Components/Pages/Setup/`
- [X] T026 [US1] Localize wizard strings (de/en/ru) in `src/ArchiveDex.Web/Resources/` and wire cookie-persisted culture

**Checkpoint**: US1 fully functional and independently testable (MVP gate).

---

## Phase 4: User Story 2 — Import Card Catalog from TCGdex (Priority: P1)

**Goal**: Populate the local catalog from TCGdex scoped by selected sets + card languages, with
upsert and progress reporting.

**Independent Test**: Trigger a scoped import; cards/sets appear and are searchable; re-import
updates rather than duplicates.

### Tests for User Story 2 ⚠️ (write first, must fail)

- [X] T027 [P] [US2] Contract test for `/api/import/*` + `/api/catalog/cards` against `contracts/catalog-import.openapi.yaml` in `tests/ArchiveDex.Api.Tests/Catalog/CatalogImportContractTests.cs`
- [X] T028 [P] [US2] Integration test: scoped import upserts (no duplicates on re-run, FR-011) using Testcontainers Postgres in `tests/ArchiveDex.Infrastructure.Tests/Importing/ImportUpsertTests.cs`
- [X] T029 [P] [US2] Integration test: catalog search by name/number/set/language returns < 2s on seeded data (SC-003) in `tests/ArchiveDex.Infrastructure.Tests/Catalog/CatalogSearchTests.cs`
- [X] T030 [P] [US2] Create `Set`, `Card`, `ImportJob` entities + EF configurations/indexes (data-model.md) in `src/ArchiveDex.Domain/Entities/` and `src/ArchiveDex.Infrastructure/Persistence/Configurations/`
- [X] T031 [P] [US2] Implement `ITcgDataSource` TCGdex REST client (per-language endpoints) in `src/ArchiveDex.Infrastructure/Tcg/TcgDexClient.cs` (research D5)
- [X] T032 [US2] Implement `ICatalogRepository` with case-insensitive search + indexed lookups in `src/ArchiveDex.Infrastructure/Persistence/CatalogRepository.cs`
- [X] T033 [US2] Implement import use cases (start scoped job, upsert keyed by SourceCardId+language, progress/counts) in `src/ArchiveDex.Application/Importing/`
- [X] T034 [US2] Implement background import job runner with progress reporting in `src/ArchiveDex.Infrastructure/Importing/ImportJobRunner.cs`
- [X] T035 [US2] Implement import + catalog-search API endpoints in `src/ArchiveDex.Api/Endpoints/CatalogEndpoints.cs`
- [X] T036 [US2] Build Blazor import page (source/set/language selection, progress, counts) + catalog browse/search in `src/ArchiveDex.Web/Components/Pages/Catalog/`

**Checkpoint**: US1 + US2 work independently.

---

## Phase 5: User Story 3 — Scan, OCR, Match, Add to Collection (Priority: P1)

**Goal**: Mobile scan → store image → server OCR → ranked matches → user confirm/correct → add
collection entry. Core value loop.

**Independent Test**: Upload a card photo; image stored, OCR + candidates shown, confirmed card
added linked to image; nothing auto-added.

### Tests for User Story 3 ⚠️ (write first, must fail)

- [X] T037 [P] [US3] Contract test for `/api/scans/*` against `contracts/scan-ocr.openapi.yaml` in `tests/ArchiveDex.Api.Tests/Scanning/ScanContractTests.cs`
- [X] T038 [P] [US3] Integration test: upload rejects non-JPEG/PNG/WebP and >10MB with no dangling scan (FR-023) in `tests/ArchiveDex.Api.Tests/Scanning/ScanUploadValidationTests.cs`
- [X] T039 [P] [US3] Integration test: confirm creates collection entry linked to image; reject adds nothing; no auto-add (SC-006) in `tests/ArchiveDex.Infrastructure.Tests/Scanning/ScanConfirmTests.cs`
- [X] T040 [P] [US3] Unit test: candidate ranking orders best-match-first from OCR fields (FR-020) in `tests/ArchiveDex.Application.Tests/Scanning/MatchRankingTests.cs`

### Implementation for User Story 3

- [X] T041 [P] [US3] Create `ScanJob`, `OcrResult`, `ImageAsset` entities + EF configs (data-model.md) in `src/ArchiveDex.Domain/Entities/` and Infrastructure configurations
- [X] T042 [P] [US3] Implement filesystem `IImageStore` (format/size validation, relative-path storage) in `src/ArchiveDex.Infrastructure/Storage/FileImageStore.cs` (research D9)
- [X] T043 [P] [US3] Implement `IOcrEngine` Tesseract adapter (language-pack selection by hint) in `src/ArchiveDex.Infrastructure/Ocr/TesseractOcrEngine.cs` (research D3)
- [X] T044 [US3] Implement optional OpenCV preprocessing (grayscale/deskew/threshold) behind toggle in `src/ArchiveDex.Infrastructure/Ocr/OpenCvPreprocessor.cs` (research D4)
- [X] T045 [US3] Implement match-ranking service mapping OCR fields → ranked catalog candidates in `src/ArchiveDex.Application/Scanning/MatchRankingService.cs`
- [X] T046 [US3] Implement scan orchestration use cases (upload→OCR→match, confirm, reject; ScanJob state transitions) in `src/ArchiveDex.Application/Scanning/`
- [X] T047 [US3] Implement scan API endpoints (upload, get, confirm, reject) in `src/ArchiveDex.Api/Endpoints/ScanEndpoints.cs`
- [X] T048 [US3] Build mobile-friendly scanner page (`<input capture>`, OCR result + candidate list, manual search, confirm form with condition/qty/price/location/notes) in `src/ArchiveDex.Web/Components/Pages/Scanner/`

**Checkpoint**: End-to-end MVP loop (US1+US2+US3) functional.

---

## Phase 6: User Story 4 — Browse, Search, Manage Collection (Priority: P2)

**Goal**: Browse/search/filter collection; edit and delete entries.

**Independent Test**: With entries present, search/filter, edit fields, delete an entry; catalog
card remains after deletion.

### Tests for User Story 4 ⚠️ (write first, must fail)

- [X] T049 [P] [US4] Contract test for `/api/collection/*` against `contracts/collection.openapi.yaml` in `tests/ArchiveDex.Api.Tests/CollectionContractTests.cs`
- [X] T050 [P] [US4] Integration test: delete entry retains catalog card (FR-027); filters by condition/language/set in `tests/ArchiveDex.Infrastructure.Tests/Collection/CollectionCrudTests.cs`

### Implementation for User Story 4

- [X] T051 [P] [US4] Create `CollectionEntry` entity + EF config (data-model.md) in `src/ArchiveDex.Domain/Entities/` and Infrastructure
- [X] T052 [US4] Implement `ICollectionRepository` (search/filter/paging) in `src/ArchiveDex.Infrastructure/Persistence/CollectionRepository.cs`
- [X] T053 [US4] Implement collection CRUD use cases in `src/ArchiveDex.Application/Collection/`
- [X] T054 [US4] Implement collection API endpoints in `src/ArchiveDex.Api/Endpoints/CollectionEndpoints.cs`
- [X] T055 [US4] Build Blazor collection browse/search/edit/delete pages in `src/ArchiveDex.Web/Components/Pages/Collection/`

**Checkpoint**: US1–US4 independently functional.

---

## Phase 7: User Story 5 — UI Language Independent of Card Languages (Priority: P2)

**Goal**: Switch UI culture (de/en/ru) while card-language data displays faithfully; fallback to
default culture on missing strings.

**Independent Test**: Switch UI among de/en/ru (text changes, persists); a JP/KR/CN card stays
in its own language under any UI culture.

### Tests for User Story 5 ⚠️ (write first, must fail)

- [X] T056 [P] [US5] Component test: culture switch updates all labels, persists across reload, no blank strings (SC-007) in `tests/ArchiveDex.Web.Tests/Localization/CultureSwitchTests.cs`
- [X] T057 [P] [US5] Component test: card-language data not translated to UI culture (SC-008) + missing-string fallback to en (FR-032) in `tests/ArchiveDex.Web.Tests/Localization/CardLanguageSeparationTests.cs`

### Implementation for User Story 5

- [X] T058 [US5] Complete `.resx` translations for all primary-flow strings (de/en/ru) in `src/ArchiveDex.Web/Resources/`
- [X] T059 [US5] Implement culture selector + cookie persistence + en fallback wiring in `src/ArchiveDex.Web/Components/Layout/`
- [X] T060 [US5] Audit catalog/collection/scan views to render card-language fields verbatim (no localization pass) across `src/ArchiveDex.Web/Components/`

**Checkpoint**: US1–US5 independently functional.

---

## Phase 8: User Story 6 — Local Corrections & Manually Added Cards (Priority: P3)

**Goal**: Correct imported card data and add cards missing upstream; corrections survive
re-import.

**Independent Test**: Edit an imported card and add a manual card; re-import preserves both.

### Tests for User Story 6 ⚠️ (write first, must fail)

- [X] T061 [P] [US6] Integration test: local correction overrides imported value and survives re-import (FR-013, SC-009) in `tests/ArchiveDex.Infrastructure.Tests/Catalog/LocalCorrectionTests.cs`
- [X] T062 [P] [US6] Integration test: manual card usable for matching + collection (FR-014) in `tests/ArchiveDex.Infrastructure.Tests/Catalog/ManualCardTests.cs`

### Implementation for User Story 6

- [X] T063 [P] [US6] Create `LocalCorrection` entity + EF config; effective-value resolution (override ?? imported) in `src/ArchiveDex.Domain/Entities/` and Application layer
- [X] T064 [US6] Update import upsert to never touch `LocalCorrection` rows (FR-013) in `src/ArchiveDex.Application/Importing/`
- [X] T065 [US6] Implement correction + manual-add use cases and API (`PUT/POST /api/catalog/cards`) in `src/ArchiveDex.Application/Catalog/` and `src/ArchiveDex.Api/Endpoints/CatalogEndpoints.cs`
- [X] T066 [US6] Build Blazor edit-card + add-manual-card UI in `src/ArchiveDex.Web/Components/Pages/Catalog/`

**Checkpoint**: All user stories independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story quality, performance, docs.

- [X] T067 [P] Add catalog-search benchmark guarding < 2s budget (SC-003) in `tests/ArchiveDex.Infrastructure.Tests/Benchmarks/` (Constitution IV)
- [X] T068 [P] Add OCR-pipeline timing benchmark guarding < 8s budget (research D3) in `tests/ArchiveDex.Infrastructure.Tests/Benchmarks/`
- [X] T069 [P] Add domain/application unit tests for validation rules (quantity ≥1, price ≥0, condition enum) in `tests/ArchiveDex.Domain.Tests/`
- [X] T070 [P] Write `README.md` referencing the constitution + setup/run instructions (Constitution governance follow-up)
- [X] T071 Security hardening pass: confirm password never logged/returned, auth required on all non-setup endpoints, upload limits enforced
- [X] T072 Run `quickstart.md` scenarios 1–5 end-to-end and record results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Ph1)**: no deps.
- **Foundational (Ph2)**: after Setup — BLOCKS all stories.
- **User Stories (Ph3–8)**: after Foundational. US1 first (gate/MVP). US2/US3 are P1.
- **Polish (Ph9)**: after target stories complete.

### User Story Dependencies

- **US1 (P1)**: after Foundational. No story deps.
- **US2 (P1)**: after Foundational. Independent (provides catalog used by US3 matching, but testable alone via seeded data).
- **US3 (P1)**: after Foundational. Match step consumes catalog; for isolated test, seed catalog rows.
- **US4 (P2)**: after Foundational. Independent (seed entries for test).
- **US5 (P2)**: after Foundational + T013 localization infra. Independent.
- **US6 (P3)**: after Foundational; touches import upsert (US2) — keep upsert key stable.

### Within Each Story

- Tests written and FAILING before implementation (Constitution II).
- Entities → repositories → use cases → endpoints → UI.

### Parallel Opportunities

- Ph1: T002–T005 [P]. Ph2: T006/T007, T010, T012/T013 [P].
- All `[P]` tests within a story run together before its implementation.
- After Foundational, with capacity: US1, US2, US4, US5 progress in parallel; US3 pairs with US2 catalog; US6 last.

---

## Parallel Example: User Story 3

```bash
# Tests first (parallel):
Task: "T037 Contract test for /api/scans/* in tests/ArchiveDex.Api.Tests/Scanning/ScanContractTests.cs"
Task: "T038 Upload validation test in tests/ArchiveDex.Api.Tests/Scanning/ScanUploadValidationTests.cs"
Task: "T039 Confirm/reject test in tests/ArchiveDex.Infrastructure.Tests/Scanning/ScanConfirmTests.cs"
Task: "T040 Match ranking unit test in tests/ArchiveDex.Application.Tests/Scanning/MatchRankingTests.cs"

# Then parallel adapters:
Task: "T042 FileImageStore in src/ArchiveDex.Infrastructure/Storage/FileImageStore.cs"
Task: "T043 TesseractOcrEngine in src/ArchiveDex.Infrastructure/Ocr/TesseractOcrEngine.cs"
```

---

## Implementation Strategy

### MVP First

1. Ph1 Setup → 2. Ph2 Foundational → 3. Ph3 US1 (setup gate). **STOP/VALIDATE.**
2. Add Ph4 US2 (import) + Ph5 US3 (scan loop) → full end-to-end MVP (the spec's primary flow).

### Incremental Delivery

US1 → US2 → US3 (MVP end-to-end) → US4 → US5 → US6. Each independently testable; deploy/demo
between stories.

---

## Notes

- `[P]` = different files, no incomplete-task dependency.
- Tests precede implementation (Constitution II, NON-NEGOTIABLE). Verify red before green.
- Open requirement gaps from checklists (match-ranking criteria, low-confidence threshold,
  manual-vs-upstream conflict, empty import scope) should be resolved or assumptions recorded
  while implementing T045/T046/T033/T064.
- Commit after each task or logical group; keep merge gates green (lint/format/tests/benchmarks).
