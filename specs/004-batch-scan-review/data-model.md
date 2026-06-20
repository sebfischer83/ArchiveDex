# Data Model: Batch Scan & Review

**Created**: 2026-06-20

## Entity Relationship Diagram

```text
BatchScanJob 1 ── * BatchScanItem * ── 1 ImageAsset
               │                    │
               │                    * ── 0..1 BatchScanResult (OCR output)
               │                    * ── 0..1 CollectionEntry (if accepted)
               │
               * ── 1 ImageAsset (batch thumbnail, optional)
```

## Entities

### BatchScanJob

Groups multiple scan items into a single batch. At most one non-complete batch exists at any time.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| Id | Guid | PK, generated | Unique batch identifier |
| Status | BatchStatus enum | Required | Uploading → Processing → ReadyForReview → PartiallyAccepted → Complete |
| CreatedAt | DateTimeOffset | Required | Batch creation timestamp |
| CompletedAt | DateTimeOffset? | Nullable | When all items were resolved (accepted/rejected/no-match) |
| ItemCount | int | Computed | Number of items in batch (derived from child items) |

**State transitions**:
- `Uploading` → `Processing` (all items uploaded)
- `Processing` → `ReadyForReview` (all items OCR completed or failed)
- `ReadyForReview` → `PartiallyAccepted` (at least one item accepted)
- `PartiallyAccepted` → `Complete` (all items resolved)
- `ReadyForReview` → `Complete` (all items accepted in one operation)

### BatchScanItem

A single card scan within a batch.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| Id | Guid | PK, generated | Unique item identifier |
| BatchScanJobId | Guid | FK → BatchScanJob, Required | Parent batch |
| ImageAssetId | Guid | FK → ImageAsset, Required | The uploaded card image |
| OcrResultId | Guid? | FK → BatchScanResult, Nullable | OCR output (null before/during processing) |
| MatchedCardPrintId | Guid? | FK → CardPrint, Nullable | Matched catalog card (from OCR or user override) |
| MatchStatus | BatchItemMatchStatus enum | Required | PendingReview / Matched / Overridden / NoMatch / Accepted / Rejected |
| IsReviewed | bool | Required, default false | Auto-set when detail view opened with high-confidence match |
| CollectionEntryId | Guid? | FK → CollectionEntry, Nullable | Resulting collection entry (if accepted) |
| SortOrder | int | Required | Display order within the batch (upload sequence) |
| FailureReason | string? | Nullable, max 500 | Error description if OCR or validation failed |

**MatchStatus transitions**:
- `PendingReview` → `Matched` (auto on OCR success) or `Overridden` (user changed match) or `NoMatch` (user marked)
- `Matched` / `Overridden` / `NoMatch` → `Accepted` (added to collection)
- `Matched` / `Overridden` / `NoMatch` → `Rejected` (user rejected from batch)

### BatchScanResult

OCR output for a batch scan item. Mirrors the existing `OcrResult` structure but belongs to a batch item rather than a single ScanJob.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| Id | Guid | PK, generated | Unique result identifier |
| BatchScanItemId | Guid | FK → BatchScanItem, unique | One result per item |
| DetectedNumber | string? | Nullable | Card number extracted by OCR |
| DetectedName | string? | Nullable | Card name extracted by OCR |
| DetectedCardLanguage | string? | Nullable | Language hint detected in image |
| DetectedSetHint | string? | Nullable | Set symbol or code hint |
| Confidence | double? | 0.0–1.0, Nullable | Tesseract mean character confidence |
| RawText | string? | Nullable | Full OCR raw output |
| CandidateMatches | string | Required | JSON array of ranked catalog card matches: `[{cardPrintId, number, name, score}]` |
| ProcessedAt | DateTimeOffset | Required | When OCR completed |

### Existing Entities (referenced, not modified)

- **ImageAsset**: Referenced by `BatchScanItem.ImageAssetId` — stores the uploaded card image.
- **CardPrint**: Referenced by `BatchScanItem.MatchedCardPrintId` — the catalog card matched by OCR or user override.
- **CollectionEntry**: Referenced by `BatchScanItem.CollectionEntryId` — created when the item is accepted.

## Enums

### BatchStatus

| Value | Description |
|-------|-------------|
| Uploading | Images are being uploaded |
| Processing | OCR running on items |
| ReadyForReview | All OCR complete; user can review |
| PartiallyAccepted | Some items accepted; others still pending |
| Complete | All items resolved (accepted, rejected, or no-match) |

### BatchItemMatchStatus

| Value | Description |
|-------|-------------|
| PendingReview | Awaiting user review |
| Matched | OCR match accepted by system (review pending) |
| Overridden | User manually selected a different card |
| NoMatch | User marked as no viable match |
| Accepted | Added to collection |
| Rejected | User rejected this item |

## Validation Rules

- Maximum 50 items per batch (enforced at API level)
- Only one batch with `Status != Complete` allowed at any time (enforced at API level, checked before creating new batch)
- Each item must have a valid `ImageAssetId` referencing a stored image
- `MatchedCardPrintId` required when `MatchStatus` is `Accepted`
- `CollectionEntryId` set only when `MatchStatus` is `Accepted`
- `Confidence` between 0.0 and 1.0 when present
- `FailureReason` populated only when OCR processing failed for the item
- Batch auto-cleanup after 30 days only if `Status` is `ReadyForReview` and no items have been accepted

## Indexes

- `BatchScanJob.Status` — for finding active (non-complete) batches
- `BatchScanItem.BatchScanJobId` — for retrieving all items of a batch
- `BatchScanItem.MatchStatus` — for filtering within a batch
- `BatchScanResult.BatchScanItemId` — unique, for OCR result lookup
