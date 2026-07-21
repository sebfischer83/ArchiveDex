# Feature Specification: Multi-Source Catalog Merge

**Feature Branch**: `009-multi-source-merge`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "Alle Quellen (TCGdex, Limitless, Serebii) so kombinieren, dass eine gute und benutzbare Datenbank entsteht. Der Import soll dieses Ziel erreichen: ein logisches Set existiert genau einmal, Kartendaten werden deterministisch aus der jeweils besten Quelle zusammengeführt, Unsicherheiten werden auflösbar statt still zu Duplikaten zu werden."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One Canonical Set Per Logical Set (Priority: P1)

As an administrator, when I import the catalog from all sources in any order and in any language, every logical card set exists exactly once in the database, and all source references for that set point to the same canonical set.

**Why this priority**: Duplicate sets are the single biggest usability failure of the current import. Cards for the same logical set end up scattered across per-source, per-language duplicates, making browsing, searching, and collection tracking unreliable. Fixing set identity is the prerequisite for every other merge improvement.

**Independent Test**: Import the same small group of well-known sets from all three sources in multiple languages, then verify the set count equals the number of logical sets and every source reference resolves to the correct canonical set.

**Acceptance Scenarios**:

1. **Given** an empty catalog, **When** the same logical set is imported from TCGdex (English and German), Limitless, and Serebii, **Then** exactly one canonical set exists and carries one source reference per source and language.
2. **Given** a catalog that already contains a set imported from one source, **When** a second source provides the same logical set under a different external identifier and name, **Then** the import links the incoming data to the existing canonical set instead of creating a new one.
3. **Given** an incoming set that cannot be confidently matched to an existing canonical set, **When** the import processes it, **Then** the set is parked as a pending mapping for review and no uncertain duplicate is created.
4. **Given** a curated cross-source set mapping exists for an incoming set, **When** the import processes that set, **Then** the curated mapping is used without any heuristic guessing.

---

### User Story 2 - Deterministic Best-Value Merge Per Field (Priority: P1)

As an administrator, when multiple sources provide values for the same card, the resulting card always contains the same final values regardless of the order in which sources were imported, following a defined per-field source precedence, and my manual corrections are never overwritten.

**Why this priority**: Today the winning value depends on import order: some fields keep the first value ever seen, others are overwritten by the last source processed. The database quality is therefore accidental. A deterministic merge makes data quality reproducible and explainable.

**Independent Test**: Import the same card data from all sources in different orders into separate test runs and verify the final card fields are identical across runs and match the documented precedence.

**Acceptance Scenarios**:

1. **Given** two sources provide different non-empty values for the same card field, **When** the merge runs in any import order, **Then** the value from the higher-precedence source for that field group wins.
2. **Given** only a lower-precedence source provides a value for a field, **When** the merge runs, **Then** that value fills the gap.
3. **Given** a card has a manual local correction, **When** any import runs, **Then** the corrected fields remain untouched.
4. **Given** a card was merged, **When** an administrator inspects it, **Then** the origin source of each merged field group is visible.
5. **Given** the same import is executed twice without source data changes, **When** the second run completes, **Then** no card field changes (idempotent re-run).

---

### User Story 3 - Reviewable Ambiguities Instead of Silent Failures (Priority: P2)

As an administrator, every set or card the import could not confidently match is recorded as a pending review item that I can resolve in the admin area by assigning it to an existing entity, creating a new one, or dismissing it — and my decision is remembered for all future imports.

**Why this priority**: Ambiguities are unavoidable with scraped and multi-language sources. Today they disappear into log messages, so the data silently degrades. Making them reviewable turns unknown data loss into a manageable queue.

**Independent Test**: Import data engineered to be ambiguous (same normalized name, multiple candidate matches) and verify each ambiguity appears in the review queue with its match candidates and score, and that resolving it applies the decision and persists it for future runs.

**Acceptance Scenarios**:

1. **Given** an incoming set matches multiple existing canonical sets with similar confidence, **When** the import processes it, **Then** a pending mapping with the candidates, score, and reasons is created and the set's cards are not imported into a wrong set.
2. **Given** a pending mapping exists, **When** the administrator assigns it to an existing set, **Then** the parked source data is merged into that set without requiring a full re-import.
3. **Given** a pending mapping was resolved, **When** the same source entity appears in a later import, **Then** the stored decision is applied automatically.
4. **Given** pending mappings exist, **When** an import run completes, **Then** the run summary shows how many items await review.

---

### User Story 4 - Best Available Image Per Entity (Priority: P3)

As a user, each card and set shows the best available image across all sources, chosen by actual image quality rather than by which source happened to be imported first.

**Why this priority**: Images drive the browsing experience, but a wrong image is less harmful than wrong identity or wrong data. Depends on merged identity (User Story 1) to know which candidates belong together.

**Independent Test**: Import an entity whose sources provide images of different resolutions and formats, and verify the highest-quality candidate is selected and recorded with its dimensions.

**Acceptance Scenarios**:

1. **Given** multiple sources provide images for the same card, **When** the import selects an image, **Then** the selection prefers higher resolution over larger file size and records width and height.
2. **Given** an administrator manually selected an image for an entity, **When** later imports run, **Then** the manual selection is kept.
3. **Given** two candidate images are byte-identical, **When** the import analyzes them, **Then** the duplicate is detected and only stored once.

---

### Edge Cases

- A source is temporarily unreachable during import: already-fetched data from other sources is still merged; the run reports the source as incomplete instead of failing entirely.
- A source renames a set (same external identifier, new name): the existing link by external identifier wins; the name change updates the source reference, not the set identity.
- A source removes a set or card that was previously provided: the entity is marked missing from that source but never deleted, because collection entries may reference it.
- Two different logical sets share the same normalized name (reprints, promo sets): release date and card count disambiguate; if still ambiguous, a pending mapping is created.
- Card numbers differ only in formatting between sources ("1", "01", "001"): they are treated as the same number.
- A resolved pending mapping conflicts with a later curated seed mapping: the manual decision wins and the conflict is reported.
- An import is cancelled mid-run: already-merged data remains consistent; re-running continues without creating duplicates.
- The very first import runs on a database that already contains duplicate sets from earlier imports: a one-time cleanup path merges those duplicates without losing collection entries.

## Requirements *(mandatory)*

### Functional Requirements

**Set Identity**

- **FR-001**: The import MUST resolve every incoming set to a canonical set using, in order: an existing source reference, a stored (curated or previously decided) mapping, and only then a similarity heuristic based on normalized name, release date, and card count.
- **FR-002**: The import MUST create a new canonical set only when no existing set matches above the defined confidence threshold and no pending ambiguity exists for the incoming set.
- **FR-003**: The system MUST support a curated seed of cross-source set mappings that links each known set's identifiers across all sources, loaded before heuristic matching is used.
- **FR-004**: The import MUST record every uncertain set match as a pending mapping containing the incoming data, candidate sets, confidence score, and match reasons, and MUST NOT import cards of that set into any canonical set until resolved.

**Card Identity**

- **FR-005**: The import MUST resolve every incoming card to a canonical card print using its source reference first, then set plus normalized card number plus language.
- **FR-006**: Card numbers MUST be normalized consistently everywhere they are stored or compared, so that formatting differences between sources cannot create duplicates.
- **FR-007**: Ambiguous card matches MUST be recorded as reviewable items and excluded from automatic merging.

**Merging**

- **FR-008**: The system MUST merge field values according to a documented per-field-group source precedence, where a higher-precedence source overrides lower-precedence values and lower-precedence sources only fill gaps, independent of import order.
- **FR-009**: Manual local corrections MUST always take precedence over any imported value.
- **FR-010**: The system MUST record, per merged field group, which source supplied the current value.
- **FR-011**: Re-running an import with unchanged source data MUST NOT change any merged value (idempotency).
- **FR-012**: The import MUST fetch and stage source data before merging, so that the merge for an entity sees all selected sources' data for that entity together rather than sequentially.

**Review Workflow**

- **FR-013**: Administrators MUST be able to list pending mappings with their candidates, scores, and reasons in the administration area.
- **FR-014**: Administrators MUST be able to resolve a pending mapping by assigning it to an existing entity, creating a new entity, or dismissing it; the resolution MUST be applied to the parked staged data without a full re-import.
- **FR-015**: Resolutions MUST be persisted as mappings and honored by all future imports.

**Images**

- **FR-016**: Image selection MUST evaluate candidates from all sources for the same entity, measure actual image dimensions, and prefer image quality (resolution, then format) over file size and source order.
- **FR-017**: Manually selected images MUST never be replaced automatically.

**Reporting & Migration**

- **FR-018**: Each import run MUST report, per source: entities added, merged, skipped, conflicting values detected, pending review items created, and errors.
- **FR-019**: A dry run MUST produce the full report without changing any catalog data.
- **FR-020**: A one-time migration MUST merge pre-existing duplicate sets and normalize stored card numbers, preserving all collection entries and manual corrections, with a preview mode before applying.
- **FR-021**: Entities missing from a source MUST be flagged as missing from that source but never automatically deleted.

### Key Entities

- **Canonical Set**: A logical card set, existing exactly once regardless of how many sources or languages provide it; carries the merged set metadata.
- **Canonical Card Print**: A card in a specific set and language; carries merged card data, its field provenance, and links to all source references.
- **Source Reference**: The link between a source's external identifier (per source and language) and a canonical entity; tracks when it was last seen and whether it is missing from the source.
- **Set Mapping**: A persisted decision (curated, automatic above threshold, or manual) that an external set identifier belongs to a specific canonical set.
- **Pending Mapping**: An unresolved match question awaiting administrator review, holding the incoming snapshot, candidates, score, and reasons.
- **Staged Snapshot**: The raw per-source, per-run capture of sets and cards used as merge input and for re-merging after a pending mapping is resolved.
- **Field Provenance**: The record of which source supplied each merged field group of a canonical entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a full import of all sources and languages, at least 99% of logical sets exist exactly once (measured against a curated reference list of known sets); the remainder are visible as pending review items, not duplicates.
- **SC-002**: Importing the same data in different source orders produces byte-identical merged catalog values in 100% of cases.
- **SC-003**: Zero ambiguous matches are silently dropped: every ambiguity detected during an import appears in the review queue or the run report.
- **SC-004**: An administrator can resolve a pending set mapping and see the parked cards appear under the chosen set without starting a new full import.
- **SC-005**: Re-running a full import with unchanged sources changes zero merged field values.
- **SC-006**: The one-time cleanup reduces pre-existing duplicate sets to single canonical sets with zero lost collection entries.
- **SC-007**: A full import of all sources completes within the same order of magnitude of time as today's single-source import (no per-card re-fetch of full set lists).

## Assumptions

- The existing canonical model (language-neutral set, per-language card print, per-source external references, local corrections, translations) remains the target shape; this feature changes how it is populated, not the model's intent.
- Field-group precedence defaults: game data (hit points, attacks, weaknesses/resistances, retreat, stage, evolution, variants, legality, regulation mark) prefers TCGdex, then Limitless, then Serebii; rarity, release dates, and series/era prefer Limitless, then Serebii, then TCGdex; totals prefer TCGdex. The precedence is configuration, adjustable without re-architecting.
- The curated seed mapping covers the known back catalog (~150–200 sets) and is maintained as new sets release; the heuristic plus review queue covers gaps, so seed completeness is an accelerator, not a correctness requirement.
- Serebii remains limited to English and Japanese; TCGdex remains the only source for most non-English languages.
- Pending review is an administrator-only workflow in the existing administration area.
- Collection entries always reference card prints; any duplicate cleanup re-links entries rather than deleting prints that have entries.
