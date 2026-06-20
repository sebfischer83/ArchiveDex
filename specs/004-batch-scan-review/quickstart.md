# Quickstart: Batch Scan & Review

**Created**: 2026-06-20

## Prerequisites

- ArchiveDex application running (Docker or local `dotnet run`)
- Admin user created via setup wizard
- At least one set imported into the catalog (via `POST /api/import/jobs`)
- A device with a camera or several card image files for testing

## Validation Scenarios

### Scenario 1: Full Batch Flow (Happy Path)

1. **Upload batch**: Open the scan page on a mobile device or desktop. Select 3–5 card photos. Submit as batch scan.
   - **Verify**: Batch created with status `Processing`. Response contains batch ID and item count.

2. **Wait for OCR**: Poll `GET /api/batch-scans/{batchId}` or wait for page to update.
   - **Verify**: Batch status transitions to `ReadyForReview`. All items show `MatchStatus: Matched` with OCR results.

3. **Review results**: Navigate to batch review page.
   - **Verify**: All cards appear as thumbnails with OCR-detected name/number. Status filter bar is visible.

4. **Correct a match**: Open item detail for a card. Search catalog for different card. Override match.
   - **Verify**: Item `MatchStatus` changes to `Overridden`. Card displayed updates to new selection.

5. **Mark no match**: Open item detail for a card where OCR produced nonsense. Mark as "no match".
   - **Verify**: Item `MatchStatus` changes to `NoMatch`.

6. **Accept into collection**: Go to accept page. Set defaults: Condition=NM, Quantity=1. Select matched items only (exclude "no match"). Submit.
   - **Verify**: Selected cards added to collection. Batch shows "X of Y accepted". Excluded items remain in batch.

7. **Complete batch**: Resolve remaining items (accept or reject).
   - **Verify**: Batch `Status` becomes `Complete`. `POST /api/batch-scans` now returns `201` instead of `409`.

### Scenario 2: Single Active Batch Enforcement

1. **Upload batch 1**: Create a batch with 3 images.
2. **Upload batch 2** (without completing batch 1): Attempt to create another batch.
   - **Verify**: Returns `409 Conflict` with message about existing active batch.
3. **Discard batch 1**: `DELETE /api/batch-scans/{batchId}`.
4. **Upload batch 2**: Create a new batch.
   - **Verify**: Returns `201 Created`. No conflict.

### Scenario 3: Partial Acceptance Survival

1. **Upload batch**: 5 images.
2. **Wait for OCR**: Batch status → `ReadyForReview`.
3. **Accept 2 items**: Accept only 2 items into collection.
   - **Verify**: Batch status → `PartiallyAccepted`. 3 items remain.
4. **Close browser**, re-open, navigate back to batch.
   - **Verify**: Remaining 3 items still present with preserved state.
5. **Discard attempt on partially accepted batch**: `DELETE /api/batch-scans/{batchId}`.
   - **Verify**: Returns `409 Conflict` — cannot discard batch with accepted items.

### Scenario 4: Within-Batch Duplicate Detection

1. **Upload batch**: 2 images of the same Pikachu card.
2. **Wait for OCR**: Both items match to the same `CardPrint`.
3. **Open batch review**:
   - **Verify**: Both items show `isDuplicateInBatch: true`. UI warns about duplicate.
4. **Remove one item** (mark as rejected) and accept the other.
   - **Verify**: Only one collection entry created. No duplicate conflict from existing collection.

### Scenario 5: Invalid Image Handling

1. **Upload batch**: 3 valid card images + 1 PDF + 1 image >10 MB.
2. **Wait for processing**:
   - **Verify**: Batch item count = 5. Two items show `MatchStatus: PendingReview` with `FailureReason` populated. Three items proceed to OCR normally.
3. **Review batch**:
   - **Verify**: Failed items show error reason. User can reject them individually.

### Scenario 6: Mobile Review

1. **Upload batch** on mobile device (width ≤ 360px).
2. **Open batch review**:
   - **Verify**: Thumbnail grid fits screen width. No horizontal scrolling. Status filter bar accessible.
3. **Tap item**:
   - **Verify**: Detail view opens. Catalog search functional. Back navigation returns to overview.

### Scenario 7: Abandoned Batch Cleanup

1. **Note**: This test requires time manipulation or waiting 30 days.
2. **Create batch**, let OCR complete. Do not accept any items.
3. **Wait 30 days** (or simulate by adjusting `CreatedAt` timestamp).
4. **Run cleanup job**:
   - **Verify**: Batch deleted. Associated images removed from storage.
5. **Create a partially accepted batch** (some items accepted).
6. **Wait 30 days**, run cleanup:
   - **Verify**: Batch NOT deleted — partial acceptance counts as activity.

## Test Commands

```bash
# Run all tests
dotnet test

# Run batch scan specific tests (once test project is configured)
dotnet test --filter "FullyQualifiedName~BatchScan"

# Run contract tests with Testcontainers
dotnet test tests/ArchiveDex.ContractTests/ --filter "BatchScan"

# Run Blazor component tests
dotnet test tests/ArchiveDex.BlazorTests/ --filter "BatchScan"
```

## Expected Test Coverage

| Test Category | Minimum Tests | What It Covers |
|---------------|---------------|----------------|
| Contract (API) | 15 | All 8 endpoints, error cases, 409 for active batch, duplicate detection |
| Integration | 8 | Full batch flow, OCR pipeline, acceptance transaction, cleanup job |
| Unit (Domain) | 12 | Entity validation, state transitions, enum behavior |
| Blazor (UI) | 6 | Batch review page, item detail, status filter, accept page, mobile layout |
