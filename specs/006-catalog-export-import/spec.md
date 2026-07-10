# Feature Specification: Catalog Export and Import

**Feature Branch**: `006-catalog-export-import`

**Created**: 2026-07-10

**Status**: Complete

**Input**: User description: "implementiere eine Funktion um den Katalog mit allen Daten inklusive Bildern zu exportieren und in einer anderen Instanz der Anwendung wieder einspielen zu können"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export the Complete Catalog (Priority: P1)

As the administrator of an ArchiveDex instance, I export the complete catalog as one portable package so I can move the catalog without repeating external imports or losing locally maintained catalog information and images.

**Why this priority**: A complete and trustworthy export is the prerequisite for every transfer and provides the portable source artifact the user requested.

**Independent Test**: Populate an instance with sets, cards in multiple languages, source references, local catalog corrections, manual catalog records, and catalog images; create an export and verify that the resulting package contains a consistent representation of every in-scope record and every referenced catalog image.

**Acceptance Scenarios**:

1. **Given** an instance with imported and manually maintained catalog content, **When** the administrator starts an export, **Then** the system creates one transferable package containing all in-scope catalog data and all locally stored catalog images.
2. **Given** catalog records have relationships across sets, cards, translations, source references, and images, **When** the export completes, **Then** the package preserves those relationships and identifies its format version, package identity, creation time, source application version, included content categories and counts, total image size, and verification status for every packaged item.
3. **Given** any required catalog record or image cannot be read, included, or verified as unchanged, **When** export processes it, **Then** the export fails with a message identifying the failed item and recommended next action and does not present an incomplete package as successful.
4. **Given** a catalog export is running, **When** catalog content would otherwise change concurrently, **Then** the completed package still represents one consistent catalog state rather than a mixture of states.
5. **Given** a person is not signed in as the administrator, **When** they attempt to start, view, cancel, download, or import a catalog transfer, **Then** access is denied and no transfer data is disclosed or changed.
6. **Given** the source also contains collection entries, scans, credentials, settings, import history, temporary files, and non-catalog images, **When** the export completes, **Then** none of those excluded items is present anywhere in the package.

---

### User Story 2 - Import into Another Instance (Priority: P1)

As the administrator of another ArchiveDex instance, I import a catalog package so the target instance receives the same complete catalog, including images, without access to the original external data sources.

**Why this priority**: Restoring the package on another instance completes the transfer and is the primary outcome of the feature.

**Independent Test**: Import a valid package into a configured target instance with an empty catalog and verify that all in-scope records, relationships, local catalog customizations, and images match the source instance.

**Acceptance Scenarios**:

1. **Given** a package whose format version and contents pass all pre-import checks and a target instance with no catalog records or catalog images, **When** the administrator imports the package, **Then** all packaged catalog data and images are restored and immediately usable by catalog browsing, searching, filtering, image display, and card matching.
2. **Given** a package created by another ArchiveDex instance and no network access to external catalog or image sources, **When** import begins, **Then** the import completes without those sources, source-instance-specific storage locations are not required, and imported image references point to images managed by the target instance.
3. **Given** any record or image fails validation or restoration, **When** the import cannot complete, **Then** no partial imported catalog remains and the target returns to its pre-import state.
4. **Given** the target already contains an in-scope catalog record or catalog image, **When** the administrator attempts an import, **Then** the system blocks the operation and explains that this version requires a target without existing catalog content.
5. **Given** an import completed successfully, **When** the administrator compares its report with the source export report, **Then** each source catalog identity maps to exactly one target item and all declared category and image counts match.

---

### User Story 3 - Validate and Review a Transfer (Priority: P2)

As the administrator, I see validation, progress, and a final transfer report so I can determine whether an export package is safe to import and whether the restored catalog is complete.

**Why this priority**: Catalog transfers can be large and long-running; clear evidence of completeness prevents silent data loss and makes failures recoverable.

**Independent Test**: Exercise valid, corrupted, incomplete, and incompatible packages and verify that validation occurs before target data changes, progress remains visible during long operations, and the final report accurately describes all processed content and failures.

**Acceptance Scenarios**:

1. **Given** a package has been altered, truncated, or corrupted, **When** the administrator selects it for import, **Then** the system rejects it before changing catalog data or catalog image storage and identifies the failed check, its impact, and the recommended next action.
2. **Given** a package requires a catalog format newer than the target understands, **When** validation runs, **Then** the system rejects it with the required compatibility information and leaves the target unchanged.
3. **Given** an export or import is running, **When** the administrator views its status, **Then** they see the current phase, processed and total item counts, processed image count and size, elapsed time, and any warnings or errors.
4. **Given** an import completes, **When** the administrator views the report, **Then** the report shows package identity, start and finish times, duration, counts by catalog content type, image counts and total size, validation outcome, and completion status.
5. **Given** an export completes or any transfer fails, **When** the administrator views its report, **Then** start and finish times, available validated package details, and available validated counts are shown, and a failure always identifies the failed check, its impact, and the recommended next action.
6. **Given** the administrator uses any supported interface language, **When** they perform an export or import, **Then** all controls, progress information, reports, warnings, and errors use that interface language.

---

### Edge Cases

- The source catalog is empty: export succeeds with a valid empty package, and importing it into an empty target succeeds without creating records or images.
- The export destination lacks sufficient space or becomes unavailable: export fails clearly and no partial artifact is presented as a valid package.
- The target lacks sufficient space for all packaged images: validation blocks import before catalog changes are made.
- The package contains duplicate identities, broken relationships, unaccounted content, content that differs from its package inventory, or content that could affect data or files outside the catalog import: import is rejected before target data or image storage changes.
- The package contains card names or other catalog text in any supported writing system: content survives the round trip without alteration.
- The administrator cancels an export: work stops safely and no partial package is presented as successful.
- The administrator cancels an import: all changes from that import are removed and the target returns to its pre-import state.
- The application restarts during export or import: the interrupted operation is reported as incomplete, no invalid export is offered, and no partial imported catalog becomes available.
- Multiple sessions belonging to the administrator attempt catalog transfer operations at the same time: only one catalog transfer or other catalog-changing operation runs at a time, and conflicting starts are blocked with a clear status message.
- Catalog records reference the same image content more than once: all references remain valid after import without requiring redundant copies in the package.

## Requirements *(mandatory)*

### Functional Requirements

**Access and Scope**

- **FR-001**: The system MUST restrict catalog export and import operations to the authenticated administrator.
- **FR-002**: An export MUST include every catalog set, card print, translation, external source reference, pending catalog mapping, manual catalog record, local catalog correction, catalog image association, catalog image metadata record, and locally stored catalog image present in one consistent source state.
- **FR-003**: An export MUST exclude collection entries, scan and batch-scan records, user credentials, application secrets, deployment settings, operational import history, temporary files, and non-catalog uploaded images.
- **FR-004**: The system MUST produce one self-contained, portable catalog package that does not require network access to external catalog or image sources during import.
- **FR-005**: The package MUST identify its format version, creation time, source application version, package identity, included content categories and counts, total image size, and verification evidence that every packaged data item and image remains unchanged.

**Export**

- **FR-006**: The administrator MUST be able to start a full catalog export and obtain the completed package for transfer to another instance.
- **FR-007**: Export MUST preserve identifiers and relationships needed to recreate the same catalog structure on the target, including links among sets, cards, languages, source references, local customizations, and images.
- **FR-008**: Export MUST preserve catalog text exactly across all represented languages and writing systems.
- **FR-009**: Export MUST verify that every in-scope locally stored image is readable and matches the package's declared content before reporting success.
- **FR-010**: Export MUST fail rather than report success when any required in-scope catalog record or image cannot be included.
- **FR-011**: The system MUST block the start of an export while another catalog transfer or catalog-changing operation is active, and MUST block catalog-changing operations until the export finishes, fails, or is cancelled.
- **FR-012**: Cancelling or interrupting export MUST NOT leave a partial artifact that can be mistaken for a valid completed package.

**Import and Validation**

- **FR-013**: The administrator MUST be able to select a catalog package and request its import into another configured ArchiveDex instance.
- **FR-014**: Before changing target data or image storage, the system MUST validate that the target recognizes the package format version and every required content category, all declared content is present and unchanged, counts and relationships are complete, no content can affect data or files outside the catalog import, and target storage is sufficient.
- **FR-015**: The system MUST reject invalid, corrupted, incomplete, unsafe, or unsupported packages before changing target catalog data or image storage. The error MUST identify the failed check, its impact, and the recommended next action.
- **FR-016**: This feature version MUST allow import only when the target contains neither in-scope catalog records nor catalog image assets; it MUST NOT merge with, update, or replace existing target catalog content.
- **FR-017**: A successful import MUST recreate every packaged catalog record, relationship, local catalog customization, catalog image, and image association on the target.
- **FR-018**: Imported images MUST be managed in the target instance's configured catalog image storage without relying on source-instance file locations.
- **FR-019**: A successful import MUST make the complete imported catalog available together, while failure, cancellation, or interruption MUST leave the target catalog and image storage unchanged from their pre-import state.
- **FR-020**: Import MUST preserve package identities sufficiently for a post-import comparison to confirm that each source catalog item corresponds to exactly one target item.
- **FR-021**: After successful import, catalog browsing, searching, filtering, image display, and card matching MUST work with the restored content without a new external catalog import.
- **FR-022**: The system MUST block another catalog transfer or catalog-changing operation from starting while an import is active.

**Progress and Reporting**

- **FR-023**: During export and import, the system MUST show operation status, current phase, processed and total record counts, processed image count and size, elapsed time, and encountered warnings or errors.
- **FR-024**: Completed and failed operations MUST provide a report containing package identity and content counts when those values can be read and validated, start and finish times, duration, image count and total size when those values can be read and validated, validation outcome, and completion status. Every failure report MUST identify the failed check, its impact, and the recommended next action.
- **FR-025**: The system MUST clearly distinguish packages that are complete and validated from exports that failed, were cancelled, or were interrupted.
- **FR-026**: User-facing transfer controls, status text, reports, warnings, and errors MUST follow the application's existing supported interface languages.

### Key Entities

- **Catalog Transfer Package**: The portable, self-contained representation of one catalog state, including catalog data, images, package identity, version, creation information, content declarations, and integrity information.
- **Catalog Package Inventory**: The administrator-reviewable declaration of included content categories, identities, relationships, counts, image sizes, compatibility information, and evidence that content remains unchanged.
- **Catalog Record**: Any in-scope set, card print, translation, external source reference, pending mapping, manual record, local correction, image metadata record, or image association represented in the package.
- **Catalog Image Asset**: A locally stored set or card image included with its content identity, descriptive metadata, size, and catalog associations.
- **Catalog Transfer Operation**: An export or import attempt with status, phase, progress counts, timestamps, cancellation state, warnings, errors, and final outcome.
- **Catalog Transfer Report**: The administrator-facing evidence of package identity, validation, processed content, images, duration, warnings, failures, and completion status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In round-trip tests, 100% of in-scope catalog records, field values, relationships, local catalog customizations, and image associations on the source have an equivalent target representation after import.
- **SC-002**: In round-trip tests, 100% of locally stored source catalog images are present on the target with identical content and render successfully from their restored catalog records.
- **SC-003**: For catalogs containing up to 100,000 card prints and 25 GB of catalog images, export and import each complete within 60 minutes on a baseline installation with four processing cores, 8 GB of available memory, and storage sustaining 200 MB per second for sequential reads and writes, excluding the time used to move the package between instances.
- **SC-004**: After opening the catalog transfer area, an administrator can start an export or validate and start an import within 2 minutes and with no more than five selections or confirmations, without consulting external documentation.
- **SC-005**: 100% of tested corrupted, truncated, incompatible, or structurally unsafe packages are rejected before any target catalog data or catalog image storage is changed.
- **SC-006**: In 100% of tested import failures, cancellations, and interruptions, the target catalog and image storage contain no content left by the failed attempt.
- **SC-007**: During an active transfer, visible progress is updated at least every 5 seconds or after each completed processing phase, whichever occurs first.
- **SC-008**: In usability testing, at least 90% of administrators can determine from the final report whether a transfer was complete and, after a failure, identify the recommended next action without assistance.

## Assumptions

- ArchiveDex remains a single-administrator, self-hosted application; the existing administrator authentication and supported interface languages are reused.
- "Catalog with all data" means the complete reusable card catalog and its locally stored catalog images, not the administrator account, deployment configuration, collection holdings, scans, batch scans, or operational import history.
- Local catalog corrections, manually created catalog records, external source references, translations, and unresolved catalog mappings are catalog data and therefore are in scope.
- The initial import behavior targets migration to a configured instance with an empty catalog. Merge, overwrite, and selective import into a non-empty catalog are out of scope.
- The source and target may use different deployment settings and storage locations; only package-format compatibility is required.
- A newer target may import an older supported package format. Automatic conversion of a package format newer than the target understands is out of scope and must be rejected safely.
- The administrator is responsible for securely transferring and retaining the package. Package encryption, scheduled exports, incremental exports, cloud destinations, and automatic cross-instance synchronization are out of scope.
- The target has sufficient storage for the complete package contents plus temporary working space; available capacity is checked before target catalog changes begin.
- Transfer performance is measured on the resource baseline stated in SC-003 so results are reproducible across releases.

### Dependencies

- Existing administrator authentication and authorization must be available to protect transfer operations and artifacts.
- Existing localization must provide the application's supported interface languages for transfer controls, status, reports, warnings, and errors.
- Existing catalog persistence and catalog image storage must expose every in-scope record, relationship, and locally stored image and must support restoring them without source-specific storage locations.
- The target must explicitly recognize the selected package's format version and every required content category; otherwise it rejects that package without changes.
- The target must be a configured ArchiveDex instance that contains no existing catalog records or catalog image assets and has enough available storage for pre-import validation and restoration.
