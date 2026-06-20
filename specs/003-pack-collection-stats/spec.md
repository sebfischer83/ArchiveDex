# Feature Specification: Pack Collection Stats & Images in Catalog

**Feature Branch**: `003-pack-collection-stats`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "ich möchte in der catalog Ansicht sehen unter jeden pack, wie viele von x Karten des packs ich schon habe. Auch soll das Bild des packs dargestellt werden"

## Clarifications

### Session 2026-06-20

- Q: How should sets imported before this feature obtain their images? → A: Re-import required — users must re-run the import for sets they want images for; existing data is updated in place.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Collection Progress per Pack (Priority: P1)

As a user browsing the catalog pack/set list, I see under each pack how many distinct
cards from that set I already own out of the total cards available in that set, so I can
quickly gauge my collection completion progress without opening each pack individually.

**Why this priority**: Collection completion is the core motivation for a card collector.
Showing progress per pack at a glance is the primary value-add of this feature and makes the
catalog view immediately actionable.

**Independent Test**: Import a set with 100 cards, add 15 distinct cards from that set to
the collection, open the catalog pack list, and verify the display shows "15/100" for that
pack. No other feature changes are needed to validate this.

**Acceptance Scenarios**:

1. **Given** a catalog set with 100 imported cards and 15 distinct cards owned in the
   collection, **When** I view the catalog pack list, **Then** that pack displays
   "15/100" or equivalent progress indicator.
2. **Given** a catalog set with cards imported but zero owned, **When** I view the catalog
   pack list, **Then** that pack displays "0/[total]" to indicate no cards owned yet.
3. **Given** a collection entry is deleted, **When** I return to the catalog pack list,
   **Then** the owned count for that pack decreases accordingly.
4. **Given** a new card is added to the collection from a pack, **When** I view the catalog
   pack list, **Then** the owned count for that pack increases by one (if the card was not
   already owned from that pack).
5. **Given** I own multiple copies of the same card (quantity > 1), **When** the pack
   progress is calculated, **Then** that card counts as 1 distinct card owned, not as
   multiple (the count reflects distinct cards, not total copies).

---

### User Story 2 - View Pack Image in Catalog (Priority: P1)

As a user browsing the catalog pack list, I see each pack's image displayed alongside
the pack name and stats, so I can identify packs visually and the catalog view is more
engaging and easier to navigate.

**Why this priority**: Visual identification of packs is essential for a card collection
app. Pack images (set logos/symbols) are a standard expectation and make the catalog
immediately recognizable. Combined with progress stats, this delivers the complete
at-a-glance catalog experience the user requested.

**Independent Test**: Import a set with an image available, verify the set image appears
in the catalog pack list. Import a set without an image and verify a placeholder or fallback
is shown instead.

**Acceptance Scenarios**:

1. **Given** a set imported from TCGdex that provides a set image, **When** I view the
   catalog pack list, **Then** the set's image is displayed.
2. **Given** a set has no image (not provided by the source or a manually created set),
   **When** I view the catalog pack list, **Then** a default placeholder image is displayed
   instead of a broken image or empty space.
3. **Given** a set image fails to load (network error, missing file), **When** the page
   renders, **Then** the placeholder fallback is shown and no layout shift occurs.
4. **Given** I switch the UI language, **When** the catalog pack list renders in the new
   language, **Then** pack images remain unchanged (images are not language-dependent).

---

### User Story 3 - Pack-Level Progress Persists Across Sessions (Priority: P2)

As a user, the collection progress per pack remains accurate and up-to-date across browser
sessions and application restarts, reflecting the current state of my collection at all
times.

**Why this priority**: The counts must reflect the actual collection state or the feature
loses trust. This is a data integrity concern rather than a new interaction.

**Independent Test**: Add cards to the collection, restart the application, reopen the
catalog pack list, and verify the counts are preserved and correct.

**Acceptance Scenarios**:

1. **Given** cards have been added to the collection, **When** I restart the application
   and return to the catalog pack list, **Then** the owned counts match the current
   collection state.
2. **Given** the collection is modified in another browser tab (add or delete), **When** I
   refresh or revisit the catalog pack list, **Then** the counts reflect the latest state.

---

### Edge Cases

- Set has zero cards imported (CardCount is 0 or null) — display "0/0" or "—" indicating
  no cards in this set rather than a division-by-zero error.
- Set has cards imported but CardCount metadata is null — total is derived from the actual
  number of cards in the catalog for that set rather than metadata; if the derived count
  cannot be determined, show only the owned count without a denominator.
- User owns all cards from a set (100% completion) — the pack shows "120/120" or similar
  complete indicator; no special celebration behavior is required, just accurate counting.
- Set image URL is a relative path or absolute URL — the display component handles both
  cases correctly (image is loaded from the configured storage or external source).
- Very large set (>1000 cards) — the count query must complete within the same performance
  budget as the pack list load (no noticeable delay).
- Set is deleted from the catalog — the pack no longer appears in the list; any collection
  entries referencing now-deleted cards are excluded from the owned count of remaining
  packs.
- Set was imported before this feature was available — the set has no image stored; a
  placeholder is displayed until the user re-imports that set, at which point the image is
  captured and stored.

## Requirements *(mandatory)*

### Functional Requirements

**Collection Progress Display**

- **FR-001**: The catalog pack/set list MUST display, for each pack, the number of
  distinct cards from that set the user currently owns in their collection.
- **FR-002**: The catalog pack/set list MUST display, for each pack, the total number of
  cards available in that set (CardCount from the Set entity, or the actual count of Card
  records linked to the set if CardCount is null).
- **FR-003**: The owned count MUST count distinct cards only — owning multiple copies
  (quantity > 1) of the same card counts as 1 toward pack completion.
- **FR-004**: The owned count MUST exclude cards belonging to deleted/removed sets.
- **FR-005**: The progress display MUST update when collection entries are added or deleted
  (the next page load or navigation event reflects the current state).

**Pack Image Display**

- **FR-006**: The catalog pack/set list MUST display an image for each pack when one is
  available.
- **FR-007**: When a pack has no image, a default placeholder image MUST be displayed
  instead of a broken image indicator or empty space.
- **FR-008**: Pack images MUST be stored or referenced as part of the Set entity so they
  persist across imports and restarts.
- **FR-009**: During catalog import from TCGdex, the set image (logo/symbol) provided by
  the data source MUST be captured and stored alongside the set metadata, when available.

**Data Integrity**

- **FR-010**: The owned count per pack MUST be derived from the current collection data in
  the database — no cached or pre-computed values that could become stale.
- **FR-011**: The pack image reference MUST survive re-import of the same set (subsequent
  imports MUST NOT delete the image reference if no new image is provided).

### Key Entities *(include if feature involves data)*

This feature modifies one existing entity:

- **Set** (modification): Adds an image reference field to store or link to the pack's
  image. The image may be a URL from the external data source or a local file path if
  downloaded and stored locally. Existing fields used: Id, Name, CardCount, Code.
- **Card** (existing, referenced): Used to calculate total cards per set. Existing field:
  SetId.
- **CollectionEntry** (existing, referenced): Used to calculate owned distinct cards per
  set. Existing fields: CardId (linking to Card, which links to Set).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The catalog pack list loads with progress counts for all packs in under 3
  seconds for a typical catalog (up to 50 sets, each with up to 300 cards, and up to
  10,000 collection entries).
- **SC-002**: Collection progress counts are 100% accurate — the owned count for any pack
  exactly matches the number of distinct cards from that set present in the collection at
  the time of page load.
- **SC-003**: 100% of packs with an available image display that image; 100% of packs
  without an image display the placeholder — no broken image indicators are shown to the
  user.
- **SC-004**: Adding or removing a collection entry and then reloading the catalog pack
  list shows the updated count within the normal page load time (under 3 seconds).
- **SC-005**: A user can visually identify any imported pack by its image alongside its
  name, reducing the time to locate a specific pack (qualitative: user can scan the pack
  list and identify packs by image in under 5 seconds each).

## Assumptions

- The catalog pack/set list view already exists as part of Feature 001 (catalog import and
  browsing). This feature enriches that view with new data without changing its structure.
- "Distinct cards" means one count per unique Card in a Set, regardless of how many copies
  (quantity) the user owns. This matches the common "set completion" use case for
  collectors.
- Pack images are provided by the TCGdex API as set logos/symbols during import. The image
  reference (URL or local path) is stored on the Set entity during import. For manually
  created sets, no image is available unless the user provides one (manual image
  assignment is out of scope for this feature).
- The placeholder image is a static asset shipped with the application; no user
  configuration is needed.
- The progress count display format (e.g., fraction "45/120" or percentage) is a UI detail
  to be decided during implementation planning; the functional requirement is simply that
  both owned and total counts are displayed.
- Out of scope for this feature: filtering or sorting packs by completion percentage,
  detailed completion view (which specific cards are owned vs. missing), and manual upload
  of set images. These may be addressed in future features.
- The existing TCGdex import infrastructure from Feature 001 is assumed to support
  fetching set images as part of set metadata; if not, the import pipeline is extended as
  part of this feature.
