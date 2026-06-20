# API Contract: Catalog Sets (Extended)

**Feature**: 003-pack-collection-stats
**Date**: 2026-06-20

## `GET /api/catalog/sets`

Returns the list of catalog sets (packs) with collection progress and image information.

### Request

- **Method**: `GET`
- **Path**: `/api/catalog/sets`
- **Headers**: standard (no auth required for UI)
- **Query parameters**: none
- **Request body**: none

### Response

**Status**: `200 OK`

**Content-Type**: `application/json`

**Body**: Array of `CatalogSetSummary` objects.

```json
[
  {
    "setId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Surging Sparks",
    "cardLanguage": "en",
    "cardCount": 252,
    "ownedCount": 45,
    "imageUrl": "/api/images/a1/b2/c3.jpg"
  },
  {
    "setId": "660e8400-e29b-41d4-a716-446655440001",
    "name": "151",
    "cardLanguage": "ja",
    "cardCount": 165,
    "ownedCount": 0,
    "imageUrl": null
  }
]
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `setId` | `string` (UUID) | Unique identifier of the canonical set |
| `name` | `string` | Canonical name of the set |
| `cardLanguage` | `string` | Card language code (de, en, ja, ko, zh-Hans, zh-Hant) |
| `cardCount` | `number` | Total cards in the set (from import metadata, or 0 if unknown) |
| `ownedCount` | `number` | **NEW** — Number of distinct cards from this set the user owns in their collection. 0 if none. Counts distinct cards only (quantity > 1 counts as 1). |
| `imageUrl` | `string` or `null` | **NEW** — URL path to the set's image. Served by the existing image endpoint. `null` if no image is available (set imported before this feature or source provides no image). Clients should show a placeholder when null. |

### Error Responses

| Status | Description |
|--------|-------------|
| `500 Internal Server Error` | Database connection failure or query error |

### Backward Compatibility

This is an **additive** change to the existing response. Two new fields (`ownedCount`, `imageUrl`) are appended. Existing clients that deserialize only the original four fields (`setId`, `name`, `cardLanguage`, `cardCount`) continue to work since JSON deserialization ignores unknown fields by default.

### Performance

| Metric | Target |
|--------|--------|
| Response time (p95) | < 500ms for 50 sets, 10k collection entries |
| Response size | ~2 KB for 50 sets (typical) |

### Implementation Notes

- `ownedCount` is computed via a single `GROUP BY` query across `CollectionEntries → CardPrints → CardSets` using existing FK indexes.
- `imageUrl` is constructed as `/api/images/{CardSet.ImagePath}` when `ImagePath` is non-null; otherwise `null`.
- The handler (`CatalogSetsHandler.cs`) remains unchanged — Wolverine maps the return type automatically.
- The query handler (`GetCatalogSetsHandler`) is updated to inject `ICollectionRepository` (or equivalent) for the owned-count computation.

### Test Scenarios

1. **Happy path**: GET returns sets with `ownedCount > 0` and `imageUrl` for imported sets with images.
2. **Empty collection**: GET returns sets with `ownedCount = 0` for all sets.
3. **Missing image**: GET returns sets with `imageUrl = null` for sets without images.
4. **No sets imported**: GET returns empty array `[]`.
5. **Distinct count**: Add 3 copies of the same card from one set; verify `ownedCount` increments by 1, not 3.
6. **Additive fields**: Client that parses only original 4 fields still works.
