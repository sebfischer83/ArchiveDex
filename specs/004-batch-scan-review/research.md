# Research: Batch Scan & Review

**Created**: 2026-06-20

## Decision 1: Batch Entities vs. Reusing Existing ScanJob

**Decision**: Create independent `BatchScanJob` and `BatchScanItem` entities rather than extending `ScanJob`.

**Rationale**: The single-scan flow (`ScanJob` → `OcrResult` → confirm/reject → `CollectionEntry`) is a tightly coupled, synchronous-UI-driven workflow. Batch scanning requires different lifecycle states (Uploading → Processing → ReadyForReview → PartiallyAccepted → Complete), supports partial acceptance, and has different concurrency rules (single active batch). Extending `ScanJob` would introduce complex conditional logic and violate single responsibility.

**Alternatives considered**:
- Extend `ScanJob` with a `BatchId` foreign key: rejected because it would tangle two distinct workflows and make state transitions ambiguous.
- Use `ScanJob` directly with a batch grouping: rejected because batch items have different match statuses (`NoMatch`, `Overridden`) and a `reviewed` flag that don't exist in single scan.

## Decision 2: OCR Processing Strategy for Batches

**Decision**: Use an in-process `Channel<BatchScanJob>` background service (`BatchOcrProcessor : BackgroundService`) with sequential per-item processing.

**Rationale**: ArchiveDex is a single-user, self-hosted application. A dedicated background service using .NET Channels provides simplicity (no external queue dependency), bounded concurrency (sequential processing prevents Tesseract memory contention), and fits the existing architecture (no need for Hangfire, Quartz.NET, or Redis). Sequential processing per item within the batch still meets the 3-minute budget for 10 cards (~18 seconds per card on average hardware).

**Alternatives considered**:
- Parallel OCR via `Parallel.ForEachAsync`: rejected because Tesseract uses significant memory per instance; parallel execution on small servers could OOM.
- External queue (RabbitMQ, Azure Service Bus): rejected as over-engineering for a single-user app.
- Fire-and-forget Task.Run: rejected because it doesn't survive app restarts; `BackgroundService` with persisted state does.

## Decision 3: Batch Image Upload Approach

**Decision**: Single multipart form request accepting all images at once, with client-side progress indication via a Blazor streaming upload component.

**Rationale**: A single request is simpler for both client and server. SC-001 targets ≤30s for 10 images (≤3s per image), which is achievable with a single multipart upload. The existing image validation (format, size) runs per-item within the request. Failed items are marked individually; successful items proceed.

**Alternatives considered**:
- Sequential single-image uploads with client-side retry: more resilient but slower and more complex client logic.
- Chunked upload: unnecessary for 50 × 10MB = 500MB max (and typical use is far less).

## Decision 4: Batch Acceptance and Duplicate Detection

**Decision**: Batch acceptance issues a single transactional request. Per-item collection creation runs sequentially within the transaction. Duplicate detection (same CardPrint + same Condition) runs per item against the existing collection. Within-batch duplicates (two items matching the same CardPrint) are detected and flagged during review (before acceptance), not at acceptance time.

**Rationale**: Single transaction ensures atomicity — if acceptance fails partway, no partial collection entries are created. Pre-acceptance duplicate detection (within batch) allows the user to clean up the batch before committing. The existing `POST /api/collection` duplicate detection logic (spec 002) is reused per item.

**Alternatives considered**:
- Non-transactional batch accept with retry: rejected because it could leave the collection in an inconsistent state.
- Detect within-batch duplicates only at acceptance time: rejected because it's better UX to warn during review.

## Decision 5: Database Schema Strategy

**Decision**: New `BatchScanJobs` and `BatchScanItems` tables with independent relationships. Batch items reference their own images (reuse `ImageAssets` table). A batch's own `OcrResult` per item mirrors the single-scan structure but belongs to the batch item.

**Rationale**: Clean separation from single-scan tables prevents schema pollution. The batch tables need different indexes (e.g., `WHERE Status != 'Complete'` for active-batch check). The `ImageAssets` table is reused since images are identical in structure.

**Alternatives considered**:
- Single `Scans` table with a discriminator column: rejected because it would require nullable columns for batch-specific fields and complicate queries.
- JSON column for batch item results: rejected because EF Core querying of JSON is less efficient for filtering by match status.

## Decision 6: Batch Review UI on Mobile

**Decision**: Reuse the existing Blazor InteractiveServer pattern. The batch review page uses a scrollable thumbnail grid with a status filter bar. Individual item detail opens as an inline panel or full-page navigation depending on screen size (CSS media queries + Blazor responsive layout).

**Rationale**: The existing UI is already mobile-friendly. The batch review page adapts the existing scanner result UI pattern to a list/grid layout. Filtering reduces cognitive load on mobile by hiding items that don't need attention.

**Alternatives considered**:
- Separate mobile app (React Native, MAUI): rejected — the existing web UI already works on mobile, and the spec requires both desktop and mobile from the same codebase.
- Server-side pagination: rejected — batch size is capped at 50; client-side filtering with lazy-loaded images is sufficient.
