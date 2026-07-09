# Feature Specification: Full Catalog Import

**Feature Branch**: `005-full-import`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Entwerfe einen Markdown Plan um einen Gesamtimport vorzubereiten, es soll für alle Sprachen aus allen Quellen die Daten zu einer vollständigen Datenbank verarbeitet werden." Follow-up decisions: prices later; load images during import; determine best image quality; Web UI preferred; only the best image is stored permanently.

## Clarifications

### Session 2026-07-07

- Q: Should prices be included in the full catalog import? → A: No — price import is deferred to a later feature.
- Q: Should images be downloaded during the catalog import? → A: Yes — image candidates are downloaded temporarily for quality analysis.
- Q: Which images should be stored permanently? → A: Only the best-quality image per card or set is stored permanently; non-selected candidates keep metadata only.
- Q: How should the import be operated? → A: Through a Web UI at `/admin/import` with start, cancel, resume, progress, and reporting.
- Q: What should happen when a previously imported source record disappears from that source? → A: Mark the source record as missing, but do not delete existing catalog data.
- Q: How many catalog imports may run at the same time? → A: Only one active import is allowed; starting another import while one is active is blocked.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start a Complete Catalog Import (Priority: P1)

An admin user opens the import administration page and starts a full catalog import across all supported sources and languages. The system fetches source data, persists progress, and continues processing even if individual sets, cards, languages, or sources fail.

**Why this priority**: The application needs a complete card database before OCR matching, collection management, and review workflows can work reliably across languages.

**Independent Test**: Start a dry-run import with fixture-backed TCGdex, Limitless, and Serebii clients. Verify that all configured sources and languages are scheduled, progress is recorded, and source-specific failures do not abort unrelated work.

**Acceptance Scenarios**:

1. **Given** the admin opens `/admin/import`, **When** they select all sources and all languages and starts a dry run, **Then** an import run is created with source/language checkpoints and no canonical data is changed.
2. **Given** a full import is running, **When** one card detail request fails, **Then** the error is recorded for that card and the import continues with the next card.
3. **Given** the import is interrupted, **When** the admin resumes it, **Then** the system continues from the last completed checkpoint instead of starting from scratch.

---

### User Story 2 - Merge Source Data into a Canonical Database (Priority: P1)

The import reconciles sets and cards from multiple sources into canonical `CardSet`, `CardPrint`, external ID, and translation records. Running the import repeatedly must update changed data without creating duplicates.

**Why this priority**: A full import is only useful if all source data merges into a stable canonical model that existing application features can query.

**Independent Test**: Import fixture data for the same set from multiple sources and languages twice. Verify that one canonical set exists, card prints are unique by set/number/language, translations are attached, and external IDs are preserved.

**Acceptance Scenarios**:

1. **Given** TCGdex and Limitless both contain the same set, **When** the import runs, **Then** one canonical `CardSet` is created or updated with external IDs for both sources.
2. **Given** the same card is present in multiple languages, **When** the import runs, **Then** language-specific `CardPrint` or `CardTranslation` records are created without duplicates.
3. **Given** a set cannot be matched confidently, **When** reconciliation runs, **Then** the system creates a pending mapping instead of guessing.
4. **Given** a user has local collection entries or local corrections, **When** import updates catalog data, **Then** those local records are not overwritten or deleted.

---

### User Story 3 - Download and Select the Best Images (Priority: P2)

During import, the system evaluates available image candidates from all sources, chooses the best-quality image for each card or set, and stores only that best image permanently.

**Why this priority**: The catalog should display high-quality card and set images without storing redundant image copies from every source.

**Independent Test**: Provide multiple fixture image candidates with different resolution, aspect ratio, format, file size, and validity. Verify that the highest-scoring image is selected, only it is retained locally, and candidate metadata remains available.

**Acceptance Scenarios**:

1. **Given** three image candidates are available for a card, **When** the image import runs, **Then** all candidates are temporarily downloaded and scored.
2. **Given** one candidate has the best quality score, **When** scoring completes, **Then** only that image is stored permanently and assigned to the card.
3. **Given** non-selected images were temporarily downloaded, **When** selection completes, **Then** temporary files are deleted and only metadata/score is retained.
4. **Given** an image was manually selected by the admin, **When** a later import finds a higher-scoring image, **Then** the manually selected image is not overwritten automatically.

---

### User Story 4 - Monitor and Review Import Results in Web UI (Priority: P2)

The admin user can monitor import progress, errors, warnings, pending mappings, and image quality results through a Web UI.

**Why this priority**: A full import can be long-running and partially manual. The admin needs visibility and control without using direct database access.

**Independent Test**: Start an import with fixture progress updates and errors. Verify the Web UI shows source/language progress, warnings, failed records, pending mappings, and final report.

**Acceptance Scenarios**:

1. **Given** an import is running, **When** the admin opens `/admin/import`, **Then** they see progress grouped by source, language, and set.
2. **Given** the import produced pending mappings, **When** the admin opens the mappings section, **Then** they can identify which source sets require manual resolution.
3. **Given** image scoring completed, **When** the admin opens image quality results, **Then** they can see selected image counts, failed downloads, and unresolved cards without images.
4. **Given** the import completed, **When** the admin opens the report, **Then** they see imported, updated, merged, skipped, error, warning, and image statistics.

---

### Edge Cases

- What happens when a source is temporarily unavailable? -> The source/language checkpoint is marked failed or retryable; other sources continue.
- What happens when a source returns malformed HTML or JSON? -> The affected record is skipped with a structured error.
- What happens when two sets match only by a similar name but different totals or release dates? -> A pending mapping is created.
- What happens when one language is missing for a source? -> The language is marked completed with skipped records or a source-specific warning.
- What happens when an image URL returns an invalid file? -> The candidate is recorded as failed and excluded from selection.
- What happens when all image candidates fail? -> The card or set remains without image and is reported.
- What happens when a full import is run twice? -> Existing records are updated or merged, but no duplicate sets, prints, translations, or external IDs are created.
- What happens when a previously imported source set or card is no longer returned by that source? -> The corresponding source reference is marked as missing, but existing catalog data is not deleted.
- What happens when the admin starts another import while one is already active? -> The new start is blocked until the active import completes, is cancelled, or fails.
- What happens with prices? -> Prices are explicitly out of scope for this feature and will be handled by a later import phase.

## Requirements *(mandatory)*

### Functional Requirements

**Import Setup and Execution**

- **FR-001**: The system MUST provide a Web UI at `/admin/import` to start, monitor, cancel, and resume catalog imports.
- **FR-002**: The import MUST support all currently available sources: TCGdex, Limitless, and Serebii.
- **FR-003**: The import MUST support all currently implemented source languages: TCGdex `en`, `fr`, `es`, `it`, `pt`, `pt-br`, `de`, `nl`, `pl`, `ru`, `ja`, `ko`, `zh-hans`, `zh-hant`, `zh`, `id`, `th`; Limitless `en`, `ja`, `de`, `fr`, `es`, `it`, `pt`; Serebii `en`, `ja`.
- **FR-004**: The import MUST allow selecting sources and languages before starting.
- **FR-005**: The import MUST provide a dry-run mode that fetches and validates data without changing canonical catalog tables.
- **FR-006**: The import MUST persist source/language/set checkpoints so interrupted imports can resume.
- **FR-007**: The import MUST isolate source, language, set, card, and image errors so one failed record does not abort the full import.
- **FR-008**: The import MUST record import statistics: imported, updated, merged, skipped, errors, warnings, and elapsed time.
- **FR-033**: The system MUST allow only one active catalog import at a time; starting another import while one is active MUST be blocked.

**Canonical Merge**

- **FR-009**: The import MUST upsert `CardSet`, `CardSetExternalId`, `CardPrint`, `CardExternalId`, and `CardTranslation` records.
- **FR-010**: The import MUST match existing sets and cards by external IDs before using fallback matching.
- **FR-011**: The import MUST create pending mappings for ambiguous set matches instead of automatically merging uncertain records.
- **FR-012**: The import MUST be idempotent: repeated runs with the same source data MUST NOT create duplicate canonical records.
- **FR-013**: The import MUST preserve existing `CollectionEntry` records.
- **FR-014**: The import MUST preserve existing `LocalCorrection` records and MUST NOT overwrite locally corrected fields automatically.
- **FR-015**: The import MUST normalize source-specific language codes into canonical language codes.
- **FR-016**: The import MUST store translations as additive enrichment and not require every source language to exist for every card.
- **FR-032**: The import MUST mark source references as missing when a previously imported source set or card is no longer returned by that source, and MUST NOT delete canonical catalog records automatically.

**Images**

- **FR-017**: The import MUST collect image candidates from all enabled sources where available.
- **FR-018**: The import MUST temporarily download image candidates for quality analysis.
- **FR-019**: The import MUST compute image metadata including width, height, format, file size, content hash, source, source URL, and decode status.
- **FR-020**: The import MUST compute a deterministic image quality score using this ordering: invalid images excluded first, resolution and expected aspect ratio as primary ranking factors, format and file size as secondary factors, source priority as tie-breaker, and source URL as final stable tie-breaker.
- **FR-021**: The import MUST permanently store only the best image per card or set.
- **FR-022**: The import MUST delete non-selected temporary image files after scoring.
- **FR-023**: The import MUST retain candidate metadata and quality score even when the candidate image file is not stored permanently.
- **FR-024**: The import MUST NOT overwrite manually selected images automatically.

**Web UI and Reporting**

- **FR-025**: The Web UI MUST show progress grouped by source, language, and set.
- **FR-026**: The Web UI MUST show current import status, start time, finish time, and cancellation/resume state.
- **FR-027**: The Web UI MUST show errors and warnings with enough detail to identify source, language, set, and card where available.
- **FR-028**: The Web UI MUST show pending mappings that require manual review.
- **FR-029**: The Web UI MUST show image quality statistics including selected images, failed downloads, cards without images, and candidate counts.
- **FR-030**: The Web UI MUST show a final import report after completion.
- **FR-034**: The Web UI MUST use the existing localization infrastructure for all user-facing labels, status text, errors, and warnings.

**Out of Scope**

- **FR-031**: The import MUST NOT import prices in this feature. Price import is deferred to a later feature.

### Key Entities

- **CatalogImportRun**: A long-running import execution with selected sources/languages, status, counters, timestamps, dry-run flag, and cancellation/resume state.
- **CatalogImportCheckpoint**: Progress marker for source, language, set, and phase.
- **SourceSetSnapshot**: Source-specific set data captured before canonical merge.
- **SourceCardSnapshot**: Source-specific card data captured before canonical merge.
- **SourceImportError**: Structured error or warning from fetch, parse, normalize, merge, or image processing.
- **ImageCandidateMetadata**: Metadata and scoring result for a temporary image candidate.
- **CatalogImageAsset**: The selected permanent catalog image for a `CardSet` or `CardPrint`, distinct from existing scan/upload image assets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A fixture-backed import can process all configured sources and languages without manual database edits.
- **SC-002**: Running the same fixture import twice produces zero duplicate `CardSet`, `CardPrint`, external ID, or translation records.
- **SC-003**: At least 95% of record-level failures are isolated to the affected source/language/set/card and do not stop unrelated import work.
- **SC-004**: The Web UI displays import progress within 5 seconds of a state change being persisted.
- **SC-005**: For fixture images with known dimensions and formats, the selected best image matches expected scoring in 100% of test cases.
- **SC-006**: Non-selected downloaded image candidates are removed from temporary storage after selection.
- **SC-007**: Existing collection entries and local corrections remain unchanged after import integration tests.

## Assumptions

- The application remains single-admin/self-hosted.
- Existing source clients for TCGdex, Limitless, and Serebii are reused.
- PostgreSQL and SQLite remain supported through EF Core.
- The import can be implemented as a hosted/background process started from the Web UI.
- Prices will be added later as a separate import feature.
- Only the best image is stored permanently; non-selected candidate files are discarded after metadata extraction.
