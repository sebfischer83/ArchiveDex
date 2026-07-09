# Phase 1 Data Model: Full Catalog Import

Derived from `spec.md`, existing catalog entities, and import decisions. The model extends the existing canonical catalog with import-run, staging, checkpoint, error, and image-selection records.

## Enums & Value Objects

### CatalogImportStatus

| Value | Meaning |
|-------|---------|
| Pending | Import run was created but not started |
| Running | Import worker is actively processing |
| Cancelling | Cancellation requested; worker should stop at the next safe checkpoint |
| Cancelled | Import stopped before completion |
| Completed | Import finished all selected work |
| Failed | Import cannot continue due to a run-level failure |

### CatalogImportPhase

| Value | Meaning |
|-------|---------|
| FetchSets | Loading source set lists |
| FetchCards | Loading card summaries/details |
| Normalize | Converting source DTOs to canonical import data |
| Reconcile | Matching source data to canonical catalog records |
| Images | Downloading/scoring/selecting image candidates |
| Validate | Producing data quality results |
| Report | Aggregating final report data |

### ImageEntityType

| Value | Meaning |
|-------|---------|
| CardSet | Image belongs to a set |
| CardPrint | Image belongs to a card print |

## Entities

### CatalogImportRun

A single full or scoped catalog import execution.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| Status | CatalogImportStatus | Current run status |
| SelectedSourcesJson | string | Source names selected by admin |
| SelectedLanguagesJson | string | Source/language selections |
| IsDryRun | bool | If true, canonical catalog tables are not changed |
| DownloadImages | bool | Whether image candidates are downloaded/scored |
| StartedAt | DateTime? | Set when processing begins |
| FinishedAt | DateTime? | Set when terminal |
| ImportedCount | int | New canonical records |
| UpdatedCount | int | Existing canonical records updated |
| MergedCount | int | Source records merged into existing canonical records |
| SkippedCount | int | Records intentionally skipped |
| ErrorCount | int | Error records |
| WarningCount | int | Warning records |

Rules: only one run should be `Running` or `Cancelling` at a time. A dry run may create staging/checkpoint/error/report data but must not change canonical catalog tables.

### CatalogImportCheckpoint

Progress marker for resumability.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ImportRunId | Guid | FK to CatalogImportRun |
| Source | string | `TCGdex`, `Limitless`, `Serebii` |
| Language | string | Canonical language code |
| SetExternalId | string? | Current source set |
| Phase | CatalogImportPhase | Current phase |
| IsCompleted | bool | Completed marker for resume |
| ProcessedCount | int | Records processed in this scope |
| UpdatedAt | DateTime | Last checkpoint write |

Uniqueness: one checkpoint per import run, source, language, set, and phase.

### SourceSetSnapshot

Source-specific set data captured before canonical merge.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ImportRunId | Guid | FK |
| Source | string | Source name |
| Language | string | Canonical language code |
| ExternalSetId | string | Source set identifier |
| NormalizedName | string | Normalized matching value |
| RawName | string | Source-provided display name |
| Series | string? | Source series |
| ReleaseDate | DateOnly? | Parsed date |
| PrintedTotal | int? | Printed card count |
| OfficialTotal | int? | Official card count |
| PayloadJson | string | Raw or source DTO payload |
| PayloadHash | string | Change detection hash |
| FetchedAt | DateTime | Snapshot time |

### SourceCardSnapshot

Source-specific card data captured before canonical merge.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ImportRunId | Guid | FK |
| Source | string | Source name |
| Language | string | Canonical language code |
| ExternalSetId | string | Source set identifier |
| ExternalCardId | string | Source card identifier |
| Number | string | Card number in set |
| NormalizedNumber | string | Normalized matching value |
| Name | string | Source card name |
| NormalizedName | string | Normalized matching value |
| Rarity | string? | Optional rarity |
| PayloadJson | string | Raw or source DTO payload |
| PayloadHash | string | Change detection hash |
| FetchedAt | DateTime | Snapshot time |

### SourceImportError

Structured error or warning for fetch, parse, normalize, reconcile, image, or report phases.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ImportRunId | Guid | FK |
| Severity | string | `Error` or `Warning` |
| Source | string? | Source name if known |
| Language | string? | Language if known |
| SetExternalId | string? | Set scope if known |
| CardExternalId | string? | Card scope if known |
| Phase | CatalogImportPhase? | Phase if known |
| Code | string | Stable machine-readable error code |
| Message | string | Human-readable detail |
| OccurredAt | DateTime | Error time |

### ImageCandidateMetadata

Metadata and score for an image candidate. The candidate file is temporary unless selected.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ImportRunId | Guid | FK |
| EntityType | ImageEntityType | CardSet or CardPrint |
| EntityId | Guid? | Canonical entity ID after reconciliation, if available |
| Source | string | Source name |
| SourceUrl | string | Original image URL |
| Width | int? | Decoded width |
| Height | int? | Decoded height |
| Format | string? | JPEG, PNG, WebP, etc. |
| FileSizeBytes | long? | Candidate file size |
| Sha256 | string? | Content hash |
| QualityScore | decimal? | Higher is better |
| IsSelected | bool | True for the permanent image candidate |
| Error | string? | Download/decode/scoring failure |
| AnalyzedAt | DateTime | Analysis time |

Rule: non-selected candidate files are deleted after analysis; metadata remains.

### CatalogImageAsset

Permanent selected catalog image for a card or set. This is distinct from the existing scan/upload `ImageAsset` entity.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| EntityType | ImageEntityType | CardSet or CardPrint |
| EntityId | Guid | Canonical entity ID |
| Source | string | Source of selected candidate |
| SourceUrl | string | Original image URL |
| LocalPath | string | Permanent relative file path |
| Width | int | Decoded width |
| Height | int | Decoded height |
| Format | string | Stored format |
| FileSizeBytes | long | Stored size |
| Sha256 | string | Content hash |
| QualityScore | decimal | Score at selection time |
| IsManuallySelected | bool | If true, imports must not auto-overwrite |
| CreatedAt | DateTime | First storage time |
| UpdatedAt | DateTime | Last metadata update |

Uniqueness: one active non-manual selected image per entity unless a manually selected image exists.

## Existing Canonical Entities Used

- **CardSet**: language-neutral canonical set.
- **CardSetExternalId**: source-specific set identity. Add missing-source tracking fields for this feature: `IsMissingFromSource`, `LastSeenAt`, and `MissingDetectedAt`.
- **CardPrint**: concrete card print in a card language.
- **CardExternalId**: source-specific card identity. Add missing-source tracking fields for this feature: `IsMissingFromSource`, `LastSeenAt`, and `MissingDetectedAt`.
- **CardTranslation**: additive translated card fields.
- **SetMapping/PendingSetMapping**: resolved or unresolved cross-source set mapping.
- **CollectionEntry**: preserved; never overwritten by import.
- **LocalCorrection**: preserved; locally corrected values win over imported values.

## Validation Rules

- Repeated imports must not create duplicate `CardSet`, `CardPrint`, external ID, or translation rows.
- `Language` values must be canonical source-normalized codes.
- Ambiguous set matches create pending mappings instead of automatic merges.
- Source references not returned by a later import are marked missing but canonical catalog records are retained.
- Dry-run imports must not update canonical catalog records.
- Non-selected image candidate files must be deleted after scoring.
- Manually selected images must not be overwritten automatically.
- Price data is not imported by this feature.
