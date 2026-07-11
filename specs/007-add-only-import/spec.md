# Feature Specification: Add-Only Full Catalog Import

**Feature Branch**: `007-add-only-import`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "der komplett Import der Library soll einen Modus bekommen der nur neue Karten hinzufügt"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run an Add-Only Full Import (Priority: P1)

As the administrator, I select an add-only mode when starting a complete catalog import so newly available cards are added without changing cards already present in my catalog.

**Why this priority**: This is the requested core behavior and lets an administrator expand an established catalog without accepting updates to existing card data.

**Independent Test**: Start an add-only import against source data containing one known card and one new card. Verify that the new card is added, the known card is skipped, and the known card and its related catalog data remain unchanged.

**Acceptance Scenarios**:

1. **Given** no catalog import is active, **When** the administrator starts a complete import and selects add-only mode, **Then** the import records that mode and evaluates all selected sources and languages for new cards.
2. **Given** the established identity rules match an incoming card to no card that existed at the start of the run, **When** it is processed in add-only mode, **Then** the card and its card-specific source references, translations, and image information are added.
3. **Given** an incoming card matches an existing card, **When** it is processed in add-only mode, **Then** the card is skipped without changing any existing values, relationships, source references, translations, corrections, or image selection associated with that card.
4. **Given** an add-only import has started, **When** the administrator views or resumes that run, **Then** the run remains in add-only mode and cannot silently change to the normal update behavior.
5. **Given** the administrator starts the existing update-capable mode, **When** changed data for an existing card is processed, **Then** that mode retains its established update behavior.

---

### User Story 2 - Preserve the Existing Catalog (Priority: P1)

As the administrator, I trust that add-only import leaves my established catalog untouched, including manually maintained content, while still creating the minimum supporting catalog records needed by genuinely new cards.

**Why this priority**: Avoiding modifications to existing cards is the defining safety guarantee of add-only mode.

**Independent Test**: Capture all existing catalog data before an add-only import, import fixtures that contain changed versions of existing cards plus cards from existing and new sets, and verify that every pre-existing item is unchanged while only the new cards and their missing prerequisites are created.

**Acceptance Scenarios**:

1. **Given** source data contains changed names, translations, source references, or images for an existing card, **When** add-only import completes, **Then** none of those changes are applied to the existing card.
2. **Given** a new card belongs to an existing set, **When** it is imported, **Then** the card is associated with that set without modifying the set's existing values.
3. **Given** a new card belongs to a set that does not yet exist, **When** the card is imported, **Then** that set and its identity information are created so the new card can be associated with it.
4. **Given** a source no longer returns a card or set that already exists locally, **When** add-only import runs, **Then** the existing item and its source status remain unchanged.
5. **Given** an add-only run has completed successfully, **When** the same source data is imported again in add-only mode, **Then** no additional cards or sets are created and no existing catalog data is changed.

---

### User Story 3 - Review Add-Only Results Before and After Import (Priority: P2)

As the administrator, I can preview and review what an add-only import would add or skip so I can confirm that the operation respected the selected mode.

**Why this priority**: Clear preview and reporting make the preservation guarantee verifiable and help distinguish expected skips from failures.

**Independent Test**: Run an add-only preview and a real import against the same mixed fixture. Verify that the preview changes nothing, both results distinguish new, existing, and failed cards, and the final counts agree with the resulting catalog.

**Acceptance Scenarios**:

1. **Given** the administrator selects preview and add-only mode, **When** the run completes, **Then** it reports which cards would be added or skipped without changing catalog data or images.
2. **Given** an add-only import completes, **When** the administrator reviews its progress or final report, **Then** the selected mode and separate counts for added cards, skipped existing cards, added supporting items, warnings, and errors are visible.
3. **Given** an incoming card cannot be classified reliably as new or existing, **When** it is processed, **Then** it is not added or merged and the report identifies it for review.
4. **Given** the administrator uses any interface language supported by the complete-import workflow, **When** they configure or review an add-only run, **Then** the mode name, explanation, confirmation, progress, warnings, errors, and report fields use that language.

---

### Edge Cases

- The catalog is empty: add-only mode behaves like a complete initial import because every incoming card is new.
- Every incoming card already exists: the run completes successfully with zero added cards and reports all matched cards as skipped.
- The same new card appears in multiple selected sources or languages: it is added once and receives the source references, translations, and image information accepted by the normal new-card rules during that run; conflicting input follows those existing deterministic rules and is reported as a warning.
- A new card belongs to a set that already exists but whose incoming set data differs: the card uses the existing set and the set is not updated.
- A card appears new in an early import phase but is later matched to an existing card: no duplicate is created; the card is skipped or flagged for review if the match is ambiguous.
- A run is cancelled, interrupted, or resumed: completed work follows the same add-only guarantees, and resumption does not reclassify already completed cards as new.
- Processing one new card fails after its previously missing set was identified: the failure is reported, unrelated new cards continue, and the set is retained only if at least one successfully added card uses it; otherwise it is not left in the catalog.
- A new card has no usable image: the card may still be added according to normal full-import rules, and the missing image is reported without changing an existing image.

## Requirements *(mandatory)*

### Functional Requirements

**Mode Selection and Execution**

- **FR-001**: The complete catalog import MUST offer the administrator an explicit add-only mode in addition to its existing update-capable mode.
- **FR-002**: The selected mode MUST be shown before confirmation and recorded for the entire import run, including preview, cancellation, interruption, and resume behavior.
- **FR-003**: Selecting add-only mode MUST NOT change the established behavior of imports started in the existing update-capable mode.
- **FR-004**: Add-only mode MUST process all sources and languages selected through the existing complete-import workflow.
- **FR-005**: Add-only mode MUST support the existing preview capability without changing catalog records or catalog images.

**New and Existing Card Handling**

- **FR-006**: Add-only mode MUST use the complete import's established identity and matching rules to classify an incoming card as existing when exactly one card present at the start of the run is identified, new when no such card is identified, and ambiguous when the rules cannot produce one unique classification; classification MUST occur before applying catalog changes for that card.
- **FR-007**: Add-only mode MUST add each card classified as new, including the source data, language information, and image handling normally accepted when that card is first created.
- **FR-008**: When multiple sources or languages describe the same new card during one run, add-only mode MUST create no more than one canonical card and MUST apply the normal new-card conflict rules to its accepted source references, translations, and image information until that run completes.
- **FR-009**: Add-only mode MUST skip each card classified as existing and MUST NOT change that card's fields, translations, external source references, source-presence status, local corrections, image candidates, selected image, or catalog relationships.
- **FR-010**: Add-only mode MUST NOT delete, deactivate, mark missing, merge, or replace any catalog item that existed before the run.
- **FR-011**: Add-only mode MUST associate a new card with its existing set when the established set identity rules identify exactly one set, without updating that set's values or source-presence status.
- **FR-012**: Add-only mode MUST create a missing set and its identity information when at least one successfully added card belongs to it; it MUST NOT create other shared catalog structures or use set creation to modify an existing catalog item.
- **FR-013**: If the established identity rules do not classify a card uniquely as new or existing, add-only mode MUST leave the catalog unchanged for that card and identify it for administrator review rather than risk a duplicate or update.
- **FR-014**: Repeating add-only import with unchanged source data MUST create no duplicate cards or supporting catalog items.

**Control, Progress, and Reporting**

- **FR-015**: Existing complete-import controls for starting, monitoring, cancelling, and resuming MUST apply to add-only runs.
- **FR-016**: Progress and final reports for add-only runs MUST display the selected mode and separate counts for added cards, skipped existing cards, ambiguous cards, added supporting items, warnings, and errors.
- **FR-017**: An add-only preview MUST classify and report cards using the same rules as a real add-only run.
- **FR-018**: User-facing mode labels, explanations, confirmations, progress, warnings, errors, and report fields MUST be available in every interface language supported by the complete-import workflow.
- **FR-019**: Errors in individual incoming cards MUST remain isolated according to the complete import's existing rules and MUST NOT weaken the prohibition on changing pre-existing catalog content.
- **FR-020**: If no successfully added card uses a set that was missing at the start of the run, add-only mode MUST NOT leave that set in the catalog.

### Key Entities

- **Catalog Import Run**: A complete import attempt whose recorded mode determines whether existing catalog cards may be updated; also carries status, selected sources and languages, progress, and outcome counts.
- **Import Mode**: The administrator's choice between existing update-capable behavior and add-only behavior for one complete import run.
- **Incoming Card**: A card representation received from a selected source and language that is classified before any card-specific catalog change.
- **Existing Catalog Card**: A card present before the add-only run begins; all of its catalog data is protected from changes by that run.
- **New Catalog Card**: A card for which the established identity rules identify no card that existed at the start of the run; it is created once during that run.
- **Supporting Catalog Set**: The set to which a newly added card belongs. An existing set is reused unchanged; a missing set and its identity information are created only when at least one card in that set is successfully added.
- **Add-Only Import Report**: The administrator-facing record of the selected mode and the cards and supporting items added, skipped, flagged, warned about, or failed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Across acceptance tests containing updates for existing cards, 100% of catalog items present before an add-only run retain identical values, relationships, source statuses, corrections, and image associations afterward.
- **SC-002**: Across mixed-source acceptance tests, 100% of cards uniquely classified as new are added exactly once and work in catalog browsing, searching, filtering, image display when an image is available, and card matching under the same conditions as cards created by the normal complete import.
- **SC-003**: Repeating an add-only run with unchanged source data results in zero additional cards, zero additional supporting items, and zero changes to pre-existing catalog content.
- **SC-004**: In 100% of tested ambiguous-match cases, the import creates no duplicate and changes no existing card; each case is visible in the final report.
- **SC-005**: An administrator can select add-only mode, understand that existing cards will remain unchanged, and start or preview the import within 2 minutes and no more than three mode-related selections or confirmations.
- **SC-006**: An add-only run evaluating source data for up to 100,000 card prints completes within 60 minutes on a baseline installation with four processing cores, 8 GB of available memory, and storage sustaining 200 MB per second for sequential reads and writes, excluding delays imposed by external sources.
- **SC-007**: In usability testing, at least 90% of administrators can determine from the final report whether the run used add-only mode and how many cards were added, skipped, ambiguous, or failed without assistance.

## Assumptions

- "Complete import of the library" refers to the existing administrator-operated full catalog import across selected sources and languages, not catalog-package transfer between instances.
- Add-only mode is an additional choice; the existing update-capable import remains the default behavior unless the administrator explicitly selects add-only mode.
- A card is considered existing according to the full import's established canonical identity and matching rules, rather than by comparing display names alone.
- The protection boundary is the catalog state at the start of the run. A card created earlier in the same run may be enriched by additional selected sources or languages so one complete new card is produced instead of duplicates.
- Creating a genuinely new card may require creating its missing set and set identity information. Add-only mode creates no other shared catalog structures, and existing sets are reused without modification.
- Collection entries and local corrections remain protected by the full import's existing guarantees and are never created by add-only catalog import.
- Price import remains outside the scope of the complete catalog import.

### Dependencies

- The existing complete-import workflow must provide administrator access control, source and language selection, preview, cancellation, resume, progress, and reporting.
- The existing card and supporting-item identity rules must be available and deterministic enough to distinguish confident matches from ambiguous matches.
- The existing deterministic import rules for creating a new card, resolving conflicting source data, processing its languages and source references, and selecting its initial catalog image remain authoritative.
- Existing interface-language support must be available for the new mode and report terminology.
