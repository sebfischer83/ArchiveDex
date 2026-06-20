# Quickstart: Validate Pack Collection Stats & Images

**Feature**: 003-pack-collection-stats
**Date**: 2026-06-20

## Prerequisites

1. Application running (Docker or `dotnet run` from `src/ArchiveDex.Web`)
2. At least one set imported via TCGdex import
3. At least one card added to the collection from an imported set

## Validation Scenarios

### Scenario 1: Pack Progress Display

**Goal**: Verify owned-card count appears under each set in the catalog browse view.

**Steps**:

1. Navigate to `http://localhost:<port>/catalog`
2. Observe the set cards in the top section
3. Verify: Each set card shows a fraction like "45/252" under the set name and language chip
4. Verify: A set where you own no cards shows "0/[total]"
5. Add a new card to your collection (via the "+" button on any card from that set)
6. Click "Refresh sets" button
7. Verify: The owned count for that set increases by 1 (if the card wasn't already owned)

**Expected outcome**: Owned counts are displayed and update correctly.

---

### Scenario 2: Pack Image Display

**Goal**: Verify set images appear for imported sets and placeholders for sets without images.

**Steps**:

1. Navigate to `http://localhost:<port>/catalog`
2. Observe the set cards
3. Verify: Sets imported after this feature show a set logo/symbol image
4. Verify: Sets imported before this feature (or without image data) show a placeholder image
5. Right-click the set image → "Open image in new tab"
6. Verify: The image loads correctly from `/api/images/...`

**Expected outcome**: Images or placeholders are displayed for every set; no broken images.

---

### Scenario 3: Re-import Fills Missing Images

**Goal**: Verify re-importing a set populates its image.

**Steps**:

1. Identify a set imported before this feature (showing placeholder)
2. Navigate to `http://localhost:<port>/import`
3. Select the same source and language, ensure that set is selected
4. Start the import
5. Wait for completion
6. Return to `/catalog`
7. Refresh sets
8. Verify: The set now displays its image instead of the placeholder

**Expected outcome**: Placeholder is replaced with the actual set image after re-import.

---

### Scenario 4: API Contract

**Goal**: Verify the extended API response includes new fields.

**Steps**:

1. Call `GET http://localhost:<port>/api/catalog/sets`
2. Verify response is a JSON array
3. For each item, verify the presence of:
   - `setId` (UUID string)
   - `name` (string)
   - `cardLanguage` (string: de/en/ja/ko/zh-Hans/zh-Hant)
   - `cardCount` (number)
   - `ownedCount` (number, >= 0) — **NEW**
   - `imageUrl` (string or null) — **NEW**
4. Verify: `ownedCount` ≤ `cardCount` and `ownedCount` ≥ 0
5. Verify: `imageUrl` is either null or starts with `/api/images/`

**Expected outcome**: JSON response conforms to [contracts/catalog-api.md](./contracts/catalog-api.md).

**Example curl**:
```bash
curl -s http://localhost:5000/api/catalog/sets | jq '.[0]'
```

---

### Scenario 5: Distinct Count Accuracy

**Goal**: Verify owned count reflects distinct cards, not total copies.

**Steps**:

1. Find a set where you own 1 card with quantity 1
2. Note the owned count (e.g., "1/100")
3. Via the "+" button, add the **same card** again with quantity 2 (via Add to Collection dialog)
4. Click "Refresh sets"
5. Verify: The owned count is still 1 (not 2) — duplicates don't increase distinct count

**Expected outcome**: Quantity > 1 on a card does not inflate the distinct owned count.

---

### Scenario 6: Set Image Survives Re-import

**Goal**: Verify re-importing a set that already has an image does not lose or change the image.

**Steps**:

1. Identify a set with an image
2. Note the image URL (inspect element or API response)
3. Re-import that set
4. Return to `/catalog` and refresh
5. Verify: The set image URL is unchanged (not replaced unless a new image is available)

**Expected outcome**: Existing set images are preserved through re-import (FR-011).

## Troubleshooting

| Symptom | Likely Cause | Resolution |
|---------|-------------|------------|
| All sets show placeholder | Sets imported before this feature | Re-import the desired sets |
| Owned count is 0 for all sets | Collection is empty | Add cards via "+" button or scanner |
| Page loads slowly (>3s) | Large collection with unindexed FKs | Run EF Core migrations; verify FK indexes exist |
| Broken image shown | Image download failed during import | Re-import the set; check TCGdex connectivity |
