# Implementation Plan: ArchiveDex — Pokémon Card Collection Manager

**Branch**: `001-pokemon-card-manager` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-pokemon-card-manager/spec.md`

## Summary

ArchiveDex is a single-user, self-hosted web application for managing a personal Pokémon card
collection across multiple card languages. The core value loop: gated first-run setup wizard →
import catalog metadata from TCGdex (scoped by set + card language) → mobile scanner page
captures a card photo → server stores image, runs Tesseract OCR (optional OpenCV
preprocessing) → ranked catalog match suggestions → user confirms/corrects → collection entry
created with condition, quantity, price, location, notes, and front image.

Technical approach: ASP.NET Core (.NET 9) backend with Blazor Web App (interactive server)
responsive UI, Clean Architecture (Domain / Application / Infrastructure / Web / Api), EF Core
with a provider switch for PostgreSQL (external) or SQLite (embedded). Localization (de/en/ru)
via resource files, strictly separated from per-card language data. Dockerized for self-hosting.

## Technical Context

**Language/Version**: C# 13 / .NET 9 (ASP.NET Core)

**Primary Dependencies**: ASP.NET Core, Blazor Web App (InteractiveServer), EF Core 9
(Npgsql + SQLite providers), Tesseract OCR (`Tesseract` .NET wrapper / native libtesseract),
OpenCvSharp4 (optional preprocessing), `Microsoft.Extensions.Localization`, ASP.NET Core
Identity (single admin) with cookie auth, HttpClient-based TCGdex REST client.

**Storage**: Relational DB via EF Core — PostgreSQL (external mode) or SQLite (embedded mode),
selected in setup wizard. Uploaded images on local filesystem at configured path. Tesseract
trained-data files (`*.traineddata`) on filesystem (eng, deu, jpn, kor, chi_sim, chi_tra).

**Testing**: xUnit (unit + application), Testcontainers for PostgreSQL integration tests,
bUnit for Blazor component tests, WebApplicationFactory for API/integration tests.

**Target Platform**: Linux container (Docker) self-hosted; responsive web UI in modern desktop
+ mobile browsers; scanner page uses HTML capture (`<input type=file accept=image/* capture>`).

**Project Type**: Web application (Blazor server UI + ASP.NET Core API), Clean Architecture
layering.

**Performance Goals**: Catalog search results < 2 s for a typical scoped catalog (SC-003);
full scan→collection flow < 60 s on a phone (SC-005); correct card in top suggestions ≥ 80%
of clear scans (SC-004). OCR per image target < 8 s server-side (budget; see research).

**Constraints**: Single-user, single-tenant, no public multi-user hosting. Setup gate blocks
all non-setup routes until complete. UI culture independent of card language. Images
JPEG/PNG/WebP ≤ 10 MB. Self-hosted, offline-capable for browse/scan against imported catalog.

**Scale/Scope**: One user. Catalog scoped by selected sets/languages (hundreds to low tens of
thousands of card rows). Collection: hundreds to thousands of entries. 9 functional modules.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution v1.0.0 — four principles. Initial evaluation:

| Principle | Gate | Status |
|-----------|------|--------|
| I. Code Quality & Maintainability | Single authoritative formatter/linter (`dotnet format` + analyzers, `.editorconfig`); Clean Architecture enforces single-responsibility boundaries; public APIs documented via XML doc comments. | PASS |
| II. Test-First & Coverage (NON-NEGOTIABLE) | TDD mandated: contract tests for API endpoints, integration tests for setup-gate/import/scan flows, unit tests for domain rules — all written before implementation. Each bug → failing regression test first. | PASS — enforced in tasks ordering |
| III. UX Consistency | Single UI convention; all surfaces localized (de/en/ru) with default-culture fallback; consistent error model (problem-details on API, localized messages on UI); human + machine output (Blazor UI + JSON API). | PASS |
| IV. Performance & Efficiency | Budgets recorded above (search < 2 s, scan flow < 60 s, OCR < 8 s); benchmarks for catalog search + OCR pipeline on critical paths; indexed lookups on card number/name/set/language; no unbounded O(n²) over catalog. | PASS |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-pokemon-card-manager/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (REST contracts)
│   ├── README.md
│   ├── setup.openapi.yaml
│   ├── catalog-import.openapi.yaml
│   ├── scan-ocr.openapi.yaml
│   └── collection.openapi.yaml
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Domain/            # Entities, value objects, enums (CardCondition), domain rules. No deps.
│   ├── Entities/
│   ├── ValueObjects/
│   └── Enums/
├── ArchiveDex.Application/       # Use cases, ports (interfaces), DTOs, validation. Depends on Domain.
│   ├── Abstractions/            # ITcgDataSource, IOcrEngine, IImageStore, ICatalogRepository, ...
│   ├── Setup/                   # Initial Setup module
│   ├── Settings/               # User Settings module
│   ├── Catalog/                # Card Catalog module
│   ├── Collection/             # Collection Management module
│   ├── Scanning/               # Scanner + OCR Processing orchestration
│   ├── Importing/              # Importer module
│   └── Common/
├── ArchiveDex.Infrastructure/   # EF Core (Postgres/SQLite), Tesseract OCR, OpenCV, TCGdex client,
│   │                            # filesystem image store, localization providers. Depends on Application.
│   ├── Persistence/            # DbContext, configurations, migrations, repositories
│   ├── Ocr/                    # Tesseract adapter + OpenCV preprocessing
│   ├── Storage/                # Filesystem image store
│   ├── Tcg/                    # TCGdex REST client
│   └── Setup/                  # Config persistence, setup-state, admin provisioning
├── ArchiveDex.Api/              # ASP.NET Core minimal API endpoints (scan upload, import, JSON).
│   └── Endpoints/
└── ArchiveDex.Web/              # Blazor Web App host: pages, components, scanner page, localization.
    ├── Components/
    │   ├── Pages/
    │   ├── Layout/
    │   └── Scanner/
    ├── Resources/              # .resx for de/en/ru UI cultures
    └── Program.cs              # Composition root; setup-gate middleware

tests/
├── ArchiveDex.Domain.Tests/         # Unit: domain rules, enums, value objects
├── ArchiveDex.Application.Tests/     # Unit: use cases with faked ports
├── ArchiveDex.Infrastructure.Tests/ # Integration: EF Core (Testcontainers Postgres + SQLite), OCR adapter
├── ArchiveDex.Api.Tests/            # Contract/integration: endpoints via WebApplicationFactory
└── ArchiveDex.Web.Tests/            # bUnit component tests, setup-gate routing, localization fallback

deploy/
├── Dockerfile
├── docker-compose.yml          # app + postgres + volume for images & traineddata
└── .dockerignore
```

**Structure Decision**: Web application with Clean Architecture. Five source projects map
directly to the constitution's dependency rule (Domain ← Application ← Infrastructure; Api and
Web are composition/delivery layers). Suggested spec modules (Initial Setup, User Settings,
Card Catalog, Collection, Scanner, OCR Processing, Importer, Localization, Storage) are
realized as Application feature folders + Infrastructure adapters rather than separate
assemblies, keeping the build simple while preserving boundaries.

## Complexity Tracking

No constitution violations. Section intentionally empty.
