# Feature Specification: Batch Scan & Review

**Feature Branch**: `004-batch-scan-review`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "wir benotigen einen batch scan endpoint und ui Funktion. Wollen mehrere Bilder scannen und spater am Desktop oder mobil die Ergebnisse anschauen evtl korrigieren und dann wirklich im dir Sammlung ubernehmen"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Multiple Card Images as a Batch (Priority: P1)

A user has several Pokemon cards they want to scan. Instead of scanning each card individually with the single-scan flow, they upload multiple images at once (up to 50). The system stores all images, processes OCR on each, and creates a batch with individual scan results. The batch is saved so the user can review it later on any device.

**Why this priority**: This is the entry point for the entire batch workflow. Without batch upload, no other batch feature can work. It replaces the repetitive single-scan loop for users with multiple cards.

**Independent Test**: Can be fully tested by uploading 2-10 card images via the batch upload endpoint/UI and verifying that a batch is created with individual scan jobs in progress.

**Acceptance Scenarios**:

1. **Given** a user is on the scan page, **When** they select 5 card photos and submit them as a batch, **Then** all 5 images are uploaded, a batch scan job is created, and the user receives a batch ID with a summary of the upload status.

2. **Given** a user uploads 20 images, **When** the batch is processed, **Then** OCR runs on each image individually, and the batch status transitions through "Uploading" → "Processing" → "Ready for Review".

3. **Given** a user tries to upload more than 50 images in a single batch, **When** the request is submitted, **Then** the system rejects the upload with a clear message indicating the maximum batch size.

4. **Given** a user uploads a batch containing an invalid file (e.g., a PDF or a file larger than 10 MB), **When** the file is processed, **Then** that individual item is marked as failed with a reason, while the rest of the batch continues processing.

---

### User Story 2 - Review and Correct Batch Scan Results (Priority: P2)

After OCR processing completes, the user opens the batch review page (on desktop or mobile). They see a list of all scanned cards in the batch, each showing the image, the OCR-extracted card details, and the top candidate matches. The user can: view detailed results per card, filter by match status (e.g., "low confidence", "no match"), manually search for a different catalog card if OCR was wrong, flag unclear results for later, and move between cards quickly.

**Why this priority**: Review is the core value-add of the batch flow — it decouples scanning from review, allowing the user to scan on a phone and review on a desktop with a larger screen.

**Independent Test**: Can be fully tested by creating a batch with 3 mock scan results (some correct, some incorrect) and verifying that the user can view each result, correct a match, and navigate between items.

**Acceptance Scenarios**:

1. **Given** a batch with 5 completed scans, **When** the user opens the batch review page, **Then** they see an overview showing all 5 cards as thumbnails with their OCR status (correct/low confidence/failed).

2. **Given** a scan result shows an incorrect card match, **When** the user opens that result's detail view, **Then** they can search the catalog for the correct card and assign it, overwriting the OCR suggestion.

3. **Given** a scan result has low OCR confidence, **When** the user views that item, **Then** the UI clearly indicates low confidence and suggests manual search.

4. **Given** a user has partially reviewed a batch (e.g., reviewed 3 of 8 cards) and closes the page, **When** they return later, **Then** their corrections and review progress are preserved.

5. **Given** a scan result has no viable catalog match, **When** the user reviews it, **Then** they can mark it as "no match" or skip it, excluding it from final acceptance.

---

### User Story 3 - Accept Batch Results into Collection (Priority: P3)

After reviewing and correcting all results, the user decides which cards to accept into their collection. They can select individual cards or accept all at once. For each accepted card, they set collection details (condition, quantity, price, location, notes) individually or apply bulk defaults. Once confirmed, the selected cards are added to the collection and the batch is marked as complete.

**Why this priority**: This is the final step that turns scan results into real collection entries. Without it, the batch has no lasting value.

**Independent Test**: Can be fully tested by taking a reviewed batch with 4 scans and accepting 3 of them into the collection, verifying that 3 new collection entries are created and the rejected scan is excluded.

**Acceptance Scenarios**:

1. **Given** a reviewed batch with 10 scan results, **When** the user selects 8 cards for acceptance and clicks "Add to Collection", **Then** those 8 cards are added as collection entries with the user's specified details, and the batch shows "8 of 10 accepted".

2. **Given** the user accepts cards into the collection, **When** a card already exists in the collection (same CardPrint + same Condition), **Then** the system detects the duplicate and offers to merge quantities or create a separate entry, per existing collection rules.

3. **Given** the user is on the batch acceptance page, **When** they set default values for condition, price, location, and notes, **Then** those defaults are pre-filled for all unset cards in the batch.

4. **Given** a partially accepted batch, **When** a scan result was marked "no match", **Then** it is excluded from acceptance and the user can dismiss it from the batch.

---

### Edge Cases

- What happens when a single image in a batch triggers an OCR timeout? → That item is marked as "Failed — timeout" and the rest of the batch continues.
- What happens when the user uploads duplicate images in the same batch? → The system processes both independently. If two items match the same catalog card, the review page warns the user about the duplicate so they can remove the extra one before acceptance.
- What happens when the batch contains images of non-card objects (e.g., a photo of a carpet)? → OCR may produce low-confidence or nonsense results; the user can mark these as "no match" during review.
- What happens when the user's session expires during batch review? → The batch data persists server-side; the user can resume after re-authentication.
- What happens when the user navigates to the batch review page on a poor mobile connection? → The overview loads with thumbnail placeholders; detailed images load progressively.
- What happens when a batch is abandoned (never reviewed or accepted)? → Batches older than 30 days with no acceptance activity are automatically cleaned up (images deleted, scan data purged).
- What happens when a batch is partially accepted (some items accepted, others not) and left inactive? → The batch is preserved indefinitely since it contains real collection data. Remaining unaccepted items stay in the batch until the user completes or discards the batch.
- What happens when a user tries to start a new batch while one is already active? → The system prompts the user to complete or discard the existing batch before starting a new one.

## Clarifications

### Session 2026-06-20

- Q: Can the user have more than one active batch at a time? → A: Only one active batch allowed — starting a new batch requires completing or discarding the current one.
- Q: Should batch review support filtering/search within the batch list? → A: Filter by status only (e.g., "low confidence", "no match", "needs review") — no text search.
- Q: Should partially accepted batches be cleaned up after 30 days? → A: No — partially accepted batches are preserved indefinitely since they contain real collection data.
- Q: Should the system detect when two batch items match the same catalog card? → A: Yes — detect same-card matches within a batch and warn the user during review/acceptance.
- Q: How is an item marked as "reviewed"? → A: Automatically — an item is considered reviewed once OCR succeeded with high confidence AND the user has viewed its detail page at least once. Items with OCR corrections are also marked reviewed.

## Requirements *(mandatory)*

### Functional Requirements

**Batch Upload**

- **FR-001**: The system MUST provide a batch upload capability that accepts between 2 and 50 card images in a single submission.
- **FR-002**: The system MUST create a batch scan job containing all uploaded images, each as an individual scan item within the batch.
- **FR-003**: The system MUST validate each image in the batch for format (JPEG, PNG, WebP) and size (max 10 MB per image), rejecting individual invalid images while processing valid ones.
- **FR-004**: The system MUST run OCR on each scan item in the batch asynchronously, updating per-item status (Pending → Processing → Complete/Failed) and overall batch status.
- **FR-005**: The batch scan job MUST persist so the user can resume work across sessions and devices.
- **FR-016**: The system MUST allow only a single active batch (not yet Complete) at any time. Starting a new batch requires the current one to be completed or discarded.

**Batch Review**

- **FR-006**: The system MUST provide an endpoint to retrieve a batch with all its scan items, including per-item OCR results and candidate matches.
- **FR-007**: The system MUST provide an endpoint to update a scan item's matched catalog card, allowing the user to override the OCR suggestion with a manually selected card.
- **FR-008**: The system MUST provide an endpoint to mark a scan item as "no match" when no viable catalog card exists.
- **FR-009**: The user MUST be able to view batch review on both desktop and mobile screen sizes, with navigation between scan items optimized for each.
- **FR-010**: The review state (overridden matches, "no match" flags) MUST persist and survive page navigation and session recovery.
- **FR-017**: The batch review page MUST allow filtering items by their match status (e.g., "all", "low confidence", "no match", "needs review", "reviewed") to help users navigate larger batches.
- **FR-018**: The system MUST detect when two or more batch items match the same catalog card and warn the user during review, before acceptance.
- **FR-019**: The system MUST automatically mark a batch item as reviewed when the user opens its detail view and the item has a high-confidence OCR match (mean character confidence ≥ 0.5, per existing single-scan threshold). Items with user-applied corrections are also automatically marked reviewed.

**Batch Acceptance**

- **FR-011**: The system MUST provide an endpoint to accept selected scan items from a batch into the collection in a single operation.
- **FR-012**: The acceptance endpoint MUST accept per-item collection details (condition, quantity, purchase price, storage location, notes) with the option to provide batch-level defaults.
- **FR-013**: The system MUST perform duplicate detection for each accepted card against the existing collection, per existing collection rules (spec 002).
- **FR-014**: The user MUST be able to accept a subset of batch items (partial acceptance), leaving rejected or "no match" items in the batch.
- **FR-015**: The system MUST update the batch status to "Complete" when all items have been either accepted, rejected, or marked "no match".

### Key Entities

- **BatchScanJob**: Groups multiple scan items into a single batch. Attributes: batch ID, overall status (Uploading → Processing → ReadyForReview → PartiallyAccepted → Complete), creation timestamp, item count.
- **BatchScanItem**: A single scan within a batch. Attributes: item ID, parent batch ID, associated image, OCR result (or failure reason), matched catalog card (nullable, initially from OCR, overridable by user), match status (PendingReview / Matched / Overridden / NoMatch / Accepted / Rejected), reviewed flag (automatically set when detail view is opened for a high-confidence match or when a correction is made), collection entry reference (if accepted).
- **BatchScanResult**: The OCR output for a single batch item, mirroring the existing OcrResult structure but linked to the batch item.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can upload a batch of 10 card images in under 30 seconds (upload only, excluding OCR processing time).
- **SC-002**: OCR processing for a batch of 10 cards completes in under 3 minutes on average hardware.
- **SC-003**: Users can review and correct a batch of 10 cards in under 5 minutes (including manual corrections for up to 3 misidentified cards).
- **SC-004**: Users can complete the full batch flow (upload → review → accept) on a mobile device without switching to another tool or application.
- **SC-005**: 90% of batch scan items produce usable OCR results (confidence above threshold or card number correctly identified).
- **SC-006**: Users spend at most 3 clicks/actions per card during batch review (view details, optionally correct, optional status filter).
- **SC-007**: Batch review is usable on screens as narrow as 360px width (mobile phones) without horizontal scrolling.

## Assumptions

- Batch scans use the same OCR pipeline as the existing single-scan flow. No new OCR technology is required.
- The existing scan page serves as the entry point for batch scanning; a dedicated batch review page allows viewing and correcting results.
- The maximum batch size of 50 images balances practical use (a typical card pack has ~10 cards, a booster box has 36 packs) with server resource constraints.
- Batch data older than 30 days with no acceptance activity is cleaned up automatically to prevent storage bloat.
- Users are already authenticated as the admin user; no additional user/permission model is needed.
- Duplicate detection follows the existing rules from spec 002 (same CardPrint + same Condition = duplicate offer).
- The OCR-matching logic (exact number match → fuzzy name match) from the single-scan flow applies identically to batch items.
- Desktop review uses the existing web application interface; no separate desktop app is required.
