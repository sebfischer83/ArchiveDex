# Implementation Plan: Catalog Export and Import

**Branch**: `006-catalog-export-import` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-catalog-export-import/spec.md`

## Summary

Add an administrator-only catalog transfer workflow that exports one consistent catalog snapshot with its reusable images and restores it into an empty ArchiveDex instance. The workflow creates a versioned, self-contained package, validates it before target mutations, uses a durable exclusive catalog-operation lease, and stages image restoration so completed imports are all-or-nothing and interrupted work is cleaned up on startup.

## Technical Context

**Language/Version**: C# 13 / .NET 10

**Primary Dependencies**: ASP.NET Core 10 controllers and Identity, Blazor Interactive Server, EF Core 10 with Npgsql/PostgreSQL, Hangfire, `System.IO.Compression`, `System.Security.Cryptography`, existing localization resources

**Storage**: PostgreSQL for catalog and transfer-operation metadata; configured local filesystem for images, package staging, and completed exports

**Testing**: xUnit, WebApplicationFactory API tests, EF Core integration tests with PostgreSQL, bUnit, fixture archives and temporary filesystem roots

**Target Platform**: Self-hosted Linux server with a desktop/mobile web browser

**Project Type**: Single-administrator web application

**Performance Goals**: Export and import up to 100,000 card prints and 25 GB of catalog images within 60 minutes on four cores, 8 GB available memory, and storage with 200 MB/s sequential reads and writes; transfer process working set remains at or below 1 GiB; visible progress is persisted and exposed at least every 5 seconds or per completed phase

**Constraints**: Target must contain no catalog records or catalog image assets; transfer must work without external catalog/image sources; package paths and contents are fully validated before restore; failed, cancelled, or interrupted import leaves target catalog and image storage unchanged; only one transfer or catalog-changing operation may run at a time

**Scale/Scope**: One self-contained package per full catalog snapshot; all canonical catalog entities and referenced reusable images; excludes Identity, configuration, collections, scan data, operational import history, and non-catalog images

**Algorithmic Complexity**: Export, validation, and restore are `O(records + uniqueImages + packageEntries)` in time and `O(batchSize + streamBuffer)` in working memory. The implementation MUST use paged catalog enumeration and stream archive/image bytes; it MUST NOT materialize the full catalog or image set in memory.

**Benchmark Gate**: A committed transfer benchmark uses deterministic fixture data and fails CI when it exceeds the proportional 60-minute throughput budget, the 1 GiB working-set budget, or the 5-second progress-persistence cadence. The full 100,000-print/25-GB baseline is run outside normal pull-request CI on the documented four-core host; its result is retained with the release evidence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality & Maintainability

| Check | Status |
|-------|--------|
| Follow Domain -> Application -> Infrastructure -> Api/Web boundaries | PASS: transfer state lives in Domain; ports and DTOs in Application; archive, storage, persistence and recovery in Infrastructure; thin API/UI surfaces |
| Keep responsibilities focused and document public transfer types | PASS: package IO, validation, lease, orchestration, staging/recovery, API, and UI are separate responsibilities |
| Avoid speculative dependencies | PASS: archive and hashing use .NET standard libraries; no new package is required |

### II. Test-First & Coverage Discipline (NON-NEGOTIABLE)

| Check | Status |
|-------|--------|
| Define tests before implementation | PASS: unit, integration, contract, and bUnit coverage is specified in `quickstart.md` |
| Cover persistence and interface contracts | PASS: PostgreSQL/filesystem round trips, rollback/recovery, and HTTP contracts are required |
| Prevent coverage regression | PASS: new transfer paths are independently testable and added to the established test projects |

### III. User Experience Consistency

| Check | Status |
|-------|--------|
| Follow existing controller, polling, and `ad-` UI conventions | PASS: transfer page follows catalog import status pattern; API returns structured, actionable transfer errors |
| Preserve localization and administrator access | PASS: UI strings use existing resource infrastructure; endpoints and UI require administrator authorization |
| Avoid breaking existing contracts | PASS: new `/api/catalog-transfers` surface and `/catalog/transfer` page; existing import/image routes remain unchanged |

### IV. Performance & Resource Efficiency

| Check | Status |
|-------|--------|
| Performance budget specified | PASS: 60-minute throughput, 1 GiB working-set, and 5-second progress budgets have CI-enforced thresholds |
| Stream large artifacts and bound memory | PASS: archive entries are streamed and hashed; data is enumerated in batches; images are never fully buffered |
| Avoid unbounded quadratic processing | PASS: documented `O(records + uniqueImages + packageEntries)` processing; identity/index lookups are keyed |
| Make operations diagnosable | PASS: durable operation/report/error records and structured logs record phase, package identity, counts, and failure code |

**Gate Result Before Design**: PASS. No deviation requires justification.

**Gate Result After Design**: PASS. The archive uses standard-library streaming; the staging and journal design preserves all-or-nothing visibility without a long database transaction during validation.

## Project Structure

### Documentation (this feature)

```text
specs/006-catalog-export-import/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── catalog-transfer.openapi.yaml
```

### Source Code (repository root)

```text
src/
├── ArchiveDex.Domain/
│   ├── Entities/          # CatalogTransferOperation, CatalogTransferError
│   └── Enums/             # CatalogTransferKind, Status, Phase
├── ArchiveDex.Application/
│   ├── Abstractions/      # transfer repository, package, lease, catalog snapshot, image store ports
│   └── CatalogTransfer/   # request, status, report, and package DTOs
├── ArchiveDex.Infrastructure/
│   ├── CatalogTransfer/   # archive reader/writer, validator, orchestrator, worker, recovery
│   ├── Persistence/       # DbContext mappings, repository, migration
│   └── Storage/           # catalog transfer staging and target-local image management
├── ArchiveDex.Api/
│   └── Controllers/       # CatalogTransferController
└── ArchiveDex.Web/
    ├── Components/Pages/Catalog/Transfer.razor
    ├── Components/Layout/NavMenu.razor
    └── Resources/         # localized transfer text

tests/
├── ArchiveDex.Domain.Tests/CatalogTransfer/
├── ArchiveDex.Infrastructure.Tests/CatalogTransfer/
├── ArchiveDex.Api.Tests/CatalogTransfer/
└── ArchiveDex.Web.Tests/CatalogTransfer/
```

**Structure Decision**: Extend the existing Clean Architecture web application. The transfer is a cross-cutting feature, so its package and operation contracts are application-facing while archive/filesystem and transaction recovery details remain in Infrastructure.

## Complexity Tracking

> No constitution violations. The database/filesystem recovery journal is necessary to meet the required all-or-nothing import outcome across two durable stores; a database-only transaction cannot roll back promoted image files after a process crash.
