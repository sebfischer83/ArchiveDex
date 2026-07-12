# Tasks: Modern Angular UI Rebuild

**Input**: Design documents from `/specs/008-angular-ui-rebuild/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by the implementation plan. Create Angular unit/browser tests before their corresponding implementation tasks and keep API/host contract coverage.

**Organization**: Tasks are grouped by user story. Shared hosting, authentication, build, and design-system prerequisites appear first because all user stories depend on them.

## Path Conventions

- Server host: `src/ArchiveDex.Web/`
- Angular client: `src/ArchiveDex.Web/ClientApp/`
- API: `src/ArchiveDex.Api/`
- API tests: `tests/ArchiveDex.Api.Tests/`
- Host tests: `tests/ArchiveDex.Web.Tests/`
- Feature documentation: `specs/008-angular-ui-rebuild/`

---

## Phase 1: Setup

**Purpose**: Establish the Angular workspace and reproducible client tooling within the existing server repository.

- [x] T001 Create the Angular workspace manifests, scripts, and Node version declaration in `src/ArchiveDex.Web/ClientApp/package.json`, `src/ArchiveDex.Web/ClientApp/angular.json`, and `src/ArchiveDex.Web/ClientApp/.nvmrc`
- [x] T002 [P] Create Angular TypeScript, linting, unit-test, and browser-test configuration in `src/ArchiveDex.Web/ClientApp/tsconfig.json`, `src/ArchiveDex.Web/ClientApp/tsconfig.spec.json`, and `src/ArchiveDex.Web/ClientApp/playwright.config.ts`
- [x] T003 [P] Add Node, Angular distribution, test-report, and .NET build artifact patterns to `.gitignore` and `.dockerignore`
- [x] T004 Add Angular, Taiga UI, Angular CDK, localization, and browser-test dependencies to `src/ArchiveDex.Web/ClientApp/package.json`

---

## Phase 2: Foundational Hosting, Security, and Design System

**Purpose**: Build and serve the Angular application from the ASP.NET host in normal, publish, and Docker Compose debug flows; establish the client contracts and reusable system required by all screens.

**⚠️ CRITICAL**: Complete this phase before implementing user-story screens.

- [x] T005 Add MSBuild targets that restore/build the Angular browser output before Web Debug and Publish builds in `src/ArchiveDex.Web/ArchiveDex.Web.csproj`
- [x] T006 Add Node LTS and the client build step to the Visual Studio Fast Mode and publish stages in `src/ArchiveDex.Web/Dockerfile`
- [x] T007 Add the client build step to the production image pipeline in `deploy/Dockerfile`
- [x] T008 Update Docker Compose and Visual Studio Compose project settings for the Web-hosted Angular build in `docker-compose.yml`, `docker-compose.override.yml`, `docker-compose.dcproj`, and `deploy/docker-compose.yml`
- [x] T009 Configure static Angular asset delivery, API-safe preview-route fallback, and preview not-found behavior while retaining the Blazor root UI in `src/ArchiveDex.Web/Program.cs`
- [x] T010 Update setup-gate path handling so Angular assets and allowed setup/deep-link routes work without masking APIs in `src/ArchiveDex.Web/SetupGateMiddleware.cs`
- [x] T011 [P] Create host integration tests for preview static delivery, preview deep-link refresh, API 404 preservation, and setup-gate behavior in `tests/ArchiveDex.Web.Tests/AngularHostingTests.cs`
- [x] T012 Add session, sign-in, sign-out, current-account, and setup-status contracts per `contracts/angular-ui-api-contract.md` in `src/ArchiveDex.Api/Controllers/SessionController.cs` and `src/ArchiveDex.Api/Controllers/AccountController.cs`
- [x] T013 Apply the authorization matrix in `contracts/angular-ui-api-contract.md` to protected workflow endpoints while preserving anonymous setup access in `src/ArchiveDex.Api/Controllers/`
- [x] T014 [P] Add WebApplicationFactory contract tests for session/account responses, user-safe errors, and every authorization-matrix role outcome in `tests/ArchiveDex.Api.Tests/SessionAccountContractTests.cs`
- [x] T015 Expose browser-facing catalog-import actions currently invoked through Blazor DI in `src/ArchiveDex.Api/Controllers/CatalogImportController.cs`
- [x] T016 Expose browser-facing catalog-transfer actions currently invoked through Blazor DI in `src/ArchiveDex.Api/Controllers/CatalogTransferController.cs`
- [x] T017 [P] Add API contract tests for migrated import and transfer operations in `tests/ArchiveDex.Api.Tests/CatalogImportAngularContractTests.cs` and `tests/ArchiveDex.Api.Tests/CatalogTransferAngularContractTests.cs`
- [x] T018 Create Angular bootstrap, router, same-origin HTTP client, error interceptor, session state, and permission guards in `src/ArchiveDex.Web/ClientApp/src/app/core/`
- [x] T019 Create Taiga UI theme tokens, responsive layout primitives, shared loading/empty/error/access-denied/not-found components, and reusable feedback service in `src/ArchiveDex.Web/ClientApp/src/app/shared/`
- [x] T020 [P] Create Angular unit tests for session state, error mapping, route guards, and standardized UI states in `src/ArchiveDex.Web/ClientApp/src/app/core/**/*.spec.ts` and `src/ArchiveDex.Web/ClientApp/src/app/shared/**/*.spec.ts`
- [x] T021 Create client localization catalogs and language selection/bootstrap behavior from existing supported languages in `src/ArchiveDex.Web/ClientApp/src/assets/i18n/` and `src/ArchiveDex.Web/ClientApp/src/app/core/localization/`

**Checkpoint**: `dotnet build ArchiveDex.slnx` builds the client, `ArchiveDex.Web` serves it, Compose debugging serves the same output, and session/API/error primitives are available to every screen.

---

## Phase 3: User Story 1 - Use A Modern Unified Application Shell (Priority: P1) 🎯 MVP

**Goal**: Users enter one responsive, localized Angular shell that includes sign-in, account, setup, navigation, protected routing, and clear recovery states.

**Independent Test**: Start the server or Docker Compose debug profile, open the root and deep links, sign in, navigate through every primary navigation item, resize to mobile width, and verify keyboard navigation, access-denied, and not-found states.

### Tests for User Story 1

- [x] T022 [P] [US1] Create Angular shell, navigation, responsive-breakpoint, and keyboard-focus unit tests in `src/ArchiveDex.Web/ClientApp/src/app/layout/**/*.spec.ts`
- [x] T023 [P] [US1] Create Angular sign-in, account, setup, access-denied, and not-found unit tests in `src/ArchiveDex.Web/ClientApp/src/app/features/{auth,account,setup,errors}/**/*.spec.ts`
- [x] T024 [P] [US1] Create browser journeys for server delivery, deep links, responsive navigation, authentication, route recovery, and the three-actions-or-fewer navigation limit in `src/ArchiveDex.Web/ClientApp/e2e/application-shell.spec.ts`

### Implementation for User Story 1

- [x] T025 [US1] Implement the Taiga-based application shell, desktop/mobile navigation, route title handling, and global feedback region in `src/ArchiveDex.Web/ClientApp/src/app/layout/`
- [x] T026 [US1] Implement sign-in, sign-out, account, and session-recovery screens backed by the session/account contracts in `src/ArchiveDex.Web/ClientApp/src/app/features/auth/` and `src/ArchiveDex.Web/ClientApp/src/app/features/account/`
- [x] T027 [US1] Implement setup, access-denied, and not-found routes using the shared UI states in `src/ArchiveDex.Web/ClientApp/src/app/features/setup/` and `src/ArchiveDex.Web/ClientApp/src/app/features/errors/`
- [x] T028 [US1] Register the complete shell route tree, guards, and initial route redirects in `src/ArchiveDex.Web/ClientApp/src/app/app.routes.ts`
- [x] T029 [US1] Create the server-served Angular preview entry and verify it does not replace the Blazor root UI before cutover in `src/ArchiveDex.Web/wwwroot/` and `src/ArchiveDex.Web/Program.cs`

**Checkpoint**: Authentication/account/setup and application-shell journeys work through the Angular UI at server-hosted routes on desktop and mobile widths.

---

## Phase 4: User Story 2 - Complete Existing Workflows In The New Interface (Priority: P1)

**Goal**: Every current primary business workflow is available through the Angular client with backend behavior, validation, progress, and error semantics preserved.

**Independent Test**: Complete catalog, collection, scanning, batch review, import, transfer, administration, and set-mapping journeys using only the Angular routes and corresponding APIs.

### Tests for User Story 2

- [x] T030 [P] [US2] Create browser catalog and collection journeys for browse/search/filter/detail/add/edit/validation in `src/ArchiveDex.Web/ClientApp/e2e/catalog-collection.spec.ts`
- [x] T031 [P] [US2] Create browser single-scan and batch-scan review journeys in `src/ArchiveDex.Web/ClientApp/e2e/scanning.spec.ts`
- [x] T032 [P] [US2] Create browser import, transfer, admin, and set-mapping journeys including progress/error/retry states in `src/ArchiveDex.Web/ClientApp/e2e/operations.spec.ts`

### Implementation for User Story 2

- [x] T033 [P] [US2] Implement typed catalog API client, browse/search/filter/list state, card detail, image, and empty/error views in `src/ArchiveDex.Web/ClientApp/src/app/features/catalog/`
- [x] T034 [P] [US2] Implement typed collection API client, collection browse/detail, add/edit dialog, and validation feedback in `src/ArchiveDex.Web/ClientApp/src/app/features/collection/`
- [x] T035 [P] [US2] Implement typed single-scan API client, scan submission/result/confirmation flow, and recovery states in `src/ArchiveDex.Web/ClientApp/src/app/features/scan/`
- [x] T036 [P] [US2] Implement typed batch-scan API client, batch review/acceptance/match-status screens, and recovery states in `src/ArchiveDex.Web/ClientApp/src/app/features/batch-scan/`
- [x] T037 [P] [US2] Implement typed selective-import and full catalog-import clients, start/status/cancel/resume/report screens, and polling behavior in `src/ArchiveDex.Web/ClientApp/src/app/features/import/`
- [x] T038 [P] [US2] Implement typed catalog-transfer client, upload/download/status/cancel/recovery screens, and progress feedback in `src/ArchiveDex.Web/ClientApp/src/app/features/transfer/`
- [x] T039 [P] [US2] Implement administration and pending set-mapping review actions in `src/ArchiveDex.Web/ClientApp/src/app/features/admin/`
- [x] T040 [US2] Integrate all feature routes into the guarded application route tree in `src/ArchiveDex.Web/ClientApp/src/app/app.routes.ts`
- [x] T041 [US2] Create the route-by-route parity record for all current Blazor screens, including replacement route and migration behavior, in `specs/008-angular-ui-rebuild/screen-inventory.md`
- [x] T042 [US2] Mark every screen-inventory entry verified after its Angular journey and configured legacy-route redirect, guided replacement, or retirement explanation pass in `specs/008-angular-ui-rebuild/screen-inventory.md`

**Checkpoint**: All screen-inventory workflows are available through Angular and their end-to-end journeys pass without opening a Blazor page.

---

## Phase 5: User Story 3 - Experience A Clear, Stringent Visual System (Priority: P2)

**Goal**: The migrated workflows use a consistent Taiga-based visual system, accessible interaction model, responsive behavior, localized feedback, and predictable loading/empty/error presentation.

**Independent Test**: Review every primary Angular screen at desktop/mobile widths and with keyboard-only navigation; verify visual-state, localization, and primary-action consistency against the shared design system.

### Tests for User Story 3

- [x] T043 [P] [US3] Create component tests for shared forms, dialogs, tables, state panels, and feedback notifications in `src/ArchiveDex.Web/ClientApp/src/app/shared/**/*.spec.ts`
- [x] T044 [P] [US3] Create browser accessibility, mobile-layout, localization, and loading-state journeys in `src/ArchiveDex.Web/ClientApp/e2e/design-system.spec.ts`

### Implementation for User Story 3

- [x] T045 [US3] Apply the shared Taiga theme, typography, spacing, density, form, dialog, table, alert, and button rules across feature screens in `src/ArchiveDex.Web/ClientApp/src/styles.scss` and `src/ArchiveDex.Web/ClientApp/src/app/`
- [x] T046 [US3] Add localized navigation, heading, action, feedback, empty-state, and operation-status text for every supported language in `src/ArchiveDex.Web/ClientApp/src/assets/i18n/`
- [x] T047 [US3] Audit and correct focus management, keyboard behavior, semantic labels, and dialog handling across client features in `src/ArchiveDex.Web/ClientApp/src/app/`
- [x] T048 [US3] Add loading/progress feedback to every route and long-running workflow state in `src/ArchiveDex.Web/ClientApp/src/app/core/` and `src/ArchiveDex.Web/ClientApp/src/app/features/`

**Checkpoint**: All primary screens share the documented visual system and pass responsive, keyboard, localization, and state-feedback journeys.

---

## Phase 6: Cutover and Cross-Cutting Validation

**Purpose**: Complete the one-time production cutover only after Angular parity and delivery validation are proven.

- [x] T049 Move the Angular fallback from preview to the production root, implement every screen-inventory legacy-route behavior, and remove retired Blazor pages, layouts, routing, scanner session state, scoped styles, and UI-only JavaScript under `src/ArchiveDex.Web/Program.cs`, `src/ArchiveDex.Web/Components/`, `src/ArchiveDex.Web/Services/ScannerSession.cs`, and `src/ArchiveDex.Web/wwwroot/` after all inventory entries are verified
- [x] T050 Remove or replace retired bUnit page tests in `tests/ArchiveDex.Web.Tests/` with retained host/static-delivery tests
- [x] T051 Verify the server-only Angular build and static delivery in Visual Studio Docker Compose debugging using `docker-compose.dcproj`
- [x] T052 Verify production image build and server-delivered deep links using `deploy/Dockerfile` and `deploy/docker-compose.yml`
- [x] T053 Run Angular unit/browser tests and all .NET tests using `src/ArchiveDex.Web/ClientApp/package.json` and `ArchiveDex.slnx`
- [x] T054 Execute every journey and the 90%-success usability review in `specs/008-angular-ui-rebuild/quickstart.md`, then record route, navigation-depth, and usability evidence in `specs/008-angular-ui-rebuild/screen-inventory.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Can start immediately.
- **Phase 2**: Depends on setup and blocks every user story; server delivery, client contracts, session/auth, and shared components are prerequisites.
- **US1 (Phase 3)**: Depends on Phase 2 and provides the shell, authentication, setup, and route foundation.
- **US2 (Phase 4)**: Depends on US1 routing/session shell; feature implementation tasks T033-T039 can proceed in parallel after their API contracts are available.
- **US3 (Phase 5)**: Depends on core/shared components from Phase 2 and feature screens from US2 for final consistency/a11y audits.
- **Cutover (Phase 6)**: Depends on verified screen inventory, all browser journeys, and successful Docker Compose/production validation.

### User Story Dependencies

- **US1 (P1)**: Independent MVP after Foundation. It proves one server-delivered Angular shell with session and responsive navigation.
- **US2 (P1)**: Requires US1. It establishes complete workflow parity before the old UI is retired.
- **US3 (P2)**: Refines US1/US2 screens into the required consistent, accessible visual system.

### Parallel Opportunities

- T002-T004 can run in parallel after T001.
- T011, T014, T017, and T020 can run in parallel with their respective implementation streams.
- T030-T032 can run in parallel.
- T033-T039 can run in parallel because each owns a distinct Angular feature directory.
- T043 and T044 can run in parallel.

## Parallel Example: User Story 2

```text
Task: "Implement catalog screens in src/ArchiveDex.Web/ClientApp/src/app/features/catalog/"
Task: "Implement collection screens in src/ArchiveDex.Web/ClientApp/src/app/features/collection/"
Task: "Implement scan screens in src/ArchiveDex.Web/ClientApp/src/app/features/scan/"
Task: "Implement import screens in src/ArchiveDex.Web/ClientApp/src/app/features/import/"
Task: "Implement transfer screens in src/ArchiveDex.Web/ClientApp/src/app/features/transfer/"
```

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2.
2. Complete US1 to prove server delivery, Compose debug builds, sign-in/setup, and one responsive shell.
3. Validate deep links, session behavior, mobile navigation, and keyboard use before starting workflow migration.

### Incremental Delivery

1. Add catalog and collection first, then scan/batch scan, then import/transfer/admin workflows.
2. Keep the screen inventory current as each Angular screen is verified.
3. Apply the cross-cutting visual/accessibility pass after all workflows exist.
4. Remove Blazor only in the final cutover phase after every primary journey passes.

## Notes

- `[P]` tasks affect independent files/directories and can be assigned in parallel only after their stated prerequisites are complete.
- The cutover is intentionally last: no legacy UI removal occurs before screen-inventory parity and browser validation pass.
- The Angular client must never call repositories, Hangfire, or Infrastructure services directly; it uses same-origin HTTP contracts only.

---

## Phase 7: Convergence

**Purpose**: Close remaining gaps identified by `/speckit-converge` between spec/plan/tasks and the codebase.

- [x] T055 [US1] Add responsive sidebar navigation with breakpoint collapse, overlay mobile nav drawer, hamburger toggle, and touch-accessible tap targets to the application shell per FR-014 in `src/ArchiveDex.Web/ClientApp/src/app/app.ts` (partial — T025 was marked done but fixed-width sidebar has no responsive behavior)
- [x] T056 Implement Taiga UI translate service wiring using `@taiga-ui/i18n` so navigation labels, page headings, actions, and shared-state text use loaded i18n catalogs instead of hardcoded English per FR-016 in `src/ArchiveDex.Web/ClientApp/src/app/{app.ts,core/,shared/states.component.ts,features/}` (missing — i18n JSON files exist but are unintegrated)

---

## Phase 8: Convergence

**Purpose**: Close additional implementation gaps found after the second implementation pass without altering prior task history.

- [x] T057 [US1] CRITICAL: derive `setupRequired` from the existing setup state, replace the nonexistent `/api/setup/initialize` call with the `/api/setup/state`, `/validate`, and `/complete` workflow, and add contract/component coverage in `src/ArchiveDex.Api/Controllers/SessionController.cs`, `src/ArchiveDex.Web/ClientApp/src/app/features/setup/setup.component.ts`, `tests/ArchiveDex.Api.Tests/SessionAccountContractTests.cs`, and `src/ArchiveDex.Web/ClientApp/src/app/features/setup/setup.component.spec.ts` per FR-023 and US1/AC5 (contradicts)
- [x] T058 [US1] Fix the mobile overlay class/state binding, keyboard focus containment, Escape dismissal, and minimum touch-target sizing in `src/ArchiveDex.Web/ClientApp/src/app/app.ts` with responsive component coverage in `src/ArchiveDex.Web/ClientApp/src/app/layout/app-shell.spec.ts` per FR-014 (partial)
- [x] T059 [US3] Add persisted language selection, configure Taiga UI language providers, load the selected client catalog, and replace remaining hardcoded setup/auth/error/account text in `src/ArchiveDex.Web/ClientApp/src/main.ts`, `src/ArchiveDex.Web/ClientApp/src/app/core/translate.service.ts`, `src/ArchiveDex.Web/ClientApp/src/app/app.ts`, `src/ArchiveDex.Web/ClientApp/src/app/features/`, and `src/ArchiveDex.Web/ClientApp/src/assets/i18n/` per FR-016 (partial)
- [x] T060 [US1] Implement account loading and supported account updates against `/api/account`, including loading, success, validation, and error states, in `src/ArchiveDex.Web/ClientApp/src/app/features/account/account.component.ts` with API/component tests in `tests/ArchiveDex.Api.Tests/SessionAccountContractTests.cs` and `src/ArchiveDex.Web/ClientApp/src/app/features/account/account.component.spec.ts` per FR-023 (partial)

---

## Phase 9: Convergence

**Purpose**: Close implementation and delivery gaps found after workflow implementation and browser-test expansion without altering prior task history.

- [X] T061 CRITICAL: unify deterministic Angular build output and static-asset ownership so normal build, publish, production Docker, and Visual Studio Fast Mode all include and serve the same current distribution; restrict preview hosting to non-production, preserve missing-asset/API 404 behavior, and restore `tests/ArchiveDex.Web.Tests/AngularHostingTests.cs` coverage per FR-001, FR-003, FR-024, and plan: delivery (contradicts)
- [X] T062 CRITICAL: add ASP.NET antiforgery token issuance and validation for cookie-authenticated unsafe API methods, propagate the token through an Angular HTTP interceptor, define safe sign-in/setup exceptions, and test missing, invalid, and valid tokens per FR-004 and plan: cookie authentication (missing)
- [X] T063 [US1] CRITICAL: implement the storage-writability validation, require every setup validation result in Angular, make configuration/admin provisioning atomic with rollback, deny setup mutations after completion, repair setup-gate redirect ordering, and add negative/rollback/post-setup tests per FR-019, FR-023, and US1/AC5 (contradicts)
- [X] T064 [US2] restore catalog parity with all-card browsing, server-side name/number/language/set filters, pagination or load-more, add-to-collection duplicate/validation handling, and routable card details that survive refresh per FR-006 and US2/AC1 (partial)
- [X] T065 [US2] complete collection parity with server-backed search and set/language/condition filters, routable entry detail, edit via `PUT /api/collection/{id}`, catalog-based card selection, duplicate merge choices, backend validation messages, and explicit success feedback per FR-007 and US2/AC2 (partial)
- [X] T066 [US2] restore the single-scan confirmation workflow with selectable condition, quantity, purchase price, storage location, notes, validation feedback, and retained entered values on failure per FR-008, FR-011, and FR-019 (partial)
- [X] T067 [US2] restore batch-scan parity with routable review/accept screens by batch ID, review filters, catalog override search, reject/discard actions, selective acceptance, per-batch/per-item collection fields, duplicate resolution, and actionable mutation errors per FR-008 and US2/AC4 (partial)
- [X] T068 [US2] complete selective import using `/api/import/sources`, `/sets`, and `/jobs` with source/language/set selection, start/detail/polling/outcomes, preserve full-import source/language/image options, and always expose terminal reports, warnings, errors, and recovery actions per FR-009 and FR-011 (partial)
- [x] T069 enumerate every API controller action against the authorization matrix, resolve catalog mutation authority, standardize stable user-safe error envelopes without raw Identity details, and add parameterized anonymous/user/admin coverage for every protected action per FR-004, FR-019, and `contracts/angular-ui-api-contract.md` (partial)
- [x] T070 correct `specs/008-angular-ui-rebuild/screen-inventory.md` by adding every legacy and required auth/error/admin/batch route, assigning concrete identifier-preserving replacements, correcting migration behaviors, and resetting unsupported Verified statuses until browser evidence exists per FR-020 and FR-021 (contradicts)
- [x] T071 create a shared user-safe Angular API-error mapper and apply it across all feature loads/mutations so 404/no-active differs from network/server failure, forms retain values, retry is available, backend validation remains actionable, and failures are never swallowed per FR-017, FR-019, and US2/AC5 (partial)
- [x] T072 complete key-parity across the real de/en/ru catalogs for every rendered workflow key, replace all hardcoded user-visible labels/statuses/feedback/placeholders/accessibility text, and add an automated catalog-key parity test that does not use synthetic E2E translations per FR-016 and US3/AC4 (partial)
- [x] T073 [US1] make every primary workflow discoverable including batch scan, add route-driven document/page titles, `routerLinkActive`/`aria-current` location semantics, an aria-live global feedback region/service, and localized access-denied recovery navigation per FR-002, FR-005, FR-013, and SC-003 (partial)
- [x] T074 make import and transfer polling lifecycle-safe with teardown/cancellation on navigation, visible refresh failures and retry, allowed-action busy states, and duplicate-submission prevention per the long-running-operation edge case (partial)
- [x] T075 add a bootstrap/session-recovery state that renders when localization or session initialization fails, uses a safe fallback language, and provides retry instead of leaving a blank application per the network-failure edge case and SC-007 (partial)
- [x] T076 implement server-backed pagination or incremental rendering for catalog and collection lists while preserving filters and displaying loading/progress during page changes per the large-list edge case (partial)

---

## Phase 10: Convergence

**Purpose**: Close remaining gaps found by convergence audit between spec/plan/tasks and the codebase.

- [x] T077 [US2] create unit tests for AdminComponent covering pending-mapping loading, accept/reject/create-new/relation actions, dialog open/close/escape behavior, and error/success state presentation in `src/ArchiveDex.Web/ClientApp/src/app/features/admin/admin.component.spec.ts` per Constitution II (Test-First NON-NEGOTIABLE) and FR-019 (missing)
- [x] T078 [US2] create unit tests for TransferComponent covering active-operation loading, export start, import upload/validate/start-restore, cancel, progress-bar rendering, polling lifecycle, OnDestroy teardown, and error/success state presentation in `src/ArchiveDex.Web/ClientApp/src/app/features/transfer/transfer.component.spec.ts` per Constitution II (Test-First NON-NEGOTIABLE) and FR-019 (missing)
- [x] T079 implement server-side legacy-route redirect middleware that maps documented Blazor routes to their Angular replacements (e.g. `/scan/batch/review/{BatchId:guid}` → `/batch-scan/{BatchId}`) using 301/302 responses in `src/ArchiveDex.Web/Program.cs` or a new `src/ArchiveDex.Web/LegacyRouteRedirectMiddleware.cs` per FR-020 and `screen-inventory.md` (partial)
- [x] T080 populate `src/ArchiveDex.Web/ClientApp/src/app/features/errors/` with standalone AccessDeniedComponent and NotFoundComponent or remove the empty directory and alias the shared/states.component.ts implementations in the route tree with a comment documenting the decision per plan: project structure (partial)

---

## Phase 11: Convergence

**Purpose**: Close remaining gaps found by final convergence audit after Phase 6 cutover.

- [x] T081 delete the unused `src/ArchiveDex.Web/ClientApp/src/app/app-routing-module.ts` (NgModule-based routing stub never imported; real routing uses `app.routes.ts` with `provideRouter()`) per Constitution I (Dead code MUST be deleted) (unrequested)
