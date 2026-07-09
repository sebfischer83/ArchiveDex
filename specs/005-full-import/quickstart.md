# Quickstart: Full Catalog Import

**Created**: 2026-07-07

## Prerequisites

- ArchiveDex application running locally or in Docker.
- Setup wizard completed with an admin user.
- Database migrations applied.
- Image storage path configured and writable.
- Network access to enabled external sources for live validation, or fixture-backed clients for automated tests.

## Validation Scenarios

### Scenario 1: Dry Run Across All Sources

1. Open `/admin/import`.
2. Select all sources and all languages.
3. Enable dry run.
4. Enable image analysis.
5. Start the import.

Verify:

- Import run is created.
- Progress is visible by source, language, and set.
- Staging snapshots, checkpoints, warnings, and errors may be written.
- Canonical `CardSet`, `CardPrint`, external ID, and translation counts do not change.

### Scenario 2: Full Import and Idempotency

1. Open `/admin/import`.
2. Select all sources and all languages.
3. Disable dry run.
4. Start the import and wait for completion.
5. Record counts for sets, card prints, external IDs, and translations.
6. Run the same import again.

Verify:

- Second run updates or skips existing records.
- No duplicate sets, card prints, external IDs, or translations are created.
- Local corrections and collection entries remain unchanged.

### Scenario 3: Resume After Cancellation

1. Start a full import.
2. Wait until at least one source/language checkpoint is completed.
3. Cancel the import from `/admin/import`.
4. Resume the same import.

Verify:

- The resumed run continues from persisted checkpoints.
- Completed source/language/set phases are not repeated unnecessarily.
- Final report shows cancelled/resumed history clearly.

### Scenario 4: Source Failure Isolation

1. Run an import with one fixture source configured to fail on a specific set or card detail.
2. Keep other fixture sources healthy.

Verify:

- The failing record produces a structured error.
- Other records in the same source continue when possible.
- Other sources and languages continue unaffected.
- Final report includes source, language, set, card, phase, and error code when available.

### Scenario 5: Image Quality Selection

1. Provide multiple image candidates for the same card or set.
2. Include candidates with different resolution, aspect ratio, file size, format, and one invalid file.
3. Run import with image analysis enabled.

Verify:

- All candidates are analyzed and scored where decodable.
- Invalid candidates are recorded with errors and excluded from selection.
- Only the best candidate is stored permanently.
- Non-selected temporary files are deleted.
- Candidate metadata and scores remain visible in the image quality report.

### Scenario 6: Manual Image Protection

1. Mark an existing image as manually selected for a card.
2. Run an import that finds a higher-scoring candidate.

Verify:

- The manually selected image remains active.
- The higher-scoring candidate is recorded as a candidate but does not replace the manual selection.

### Scenario 7: Deferred Prices

1. Open `/admin/import`.
2. Inspect import options.
3. Run a full import.

Verify:

- Price import is shown as deferred or disabled.
- No price records are imported or modified by this feature.

## Test Commands

```bash
dotnet test
dotnet test --filter "FullyQualifiedName~CatalogImport"
dotnet test tests/ArchiveDex.Api.Tests/ --filter "CatalogImport"
dotnet test tests/ArchiveDex.Web.Tests/ --filter "ImportAdmin"
```

## Expected Test Coverage

| Test Category | Minimum Tests | What It Covers |
|---------------|---------------|----------------|
| Unit | 20 | Language normalization, matching, scoring, options, protection rules |
| Integration | 12 | Source fixtures, staging, canonical upsert, idempotency, resume, images |
| API Contract | 8 | Start, active, status, cancel, resume, report, errors, image quality |
| Web UI | 6 | Start form, progress, errors, report, image quality, disabled prices |
