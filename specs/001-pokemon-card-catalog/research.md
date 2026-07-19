# Research: KI-gestützter Pokémon-Kartenkatalog

**Feature**: 001-pokemon-card-catalog | **Date**: 2026-07-18

## Decision 1: Modular Monolith and Version Baseline

**Decision**: Use C# 14/.NET 10 for one ASP.NET Core modular monolith, Angular 22 with TypeScript 6 for the UI build, Node 24 LTS in build stages, and PostgreSQL 18. Pin patch versions in lockfiles, package management, and container references during implementation.

**Rationale**: The requested solution is small, private, and Docker-hosted. One server process avoids distributed transactions and operational overhead while feature folders maintain boundaries. The selected major versions are current, mutually compatible, and match the available .NET 10 environment.

**Alternatives considered**:
- Separate API, domain, application, and infrastructure projects: rejected for v1 because it adds ceremony without an independent deployment or reuse boundary.
- Separate Angular runtime container: rejected because the server must deliver the production UI as one artifact.
- Microservices or a separate worker: rejected because one owner and fewer than five concurrent requests do not justify the operational cost.

## Decision 2: Same-Origin Angular Delivery

**Decision**: Build Angular in a Node stage and include its hashed browser assets in ASP.NET publish output. ASP.NET serves `/api/v1`, `/health`, and private image endpoints before an Angular fallback to `index.html`.

**Rationale**: Same-origin delivery simplifies secure cookie authentication and antiforgery, supports deep-link refresh, and leaves no Node runtime in production.

**Alternatives considered**:
- Angular development server in production: rejected because it creates a second runtime and weaker deployment boundary.
- Server-side rendering: rejected because the application is private and gains little discoverability value from SSR.
- Cross-origin static hosting: rejected because it adds CORS, cookie, and deployment complexity.

## Decision 3: Docker Runtime

**Decision**: Docker Compose runs `web` and `db`. PostgreSQL data and Data Protection keys use named volumes. Migrations and tests run as transient commands from pinned image stages. The database is not published outside the Compose network.

**Rationale**: This satisfies the all-in-Docker requirement while keeping the persistent runtime small. A transient migration bundle avoids giving the application role schema privileges or risking concurrent startup migrations.

**Alternatives considered**:
- Automatic migration during web startup: rejected because failures make startup unsafe and schema changes become difficult to review or roll back.
- Kubernetes: rejected because high availability and multi-host scheduling are outside v1 scope.
- Self-hosted AI and object-storage containers: rejected for v1 because they substantially increase hardware and operations requirements.

## Decision 4: Authentication and Authorization

**Decision**: Use ASP.NET Core Identity with one owner account provisioned from Docker secrets. Authenticate with an encrypted `HttpOnly`, `Secure`, `SameSite=Lax` host cookie. Require antiforgery validation for every unsafe API operation. Persist Data Protection keys in a protected Docker volume.

**Rationale**: A private one-owner application needs durable sessions and explicit protection of images and mutations, but no registration, OAuth token storage, or multi-tenant role model.

**Alternatives considered**:
- No authentication because the service is private: rejected because container port exposure or reverse-proxy mistakes would expose card images.
- Browser-stored bearer tokens: rejected because cookies with antiforgery reduce token theft risk for a same-origin application.
- External OpenID Connect: deferred until centralized identity is a real requirement.

## Decision 5: PostgreSQL Image Storage

**Decision**: Store one normalized full image and thumbnail as `bytea` in a dedicated PostgreSQL `image_asset` table. Persist PostgreSQL on a named volume and back it up off-host. Reconsider managed object storage at 50–100 GB image data, missed backup windows, or multi-host deployment.

**Rationale**: At the v1 target of up to 20,000 specimens and roughly 20–35 GB, PostgreSQL provides the simplest atomic relationship between specimen, image, duplicate override, and permanent deletion. It also produces one consistent backup.

**Alternatives considered**:
- Filesystem Docker volume: rejected because database and files cannot commit or back up atomically and require orphan reconciliation.
- S3-compatible object storage: preferred future scale path, but rejected initially because it adds credentials, compensation workflows, and another service boundary.
- PostgreSQL large objects: rejected because ordinary bounded images do not justify their specialized lifecycle APIs.

## Decision 6: Image Safety and Duplicate Detection

**Decision**: Accept a small signature-validated image allowlist with a 15 MiB and 30-megapixel limit. Decode, orient, strip EXIF/GPS, and re-encode to a browser-safe normalized representation plus thumbnail. Compute upload and normalized SHA-256 hashes. Duplicate hashes warn but do not prohibit an explicitly confirmed second specimen.

**Rationale**: Re-encoding limits malicious payloads and accidental location disclosure. Exact hashes satisfy the specified warning behavior without false-positive blocking.

**Alternatives considered**:
- Trust MIME type and filename extension: rejected as unsafe.
- Unique hash constraint: rejected because multiple physical copies with the same image can be deliberately retained.
- Perceptual hash in v1: deferred because false positives need a tuned evaluation set; exact hashes are deterministic.

## Decision 7: Two-Stage Card Recognition

**Decision**: A configurable multimodal provider extracts visible observations through strict structured output. Application code then resolves those observations against a pinned local multilingual TCGdex catalog snapshot. The AI is not authoritative for canonical identity, official German naming, or price.

**Rationale**: Image understanding is appropriate for text, visual clues, and condition suggestions, while deterministic catalog resolution is reproducible, correctable, and testable. A local snapshot removes live catalog availability from the 30-second path.

**Alternatives considered**:
- AI-only identity, translation, and valuation: rejected because plausible output is not a verifiable catalog fact or market quote.
- Traditional OCR only: rejected because artwork, set symbols, finish, and condition require visual reasoning, although OCR may remain an additional signal.
- Hard-code one model name in public contracts: rejected because provider models deprecate; the model is pinned in deployment configuration behind an adapter.

## Decision 8: Condition and Variant Identity

**Decision**: The AI proposes exactly `NEAR_MINT`, `LIGHTLY_PLAYED`, `MODERATELY_PLAYED`, `HEAVILY_PLAYED`, or `DAMAGED`, with observed defects and limitations. The user must confirm it. Group card identity includes canonical card, language, and printing/finish variant; condition belongs to each specimen.

**Rationale**: Finish variants can have materially different values and must not be merged. One front image cannot provide a professional grade, so the proposal remains explicitly uncertain.

**Alternatives considered**:
- Group all finishes by card number: rejected because pricing and physical identity become misleading.
- Free-text condition: rejected because it prevents consistent validation, filtering, and valuation.
- Professional grading claim: rejected because the image scope and feature specification explicitly exclude it.

## Decision 9: EUR Valuation

**Decision**: Use a separate market provider adapter. Prefer a terms-approved condition/language/printing-aware source such as CardTrader active listings; fall back to TCGdex/Cardmarket EUR aggregates with lower confidence and explicit `conditionApplied=false`. Store integer minor units, currency, provider/method, market-data timestamp, estimate timestamp, and uncertainty. Return unavailable rather than inventing precision.

**Rationale**: Catalog, AI, and market data have different licensing, freshness, and failure modes. Separating them allows card capture to succeed when valuation is unavailable.

**Alternatives considered**:
- AI-generated price: rejected because it has no reliable market timestamp or provenance.
- Direct Cardmarket integration: preferred conceptually but cannot be assumed without approved access and terms.
- Arbitrary percentage multipliers by condition: rejected because they create false precision.

## Decision 10: Asynchronous Analysis and Recovery

**Decision**: Persist a capture draft and image before external analysis. Run analysis asynchronously with bounded retries and expose a polling resource. Terminal states are `NeedsReview`, `NeedsNewImage`, or `Failed`; no operation remains indefinitely active. Manual revaluation reuses confirmed identity and never removes the last successful value after failure.

**Rationale**: External providers have variable latency, rate limits, and outages. A persisted state machine preserves user work and supports deterministic recovery within the 30-second requirement.

**Alternatives considered**:
- Hold one HTTP request open for the entire analysis: rejected because provider timeouts and container restarts lose progress.
- Add a message broker and worker service: rejected for v1 scale; a bounded in-process background queue backed by persisted state is sufficient.
- Automatic cross-provider failover: rejected because it silently changes cost, accuracy, privacy, and residency.

## Decision 11: API and Error Contract

**Decision**: Expose versioned `/api/v1` JSON endpoints documented by OpenAPI 3.1. Use RFC Problem Details with stable application error codes, idempotency keys for retryable commands, and ETag/`If-Match` optimistic concurrency for edits. Stream authenticated image endpoints separately from list metadata.

**Rationale**: Stable machine-readable contracts satisfy the constitution, prevent accidental duplicate commands, and make Angular and contract tests deterministic.

**Alternatives considered**:
- Minimal APIs without a published contract: rejected because public boundaries require contract tests and versioning.
- Return provider error payloads directly: rejected because they leak technical details and couple the UI to vendors.
- Include images in list responses: rejected because it breaks payload and memory budgets.

## Decision 12: Test, Observability, and Performance Gates

**Decision**: Enforce TDD across server, Angular, API contracts, PostgreSQL integration, browser journeys, and provider adapters. Normal CI uses fake providers and a pinned catalog fixture. Structured JSON logs, trace spans, and bounded-cardinality metrics cover every mutation and provider call. Establish 80% line/70% branch coverage and the budgets in plan.md.

**Rationale**: External AI output and binary persistence are high-regression surfaces. Reproducible fixtures, real PostgreSQL tests, and measurable budgets are required by the constitution.

**Alternatives considered**:
- EF in-memory or SQLite integration tests: rejected because they do not reproduce PostgreSQL constraints, transactions, locking, or query behavior.
- Live provider calls in normal CI: rejected because they are nondeterministic, costly, and expose secrets.
- Add a monitoring stack to Compose: rejected for v1; emit OpenTelemetry optionally to an external endpoint and structured logs to stdout.

## Dependency and Legal Notes

- Verify the selected image-processing library license before merge and document the result in the dependency review.
- TCGdex data is MIT-licensed, but Pokémon artwork and trademarks remain third-party intellectual property; the application stores user uploads and must not assume catalog licensing grants image redistribution rights.
- AI and market providers require documented retention, residency, rate-limit, and deletion behavior. Provider keys remain server-side and images are sent without EXIF through non-public requests.
- Marketplace data must be used under approved terms. Active asking prices are labeled as estimates, not completed sales.
