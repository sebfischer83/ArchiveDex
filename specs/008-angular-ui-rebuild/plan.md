# Implementation Plan: Modern Angular UI Rebuild

**Branch**: `008-angular-ui-rebuild` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-angular-ui-rebuild/spec.md`

## Summary

Replace the server-interactive Blazor UI with one Angular single-page application using Taiga UI, served by the existing `ArchiveDex.Web` ASP.NET Core host. The migration is a one-time production cutover covering every user-facing page, including sign-in, account, and setup. The Angular production output is built during normal publish and Visual Studio Docker Compose debug builds, then served by the same ASP.NET process that hosts the existing APIs and Identity cookie session.

## Technical Context

**Language/Version**: C# 13 / .NET 10; TypeScript with the current Angular LTS release compatible with the supported Node.js LTS runtime

**Primary Dependencies**: ASP.NET Core 10, ASP.NET Core Identity cookies, Angular, Taiga UI, Angular CDK, Angular Router, Angular HttpClient, existing EF Core/Npgsql/Hangfire services

**Storage**: PostgreSQL and existing filesystem image storage remain unchanged; Angular build artifacts are generated into the Web host static-assets directory and are not persisted as application data

**Testing**: xUnit/WebApplicationFactory for server and API behavior; Angular unit tests for components/services; browser end-to-end tests for primary journeys, deep links, responsive navigation, and keyboard access

**Target Platform**: Self-hosted Linux server, Visual Studio Docker Compose debugging, desktop and mobile modern browsers

**Project Type**: Existing Clean Architecture web application extended with a server-hosted Angular client workspace

**Performance Goals**: No fixed latency budget. Every primary application load or route transition that enters a loading state displays meaningful loading/progress feedback until content, empty state, or error state is available.

**Constraints**: One production cutover; no parallel legacy UI after release; pre-cutover validation uses a non-production preview route only; the same UI build is served by `ArchiveDex.Web` in production and Docker Compose debugging; no separately started frontend service; preserve existing data, business rules, Identity sessions, localization scope, and API compatibility where exposed.

**Scale/Scope**: Replace all current Blazor pages/layouts, including home, setup, catalog, collection, scan, batch scan, import, catalog transfer, administration, sign-in, account, and not-found screens. Retain backend projects and move UI-only behavior behind authenticated HTTP contracts where it is currently invoked through server-side DI.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No project constitution file exists. Constitution-specific gates are skipped; established Clean Architecture boundaries and test discipline remain mandatory project conventions.

### Architecture and Delivery Checks

| Check | Status |
|-------|--------|
| Preserve Domain → Application → Infrastructure → API/host boundaries | PASS: Angular uses HTTP contracts only; no client access to repositories or orchestrators |
| Server delivers one UI artifact in production and Compose debug | PASS: Web host owns build integration, static delivery, and SPA fallback |
| Preserve existing business behavior and data | PASS: backend services/data models remain authoritative; UI-only behavior migrates to API contracts |
| Test the cutover end to end | PASS: contract, Angular unit, and browser journey coverage are required |
| Avoid a parallel legacy UI | PASS: Blazor routes/pages/layouts are removed after screen-inventory parity passes |

**Gate Result Before Design**: PASS.

**Gate Result After Design**: PASS. The client workspace is isolated within the host project, and all server-only UI operations receive explicit API surfaces before the Blazor implementation is removed.

## Project Structure

### Documentation (this feature)

```text
specs/008-angular-ui-rebuild/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── angular-ui-api-contract.md
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Web/
│   ├── ClientApp/                         # NEW Angular workspace
│   │   └── src/app/
│   │       ├── core/                      # session, API clients, interceptors, guards
│   │       ├── layout/                    # application shell and responsive navigation
│   │       ├── shared/                    # Taiga UI wrappers and standardized states
│   │       └── features/                  # setup, catalog, collection, scan, import, transfer, account
│   ├── wwwroot/                           # generated Angular static output at build time
│   ├── Program.cs                         # static delivery, SPA fallback, API/auth hosting
│   ├── SetupGateMiddleware.cs             # Angular asset/deep-link aware setup gate
│   ├── ArchiveDex.Web.csproj              # client build target and publish integration
│   └── Dockerfile                         # Node-enabled Visual Studio Fast Mode and publish build
├── ArchiveDex.Api/
│   └── Controllers/                       # existing APIs plus session/account and missing UI contracts
├── ArchiveDex.Application/
│   └── Abstractions/                      # application-facing contracts where needed
└── ArchiveDex.Infrastructure/
    └── Setup/                             # Identity/session/account operations

tests/
├── ArchiveDex.Api.Tests/                  # auth/session and migrated UI-operation API contracts
├── ArchiveDex.Web.Tests/                  # host/static-delivery/setup-gate tests (Blazor tests retired)
└── ArchiveDex.Web/ClientApp/              # Angular unit and browser end-to-end test configuration

docker-compose.dcproj                      # Visual Studio Compose build/debug integration
docker-compose.yml                         # local container build context
docker-compose.override.yml                # debug behavior
deploy/Dockerfile                          # production Node + .NET build pipeline
deploy/docker-compose.yml                  # production server-delivered client
```

**Structure Decision**: Keep the Angular workspace under `src/ArchiveDex.Web/ClientApp` so the server owns a single source/build/deployment boundary. The client consumes `/api` contracts with same-origin Identity cookies. Before cutover, the Web project serves generated assets through a non-production preview route while Blazor remains the active root UI. At cutover, the root and legacy-route mappings move to Angular, and Blazor is removed. The Web project builds Angular before .NET build/publish, copies only generated browser assets into static output, and maps non-API deep links to the Angular entry document.

## Complexity Tracking

| Complexity | Why Needed | Simpler Alternative Rejected Because |
|------------|------------|-------------------------------------|
| Client workspace inside Web host | Required for a modern Angular UI while retaining one server-delivered deployment artifact | Continuing Blazor cannot meet the requested Angular/Taiga UI constraint |
| New session/account and admin-operation APIs | Browser client cannot invoke server-side DI/repository operations directly | Retaining hidden Blazor exceptions violates the full cutover requirement |
| Node runtime in Docker debug/build stages | Required to build the server-delivered Angular assets during Visual Studio Compose debugging | A manually started frontend service violates FR-024 |
