# Quickstart: Direct Add to Collection from Catalog

**Feature**: 002-add-to-collection
**Date**: 2026-06-20

## Prerequisites

1. Feature 001 setup complete (administrator account, configured database, at least one set imported into catalog)
2. Application running (`docker compose up` or `dotnet run`)
3. Administrator authenticated in browser

## Validation Scenarios

### VS-1: Add from Catalog Detail View (US1, P1)

1. Navigate to `/catalog` and select a set with cards
2. Click any card to open its detail page (`/catalog/card/{id}`)
3. Click **"Add to Collection"** button
   - **Expected**: A modal dialog appears with form fields pre-filled (Condition: NM, Quantity: 1)
4. Change Condition to "LP", set Quantity to 2, enter a Purchase Price of 4.50, and a Storage Location
5. Click **Save**
   - **Expected**: Dialog closes, confirmation message appears, page stays on the card detail view
6. Navigate to `/collection` and search for the card
   - **Expected**: New entry appears with LP condition, quantity 2, price 4.50, and the specified location

### VS-2: Add from Catalog List View (US2, P2)

1. Navigate to `/catalog` and select a set with multiple cards
2. In the card grid, click **"Add to Collection"** on a specific card row
   - **Expected**: Same modal dialog appears as from detail view, with fresh defaults
3. Leave defaults (NM, quantity 1) and click **Save**
   - **Expected**: Dialog closes, confirmation shown, stays on list view
4. Click "Add to Collection" on a different card in the same list
   - **Expected**: Dialog opens with fresh defaults (NM, 1), not stale data from the previous add

### VS-3: Duplicate Detection — Merge (US3, P2)

1. Ensure a collection entry exists for a card in NM condition with quantity 2
2. From catalog detail view, click "Add to Collection" for the same card
3. Set Condition to NM, Quantity to 1, click **Save**
   - **Expected**: System detects duplicate, shows prompt: "You already have 2 of this card in NM. Add 1 more for a total of 3?"
4. Choose **"Merge — Increment Quantity"**
   - **Expected**: Existing entry's quantity updates to 3. No new entry created. Confirmation shown.

### VS-4: Duplicate Detection — Separate Entry (US3, P2)

1. Ensure a collection entry exists for a card in NM condition
2. Add the same card again in NM condition with a different storage location
3. When duplicate prompt appears, choose **"Create as Separate Entry"**
   - **Expected**: A new, separate collection entry is created. Both entries exist with different locations.

### VS-5: Duplicate — Different Condition (US3)

1. Ensure a collection entry exists for a card in LP condition
2. Add the same card in NM condition
   - **Expected**: No duplicate prompt. New entry created directly (different condition = different entry).

### VS-6: Validation Errors (FR-005)

1. Open the Add to Collection form for any card
2. Enter Quantity 0 and click **Save**
   - **Expected**: Form shows validation error "Quantity must be at least 1." Form stays open.
3. Enter Quantity -1 and click **Save**
   - **Expected**: Same validation error.
4. Enter Purchase Price -5 and click **Save**
   - **Expected**: Form shows validation error for price. Form stays open.

### VS-7: Cancel Without Saving (FR-008)

1. Open the Add to Collection form
2. Fill in several fields
3. Click **Cancel** or click the backdrop outside the dialog
   - **Expected**: Dialog closes. No collection entry created. Page state unchanged.

### VS-8: Duplicate — Different Condition No Prompt

1. Have a card in LP condition in collection
2. Add same card in NM condition
   - **Expected**: No duplicate dialog, entry created directly since conditions differ.

### VS-9: Card Deleted During Form Open (FR-014, Edge Case)

Manual test (requires two browser tabs):
1. Tab A: Open a card detail page, open Add to Collection form
2. Tab B: As admin, somehow delete the underlying catalog card
3. Tab A: Fill form and click **Save**
   - **Expected**: Error message "This catalog card is no longer available." Form stays open.

### VS-10: Network Error During Submit (Edge Case)

Manual test (requires network throttling):
1. Open Add to Collection form, fill fields
2. Simulate network interruption before clicking Save
3. Click **Save**
   - **Expected**: Error message shown. Form stays open with data intact. Can retry after network restored.

## API-Only Validation (curl / HTTP client)

```bash
# Create a new collection entry
curl -X POST http://localhost:5000/api/collection \
  -H "Content-Type: application/json" \
  -H "Cookie: .AspNetCore.Cookies=<auth-cookie>" \
  -d '{
    "cardPrintId": "VALID-CARD-GUID",
    "condition": "NM",
    "quantity": 1
  }'

# Expected: 201 Created with CollectionEntryDto in body

# Attempt duplicate (same card + same condition)
curl -X POST http://localhost:5000/api/collection \
  -H "Content-Type: application/json" \
  -H "Cookie: .AspNetCore.Cookies=<auth-cookie>" \
  -d '{
    "cardPrintId": "SAME-CARD-GUID",
    "condition": "NM",
    "quantity": 1
  }'

# Expected: 409 Conflict with duplicate detection response

# Invalid card ID
curl -X POST http://localhost:5000/api/collection \
  -H "Content-Type: application/json" \
  -H "Cookie: .AspNetCore.Cookies=<auth-cookie>" \
  -d '{
    "cardPrintId": "00000000-0000-0000-0000-000000000000",
    "condition": "NM",
    "quantity": 1
  }'

# Expected: 404 Not Found

# Invalid quantity
curl -X POST http://localhost:5000/api/collection \
  -H "Content-Type: application/json" \
  -H "Cookie: .AspNetCore.Cookies=<auth-cookie>" \
  -d '{
    "cardPrintId": "VALID-CARD-GUID",
    "condition": "NM",
    "quantity": 0
  }'

# Expected: 400 Bad Request
```
