# Research: Pack Collection Stats & Images in Catalog

**Feature**: 003-pack-collection-stats
**Date**: 2026-06-20

## Research Questions

### R1: How does TCGdex expose set images?

**Finding**: The TCGdex API provides two image URLs per set:

| Field | Type | Description |
|-------|------|-------------|
| `Logo` | `string?` | URL to set logo image (e.g., `https://assets.tcgdex.net/en/base/base1/logo`) |
| `Symbol` | `string?` | URL to set symbol image |

These are available on both `SetResume` (list endpoint) and `Set` (detail endpoint). The existing `TcgDexDataSource.GetAvailableSetsAsync` and `GetSetMetaAsync` methods already fetch `SetResume` and `Set` objects but discard `Logo`/`Symbol` when mapping to `SetSummary`.

**Decision**: Capture both `Logo` and `Symbol` URLs in `SetSummary`. Prefer `Logo` as primary image (higher resolution, more recognizable). Fall back to `Symbol` if `Logo` is null.

**Alternatives considered**:
- Fetching set image from a separate endpoint — rejected; already available in existing API calls.
- Using only `Symbol` — rejected; `Logo` is more visually useful for pack identification.

---

### R2: How should set images be downloaded and stored?

**Finding**: The codebase already has an established image download + storage pipeline:

```
ITcgDataSource.DownloadCardImageAsync() → MemoryStream + filename
↓
IImageStore.StoreAsync(stream, fileName) → ImageAsset (with RelativePath)
↓
ImageAsset.RelativePath stored on entity (CardPrint.ImagePath)
↓
Served via GET /api/images/{relativePath} → ImageGetHandler → IImageStore.GetAsync()
```

The `ImportJobService.DownloadImageIfNeeded()` method (line 217-232) encapsulates the "download if no existing path" logic. The `ImageDownloadHelper` is a general-purpose URL→stream downloader already available as a static utility.

**Decision**: Follow the exact same pattern for set images:
1. Add an `ImagePath` (string?) property to `CardSet`
2. In `ImportJobService`, after resolving a `CardSet` via `SetImportService`, download the set image via `ITcgDataSource.GetSetMetaAsync()` → `LogoUrl`/`SymbolUrl` → `ImageDownloadHelper` → `IImageStore.StoreAsync()`
3. Store the `RelativePath` on `CardSet.ImagePath`
4. Serve via existing `/api/images/{*fileName}` handler
5. Skip download if `CardSet.ImagePath` is already set (idempotent re-import)

**Alternatives considered**:
- Storing the TCGdex Logo URL directly (hotlinking) — rejected; violates data integrity (URLs may change/break), doesn't work offline.
- Creating a new `SetImageAsset` entity — rejected; over-engineered. A simple `ImagePath` string on `CardSet` follows the `CardPrint.ImagePath` precedent.

---

### R3: How to compute "distinct owned cards per set" efficiently?

**Finding**: The database schema has:
- `CollectionEntries` with FK `CardPrintId` → `CardPrints`
- `CardPrints` with FK `CardSetId` → `CardSets`

To count distinct owned cards per set: count unique `CardPrintId` values in `CollectionEntries` grouped by the `CardSetId` of the linked `CardPrint`.

**SQL concept**:
```sql
SELECT cs.Id, COUNT(DISTINCT ce.CardPrintId) AS OwnedCount
FROM CardSets cs
LEFT JOIN CardPrints cp ON cp.CardSetId = cs.Id
LEFT JOIN CollectionEntries ce ON ce.CardPrintId = cp.Id
GROUP BY cs.Id
```

**EF Core LINQ concept**:
```csharp
var ownedCounts = await _db.CollectionEntries
    .Select(ce => new { ce.CardPrintId, ce.CardPrint.CardSetId })
    .Distinct()
    .GroupBy(x => x.CardSetId)
    .Select(g => new { CardSetId = g.Key, OwnedCount = g.Count() })
    .ToDictionaryAsync(x => x.CardSetId, x => x.OwnedCount, ct);
```

**Decision**: Compute owned counts in a single query and merge into `CatalogSetSummary` results. This avoids N+1 queries (one per set). The existing `GetSetSummariesAsync` already queries `CardSetExternalIds` grouped by `CardSetId`. The owned-count query can run in parallel or be merged into the same repository method.

Performance: For 50 sets and 10,000 collection entries, a single indexed JOIN + GROUP BY completes in well under 100ms on both PostgreSQL and SQLite (per SC-001 budget of 3s total page load).

**Alternatives considered**:
- Pre-computed/cached counts — rejected by FR-010 explicitly requiring database-derived counts.
- Separate API endpoint for counts — rejected; adds an extra HTTP round-trip. Include in `GET /api/catalog/sets`.

---

### R4: What placeholder image should be shown for sets without images?

**Finding**: The web app already uses `/card-placeholder.svg` for cards without images (`CatalogBrowse.razor:153`). The design system defines an `ad-` prefixed CSS convention and uses inline SVGs for UI elements.

**Decision**: Create a static SVG placeholder at `wwwroot/set-placeholder.svg` — a simple, neutral pack/set icon (e.g., a folder or card-deck silhouette in the app's secondary color). Display it when `CardSet.ImagePath` is null. Follow the same `<img>` + `alt` pattern used for card placeholders.

CSS: The set card layout is extended inline in the existing `.set-card` grid to accommodate the image thumbnail, maintaining responsive behavior.

**Alternatives considered**:
- CSS-only placeholder (no image element) — rejected; an `<img>` element with a real SVG source provides consistent sizing, `alt` text support, and predictable layout behavior.
- No placeholder (empty space) — rejected by FR-007 which requires a placeholder.

---

### R5: How should the progress display format work?

**Finding**: The spec requires both "owned" and "total" counts to be displayed per pack. The exact format (fraction, percentage, progress bar) is left to implementation planning per the Assumptions section.

**Decision**: Display as a simple fraction text beneath the set name (e.g., "15/100"). This is:
- Compact (fits in the existing set card grid)
- Immediately understandable
- No visual design dependency (no progress bar component needed)
- Easy to localize if needed later

The `CatalogSetDto` record in `CatalogBrowse.razor` is extended to include `OwnedCount` and `TotalCount` (or `CardCount`, already present). The rendering adds a new `<span>` element below the existing `<span class="set-meta">`.

**Alternatives considered**:
- Percentage only — rejected; less informative than fraction.
- Progress bar — rejected; over-designed for this feature scope, can be added in a future enhancement.
- Color-coded completion — rejected; keep v1 simple per spec scope.
