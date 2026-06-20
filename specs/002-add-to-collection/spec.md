# Feature Specification: Direct Add to Collection from Catalog

**Feature Branch**: `002-add-to-collection`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "As a user I want to be able to add a card from the catalog, list and detail views to my collection"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add to Collection from Catalog Detail View (Priority: P1)

As a user browsing a card's full detail page, I can trigger an "Add to Collection" action,
fill in the card's condition, quantity, and optional details, and save it directly to my
collection without leaving the detail page.

**Why this priority**: The detail view provides the richest card information, enabling
informed decisions about condition and value. This is the primary path for deliberate,
single-card addition and delivers immediate standalone value.

**Independent Test**: Open any catalog card detail page, click "Add to Collection", fill the
form, and verify the entry appears in the collection. The collection count for that card
increases accordingly.

**Acceptance Scenarios**:

1. **Given** I am viewing a catalog card detail page, **When** I click "Add to Collection",
   **Then** a form dialog appears with fields for condition, quantity, purchase price, storage
   location, and notes, pre-filled with sensible defaults (condition: NM, quantity: 1).
2. **Given** I have filled in the add form, **When** I submit, **Then** a new collection entry
   is created linked to that catalog card, a confirmation is shown, and the dialog closes.
3. **Given** I have filled in the add form with only the required fields (condition and
   quantity), **When** I submit, **Then** the entry is still created with optional fields left
   blank/zero.
4. **Given** I open the add form, **When** I cancel or dismiss it without submitting, **Then**
   no collection entry is created and I remain on the same page.
5. **Given** I submit the form with an invalid value (e.g., negative quantity), **When**
   validation runs, **Then** the form shows an error and does not close until the input is
   corrected.

---

### User Story 2 - Add to Collection from Catalog List/Browse View (Priority: P2)

As a user browsing a set's card list, I can add individual cards to my collection directly
from the list using the same add form, without navigating to each card's detail page first.

**Why this priority**: When adding multiple cards from the same set, navigating to each detail
page is slow. List-level add accelerates bulk entry while reusing the same form and validation
as the detail view.

**Independent Test**: Browse a set's card list, click "Add to Collection" on a specific card
row, fill the form, and verify the entry is created. Repeat for another card in the same list.

**Acceptance Scenarios**:

1. **Given** I am viewing a card list for a set, **When** I click an "Add to Collection"
   trigger on a card row, **Then** the same add form dialog appears as from the detail view.
2. **Given** I submit the form from the list view, **When** the entry is created, **Then** the
   dialog closes and I stay on the list view, ready to add another card.
3. **Given** I open the add form for one card in the list, **When** I cancel and open the add
   form for a different card, **Then** the second form opens with fresh defaults, not
   stale data from the first attempt.

---

### User Story 3 - Duplicate-Aware Addition (Priority: P2)

As a user, when I add a card I already own in the same condition, the system detects the
duplicate and lets me choose whether to increment the existing entry's quantity or create a
separate entry.

**Why this priority**: Without duplicate handling, users can accidentally fragment their
collection across multiple entries for the same card+condition, making inventory tracking
confusing.

**Independent Test**: Add a card in NM condition, then add the same card again in NM condition
and verify the system offers a choice between merging quantities or creating a separate entry.

**Acceptance Scenarios**:

1. **Given** I already own a card in NM condition with quantity 2, **When** I add the same
   card also in NM condition with quantity 1, **Then** the system detects the existing entry
   and offers to increment the existing entry's quantity to 3.
2. **Given** a duplicate is detected, **When** I choose "Create as separate entry", **Then** a
   new collection entry is created alongside the existing one (e.g., same card, same condition,
   but different purchase date or location).
3. **Given** I add a card I already own but in a different condition (e.g., existing LP, new
   NM), **When** I submit, **Then** no duplicate warning is shown and a separate entry is
   created (since condition differs).

---

### Edge Cases

- Card has no catalog image (manual card) — the add form still works; no image is attached to
  the collection entry and the catalog card's missing image is unaffected.
- Submit with quantity zero — rejected by validation; quantity must be at least 1.
- Network error during submission — the form stays open with the filled data intact and an
  error message is shown; the user can retry without re-entering.
- Rapid double-submit (clicking "Save" twice quickly) — the submit button is disabled during
  the request; only one collection entry is created. If a duplicate slips through, the
  duplicate detection on the second request merges it into the first entry's quantity.
- Adding while another browser tab simultaneously deletes the same catalog card — the add
  fails with a clear message that the catalog card is no longer available.
- User has no collection entries yet (fresh install, catalog populated) — the add form works
  the same; no special empty-state behavior needed for the add action itself.

## Requirements *(mandatory)*

### Functional Requirements

**Add Form & Interaction**

- **FR-001**: The catalog card detail page MUST provide an "Add to Collection" action that
  opens a form dialog without navigating away from the detail page.
- **FR-002**: The catalog card list/browse view MUST provide an "Add to Collection" action on
  each listed card that opens the same form dialog.
- **FR-003**: The add form MUST include the following fields: condition (required, default NM),
  quantity (required, default 1, minimum 1), purchase price (optional, default 0, non‑negative
  numeric), storage location (optional, free text), notes (optional, free text).
- **FR-004**: The condition field MUST display the fixed grade set NM, LP, MP, HP, DMG as
  defined by the existing collection domain.
- **FR-005**: The form MUST validate that quantity is a positive integer and purchase price is
  non‑negative before submission.
- **FR-006**: Submitting the form MUST create a collection entry linked to the current catalog
  card with the user‑supplied values.
- **FR-007**: On successful creation, the form MUST close and display a confirmation
  notification (toast or inline message, auto-dismissed after 3 seconds); the user
  MUST remain on the same page (detail or list) they were on.
- **FR-008**: Cancelling or dismissing the form MUST NOT create any entry and MUST return the
  user to the same state they were in before opening the form.

**Duplicate Detection & Handling**

- **FR-009**: Before creating a new entry, the system MUST check whether a collection entry
  already exists for the same catalog card with the same condition.
- **FR-010**: When a duplicate is detected, the system MUST offer the user a choice: increment
  the existing entry's quantity by the submitted quantity, or create a separate new entry.
- **FR-011**: When the user chooses to increment, the existing entry's quantity MUST be
  increased; no new entry is created. The `DateAdded` field retains its original value
  (the entry's creation date is unchanged).
- **FR-012**: When no duplicate exists, or the user chooses to create a separate entry, a new
  collection entry MUST be created.

**Collection Integrity**

- **FR-013**: Creating a collection entry MUST NOT modify, delete, or otherwise affect the
  underlying catalog card.
- **FR-014**: If the referenced catalog card has been deleted between the time the form was
  opened and submission, the system MUST reject the submission with an actionable error message.

### Key Entities *(include if feature involves data)*

This feature uses existing entities defined in Feature 001; no new entities are introduced.

- **Collection Entry** (existing): A card the user owns. Key fields referenced by this
  feature: link to Catalog Card, Condition (NM/LP/MP/HP/DMG), Quantity (≥1), Purchase Price
  (decimal, in the configured collection currency), Storage Location (free text), Notes (free
  text). The Front Image field is optional for direct‑add entries and is not collected by this
  feature's form.
- **Catalog Card / CardPrint** (existing): The catalog definition of a Pokémon card. The add
  form links a new collection entry to this entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a card from the detail view to their collection in under 15
  seconds (from clicking "Add to Collection" to seeing the confirmation).
- **SC-002**: A user can add a card from the list view to their collection in under 20 seconds.
- **SC-003**: Submitting an add form with valid data succeeds on the first attempt in 100% of
  cases where the catalog card exists and no network errors occur.
- **SC-004**: Duplicate detection correctly identifies same‑card‑same‑condition conflicts in
  100% of cases.
- **SC-005**: No catalog card data is modified or deleted as a side effect of creating a
  collection entry (0% catalog mutations).
- **SC-006**: Form validation catches invalid inputs (zero/negative quantity, negative price)
  before submission in 100% of cases.

## Assumptions

- The existing catalog, collection, and card entities from Feature 001 are available and
  stable; this feature adds a new entry point to the collection without changing those models.
- The add form is presented as a dialog or modal overlay; it does not navigate to a separate
  page. The same form component is reused from both the detail and list views.
- Direct‑add entries do not require a user‑supplied front image. The catalog card's stock image
  (if any) serves as the visual reference. Adding photo upload to the direct‑add form is out of
  scope for this feature.
- Purchase price uses the single collection currency configured at setup (Feature 001
  assumption); no per‑entry currency selection.
- The duplicate detection during direct add follows the same logical rule already described
  for the scan flow in Feature 001 (same card + same condition), adapted here to prompt the
  user for merge vs. separate at add time.
- The add action is only available when a catalog card exists; cards cannot be added to the
  collection directly without an underlying catalog entry.
- Out of scope for this feature: bulk multi‑select add from list view, inline quick‑add with
  default values only, editing existing collection entries, deleting collection entries, and
  uploading images as part of the add flow.
