# API Contract: Create Collection Entry

**Feature**: 002-add-to-collection
**Endpoint**: `POST /api/collection`
**Date**: 2026-06-20

## Request

```
POST /api/collection
Content-Type: application/json
```

### Request Body

```json
{
  "cardPrintId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "condition": "NM",
  "quantity": 1,
  "purchasePrice": 0.00,
  "storageLocation": "Binder 1, Page 3",
  "notes": "Pack fresh"
}
```

### Field Specifications

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `cardPrintId` | `string` (GUID) | Yes | — | Must reference an existing `CardPrint` |
| `condition` | `string` (enum) | Yes | `"NM"` | One of: `"NM"`, `"LP"`, `"MP"`, `"HP"`, `"DMG"` |
| `quantity` | `int` | Yes | `1` | Minimum 1 |
| `purchasePrice` | `number` or `null` | No | `null` | Non-negative if provided. In collection currency |
| `storageLocation` | `string` or `null` | No | `null` | Free text |
| `notes` | `string` or `null` | No | `null` | Free text |

## Responses

### 201 Created — New entry created

```json
{
  "id": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cardId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cardName": "Charizard",
  "cardLanguage": "en",
  "condition": "NM",
  "quantity": 1,
  "purchasePrice": 0.00,
  "storageLocation": "Binder 1, Page 3",
  "notes": "Pack fresh",
  "frontImageUrl": "/api/images/cards/charizard_en.png",
  "dateAdded": "2026-06-20T12:00:00Z"
}
```

**Response body**: `CollectionEntryDto` (existing DTO). `frontImageUrl` is the catalog card's stock image fallback when no custom front image is uploaded.

**Location header**: `/api/collection/{id}`

### 201 Created — Merged with existing entry (quantity incremented)

Same response shape as above, but `id` references the **existing** (updated) entry and `quantity` reflects the new total. The `Location` header points to the existing entry's URL.

```json
{
  "id": "EXISTING-ENTRY-GUID",
  "cardId": "...",
  "condition": "NM",
  "quantity": 3,
  ...
}
```

### 409 Conflict — Duplicate detected (merge prompt required)

Returned when a `CollectionEntry` already exists for the same `cardPrintId` + `condition`. The response body provides the existing entry summary so the UI can render the merge-vs-separate choice.

```json
{
  "type": "duplicate",
  "existingEntry": {
    "id": "EXISTING-ENTRY-GUID",
    "condition": "NM",
    "quantity": 2,
    "storageLocation": "Binder 1, Page 3",
    "notes": "Pack fresh"
  },
  "submittedQuantity": 1,
  "proposedQuantity": 3
}
```

### 400 Bad Request — Validation error

```json
{
  "type": "validation_error",
  "errors": {
    "quantity": ["Quantity must be at least 1."],
    "condition": ["Condition 'XX' is not valid."]
  }
}
```

### 404 Not Found — Catalog card deleted

```json
{
  "type": "card_not_found",
  "cardPrintId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

## Request/Response Types (C#)

```csharp
// Request (API layer input)
public sealed record CreateCollectionRequest(
    Guid CardPrintId,
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes);

// Success response: existing CollectionEntryDto (from Application.Common)
// Already defined: ArchiveDex.Application.Common.CollectionEntryDto

// Duplicate response (new DTO)
public sealed record DuplicateDetectedResponse(
    Guid ExistingEntryId,
    string Condition,
    int ExistingQuantity,
    string? StorageLocation,
    string? Notes,
    int SubmittedQuantity,
    int ProposedQuantity);
```

## Authentication

Requires administrator authentication (same as all `/api/*` endpoints in Feature 001). Inherits existing cookie-based auth middleware.
