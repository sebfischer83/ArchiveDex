# Data Model: Add-Only Full Catalog Import

**Feature**: 007-add-only-import | **Date**: 2026-07-11

## Entity Changes

### NEW: `CatalogImportMode` (Enum)

```
namespace ArchiveDex.Domain.Enums;

public enum CatalogImportMode
{
    Update = 0,
    AddOnly = 1,
}
```

| Value | Description |
|-------|-------------|
| `Update` (0) | Existing behavior: create new cards, update existing cards with changed source data |
| `AddOnly` (1) | New behavior: create new cards and their prerequisite sets; skip all existing catalog items unchanged |

**Default**: `Update` (0) — preserves backward compatibility with existing data and API consumers.

---

### MODIFIED: `CatalogImportRun` (Entity)

Adds mode tracking and mode-specific count columns.

| Field | Type | Change | Description |
|-------|------|--------|-------------|
| `Mode` | `CatalogImportMode` | **NEW** | The import mode selected at start; immutable for the run's lifetime |
| `AddedCount` | `int` | **NEW** | Cards created during this run (populated in add-only mode; zero in update mode) |
| `AddedSupportingItemCount` | `int` | **NEW** | Supporting sets created during this run (or that would be created in preview) |
| `AmbiguousCount` | `int` | **NEW** | Cards that could not be uniquely classified as new or existing |

**After modification**:

```csharp
public class CatalogImportRun
{
    public Guid Id { get; set; }
    public CatalogImportStatus Status { get; set; }
    public CatalogImportMode Mode { get; set; }           // NEW
    public string SelectedSourcesJson { get; set; } = "[]";
    public string SelectedLanguagesJson { get; set; } = "[]";
    public bool IsDryRun { get; set; }
    public bool DownloadImages { get; set; } = true;
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int ImportedCount { get; set; }
    public int UpdatedCount { get; set; }
    public int MergedCount { get; set; }
    public int SkippedCount { get; set; }
    public int AddedCount { get; set; }                   // NEW
    public int AddedSupportingItemCount { get; set; }     // NEW
    public int AmbiguousCount { get; set; }               // NEW
    public int ErrorCount { get; set; }
    public int WarningCount { get; set; }

    public List<CatalogImportCheckpoint> Checkpoints { get; set; } = [];
}
```

**Count semantics by mode**:

| Count Field | Update Mode | Add-Only Mode |
|-------------|-------------|---------------|
| `ImportedCount` | Cards created | Always 0; `AddedCount` is the add-only card count |
| `UpdatedCount` | Cards modified | Always 0 |
| `MergedCount` | Cards merged | Always 0 |
| `SkippedCount` | Cards skipped (duplicates) | Existing cards skipped |
| `AddedCount` | 0 | Cards created |
| `AddedSupportingItemCount` | 0 | Supporting sets created |
| `AmbiguousCount` | 0 | Cards not uniquely classified |
| `ErrorCount` | Errors | Errors (including ambiguous, per existing pattern) |
| `WarningCount` | Warnings | Warnings |

---

### MODIFIED: `SourceImportError` (Entity)

No schema change; new `Code` values used.

| Code | Severity | Description |
|------|----------|-------------|
| `AMBIGUOUS_CARD` | Warning | Incoming card matched multiple existing cards or had an ambiguous identity; skipped |
| `ADD_ONLY_SKIPPED` | Warning (informational) | Card skipped because it already exists (used in dry-run preview reports) |

---

### UNCHANGED Entities (referenced by add-only mode)

| Entity | Role in Add-Only Mode |
|--------|----------------------|
| `SourceCardSnapshot` | Recorded for every incoming card (including skipped) for audit and idempotency |
| `SourceSetSnapshot` | Recorded for every incoming set (including skipped) for audit |
| `CardExternalId` | Looked up to classify cards as existing; never modified in add-only mode |
| `CardSetExternalId` | Looked up to classify sets as existing; never modified in add-only mode |
| `CardPrint` | Created for new cards only; existing cards never modified |
| `CardSet` | Created for missing sets; existing sets never modified |
| `CatalogImportCheckpoint` | Tracks progress per source/language/set; no schema changes needed |

## Database Migration

A single migration adds three columns to the `CatalogImportRuns` table:

```sql
ALTER TABLE "CatalogImportRuns"
ADD COLUMN "Mode" integer NOT NULL DEFAULT 0,
ADD COLUMN "AddedCount" integer NOT NULL DEFAULT 0,
ADD COLUMN "AddedSupportingItemCount" integer NOT NULL DEFAULT 0,
ADD COLUMN "AmbiguousCount" integer NOT NULL DEFAULT 0;
```

**Rollback**:
```sql
ALTER TABLE "CatalogImportRuns"
DROP COLUMN "Mode",
DROP COLUMN "AddedCount",
DROP COLUMN "AddedSupportingItemCount",
DROP COLUMN "AmbiguousCount";
```

## State Transitions

`CatalogImportRun` status transitions are unchanged (Pending → Running → Completed/Failed/Cancelled). The `Mode` field is set at creation and never changes:

```
StartAsync(CatalogImportOptions with Mode)
  → Create CatalogImportRun { Mode = options.Mode, Status = Pending }
  → Mode is immutable for remainder of run lifecycle
```

## Application DTO Changes

### `CatalogImportOptions`

```csharp
public record CatalogImportOptions(
    List<string> Sources,
    Dictionary<string, List<string>> LanguagesBySource,
    bool IsDryRun = false,
    bool DownloadImages = true,
    CatalogImportMode Mode = CatalogImportMode.Update);  // NEW
```

### `CatalogImportRunDto`

```csharp
public record CatalogImportRunDto(
    Guid Id,
    string Status,
    string Mode,          // NEW: "Update" or "AddOnly"
    bool IsDryRun,
    bool DownloadImages,
    DateTime? StartedAt,
    DateTime? FinishedAt,
    int ImportedCount,
    int UpdatedCount,
    int MergedCount,
    int SkippedCount,
    int AddedCount,       // NEW
    int AddedSupportingItemCount, // NEW
    int AmbiguousCount,   // NEW
    int ErrorCount,
    int WarningCount,
    List<CatalogImportCheckpointDto> Checkpoints);
```

### `StartCatalogImportRequest`

```csharp
public class StartCatalogImportRequest
{
    public List<string> Sources { get; set; } = [];
    public Dictionary<string, List<string>> LanguagesBySource { get; set; } = new();
    public bool DryRun { get; set; }
    public bool DownloadImages { get; set; } = true;
    public bool ReanalyzeExistingImages { get; set; } = true;
    public CatalogImportMode Mode { get; set; } = CatalogImportMode.Update;  // NEW
}
```

### `CatalogImportReportDto`

```csharp
public record CatalogImportReportDto(
    CatalogImportRunDto Run,
    List<SourceSummaryDto> SourceSummaries,
    ImageQualitySummaryDto ImageSummary,
    int PendingMappingCount,
    int AmbiguousCardCount);    // NEW: count of ambiguous cards for review
```

## Internal Reconciliation Results

The reconciler returns explicit outcomes instead of returning only an entity. This lets the orchestrator use one classification path for real imports and previews, derive correct counts, and pass the uniquely resolved set ID to card reconciliation.

| Result | Required fields | Use |
|--------|-----------------|-----|
| `CatalogImportSetResult` | `Outcome`, `CardSetId`, `CreatedSupportingItem` | Reuses an existing set unchanged, identifies a new set, or reports an ambiguous set match before cards are processed |
| `CatalogImportCardResult` | `Outcome`, `CardPrintId`, `CreatedCard`, `AmbiguousReason` | Distinguishes `Added`, `SkippedExisting`, `Ambiguous`, and `Failed` without inferring outcome from a nullable entity |

In dry-run mode these results represent predicted outcomes and never persist catalog entities, external IDs, source status, or image assets.
