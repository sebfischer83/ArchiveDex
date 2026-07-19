# Implementation Plan: KI-gestützter Pokémon-Kartenkatalog

**Branch**: `develop` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-pokemon-card-catalog/spec.md`

## Summary

Build a private web application in which one authenticated owner uploads a Pokémon card image, receives a structured AI-assisted proposal, confirms or corrects the card identity and visible condition, and stores the physical specimen beneath a grouped card record. An ASP.NET Core 10 modular monolith owns the API, authentication, persistence, provider integrations, image delivery, and Angular 22 production build. PostgreSQL 18 stores metadata and normalized image bytes transactionally. Docker Compose runs the published web image and PostgreSQL; external multimodal and market-data providers are reached over HTTPS through replaceable adapters.

## Technical Context

**Language/Version**: C# 14 on .NET 10; TypeScript 6 with Angular 22; PostgreSQL SQL 18

**Primary Dependencies**: ASP.NET Core MVC and Identity, EF Core 10 with Npgsql, ASP.NET Core OpenAPI and health checks, OpenTelemetry, ImageSharp (license review required before adoption), Angular standalone components, Angular Material/CDK, Angular HttpClient, Reactive Forms, Vitest, Playwright

**Storage**: PostgreSQL 18 for domain data, drafts, normalized card images, thumbnails, and the indexed multilingual catalog snapshot; named Docker volume for PostgreSQL durability; encrypted off-host PostgreSQL backups

**Testing**: xUnit v3 for server unit tests; WebApplicationFactory for API contracts; Testcontainers with real PostgreSQL for persistence and migrations; Vitest for Angular unit/component tests; Playwright for browser journeys; deterministic fake AI/market providers and a separately triggered live-provider smoke suite

**Target Platform**: Linux containers on a Docker Engine with Docker Compose; modern desktop and mobile browsers

**Project Type**: Server-hosted single-page web application and versioned JSON API

**Performance Goals**: Analysis reaches a successful or actionable terminal state within 30 seconds; set/card list queries p95 ≤250 ms and p99 ≤750 ms; ordinary mutations p95 ≤500 ms; image time-to-first-byte p95 ≤300 ms; set overview usable within 2 seconds in 95% of runs; initial compressed Angular assets warning at 300 KiB and failure at 400 KiB

**Constraints**: One persistent web container plus one PostgreSQL container; no separately deployed frontend or worker; same-origin cookie authentication and antiforgery; private authenticated image access; no live external provider dependency in normal CI; card images ≤15 MiB encoded and ≤30 megapixels; all money stored in integer EUR minor units; no O(n²) operation over unbounded collection data

**Scale/Scope**: One owner, fewer than five concurrent requests, up to 100 set-language combinations for acceptance validation, design target of 10,000 grouped card variants and 20,000 physical specimens, approximately 20–35 GB normalized image data; migrate images to managed object storage when image data approaches 50–100 GB or multiple web hosts are required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Before Research | After Design | Evidence |
|------------------|-----------------|--------------|----------|
| I. Code Quality & Maintainability | PASS | PASS | One modular monolith organized by feature; narrow provider interfaces; formatter/linter enforced; no speculative repository or messaging layers |
| II. Test-First & Coverage Discipline | PASS | PASS | Tasks must create failing unit, contract, PostgreSQL integration, component, and browser tests before production code; CI blocks on tests and coverage regression |
| III. User Experience Consistency | PASS | PASS | Versioned `/api/v1` contract, RFC Problem Details, shared Angular loading/error/empty states, typed uncertainty and recovery actions |
| IV. Performance & Resource Efficiency | PASS | PASS | Explicit latency, bundle, memory, payload, and complexity budgets; indexed/keyset queries; benchmark thresholds defined below |
| Structured observability for mutations | PASS | PASS | Upload, analysis, finalization, edit, valuation, deletion, cleanup, and migration operations emit structured logs and trace spans without image bytes or secrets |
| Dependency justification | PASS | PASS | Each non-platform dependency is justified in research.md; lockfiles and pinned container versions are required |

Initial coverage gates are 80% lines and 70% branches for server and client. Grouping, duplicate override, finalization, deletion, and last-successful-valuation invariants require 100% branch coverage. A critical benchmark fails CI when its median regresses by more than 10% from the committed baseline.

## Project Structure

### Documentation (this feature)

```text
specs/001-pokemon-card-catalog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
ArchiveDex.slnx
Directory.Build.props
Directory.Packages.props
global.json
Dockerfile
docker-compose.yml
docker-compose.test.yml
.env.example
src/
└── ArchiveDex.Server/
    ├── ArchiveDex.Server.csproj
    ├── Program.cs
    ├── Features/
    │   ├── Authentication/
    │   ├── Capture/
    │   ├── Collection/
    │   ├── Catalog/
    │   └── Valuation/
    ├── Infrastructure/
    │   ├── Persistence/
    │   │   ├── ArchiveDexDbContext.cs
    │   │   ├── Configurations/
    │   │   └── Migrations/
    │   ├── Images/
    │   ├── Providers/
    │   ├── Security/
    │   └── Observability/
    ├── OpenApi/
    └── ClientApp/
        ├── src/app/
        │   ├── core/
        │   ├── layout/
        │   ├── shared/
        │   └── features/
        │       ├── auth/
        │       ├── capture/
        │       ├── sets/
        │       └── cards/
        ├── e2e/
        └── package.json
tests/
├── ArchiveDex.Server.UnitTests/
├── ArchiveDex.Server.IntegrationTests/
├── ArchiveDex.Server.ContractTests/
└── ArchiveDex.E2E/
```

**Structure Decision**: Use one ASP.NET Core project with feature folders rather than recreating a multi-project Clean Architecture solution. Domain rules remain internal and independently tested. The Angular workspace lives under the server project so normal publish and the Docker build produce one deployable artifact. Test projects are separated by execution boundary because unit, API contract, real-PostgreSQL integration, and browser suites have different dependencies and runtimes.

## Delivery and Runtime Design

- Docker Compose has persistent `web` and `db` services only. Build and migration/test commands may run transient containers but create no additional runtime service.
- A Node 24 LTS build stage runs the locked Angular production build. A .NET 10 SDK stage restores locked packages, tests, and publishes. The final ASP.NET Core 10 image contains only server output and hashed Angular assets.
- ASP.NET maps `/api/v1`, `/health`, and authenticated image endpoints before the Angular fallback. `MapStaticAssets()` serves hashed files and `MapFallbackToFile("index.html")` restores deep links.
- PostgreSQL is private to the Compose network. Named volumes retain database data and ASP.NET Data Protection keys. Secrets are mounted at runtime and never committed or baked into images.
- Database migrations are committed and applied through a reviewed migration bundle using `docker compose run --rm web migrate`; the normal web startup does not mutate the schema.
- Initial owner provisioning is part of the migration/setup command and reads username/password from Docker secrets. The public API provides sign-in, sign-out, session, and antiforgery operations but no registration.

## Provider and Analysis Design

- `IVisualCardAnalyzer` sends a stripped, normalized derivative to one configured generally available multimodal model with strict structured output and provider-side storage disabled where supported.
- AI extracts only visible evidence: printed name/number, language, set clues, finish clues, image quality, and one of the five condition proposals. It does not invent canonical IDs, official German names, or prices.
- `ICardCatalog` resolves observations against a pinned local TCGdex multilingual snapshot and supplies canonical identity plus official German naming. Ambiguous candidates require user selection; missing German data is represented explicitly.
- `IMarketValuationProvider` produces an EUR estimate using condition/language/printing-aware market data when licensing and mappings permit, with a transparent aggregate fallback. No quote is preferable to fabricated precision.
- Capture analysis is asynchronous and persisted before external calls. UI polling observes `Uploaded → Analyzing → NeedsReview | NeedsNewImage | Failed`; retry is bounded and idempotent.
- Manual revaluation uses confirmed identity and condition without another vision call. A failed refresh leaves the last successful valuation unchanged.

## Persistence and Performance Design

- Store normalized full image and thumbnail in a separate PostgreSQL `image_asset` table using `bytea`; metadata queries never select binary columns. This provides atomic finalization/deletion and one consistent backup for v1.
- Exact duplicate warning uses owner-scoped upload and normalized SHA-256 indexes; hash indexes are non-unique because explicit duplicate override is allowed. Finalization uses a transaction-scoped advisory lock and rechecks duplicate status.
- Group identity is owner + set-language edition + normalized collector number + printing/finish variant. Names are editable display data, not identity. Condition is specimen-specific.
- List endpoints use projections, indexes, page size ≤50, and keyset pagination. Expected list complexity is O(log n + page-size).
- Normalized image upload limit is 15 MiB encoded and 30 megapixels; EXIF is stripped and browser-safe derivatives are produced before persistence or provider transmission.
- Initial resource budget: web ≤384 MiB steady state and ≤768 MiB during one analysis; PostgreSQL ≤1 GiB during acceptance benchmarks on a 2 vCPU / 2 GiB deployment target.

## Complexity Tracking

No constitution violations or justified exceptions are required.
