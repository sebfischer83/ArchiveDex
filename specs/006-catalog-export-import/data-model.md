# Phase 1 Data Model: Catalog Export and Import

This model adds durable transfer operations and package DTOs while reusing the existing canonical catalog. Identity, configuration, collection, scan, and import-history entities are not part of the transfer graph.

## Enums

### CatalogTransferKind

| Value | Meaning |
|-------|---------|
| Export | Creates a completed downloadable catalog package |
| Import | Validates then restores an uploaded package |

### CatalogTransferStatus

| Value | Meaning |
|-------|---------|
| Pending | Request persisted and waiting for worker |
| Validating | Archive is being inspected/staged without target mutation |
| Running | Exporting or restoring catalog content |
| Cancelling | Cancellation requested at the next safe boundary |
| Cancelled | Work and staging were cleaned up |
| Completed | Package published or target catalog restored |
| Failed | Operation stopped with a durable error report |
| Interrupted | Process stopped before a terminal outcome; recovery cleanup is required |

### CatalogTransferPhase

| Value | Meaning |
|-------|---------|
| AcquireLease | Check and acquire global catalog-operation lease |
| Snapshot | Read a consistent export catalog state |
| Package | Write or inspect package entries |
| Verify | Verify package inventory, hashes, counts, paths, relationships, capacity, and target emptiness |
| StageImages | Extract or prepare target-local images outside active storage |
| RestoreCatalog | Insert the validated catalog graph |
| Finalize | Publish export or promote target image root and complete the journal |
| Cleanup | Remove temporary/staged artifacts |
| Report | Persist final counts and outcome |

## Persistent Entities

### CatalogTransferOperation

One administrator-requested export or import and the durable global catalog-operation lease while non-terminal.

| Field | Type | Rules |
|-------|------|-------|
| Id | Guid | Primary key; operation identity |
| Kind | CatalogTransferKind | Export or Import |
| Status | CatalogTransferStatus | Valid state transition required |
| Phase | CatalogTransferPhase | Current observable phase |
| PackageId | Guid? | Set after export manifest or import validation is read |
| FormatVersion | string? | Package format used or validated |
| PackageFileName | string? | Safe display/download name only |
| PackagePath | string? | Server-managed completed export or staged upload location; never returned as a target image path |
| StagingRoot | string? | Server-managed cleanup/recovery location |
| StartedAt | DateTime? | UTC start time |
| FinishedAt | DateTime? | UTC terminal time |
| CancellationRequestedAt | DateTime? | Set by cancel request |
| TotalRecords | long | Declared or snapshot total |
| ProcessedRecords | long | Progress counter |
| TotalImages | long | Declared or snapshot total |
| ProcessedImages | long | Progress counter |
| TotalImageBytes | long | Declared or snapshot total |
| ProcessedImageBytes | long | Progress counter |
| ValidationSucceeded | bool? | Null until validation completes |
| PackageHash | string? | Hash of the completed export where applicable |
| ErrorCount | int | Number of durable errors |
| WarningCount | int | Number of durable warnings |
| CreatedAt | DateTime | UTC creation time |
| UpdatedAt | DateTime | UTC progress update time |

Rules:

- A partial unique index/constraint permits only one non-terminal operation or catalog-changing lease at a time.
- Only `Pending`, `Validating`, `Running`, and `Cancelling` hold the lease.
- `Completed`, `Cancelled`, `Failed`, and `Interrupted` are terminal.
- Import can transition from `Validating` to `Running` only when validation succeeded and target emptiness still holds.

### CatalogTransferError

Structured warning or error linked to an operation.

| Field | Type | Rules |
|-------|------|-------|
| Id | Guid | Primary key |
| OperationId | Guid | Required FK to CatalogTransferOperation |
| Severity | string | `Warning` or `Error` |
| Code | string | Stable machine-readable code |
| Check | string? | Validation or processing check that failed |
| ItemPath | string? | Safe package-relative entry or logical catalog identity |
| Message | string | Human-readable localized-safe detail |
| Impact | string | Explains why operation cannot continue or what remains usable |
| RecommendedAction | string | Concrete administrator next step |
| OccurredAt | DateTime | UTC timestamp |

### CatalogTransferJournal

Recovery record that coordinates a database transaction and staged filesystem promotion.

| Field | Type | Rules |
|-------|------|-------|
| OperationId | Guid | Primary key/FK to import operation |
| StagingRoot | string | Server-managed relative staging location |
| PromotedImageRoot | string? | Target-local image root after promotion begins |
| State | string | `Staged`, `Promoted`, `Committed`, or `Cleaned` |
| UpdatedAt | DateTime | UTC timestamp |

Rules: startup recovery removes roots for journals not marked `Committed`, then marks the operation `Interrupted` or retains its terminal report. A committed journal may be retained for audit/reporting but does not expose a source path to clients.

## Package DTO Graph

### CatalogTransferManifest

The package inventory, serialized as controlled UTF-8 JSON rather than database entities.

| Field | Description |
|-------|-------------|
| FormatVersion | Reader compatibility decision |
| PackageId | UUID stable across source report and target report |
| CreatedAtUtc | Source creation time |
| SourceApplicationVersion | Diagnostic source version |
| RequiredCategories | Explicit catalog DTO categories required to restore |
| CategoryCounts | Count per category |
| TotalUncompressedImageBytes | Capacity validation input |
| Entries | Canonical archive path, byte length, SHA-256, and entry category for each data/image item |

### CatalogSnapshot

Contains ordered DTO collections for `CardSet`, `CardSetExternalId`, `SetMapping`, `PendingSetMapping`, `SetRelation`, `CardPrint`, `CardExternalId`, `CardTranslation`, `LocalCorrection`, and `CatalogImageAsset`. Image-bearing DTO fields use an image content hash and target-neutral metadata, not `ImagePath` or `LocalPath` source values.

### PackageImage

Each distinct readable image is stored once at `images/sha256/{lowercase-hash}.{extension}`. Catalog set/card paths and catalog image metadata resolve to the content hash. One hash may be associated with multiple records.

## Existing Entities and Relationships

- `CardSet` is the root for `CardSetExternalId` and `CardPrint`.
- `CardPrint` belongs to `CardSet` and owns `CardExternalId`, `CardTranslation`, and optional `LocalCorrection`.
- `SetMapping`, `PendingSetMapping`, and `SetRelation` preserve cross-source reconciliation state.
- `CatalogImageAsset` attaches image metadata to a `CardSet` or `CardPrint` through `EntityType` and `EntityId`.
- `CollectionEntry`, `ScanJob`, `ImageAsset`, batch-scan entities, Identity entities, `ApplicationConfiguration`, and `CatalogImportRun` plus its snapshots/checkpoints/errors/candidates are excluded.

## Validation Rules

- Target import eligibility requires zero in-scope canonical catalog rows and zero catalog image assets at validation and immediately before restore.
- Package archive paths must be relative, normalized, unique, declared in the manifest, and unable to escape the transfer root.
- Every manifest entry must exist exactly once, match its declared byte length and SHA-256, and belong to a recognized required category.
- DTO identities must be unique; all required foreign keys and image content hashes must resolve within the package.
- Every image must be readable before export success and before import promotion.
- Existing source paths are never restored. Target image paths are generated under a target-managed catalog root.
- Any validation, restore, cancellation, or restart failure leaves no imported rows or promoted images visible.
