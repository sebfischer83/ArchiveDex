# Quickstart: Add-Only Full Catalog Import

**Feature**: 007-add-only-import | **Date**: 2026-07-11

## Prerequisites

- .NET 10 SDK
- Docker (for PostgreSQL test containers)
- Running PostgreSQL instance (or `docker compose up -d postgres`)

## Setup Commands

```bash
# From repository root
dotnet restore
dotnet build

# Apply database migrations (if needed)
dotnet ef database update --project src/ArchiveDex.Infrastructure

# Run all existing tests to verify baseline
dotnet test
```

## Validation Scenarios

### 1. Add-Only Mode Creates New Cards

**Goal**: Verify that add-only mode adds genuinely new cards while skipping existing ones.

**Test**: `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs`

```bash
dotnet test tests/ArchiveDex.Infrastructure.Tests/ --filter "FullyQualifiedName~AddOnlyImport"
```

**Expected behavior**:
- Cards not matching any existing `CardExternalId` are created with full detail
- Cards matching an existing `CardExternalId` are skipped with no modifications
- `AddedCount` equals number of genuinely new cards
- `AddedSupportingItemCount` equals newly created sets
- `SkippedCount` equals number of existing cards
- `UpdatedCount` and `MergedCount` are zero
- Re-running the same import produces zero additional cards (idempotency)

### 2. Existing Catalog Is Untouched

**Goal**: Verify no existing card data is modified during add-only import.

**Test**: `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/CatalogImportProtectionTests.cs` (extended)

```bash
dotnet test tests/ArchiveDex.Infrastructure.Tests/ --filter "FullyQualifiedName~Protection"
```

**Expected behavior**:
- All `CardPrint` fields of existing cards are identical before and after
- All `CardSet` fields of existing sets are identical before and after
- `CardExternalId.IsMissingFromSource` is unchanged
- `CardSetExternalId.IsMissingFromSource` is unchanged
- `CardTranslation` records are unchanged
- `LocalCorrection` records are unchanged

### 3. Mode Is Persisted and Visible

**Goal**: Verify mode is set at creation, immutable, and surfaced in API responses.

**Test**: `tests/ArchiveDex.Api.Tests/CatalogImport/AddOnlyImportContractTests.cs`

```bash
dotnet test tests/ArchiveDex.Api.Tests/ --filter "FullyQualifiedName~AddOnlyImportContract"
```

**Expected behavior**:
- `POST /api/catalog-imports` with `"mode": "AddOnly"` returns `201` with `mode: "AddOnly"`
- `GET /api/catalog-imports/{id}` includes `mode`, `addedCount`, `addedSupportingItemCount`, and `ambiguousCount`
- `GET /api/catalog-imports/{id}/report` includes mode and counts
- Mode cannot be changed via resume (resume re-uses the stored mode)

### 4. Ambiguous Cards Are Flagged Not Created

**Goal**: Verify cards with ambiguous identity are not created and are reported.

**Test**: `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs` (ambiguous fixture)

```bash
dotnet test tests/ArchiveDex.Infrastructure.Tests/ --filter "FullyQualifiedName~Ambiguous"
```

**Expected behavior**:
- No `CardPrint` created for ambiguous cards
- `AmbiguousCount` incremented
- Warning/error record with code `AMBIGUOUS_CARD`
- Existing cards are not modified or merged

### 5. Add-Only Preview (Dry Run)

**Goal**: Verify preview mode reports correctly without changing the catalog.

**Test**: `tests/ArchiveDex.Infrastructure.Tests/CatalogImport/AddOnlyImportTests.cs` (dry-run fixture)

```bash
dotnet test tests/ArchiveDex.Infrastructure.Tests/ --filter "FullyQualifiedName~DryRun"
```

**Expected behavior**:
- No catalog records or images are created
- Report shows which cards would be added vs skipped
- Report shows which supporting sets would be added and which cards are ambiguous
- Counts match the real run counts

### 6. UI Mode Selection (Blazor)

**Goal**: Verify the admin UI renders the mode selector and shows mode-specific status.

**Test**: `tests/ArchiveDex.Web.Tests/ImportAdminModeTests.cs`

```bash
dotnet test tests/ArchiveDex.Web.Tests/ --filter "FullyQualifiedName~ImportAdminMode"
```

**Expected behavior**:
- Mode selector rendered (radio or dropdown) with "Update" (default) and "Add Only"
- Selecting add-only mode and starting import passes mode in request
- Status display shows mode label
- Report distinguishes added vs skipped counts

### 7. End-to-End: Mixed Fixture

**Goal**: Full integration test with real database.

**Prerequisites**: Running PostgreSQL (test container)

```bash
dotnet test tests/ArchiveDex.Api.Tests/ --filter "FullyQualifiedName~AddOnlyImportE2E"
```

**Expected behavior**:
- Source data with 5 new cards + 3 changed existing cards:
  - 5 cards added
  - 3 cards skipped
  - 0 cards updated
  - All existing data unchanged
- Re-run produces 0 added, 0 skipped, 0 changes

### 8. Supporting Set Association and Failure Isolation

**Goal**: Verify a new card uses its uniquely resolved existing or newly created set, and one failed card does not prevent unrelated cards from completing.

**Expected behavior**:
- A new card is persisted with the resolved existing `CardSet.Id` without changing that set
- A new set is retained only when at least one associated new card succeeds
- A failed card is reported while unrelated cards continue

### 9. Throughput Benchmark

**Goal**: Verify SC-006 on the documented four-core baseline host.

```bash
ARCHIVEDEX_RUN_PERFORMANCE_TESTS=true dotnet test tests/ArchiveDex.Infrastructure.Tests/ --filter "FullyQualifiedName~AddOnlyImportPerformance"
```

**Expected behavior**: The deterministic 100,000-card fixture completes within 60 minutes excluding external-source delays; retain the result with release evidence.

## Running All Add-Only Tests

```bash
# Run all add-only-related tests
dotnet test --filter "FullyQualifiedName~AddOnly"

# Run with coverage
dotnet test --filter "FullyQualifiedName~AddOnly" --collect:"XPlat Code Coverage"
```

## Manual Verification

1. Start the application: `dotnet run --project src/ArchiveDex.Web`
2. Navigate to `/admin/import`
3. Select "Add Only" mode from the mode selector
4. Confirm the explanation text describes add-only behavior
5. Start the import
6. Observe progress shows mode label
7. Verify report shows Added / Skipped / Ambiguous counts
8. Re-run with same sources: verify zero cards added
9. Start a new import in "Update" mode: verify existing behavior is unchanged
