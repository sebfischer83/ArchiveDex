# Quickstart: Catalog Export and Import

**Created**: 2026-07-10

## Prerequisites

- ArchiveDex is running and initial setup is complete.
- The operator is signed in as the administrator.
- Source has canonical catalog records and readable catalog images.
- Target is configured, has no canonical catalog records or catalog image assets, and has writable image and temporary-transfer storage.
- Target has free space for the package contents plus staging space.
- Database migrations are applied.

See [data model](./data-model.md) and [API contract](./contracts/catalog-transfer.openapi.yaml).

## Validation Scenarios

### Scenario 1: Export a Complete Catalog

1. Open the catalog transfer page.
2. Start an export.
3. Observe progress until status is `Completed`.
4. Download the package and open the final report.

Verify:

- Report contains package ID, format version, timestamps, category counts, image count/size, and successful validation.
- Package contains the declared catalog data and every readable catalog image.
- Package contains no collection, scan, account, configuration, or operational-import content.
- A shared image is represented once while all catalog associations remain present.

### Scenario 2: Restore into an Empty Target Without Network Access

1. Disable target access to external catalog and image sources.
2. Upload the Scenario 1 package through catalog transfer.
3. Wait for validation to succeed.
4. Start import and wait for `Completed`.
5. Compare source export and target import reports.

Verify:

- Package ID, category counts, image count, image bytes, and relationships match.
- Browse, search, filter, image display, and card matching work on target.
- Target image references resolve inside target-managed storage rather than source paths.

### Scenario 3: Reject Invalid or Incompatible Packages

1. Copy a valid package and change one data or image entry.
2. Upload the changed package to an empty target.
3. Repeat with a package that declares an unsupported newer format version.

Verify:

- Each package is rejected before target catalog rows or image storage change.
- Report identifies the failed check, impact, and recommended action.
- No completed package download or import result is reported for the invalid input.

### Scenario 4: Empty Target and Concurrent Operation Rules

1. Add one canonical catalog record or catalog image asset to a target.
2. Validate a package.
3. Start an export or catalog-changing operation, then attempt a transfer from another browser session.

Verify:

- Non-empty target is rejected with an actionable error.
- Conflicting start returns the contract conflict response.
- Only one active transfer/catalog-changing operation is visible.

### Scenario 5: Cancellation, Failure, and Restart Recovery

1. Start an export and cancel during image packaging.
2. Start an import and cancel during image staging.
3. Repeat import, stop the application during staging/finalization, then restart it.

Verify:

- No partial export is downloadable.
- Target contains no imported catalog rows or promoted images after cancellation/failure.
- Startup recovery removes uncommitted staging/promoted roots and reports the interrupted operation.

## Test Commands

```bash
dotnet test ArchiveDex.slnx
dotnet test tests/ArchiveDex.Domain.Tests/ --filter "FullyQualifiedName~CatalogTransfer"
dotnet test tests/ArchiveDex.Infrastructure.Tests/ --filter "FullyQualifiedName~CatalogTransfer"
dotnet test tests/ArchiveDex.Api.Tests/ --filter "FullyQualifiedName~CatalogTransfer"
dotnet test tests/ArchiveDex.Web.Tests/ --filter "FullyQualifiedName~CatalogTransfer"
```

## Required Coverage

| Test category | Required behavior |
|---------------|-------------------|
| Domain unit | State transitions, global lease, package identity, category/relationship validation, safe archive paths |
| Infrastructure integration | PostgreSQL/filesystem export-import round trip, Unicode, de-duplicated images, missing image, capacity failure, rollback, cancellation, restart recovery |
| API contract | Administrator-only access, starts/status/report/download/cancel, conflict, invalid upload, incompatible format, no mutation after failed validation |
| Web component | Upload/validation controls, polling, cancellation, conflict-disabled state, localized structured errors, completed report |

## Automated Verification Record

**Recorded**: 2026-07-10

- `dotnet build ArchiveDex.slnx --no-restore --nologo`: passed.
- `dotnet test ArchiveDex.slnx --no-build --nologo`: 345 passed, 1 skipped, 0 failed.
- Transfer infrastructure tests cover streamed catalog JSON across multiple batches, image-spool cleanup, invalid package rejection, cancellation, rollback, and interrupted-operation recovery.
- The 25-GB baseline measurement is explicitly deferred and is not a release blocker for this iteration.

## Deferred Operational Checks

The following checks require a configured source and empty target instance. They are explicitly deferred from feature acceptance for this iteration and remain operational release checks:

- [ ] Complete Scenarios 1 through 5 above on PostgreSQL and configured filesystem storage.
- [ ] Capture source and target reports and confirm category and image totals match.
- [ ] Interrupt an import during image promotion, restart the application, and confirm that recovery removes the promoted root and marks the operation interrupted.
- [ ] Perform the administrator usability validation for the two-minute/five-interaction and report-comprehension criteria.
