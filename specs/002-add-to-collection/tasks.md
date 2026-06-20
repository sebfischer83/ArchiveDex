# Tasks: Direct Add to Collection from Catalog

**Input**: Design documents from `specs/002-add-to-collection/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — the constitution mandates Test-First discipline (Principle II is NON-NEGOTIABLE). Tests MUST be written first and fail before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Clean Architecture `.NET` project:

```text
src/ArchiveDex.Domain/          # Entities, Enums (no changes)
src/ArchiveDex.Application/     # Commands, Queries, Abstractions, DTOs
src/ArchiveDex.Infrastructure/  # EF Core repositories
src/ArchiveDex.Api/             # Wolverine HTTP handlers
src/ArchiveDex.Web/             # Blazor components, pages
tests/ArchiveDex.Api.Tests/           # API contract tests (Testcontainers)
tests/ArchiveDex.Infrastructure.Tests/# Repository/infrastructure tests
tests/ArchiveDex.Web.Tests/          # bUnit component tests
```

---

## Phase 1: Setup

**Purpose**: Verify existing project structure is ready — no new projects or packages needed.

**Status**: Project already initialized. All infrastructure (Blazor, Wolverine, EF Core, xUnit, bUnit) is in place from Feature 001. Skip to Phase 2.

---

## Phase 2: Foundational — Repository Interface & Duplicate Query

**Purpose**: Add the `FindByCardAndConditionAsync` method to `ICollectionRepository` and implement it. This is the blocking prerequisite for the create-collection command handler.

**⚠️ CRITICAL**: No user story work can begin until the repository method exists for duplicate detection.

- [x] T001 Write repository integration test for `FindByCardAndConditionAsync` in `tests/ArchiveDex.Infrastructure.Tests/Collection/CollectionCreateTests.cs` — test: returns entry when duplicate exists, returns null when no duplicate, respects condition mismatch (depends on T002 for interface to compile)
- [x] T002 Add `FindByCardAndConditionAsync(Guid cardPrintId, CardCondition condition, CancellationToken ct)` method signature to `ICollectionRepository` in `src/ArchiveDex.Application/Abstractions/ICollectionRepository.cs`
- [x] T003 Implement `FindByCardAndConditionAsync` in `CollectionRepository` — query `db.CollectionEntries.FirstOrDefaultAsync(e => e.CardPrintId == cardPrintId && e.Condition == condition)` in `src/ArchiveDex.Infrastructure/Persistence/Repositories/CollectionRepository.cs`

**Checkpoint**: Repository layer ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Add to Collection from Catalog Detail View (Priority: P1) 🎯 MVP

**Goal**: User clicks "Add to Collection" on a card detail page, fills condition/quantity/price/location/notes, submits, and a collection entry is created. Dialog closes with confirmation, user stays on detail page.

**Independent Test**: Open any catalog card detail page, click "Add to Collection", fill the form (default NM, quantity 1), submit, and verify the entry appears at `/collection`.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation.**

- [x] T004 [P] [US1] Write failing API contract test for `POST /api/collection` — test: 201 Created with valid request, response contains `CollectionEntryDto`, Location header set — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`
- [x] T005 [P] [US1] Write failing API contract test for 400 Bad Request — test: invalid quantity (0, -1), invalid condition — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`
- [x] T006 [P] [US1] Write failing API contract test for 404 Not Found — test: submit with non-existent `cardPrintId` — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`
- [x] T024 [P] [US1] Write failing API contract test for catalog-card integrity (FR-013, SC-005) — test: create collection entry via POST, then GET the catalog card and verify no fields were modified — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`

### Implementation for User Story 1

- [x] T007 [US1] Create `CreateCollectionEntry` command record and `CreateCollectionEntryHandler` static class with `Handle` method — logic: validate card exists via `ICatalogRepository`, check for duplicate via `FindByCardAndConditionAsync`, create new `CollectionEntry` if no duplicate, return `CollectionEntryDto` — in `src/ArchiveDex.Application/Commands/Collection/CreateCollectionEntry.cs`
- [x] T008 [US1] Create `CollectionCreateHandler` API endpoint — `[WolverinePost("/api/collection")]`, accept `CreateCollectionRequest` input, delegate to `CreateCollectionEntryHandler.Handle()`, return `Results.Created` with `CollectionEntryDto` — in `src/ArchiveDex.Api/Handlers/CollectionCreateHandler.cs`
- [x] T009 [P] [US1] Create `AddToCollectionDialog.razor` Blazor component — CSS overlay modal, `EditForm` with `DataAnnotationsValidator`, fields: Condition dropdown (NM/LP/MP/HP/DMG default NM), Quantity (default 1, min 1), PurchasePrice (optional, min 0), StorageLocation (optional), Notes (optional); parameters: `CardPrintId`, `OnConfirm` EventCallback, `OnCancel` EventCallback; `@rendermode InteractiveServer` — in `src/ArchiveDex.Web/Components/Shared/AddToCollectionDialog.razor`
- [x] T010 [P] [US1] Add CSS styles for `AddToCollectionDialog` — overlay backdrop, centered dialog box, form layout, confirm/cancel buttons, follow `ad-` prefix convention — in `src/ArchiveDex.Web/wwwroot/css/` or component-scoped `.razor.css`
- [x] T011 [US1] Integrate "Add to Collection" button and dialog into `CatalogCardView.razor` — add button in page toolbar, wire to open `AddToCollectionDialog`, pass `CardPrint.Id`, handle `OnConfirm` to POST to `/api/collection` and show confirmation, handle `OnCancel` to close — in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogCardView.razor`

**Checkpoint**: User Story 1 should be fully functional — user can add a card from the detail page. Tests pass (T004-T006 green after implementation).

---

## Phase 4: User Story 2 - Add to Collection from Catalog List/Browse View (Priority: P2)

**Goal**: User sees an "Add to Collection" trigger on each card row in the catalog list view. Same dialog opens, form submits, dialog closes, user stays on list view ready to add the next card.

**Independent Test**: Browse a set's card list, click "Add to Collection" on a specific card row, fill the form, submit, verify entry created. Repeat for another card in same list.

### Tests for User Story 2

- [x] T012 [P] [US2] Write failing bUnit component test for `AddToCollectionDialog` — test: renders fields with correct defaults, fires `OnConfirm` on valid submit, fires `OnCancel` on dismiss, form fields clear between opens — in `tests/ArchiveDex.Web.Tests/Components/AddToCollectionDialogTests.cs`

### Implementation for User Story 2

- [x] T013 [US2] Integrate "Add to Collection" trigger into each card row in `CatalogBrowse.razor` — add button/icon per card row in the card grid, wire to open `AddToCollectionDialog` with card's `Id`, reuse same POST flow from US1 — in `src/ArchiveDex.Web/Components/Pages/Catalog/CatalogBrowse.razor`
- [x] T014 [US2] Ensure dialog state resets between opens — when dialog opens for card B after card A was previously used, fresh defaults (NM, 1) are shown — verify acceptance scenario US2-3 — update `AddToCollectionDialog.razor` if needed

**Checkpoint**: User Stories 1 AND 2 both work — user can add from detail and list views independently.

---

## Phase 5: User Story 3 - Duplicate-Aware Addition (Priority: P2)

**Goal**: When user adds a card they already own in the same condition, the system detects it and offers to increment the existing entry's quantity or create a separate entry.

**Independent Test**: Add a card in NM, then add the same card again in NM — verify the system offers merge-vs-separate choice.

### Tests for User Story 3

- [x] T015 [P] [US3] Write failing API contract test for duplicate detection — test: create entry via POST, then POST same card+condition again and expect 409 Conflict with `DuplicateDetectedResponse` body — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`
- [x] T016 [P] [US3] Write failing API contract test for merge flow — test: send 409 response, user accepts merge → second POST (or PATCH) increments quantity — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`

### Implementation for User Story 3

- [x] T017 [US3] Implement duplicate detection response in `CreateCollectionEntryHandler` — when `FindByCardAndConditionAsync` returns an existing entry, return a result indicating duplicate with existing entry summary and proposed quantity — in `src/ArchiveDex.Application/Commands/Collection/CreateCollectionEntry.cs`
- [x] T018 [US3] Update `CollectionCreateHandler` API endpoint to return HTTP 409 Conflict with `DuplicateDetectedResponse` body when duplicate is found — in `src/ArchiveDex.Api/Handlers/CollectionCreateHandler.cs`
- [x] T019 [US3] Add merge-vs-separate choice UI in `AddToCollectionDialog.razor` — on 409 response, show comparison (existing quantity + proposed total), two buttons: "Merge — Increment Quantity" and "Create as Separate Entry"; merge sends second request with `forceCreate: false`, separate sends `forceCreate: true` — in `src/ArchiveDex.Web/Components/Shared/AddToCollectionDialog.razor`
- [x] T020 [US3] Implement merge and force-create logic in `CreateCollectionEntryHandler` — when `forceCreate: false` and duplicate exists: increment existing quantity and return updated entry; when `forceCreate: true`: always create a new entry; when different condition: no duplicate check triggered — in `src/ArchiveDex.Application/Commands/Collection/CreateCollectionEntry.cs`

**Checkpoint**: All three user stories functional — duplicate detection and user choice works end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Localization, edge case hardening, validation pass.

- [x] T021 Add localization keys for "Add to Collection" button text, form labels (Condition, Quantity, Purchase Price, Storage Location, Notes), Save/Cancel buttons, confirmation message, duplicate prompt text, and error messages — add to existing `.resx` files for de/en/ru in `src/ArchiveDex.Web/Resources/`
- [x] T022 Prevent double-submit by disabling the Save button during HTTP request using `_isSubmitting` flag in `AddToCollectionDialog.razor` — re-enable on error, close on success
- [x] T025 Add performance benchmark assertion to contract test — verify `POST /api/collection` server response time is under 1 second (supports SC-001, SC-002) — in `tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs`
- [x] T023 Run quickstart.md validation scenarios — verify all 10 validation scenarios pass end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Already complete — skip
- **Foundational (Phase 2)**: No dependencies — start immediately. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 (repository method). US1 backend + dialog + detail view integration.
- **User Story 2 (Phase 4)**: Depends on Phase 3 (dialog component must exist). Integrates dialog into list view.
- **User Story 3 (Phase 5)**: Depends on Phase 3 (API endpoint must exist). Adds duplicate detection and merge UI.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P2)**: Depends on US1 for `AddToCollectionDialog` component — but is independently testable via bUnit
- **US3 (P2)**: Depends on US1 for `POST /api/collection` endpoint — adds duplicate handling to existing flow

### Within Each User Story

- Tests MUST be written and FAIL before implementation (constitution Principle II)
- Tests → Command/Handler → API endpoint → Blazor component → Page integration
- TDD cycle: Red (write test, see it fail) → Green (implement) → Refactor

### Parallel Opportunities

- **Phase 2**: T002 (interface) and T003 (implementation) can run in parallel — T001 must follow T002 (interface needed to compile test)
- **Phase 3 tests**: T004, T005, T006 all in same file but test different scenarios — write them together
- **Phase 3 implementation**: T009 (dialog) and T010 (CSS) can run in parallel
- **Phase 5 tests**: T015 and T016 can run in parallel — same file, different test methods
- **Across phases**: Once US1 is complete, US2 and US3 can be worked on in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Step 1: Write all failing tests in parallel (same file, different methods)
Task: "Write failing API contract test for POST /api/collection (201 Created) in tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs"
Task: "Write failing API contract test for 400 Bad Request in tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs"
Task: "Write failing API contract test for 404 Not Found in tests/ArchiveDex.Api.Tests/CollectionCreateContractTests.cs"

# Step 2: Implement backend (sequential — command then handler)
Task: "Create CreateCollectionEntry command + handler in src/ArchiveDex.Application/Commands/Collection/CreateCollectionEntry.cs"
Task: "Create CollectionCreateHandler API endpoint in src/ArchiveDex.Api/Handlers/CollectionCreateHandler.cs"

# Step 3: Implement frontend (parallel)
Task: "Create AddToCollectionDialog.razor in src/ArchiveDex.Web/Components/Shared/AddToCollectionDialog.razor"
Task: "Add CSS styles for dialog in src/ArchiveDex.Web/wwwroot/css/"

# Step 4: Integrate (depends on steps 2+3)
Task: "Integrate Add to Collection into CatalogCardView.razor"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (repository method)
2. Complete Phase 3: User Story 1 — back-end + dialog + detail view
3. **STOP and VALIDATE**: Test US1 independently on `CatalogCardView.razor`
4. Deploy/demo — user can add cards from detail pages

### Incremental Delivery

1. Phase 2: Foundational → Foundation ready
2. Phase 3: US1 → Test independently → **MVP!** User can add from detail view
3. Phase 4: US2 → Test independently → User can add from list view too
4. Phase 5: US3 → Test independently → Duplicate detection active
5. Phase 6: Polish → Localization, hardening, validation
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Complete Phase 2 together (foundational — quick)
2. Once Phase 2 is done:
   - Developer A: US1 (backend + dialog + detail view)
   - Once US1 dialog exists, Developer B: US2 (list view integration)
   - Developer A continues to US3 (duplicate handling)
3. Stories complete and integrate incrementally

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Constitution Principle II (NON-NEGOTIABLE): Tests MUST be written first and fail before implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All new files follow existing namespace conventions and Clean Architecture layering
- No new NuGet packages or third-party dependencies required
