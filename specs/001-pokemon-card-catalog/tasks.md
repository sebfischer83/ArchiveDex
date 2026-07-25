# Tasks: KI-gestützter Pokémon-Kartenkatalog

**Input**: Design documents from `/specs/001-pokemon-card-catalog/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The constitution mandates TDD: write failing tests first, then implement. Every phase includes test tasks before implementation tasks.

**Organization**: Tasks are grouped by user story. Shared hosting, authentication, build, and design-system prerequisites appear first because all user stories depend on them.

## Path Conventions

- Server: `src/ArchiveDex.Server/`
- Angular client: `src/ArchiveDex.Server/ClientApp/`
- Server unit tests: `tests/ArchiveDex.Server.UnitTests/`
- Server integration tests: `tests/ArchiveDex.Server.IntegrationTests/`
- Server contract tests: `tests/ArchiveDex.Server.ContractTests/`
- Browser E2E tests: `tests/ArchiveDex.E2E/`
- Feature documentation: `specs/001-pokemon-card-catalog/`

---

## Phase 1: Setup

**Purpose**: Establish the .NET solution, project scaffolding, dependency manifests, linting, formatting, and version pinning for both server and client.

- [x] T001 Create solution and project scaffolding: `ArchiveDex.slnx`, `src/ArchiveDex.Server/ArchiveDex.Server.csproj`, `global.json` with .NET 10.0 SDK pin, `Directory.Build.props`, `Directory.Packages.props` with Central Package Management
- [x] T002 [P] Create Angular workspace manifests, scripts, and Node version declaration in `src/ArchiveDex.Server/ClientApp/package.json`, `src/ArchiveDex.Server/ClientApp/angular.json`, `src/ArchiveDex.Server/ClientApp/.nvmrc` (Node 24 LTS)
- [x] T003 [P] Create Angular TypeScript, linting, unit-test, and browser-test configuration in `src/ArchiveDex.Server/ClientApp/tsconfig.json`, `src/ArchiveDex.Server/ClientApp/tsconfig.spec.json`, `src/ArchiveDex.Server/ClientApp/playwright.config.ts`, and `src/ArchiveDex.Server/ClientApp/vitest.config.ts`
- [x] T004 [P] Add Angular, Angular Material/CDK, localization, and browser-test dependencies to `src/ArchiveDex.Server/ClientApp/package.json`
- [x] T005 [P] Create test project scaffolding: `tests/ArchiveDex.Server.UnitTests/`, `tests/ArchiveDex.Server.IntegrationTests/`, `tests/ArchiveDex.Server.ContractTests/`, `tests/ArchiveDex.E2E/` with their `.csproj` files referencing xUnit v3, WebApplicationFactory, Testcontainers, and aligned NuGet versions
- [x] T006 [P] Configure editor formatting, linting, and code-style enforcement in `.editorconfig`, `src/ArchiveDex.Server/.editorconfig`, and `src/ArchiveDex.Server/ClientApp/.prettierrc`
- [x] T007 [P] Add .NET and Node build artifact patterns to `.gitignore` and `.dockerignore`
- [x] T008 Add NuGet and npm version pins: EF Core 10, Npgsql, ImageSharp, OpenTelemetry, Serilog, Angular 22, Angular Material/CDK, Vitest, Playwright in `Directory.Packages.props` and `src/ArchiveDex.Server/ClientApp/package.json`

---

## Phase 2: Foundational Hosting, Security, and Design System

**Purpose**: Build and serve the Angular application from the ASP.NET host in Docker Compose; establish persistence, authentication, API contracts, and the reusable UI system required by all screens.

**⚠️ CRITICAL**: Complete this phase before implementing user-story screens.

### Tests for Phase 2

- [x] T009 [P] Create Docker Compose infrastructure test validating `web` and `db` health, named volume persistence, and migration bundle application in `tests/ArchiveDex.Server.IntegrationTests/DockerInfrastructureTests.cs`
- [x] T010 [P] Create host integration tests for SPA static delivery, SPA deep-link refresh, API 404 preservation, and health-check behavior in `tests/ArchiveDex.Server.ContractTests/HostContractTests.cs`
- [x] T011 [P] Create authentication contract tests for sign-in, sign-out, session, and antiforgery token issuance in `tests/ArchiveDex.Server.ContractTests/AuthenticationContractTests.cs`
- [x] T012 [P] Create EF Core migration tests validating up/down roundtrip and model snapshot consistency against PostgreSQL 18 in `tests/ArchiveDex.Server.IntegrationTests/MigrationTests.cs`

### Implementation for Phase 2

- [x] T013 Build the ASP.NET Core host pipeline: `Program.cs` with controllers, OpenAPI, health checks, antiforgery, SPA static assets, and SPA fallback excluding `/api`, `/health`, and `/hangfire` in `src/ArchiveDex.Server/Program.cs`
- [x] T014 Add Docker Compose configuration with `web` and `db` services, named volumes, health checks, secrets, and transient migration command in `docker-compose.yml`, `docker-compose.override.yml`, and `.env.example`
- [x] T015 Create the multi-stage Dockerfile: Node 24 LTS build stage for Angular, .NET 10 SDK stage for restore/test/publish, ASP.NET 10 runtime final image in `Dockerfile`
- [x] T016 Add MSBuild targets that restore/build the Angular browser output before Web Debug and Publish builds in `src/ArchiveDex.Server/ArchiveDex.Server.csproj`
- [x] T017 Wire up EF Core DbContext, PostgreSQL connection, migration history, and the owner-scoped `ArchiveDexDbContext` with initial configurations in `src/ArchiveDex.Server/Infrastructure/Persistence/ArchiveDexDbContext.cs` and `src/ArchiveDex.Server/Infrastructure/Persistence/Configurations/`
- [x] T018 Generate and commit the initial EF Core migration for all Phase 2 entities (`ApplicationUser`, `ImageAsset`, `CaptureDraft`, `CatalogSetReference`, `CatalogCardReference`, `SetEdition`, `CardRecord`, `CardSpecimen`) in `src/ArchiveDex.Server/Infrastructure/Persistence/Migrations/`
- [x] T019 Wire ASP.NET Core Identity with owner provisioning, cookie configuration, Data Protection volume, and the single-owner scope in `src/ArchiveDex.Server/Features/Authentication/`
- [x] T020 Add session, sign-in, sign-out, and setup-status contracts per `contracts/openapi.yaml` in `src/ArchiveDex.Server/Features/Authentication/SessionController.cs`
- [x] T021 Apply the authorization matrix: fallback policy requires authenticated user for every `/api/v1/**` route; anonymous access only for session/sign-in routes in `src/ArchiveDex.Server/Program.cs`
- [x] T022 Create Angular bootstrap, router, same-origin HTTP client with antiforgery token interceptor, error interceptor, and session state in `src/ArchiveDex.Server/ClientApp/src/app/core/`
- [x] T023 Create Angular authentication guards, sign-in, sign-out, and account screens backed by the session contracts in `src/ArchiveDex.Server/ClientApp/src/app/features/auth/` and `src/ArchiveDex.Server/ClientApp/src/app/core/guards.ts`
- [x] T024 Create the Angular application shell with Taiga UI or Angular Material theme tokens, responsive sidebar, desktop/mobile navigation, route title strategy, and layout primitives in `src/ArchiveDex.Server/ClientApp/src/app/layout/` and `src/ArchiveDex.Server/ClientApp/src/styles.scss`
- [x] T025 Create shared Angular loading, empty, error, access-denied, and not-found state components with standardized translatable messages in `src/ArchiveDex.Server/ClientApp/src/app/shared/`
- [x] T026 [P] Create Angular unit tests for session state, error mapping, antiforgery interceptor, route guards, and standardized UI states in `src/ArchiveDex.Server/ClientApp/src/app/core/**/*.spec.ts` and `src/ArchiveDex.Server/ClientApp/src/app/shared/**/*.spec.ts`
- [x] T027 Create client localization catalogs for de/en (plus a minimal ru placeholder) and language selection/bootstrap behavior in `src/ArchiveDex.Server/ClientApp/src/assets/i18n/` and `src/ArchiveDex.Server/ClientApp/src/app/core/localization/`

**Checkpoint**: `docker compose up` builds and serves the Angular shell, sign-in and session work, persistence and migrations apply cleanly, and anti-forgery/authentication tests are green.

---

## Phase 3: User Story 1 - Card Capture from Image (Priority: P1)

**Goal**: Upload a single card image, run structured AI analysis, present a reviewable proposal with uncertainty, condition proposal, and EUR valuation, including duplicate detection.

**Independent Test**: Upload a supported card image; the analysis reaches `needsReview` within 30 seconds displaying printed name, German name, number, set, language, condition proposal, and valuation.

### Tests for User Story 1

- [x] T028 [P] [US1] Create unit tests for image validation pipeline (format allowlist, pixel/memory limits, EXIF stripping, re-encoding) in `tests/ArchiveDex.Server.UnitTests/Images/ImageValidationTests.cs`
- [x] T029 [P] [US1] Create unit tests for exact-SHA256 duplicate detection, advisory-lock serialization, and explicit-override logic in `tests/ArchiveDex.Server.UnitTests/Collection/DuplicateDetectionTests.cs`
- [x] T030 [P] [US1] Create unit tests for the capture state machine transitions (`Uploaded → Analyzing → NeedsReview | NeedsNewImage | Failed`, retry bounds) in `tests/ArchiveDex.Server.UnitTests/Capture/CaptureStateMachineTests.cs`
- [x] T031 [P] [US1] Create unit tests for the AI extraction contract deserialization, provider-agnostic schema validation, observation-to-catalog mapping, and multi-language German-name resolution in `tests/ArchiveDex.Server.UnitTests/Capture/AnalysisPipelineTests.cs`
- [x] T032 [P] [US1] Create integration tests for capture upload, draft persistence, duplicate warning, and draft expiration cleanup using real PostgreSQL in `tests/ArchiveDex.Server.IntegrationTests/Capture/CaptureIntegrationTests.cs`
- [x] T033 [P] [US1] Create API contract tests for capture create, get, delete, retry, and the full state-machine journey in `tests/ArchiveDex.Server.ContractTests/CaptureContractTests.cs`
- [x] T034 [P] [US1] Create provider adapter tests with a deterministic fake AI, fake market-data, and pinned catalog fixture in `tests/ArchiveDex.Server.UnitTests/Capture/ProviderAdapterTests.cs`
- [x] T035 [P] [US1] Create Angular component tests for the capture upload, progress, review, and error recovery screens in `src/ArchiveDex.Server/ClientApp/src/app/features/capture/**/*.spec.ts`
- [x] T036 [P] [US1] Create browser journeys for capture upload, analysis polling, condition-selection, and error/retry states in `src/ArchiveDex.Server/ClientApp/e2e/capture.spec.ts`

### Implementation for User Story 1

- [x] T037 [P] [US1] Implement the image normalization service: format allowlist, signature validation, pixel/memory limits, orientation, EXIF/GPS stripping, browser-safe re-encode, thumbnail generation, SHA-256 hashing in `src/ArchiveDex.Server/Infrastructure/Images/ImageNormalizationService.cs`
- [x] T038 [P] [US1] Implement the `IVisualCardAnalyzer` interface and a single configurable provider adapter with strict structured output, bounded retry, and typed error codes in `src/ArchiveDex.Server/Infrastructure/Providers/IVisualCardAnalyzer.cs` and `src/ArchiveDex.Server/Infrastructure/Providers/VisionProviderAdapter.cs`
- [x] T039 [P] [US1] Implement a versioned Simplified-Chinese set-code reference, reuse already-confirmed ArchiveDex database references as bounded candidates, and enrich official German names through the isolated web-resolution stage in `src/ArchiveDex.Server/Infrastructure/Providers/`
- [x] T040 [P] [US1] Implement the `IMarketValuationProvider` interface with a CardTrader adapter (if terms approved) and a TCGdex/Cardmarket EUR aggregate fallback, including condition-mapping and confidence tagging in `src/ArchiveDex.Server/Infrastructure/Providers/IMarketValuationProvider.cs` and `src/ArchiveDex.Server/Infrastructure/Providers/MarketValuationProvider.cs`
- [x] T041 [US1] Implement the capture orchestration service: create draft, persist image, schedule analysis, poll state, enforce the state machine, and handle retry/expiry in `src/ArchiveDex.Server/Features/Capture/CaptureOrchestrationService.cs`
- [x] T042 [US1] Implement the capture controller: `POST /captures`, `GET /captures/{id}`, `DELETE /captures/{id}`, `POST /captures/{id}/retry` with idempotency, ETags, and RFC Problem Details in `src/ArchiveDex.Server/Features/Capture/CaptureController.cs`
- [x] T043 [US1] Wire the background analysis queue/hosted service for async capture processing with bounded concurrency and durable state in `src/ArchiveDex.Server/Features/Capture/CaptureProcessingService.cs`
- [x] T044 [US1] Implement the capture upload Angular screen with file selection, progress indication, and duplicate-warning presentation in `src/ArchiveDex.Server/ClientApp/src/app/features/capture/capture-upload.component.ts`
- [x] T045 [US1] Implement the capture review Angular screen displaying all analysis fields, confidence indicators, condition selection (NM/LP/MP/HP/DMG), catalog-candidate picker, and germanName-disclosure in `src/ArchiveDex.Server/ClientApp/src/app/features/capture/capture-review.component.ts`
- [x] T046 [US1] Implement typed capture API client, polling behavior, and error-recovery state in `src/ArchiveDex.Server/ClientApp/src/app/features/capture/capture.service.ts`
- [x] T047 [US1] Register capture routes, guards, and feature-redirects in `src/ArchiveDex.Server/ClientApp/src/app/app.routes.ts`

**Checkpoint**: A card image upload is normalized, analyzed, reviewed, and ready for finalization. Provider fakes are deterministic; real-provider smoke test is separately triggerable.

---

## Phase 4: User Story 2 - Review, Finalize, and Store Specimen (Priority: P1)

**Goal**: Confirm or correct reviewed fields, condition, and duplicate override; finalize one physical specimen beneath its grouped card record; edit and delete specimens; persist image, condition, and valuation atomically.

**Independent Test**: Review and finalize a capture, open the resulting card in the set list, edit its condition, delete the specimen, and confirm the empty grouped card disappears.

### Tests for User Story 2

- [x] T048 [P] [US2] Create unit tests for capture review validation (all mandatory fields, exactly one NM/LP/MP/HP/DMG, germanName xor unavailableReason) in `tests/ArchiveDex.Server.UnitTests/Capture/ReviewValidationTests.cs`
- [x] T049 [P] [US2] Create unit tests for finalization transaction: duplicate advisory-lock, upsert SetEdition/CardRecord, insert CardSpecimen, attach ImageAsset, remove CaptureDraft in `tests/ArchiveDex.Server.UnitTests/Collection/FinalizationTransactionTests.cs`
- [x] T050 [P] [US2] Create unit tests for grouped identity rules: owner+set+language+number+variant unique constraint, empty-group cleanup, move-specimens-on-identity-edit in `tests/ArchiveDex.Server.UnitTests/Collection/GroupingIdentityTests.cs`
- [x] T051 [P] [US2] Create integration tests for the full capture→review→finalize→edit→delete lifecycle with real PostgreSQL in `tests/ArchiveDex.Server.IntegrationTests/Collection/CollectionLifecycleTests.cs`
- [x] T052 [P] [US2] Create API contract tests for finalization, duplicate-conflict, specimen update, specimen delete, grouped-card edit/merge, empty-group removal, and ETag-based conflicts in `tests/ArchiveDex.Server.ContractTests/CollectionContractTests.cs`
- [x] T053 [P] [US2] Create Angular component tests for review-confirmation, finalization, duplicate-override, and specimen-list screens in `src/ArchiveDex.Server/ClientApp/src/app/features/capture/**/*.spec.ts`
- [x] T054 [P] [US2] Create browser journeys for full capture→finalize→edit-condition→delete-specimen including duplicate-warning override in `src/ArchiveDex.Server/ClientApp/e2e/collection.spec.ts`

### Implementation for User Story 2

- [x] T055 [US2] Implement review validation and the `PUT /captures/{id}/review` endpoint with field-level error responses in `src/ArchiveDex.Server/Features/Capture/CaptureReviewService.cs` and `src/ArchiveDex.Server/Features/Capture/CaptureController.cs` (review path)
- [x] T056 [US2] Implement the finalization service: upsert SetEdition/CardRecord, advisory-lock for duplicate, insert CardSpecimen, attach ImageAsset, remove CaptureDraft, all within one transaction in `src/ArchiveDex.Server/Features/Collection/CollectionFinalizationService.cs`
- [x] T057 [US2] Implement the `POST /captures/{id}/finalize` endpoint with idempotency, duplicate-conflict response, and `Location` header in `src/ArchiveDex.Server/Features/Collection/CollectionController.cs`
- [x] T058 [US2] Implement the `PUT /cards/{id}` and `PUT /specimens/{id}` endpoints with ETag-based optimistic concurrency, identity-edit merging, and validation in `src/ArchiveDex.Server/Features/Collection/CollectionController.cs`
- [x] T059 [US2] Implement the `DELETE /specimens/{id}` endpoint with card-record removal when empty, image cleanup, and ETag-based concurrency in `src/ArchiveDex.Server/Features/Collection/CollectionController.cs`
- [x] T060 [US2] Implement the private authenticated image endpoint `GET /specimens/{id}/image` with size parameter (thumbnail/full), nosniff and cache-private headers, and owner-scoped query in `src/ArchiveDex.Server/Features/Collection/ImageController.cs`
- [x] T061 [US2] Integrate review-confirmation and finalization flows into the Angular capture screens in `src/ArchiveDex.Server/ClientApp/src/app/features/capture/`
- [x] T062 [US2] Register collection finalization and edit routes in `src/ArchiveDex.Server/ClientApp/src/app/app.routes.ts`

**Checkpoint**: A capture can be reviewed, finalized, the resulting specimen is stored beneath its grouped card, and condition edits, deletion, and image access work end-to-end through the Angular UI.

---

## Phase 5: User Story 3 - Browse by Set and Language (Priority: P2)

**Goal**: Display an owner-scoped set+language overview with distinct-card and physical-specimen counts; browse cards within a set; access card detail with all specimens listed.

**Independent Test**: Finalize specimens from at least two sets and two languages; open the set overview, select a set, select a card, and confirm counts and specimen thumbnails.

### Tests for User Story 3

- [x] T063 [P] [US3] Create unit tests for set-edition grouping, owned-set queries, count aggregation, and empty-collection handling in `tests/ArchiveDex.Server.UnitTests/Collection/SetBrowsingTests.cs`
- [x] T064 [P] [US3] Create integration tests for large-set browsing, keyset pagination, search/filter, and performance budgets in `tests/ArchiveDex.Server.IntegrationTests/Collection/CollectionPerformanceTests.cs`
- [x] T065 [P] [US3] Create API contract tests for `GET /sets`, `GET /sets/{id}/cards`, `GET /cards/{id}` with pagination and search in `tests/ArchiveDex.Server.ContractTests/CollectionContractTests.cs`
- [x] T066 [P] [US3] Create Angular component tests for set-overview, card-list, and card-detail screens in `src/ArchiveDex.Server/ClientApp/src/app/features/sets/**/*.spec.ts` and `src/ArchiveDex.Server/ClientApp/src/app/features/cards/**/*.spec.ts`
- [x] T067 [P] [US3] Create browser journeys for set-browse, card-browse, deep-link refresh, and empty-collection states in `src/ArchiveDex.Server/ClientApp/e2e/browse.spec.ts`

### Implementation for User Story 3

- [x] T068 [P] [US3] Implement query services for owned-set listing, card listing within a set, and card detail with specimens, using keyset pagination and projections in `src/ArchiveDex.Server/Features/Collection/CollectionQueryService.cs`
- [x] T069 [US3] Implement the `GET /sets`, `GET /sets/{id}/cards`, and `GET /cards/{id}` endpoints in `src/ArchiveDex.Server/Features/Collection/CollectionController.cs`
- [x] T070 [P] [US3] Implement the Angular set-overview screen with set-language cards showing counts and thumbnail-preview in `src/ArchiveDex.Server/ClientApp/src/app/features/sets/set-overview.component.ts`
- [x] T071 [P] [US3] Implement the Angular card-list screen with search, pagination, and "load more" in `src/ArchiveDex.Server/ClientApp/src/app/features/cards/card-list.component.ts`
- [x] T072 [P] [US3] Implement the Angular card-detail screen listing all specimens with thumbnail, condition, valuation, and navigation to the edit page in `src/ArchiveDex.Server/ClientApp/src/app/features/cards/card-detail.component.ts`
- [x] T073 [US3] Register set and card browsing routes in `src/ArchiveDex.Server/ClientApp/src/app/app.routes.ts`

**Checkpoint**: The set-and-language overview displays correct counts; clicking through shows card lists with specimens; deep-links survive refresh.

---

## Phase 6: User Story 4 - Valuation Refresh (Priority: P2)

**Goal**: Manually refresh the EUR valuation of one specimen without repeating image analysis; on failure preserve the last successful value. Display valuation history and market metadata.

**Independent Test**: Refresh a specimen's valuation, confirm updated timestamp and disclaimer; trigger a provider failure and confirm the last value persists.

### Tests for User Story 4

- [x] T074 [P] [US4] Create unit tests for valuation refresh: provider success updates, provider failure preserves, condition-applied flag, currency/amount/null-coherence invariants in `tests/ArchiveDex.Server.UnitTests/Valuation/ValuationRefreshTests.cs`
- [x] T075 [P] [US4] Create integration tests for valuation with CardTrader adapter (terms permitting) and aggregate fallback against real PostgreSQL in `tests/ArchiveDex.Server.IntegrationTests/Valuation/ValuationIntegrationTests.cs`
- [x] T076 [P] [US4] Create API contract tests for `POST /specimens/{id}/valuation` with idempotency, ETag, success, and provider-failure responses in `tests/ArchiveDex.Server.ContractTests/ValuationContractTests.cs`
- [x] T077 [P] [US4] Create Angular component tests for the valuation-display and refresh-trigger UI in `src/ArchiveDex.Server/ClientApp/src/app/features/cards/**/*.spec.ts`
- [x] T078 [P] [US4] Create browser journeys for manual valuation refresh and provider-failure recovery in `src/ArchiveDex.Server/ClientApp/e2e/valuation.spec.ts`

### Implementation for User Story 4

- [x] T079 [US4] Implement the valuation refresh service: read confirmed identity and condition server-side, call provider, write new snapshot only on success, leave last value untouched on failure in `src/ArchiveDex.Server/Features/Valuation/ValuationService.cs`
- [x] T080 [US4] Implement the `POST /specimens/{id}/valuation` endpoint with idempotency, ETag, and typed provider-outcome response in `src/ArchiveDex.Server/Features/Valuation/ValuationController.cs`
- [x] T081 [US4] Add valuation-display Angular component showing amount, currency, provider, confidence, timestamps, and disclaimer in `src/ArchiveDex.Server/ClientApp/src/app/features/cards/valuation-display.component.ts`
- [x] T082 [US4] Bind a manual refresh trigger to the card-detail and specimen-detail Angular screens in `src/ArchiveDex.Server/ClientApp/src/app/features/cards/`
- [x] T083 [US4] Implement a persisted collection-wide valuation refresh job with progress UI, restart recovery, shared requests per card/condition, and last-successful-value preservation in `src/ArchiveDex.Server/Features/Valuation/`
- [x] T084 [US4] Implement versioned full-collection ZIP export/import with streamed uploads, image checksums, idempotent merge behavior, API endpoints, and collection UI in `src/ArchiveDex.Server/Features/DataTransfer/`

**Checkpoint**: Valuation refresh works through the UI; a failed refresh shows recovery guidance and retains the last successful value.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: CI, observability, backup, catalog ingestion tooling, load benchmarks, migration bundles, and runbook validation.

- [x] T083 [P] Wire OpenTelemetry tracing and metrics for all mutations, provider calls, and image operations; expose optional OTLP export in `src/ArchiveDex.Server/Infrastructure/Observability/`
- [x] T084 [P] Add structured Serilog logging to stdout with trace IDs, operation names, outcomes, and bounded-cardinality metrics in `src/ArchiveDex.Server/Program.cs` and `src/ArchiveDex.Server/Infrastructure/Observability/`
- [x] T085 [P] Create a catalog-snapshot ingestion CLI command that imports a pinned TCGdex release into the local `CatalogSetReference`/`CatalogCardReference` tables in `src/ArchiveDex.Server/Infrastructure/Providers/CatalogIngestionCommand.cs`
- [x] T086 Create the performance-benchmark Docker Compose target and a seeded benchmark dataset generator with 100 set-editions, 10,000 card variants, and 20,000 physical specimens in `tests/ArchiveDex.Server.IntegrationTests/Benchmarks/`
- [x] T087 [P] Create the production migration bundle script and the `docker compose run --rm web migrate` command in `src/ArchiveDex.Server/Infrastructure/Persistence/Migrations/` and `docker-compose.yml`
- [x] T088 [P] Create the initial user provisioning command that reads username/password from Docker secrets and creates the single owner account in `src/ArchiveDex.Server/Features/Authentication/OwnerProvisioningCommand.cs`
- [x] T089 [P] Add PostgreSQL backup documentation and an example cron/pg_dump script with encryption, retention, checksums, and restore-test in `docs/backup.md`
- [x] T090 [P] Create a GitHub Actions CI workflow that runs format/lint, unit tests, contract tests, PostgreSQL integration tests, Angular tests, browser E2E, and benchmark gates in `.github/workflows/ci.yml`
- [x] T091 Run every quickstart.md journey and verify acceptance criteria against the built containers
- [x] T092 [P] Apply the shared Angular theme, typography, spacing, density, and consistent loading/empty/error states across all feature screens in `src/ArchiveDex.Server/ClientApp/src/styles.scss` and every feature component
- [x] T093 [P] Audit and correct keyboard navigation, focus management, semantic ARIA labels, and dialog handling across all client features in `src/ArchiveDex.Server/ClientApp/src/app/`
- [x] T094 [P] Add responsive mobile-audit browser journeys covering all four primary workflows at 390×844 viewport in `src/ArchiveDex.Server/ClientApp/e2e/responsive.spec.ts`
- [x] T095 [P] Ensure client localization keys are complete and parity-tested across de/en for every displayed label, heading, state, and action in `src/ArchiveDex.Server/ClientApp/src/assets/i18n/` and `src/ArchiveDex.Server/ClientApp/src/app/core/localization-parity.spec.ts`
- [x] T096 [P] Review and harden API security: ensure every metadata and image endpoint is owner-scoped, ETag-concurrency is enforced, idempotency keys are validated, upload limits are enforced at proxy/Kestrel/multipart layers, and error responses never expose provider secrets or full image paths in `src/ArchiveDex.Server/Program.cs` and controllers
- [x] T097 [P] Configure container packaging final review: lock Docker image digests, verify read-only root filesystem and non-root user, drop capabilities, and test Compose secret mounting in `Dockerfile` and `docker-compose.yml`
- [x] T098 Run the full test suite (`docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm test`), confirm all coverage gates (80% lines, 70% branches, 100% branch for critical invariants), and lock coverage baselines

**Checkpoint**: All quickstart journeys pass; CI is green; backend and client tests, benchmarks, and coverage gates are satisfied; the application is ready for review.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — blocks all user stories.
- **US1 (Phase 3 / Capture)**: Depends on Phase 2. Provides image normalization, AI analysis pipeline, and the review-ready proposal.
- **US2 (Phase 4 / Collection)**: Depends on US1 (review-ready data). Finalization, grouping, specimen management, image delivery.
- **US3 (Phase 5 / Browse)**: Depends on US2 (persisted specimens and cards). Set-and-language browsing with counts and navigation.
- **US4 (Phase 6 / Valuation)**: Depends on US2 (persisted specimens). Manual valuation refresh without new image analysis.
- **Phase 7 (Polish)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundation. Establishes the capture pipeline.
- **US2 (P1)**: Requires US1 reviewed output. Together US1+US2 form the MVP because capture alone has no persistence.
- **US3 (P2)**: Requires US2 finalized data. Provides collection browsing and counts.
- **US4 (P2)**: Requires US2 specimens. Valuation refresh is a secondary feature.

### Parallel Opportunities

- Within Phase 1: T002–T007 can run in parallel after T001.
- Within Phase 2: T009–T012 (tests) and T026 (Angular unit tests) can run in parallel.
- Within US1: T028–T036 (all tests) can run in parallel; T037–T040 (provider implementations) can run in parallel.
- Within US2: T048–T054 (all tests) can run in parallel.
- Within US3: T063–T067 (all tests) can run in parallel; T068, T070–T072 (query service + Angular screens) can run in parallel.
- US3 and US4 can run in parallel after US2 is complete.
- Phase 7 tasks T083–T098 are mostly parallel after all user stories are complete.

## Parallel Example: User Story 1

```bash
# Launch all US1 provider tests together:
Task: "Unit test image validation pipeline in tests/.../ImageValidationTests.cs"
Task: "Unit test duplicate detection in tests/.../DuplicateDetectionTests.cs"
Task: "Unit test capture state machine in tests/.../CaptureStateMachineTests.cs"
Task: "Unit test analysis pipeline in tests/.../AnalysisPipelineTests.cs"
Task: "Unit test provider adapters in tests/.../ProviderAdapterTests.cs"

# Launch all US1 provider implementations together:
Task: "Implement image normalization service in src/.../ImageNormalizationService.cs"
Task: "Implement vision provider adapter in src/.../VisionProviderAdapter.cs"
Task: "Implement catalog provider in src/.../TcgdexCatalogProvider.cs"
Task: "Implement market valuation provider in src/.../MarketValuationProvider.cs"
```

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phases 1 and 2.
2. Complete US1 (Phase 3) to prove image-to-analysis pipeline.
3. Complete US2 (Phase 4) to prove finalization, grouping, and image delivery.
4. **STOP and VALIDATE**: A card image is uploaded, analyzed, reviewed, finalized, and the specimen appears with its own image. Duplicates are warned and can be overridden.
5. The application is usable as a private card-logging application.

### Incremental Delivery

1. Setup + Foundational → Build and auth ready.
2. US1 + US2 → Capture-to-collection complete (MVP).
3. US3 → Browse by set and language with paginated lists.
4. US4 → Manual valuation refresh with market data.
5. Phase 7 → CI, observability, benchmarks, accessibility, localization polish.

## Notes

- `[P]` tasks affect independent files/directories and can be assigned in parallel only after their stated prerequisites are complete.
- Test tasks MUST be written and verified to fail before their corresponding implementation tasks.
- The Angular client must never call providers or repositories directly; it uses same-origin HTTP contracts only.
- Provider API keys and database credentials are mounted as Docker secrets or protected files; never committed.
- All money values use integer EUR minor units; decimal types are used only at the database and API boundary.
