# Implementation Plan: Batch Scan & Review

**Branch**: `004-batch-scan-review` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-batch-scan-review/spec.md`

## Summary

Add batch scanning capability to ArchiveDex: users upload multiple card images at once (2–50), OCR processes them asynchronously, and the results are reviewable later on desktop or mobile. Users can override OCR matches, mark items as "no match," filter by status, and selectively accept corrected results into their collection. Only one active batch is allowed at a time. The feature extends the existing single-scan flow with new batch-specific endpoints, entities, and Blazor UI pages.

## Technical Context

**Language/Version**: C# 13 / .NET 9

**Primary Dependencies**: ASP.NET Core 9, Blazor (InteractiveServer), Wolverine HTTP, EF Core 9 (PostgreSQL/SQLite), Tesseract OCR, OpenCvSharp4

**Storage**: PostgreSQL (external mode) or SQLite (embedded mode) via EF Core; file system for images

**Testing**: xUnit, bUnit (Blazor components), Testcontainers (PostgreSQL integration), WebApplicationFactory (API contract)

**Target Platform**: Linux server (Docker) + web browser (desktop and mobile)

**Project Type**: Web application (single-user, self-hosted)

**Performance Goals**: Batch upload 10 images ≤30s (upload only); OCR 10 cards ≤3min (measured on 2 vCPU / 4 GB RAM / SSD storage); review 10 cards ≤5min

**Constraints**: Single active batch per user; max 50 images per batch; max 10 MB per image; JPEG/PNG/WebP only

**Scale/Scope**: Single admin user; up to 50 cards per batch; operates within existing application footprint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality & Maintainability

| Check | Status |
|-------|--------|
| Follow existing Clean Architecture layers (Domain → Application → Infrastructure → Api/Web) | ✅ WILL comply |
| New entities in Domain layer; handlers in Application; EF config in Infrastructure; endpoints in Api; pages in Web | ✅ WILL comply |
| Doc comments on public types and methods | ✅ WILL comply |
| No dead code or commented-out blocks shipped | ✅ WILL comply |

### II. Test-First & Coverage Discipline (NON-NEGOTIABLE)

| Check | Status |
|-------|--------|
| Contract tests for new API endpoints (batch upload, batch retrieve, item update, batch accept) | ✅ WILL comply |
| Integration tests for batch OCR pipeline and acceptance flow | ✅ WILL comply |
| Unit tests for batch entity logic and validation | ✅ WILL comply |
| Blazor component tests (bUnit) for new UI pages | ✅ WILL comply |
| Coverage must not regress below baseline | ✅ WILL comply |

### III. User Experience Consistency

| Check | Status |
|-------|--------|
| API follows existing Wolverine HTTP endpoint conventions (JSON, cookie auth) | ✅ WILL comply |
| UI follows existing Blazor component patterns, ad- CSS prefix, EditForm conventions | ✅ WILL comply |
| Error responses follow existing format: actionable, human-readable, machine-parseable | ✅ WILL comply |
| Localization via existing .resx infrastructure (de/en/ru) | ✅ WILL comply |
| No breaking changes to existing endpoints or UI routes | ✅ WILL comply |

### IV. Performance & Resource Efficiency

| Check | Status |
|-------|--------|
| Performance budgets defined in Success Criteria (SC-001 through SC-007) | ✅ Defined |
| Batch OCR processing is async/non-blocking; single active batch prevents resource contention | ✅ WILL comply |
| No O(n²)-or-worse on unbounded input (batch size capped at 50) | ✅ WILL comply |
| Optimization follows profiling; no premature micro-optimization | ✅ WILL comply |

**Gate Result**: All checks PASS. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/004-batch-scan-review/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
├── checklists/          # Already created
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/ArchiveDex.Domain/
├── Entities/
│   ├── BatchScanJob.cs       # New
│   ├── BatchScanItem.cs      # New
│   └── BatchScanResult.cs    # New (or extends OcrResult)
├── Enums/
│   ├── BatchStatus.cs        # New
│   └── BatchItemMatchStatus.cs   # New

src/ArchiveDex.Application/
├── BatchScan/
│   ├── Commands/             # CreateBatch, UpdateItem, AcceptBatch, DiscardBatch
│   ├── Queries/              # GetBatch, GetBatchItem
│   └── Services/             # BatchOcrProcessor (background)
├── Contracts/
│   ├── BatchScanJobDto.cs
│   └── BatchScanItemDto.cs

src/ArchiveDex.Infrastructure/
├── Persistence/
│   ├── Configurations/       # EF entity type configs
│   └── Migrations/
├── Ocr/
│   └── BatchOcrService.cs    # Orchestrates per-item OCR

src/ArchiveDex.Api/
└── Endpoints/
    └── BatchScanEndpoints.cs # Wolverine HTTP handlers

src/ArchiveDex.Web/
├── Pages/
│   ├── Scanner/
│   │   ├── ScannerHome.razor       # Extended with batch upload UI
│   │   ├── BatchReview.razor       # New: batch review page
│   │   └── BatchAccept.razor       # New: batch accept page
├── Components/
│   └── Shared/
│       ├── BatchItemCard.razor     # New: single batch item thumbnail
│       ├── BatchItemDetail.razor   # New: batch item detail/edit view
│       └── BatchStatusFilter.razor # New: status filter bar
```

## Complexity Tracking

> No violations. No complexity justifications needed.
