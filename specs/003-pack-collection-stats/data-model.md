# Data Model: Pack Collection Stats & Images in Catalog

**Feature**: 003-pack-collection-stats
**Date**: 2026-06-20

## Overview

This feature modifies one existing entity (`CardSet`) and one existing DTO (`CatalogSetSummary`). No new entities are introduced.

## Modified Entity: CardSet

**Source**: `src/ArchiveDex.Domain/Entities/CardSet.cs`

### New Field

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `ImagePath` | `string?` | No | `null` | Relative path to the stored set logo/symbol image. Follows same pattern as `CardPrint.ImagePath`. Null if no image has been captured (set imported before this feature or source provides no image). Served via `GET /api/images/{ImagePath}`. |

### Full Entity (after modification)

| Field | Type | Notes |
|-------|------|-------|
| `Id` | `Guid` | PK |
| `CanonicalName` | `string` | |
| `Series` | `string?` | |
| `ReleaseDate` | `DateOnly?` | |
| `PrintedTotal` | `int?` | |
| `OfficialTotal` | `int?` | |
| `ImagePath` | `string?` | **NEW** — relative path to stored set image |
| `CreatedAt` | `DateTime` | |
| `UpdatedAt` | `DateTime` | |
| `ExternalIds` | `List<CardSetExternalId>` | Navigation |
| `Cards` | `List<CardPrint>` | Navigation |

### Validation Rules

- `ImagePath` is set only during import from a TCG data source (or re-import).
- If the source provides no image (`Logo` and `Symbol` both null), `ImagePath` remains null.
- `ImagePath` is not user-editable (manual image upload is out of scope per spec assumptions).
- Subsequent re-imports that find a non-null `ImagePath` skip redownload (idempotent).

## Modified DTO: CatalogSetSummary

**Source**: `src/ArchiveDex.Application/Abstractions/ICatalogRepository.cs`

### Current
```csharp
public sealed record CatalogSetSummary(
    Guid SetId,
    string Name,
    string CardLanguage,
    int CardCount);
```

### After Modification
```csharp
public sealed record CatalogSetSummary(
    Guid SetId,
    string Name,
    string CardLanguage,
    int CardCount,
    int OwnedCount,       // NEW — distinct cards from this set in the user's collection
    string? ImageUrl);    // NEW — URL to the set image (/api/images/{path} or null)
```

### Field Details

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `SetId` | `Guid` | `CardSet.Id` | Unchanged |
| `Name` | `string` | `CardSet.CanonicalName` | Unchanged |
| `CardLanguage` | `string` | `CardSetExternalId.Language` | Unchanged |
| `CardCount` | `int` | `MAX(SourcePrintedTotal, SourceOfficialTotal)` from `CardSetExternalId` | Existing fallback to actual Card count if null per FR-002 |
| `OwnedCount` | `int` | `COUNT(DISTINCT CollectionEntry.CardPrintId)` where `CardPrint.CardSetId == SetId` | 0 if no cards owned from this set. Excludes duplicates (quantity > 1 counts as 1 per FR-003) |
| `ImageUrl` | `string?` | `"/api/images/" + CardSet.ImagePath` if ImagePath is non-null; otherwise null | Null signals the frontend to show placeholder |

## Modified DTO: SetSummary (ITcgDataSource)

**Source**: `src/ArchiveDex.Application/Abstractions/ITcgDataSource.cs`

### Current
```csharp
public sealed record SetSummary(
    string Id,
    string Name,
    string CardLanguage,
    int? TotalCards,
    int? OfficialCards,
    DateOnly? ReleaseDate = null,
    string? Series = null);
```

### After Modification
```csharp
public sealed record SetSummary(
    string Id,
    string Name,
    string CardLanguage,
    int? TotalCards,
    int? OfficialCards,
    DateOnly? ReleaseDate = null,
    string? Series = null,
    string? LogoUrl = null,     // NEW — TCGdex Logo image URL
    string? SymbolUrl = null);  // NEW — TCGdex Symbol image URL
```

## Related Entities (Reference Only — No Changes)

### CollectionEntry

**Source**: `src/ArchiveDex.Domain/Entities/CollectionEntry.cs`

Referenced via `CardPrintId` for owned-count computation. No modifications.

### CardPrint

**Source**: `src/ArchiveDex.Domain/Entities/CardPrint.cs`

Used as join table between `CardSet` and `CollectionEntry` for the owned-count query. Existing `ImagePath` field is the precedent for `CardSet.ImagePath`. No modifications.

### ImageAsset

**Source**: `src/ArchiveDex.Domain/Entities/ImageAsset.cs`

Created by `IImageStore.StoreAsync()` when a set image is downloaded. Referenced indirectly via `CardSet.ImagePath`. No modifications.

## Query: Owned Distinct Card Count per Set

### Repository Method (new)

```csharp
// ICatalogRepository addition
Task<IReadOnlyDictionary<Guid, int>> GetOwnedCountsBySetIdAsync(CancellationToken ct = default);
```

### Implementation (CatalogRepository)

```csharp
public async Task<IReadOnlyDictionary<Guid, int>> GetOwnedCountsBySetIdAsync(CancellationToken ct = default)
{
    return await _db.CollectionEntries
        .Select(ce => new { ce.CardPrintId, ce.CardPrint.CardSetId })
        .Distinct()
        .GroupBy(x => x.CardSetId)
        .Select(g => new { CardSetId = g.Key, OwnedCount = g.Count() })
        .ToDictionaryAsync(x => x.CardSetId, x => x.OwnedCount, ct);
}
```

This query uses existing FK indexes:
- `CollectionEntries.CardPrintId` → `CardPrints.Id`
- `CardPrints.CardSetId` → `CardSets.Id`

## State Transitions

No state transitions apply. The feature adds data that is either present or absent:
- `ImagePath`: null → populated (during import); remains populated on re-import (idempotent)
- `OwnedCount`: computed live from collection data; changes as collection entries are added/removed per FR-005

## Migration

A single EF Core migration adds the `ImagePath` column to the `CardSets` table:

```sql
ALTER TABLE "CardSets" ADD COLUMN "ImagePath" TEXT NULL;
```

Existing rows have `ImagePath = NULL` and will display the placeholder until the set is re-imported.
