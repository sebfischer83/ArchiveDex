# Data Model: Direct Add to Collection from Catalog

**Feature**: 002-add-to-collection
**Date**: 2026-06-20

## Overview

This feature introduces no new entities. It adds a new creation path for the existing `CollectionEntry` entity and a new repository query method for duplicate detection.

## Existing Entity: CollectionEntry

**Source**: `src/ArchiveDex.Domain/Entities/CollectionEntry.cs`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `Id` | `Guid` | Yes | `Guid.NewGuid()` | Primary key |
| `CardPrintId` | `Guid` | Yes | — | FK → `CardPrint.Id`. Indexed for search + duplicate detection |
| `Condition` | `CardCondition` (enum) | Yes | — | NM=0, LP=1, MP=2, HP=3, DMG=4. Combined with `CardPrintId` for duplicate detection |
| `Quantity` | `int` | Yes | `1` | Minimum 1. Validated client-side and server-side |
| `PurchasePrice` | `decimal?` | No | `null` | Non-negative. Interpreted in the single collection currency (Feature 001) |
| `StorageLocation` | `string?` | No | `null` | Free text |
| `Notes` | `string?` | No | `null` | Free text |
| `FrontImagePath` | `string` | No (empty string) | `""` | Not collected by this feature's form; left as empty string for direct-add entries |
| `DateAdded` | `DateTime` | Yes | `DateTime.UtcNow` | Set at creation time |
| `CardPrint` | `CardPrint` (nav) | — | — | Navigation property to the catalog card |

### Validation Rules (Direct Add)

1. `CardPrintId` must reference an existing, non-deleted `CardPrint` → rejected with error if missing (FR-014)
2. `Quantity` ≥ 1 → rejected with validation error (FR-005, edge case)
3. `PurchasePrice` ≥ 0 if provided → rejected with validation error (FR-005)
4. `Condition` must be a valid `CardCondition` enum value → enum parsing handles this

### Duplicate Detection Rule

A **duplicate** is defined as: same `CardPrintId` + same `CardCondition`.

When a duplicate is detected during creation:
- **Default behavior**: Increment existing entry's `Quantity` by the submitted `Quantity` (FR-011)
- **Alternative behavior** (user choice): Create a separate new entry (FR-012)
- **Not a duplicate**: Same `CardPrintId` but different `Condition` → always separate entry

## New Repository Method

**Interface**: `ICollectionRepository` (add method)

```csharp
Task<CollectionEntry?> FindByCardAndConditionAsync(
    Guid cardPrintId, CardCondition condition, CancellationToken ct = default);
```

- Returns the existing `CollectionEntry` if one exists for the given card + condition
- Returns `null` if no duplicate exists
- Implementation: `db.CollectionEntries.FirstOrDefaultAsync(e => e.CardPrintId == cardPrintId && e.Condition == condition)`
- Uses existing FK index on `CardPrintId` for efficient lookup

## Related Entities (Reference Only — No Changes)

### CardPrint (Catalog Card)

**Source**: `src/ArchiveDex.Domain/Entities/CardPrint.cs`

Referenced by `CollectionEntry.CardPrintId`. This feature only reads `CardPrint` (to verify existence at submission time). No modifications.

### CardCondition Enum

**Source**: `src/ArchiveDex.Domain/Enums/CardCondition.cs`

```csharp
public enum CardCondition { NM = 0, LP = 1, MP = 2, HP = 3, DMG = 4 }
```

Used as a form dropdown source and as part of the duplicate detection key.

## State Transitions

This feature only creates `CollectionEntry` records. No state transitions apply (the entry is created in its final state). Deletion and editing are handled by existing Feature 001 endpoints and are out of scope for this feature.
