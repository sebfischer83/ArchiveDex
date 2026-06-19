# Feature Specification: ArchiveDex — Pokémon Card Collection Manager

**Feature Branch**: `001-pokemon-card-manager`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Single-user, self-hosted Pokémon Card Collection Manager (ArchiveDex) with responsive web UI, mobile scanner page, initial setup wizard, multi-language card catalog, TCG metadata import, server-side OCR-assisted card matching, and personal collection management."

## Clarifications

### Session 2026-06-16

- Q: How should TCGdex catalog import be scoped in v1? → A: By set + card language (user selects which sets and which card languages to import).
- Q: How should card condition be recorded on a collection entry? → A: Fixed grade enum — NM, LP, MP, HP, DMG (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged).
- Q: How should purchase price currency be handled? → A: Single currency configured at setup, applied to all entries.
- Q: What limits should apply to uploaded scan images? → A: Accept JPEG/PNG/WebP, maximum 10 MB per image.
- Q: How should match candidates be ranked? → A: Exact card number match first, then remaining candidates ranked by name similarity (fuzzy match).
- Q: What OCR confidence threshold determines 'low confidence'? → A: Tesseract mean confidence < 50% = low confidence; show retake-recommended indicator.
- Q: When a manual card's number + set + language appears in a later import, what happens? → A: Manual card is kept; the TCGdex source reference is attached to it silently (manual origin wins).
- Q: What happens when user selects zero sets or zero card languages and starts an import? → A: Block the import start with a validation error; at least one set and one card language are required.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Run Setup Wizard (Priority: P1)

As the sole owner of a fresh ArchiveDex installation, I am guided through a one-time setup
wizard the first time I open the application, so the system is configured and secured before
any data is entered. Until setup completes, no other part of the application is reachable.

**Why this priority**: Nothing else can be used safely or correctly without an admin account,
a place to store images, and a working database. This is the gate to every other feature.

**Independent Test**: Launch a clean install, confirm the wizard appears and blocks all other
pages, complete every wizard step, and verify the app transitions to normal operation and the
wizard never appears again.

**Acceptance Scenarios**:

1. **Given** a freshly installed instance with no completed setup, **When** I open any URL,
   **Then** I am redirected to the setup wizard and cannot reach the catalog, collection, or
   scanner pages.
2. **Given** I am on the wizard, **When** I provide a valid administrator username and
   password, default UI language, image storage path, and database choice (embedded or
   external connection), **Then** the system validates each input and lets me advance.
3. **Given** I supply an invalid database connection or an unwritable storage path, **When** I
   try to continue, **Then** the system blocks progress and explains exactly what failed and
   how to fix it.
4. **Given** I complete the final wizard step, **When** I confirm, **Then** setup is marked
   complete, I am signed in as administrator, and reopening the app goes straight to the main
   application rather than the wizard.
5. **Given** setup is already complete, **When** I navigate to the wizard URL, **Then** I am
   redirected away from it.

---

### User Story 2 - Import Card Catalog from TCG Data Source (Priority: P1)

As the user, I import Pokémon card metadata from an external TCG data source (initially
TCGdex) so my local catalog is populated with cards, sets, and per-language details that I can
later match scans against and add to my collection.

**Why this priority**: OCR matching and collection management are only useful if there is a
local catalog to match against and reference. Import is the data foundation for the scan flow.

**Independent Test**: From a configured install, trigger an import for a chosen scope, and
verify cards and sets appear in the local catalog with their language-specific data and are
searchable.

**Acceptance Scenarios**:

1. **Given** a configured install, **When** I start an import from the TCG data source,
   **Then** the system fetches card and set metadata and stores it in the local catalog.
2. **Given** an import is running, **When** I view its progress, **Then** I see status,
   counts of imported/updated/skipped records, and any errors.
3. **Given** an import was previously run, **When** I run it again, **Then** existing records
   are updated rather than duplicated, and my local corrections are preserved (see US6).
4. **Given** the external source is unreachable or returns an error, **When** import runs,
   **Then** the system reports the failure clearly and leaves the existing catalog intact.

---

### User Story 3 - Scan, OCR, Match, and Add to Collection (Priority: P1)

As the user, on my phone I open the mobile scanner page, photograph a physical card, and the
server stores the image, runs OCR, extracts identifying details, and proposes matching cards
from my catalog. I confirm or correct the match, then add it to my collection with condition,
quantity, price, location, and notes.

**Why this priority**: This is the core end-to-end value loop and the product's reason to
exist. It ties together catalog, scanner, OCR, and collection.

**Independent Test**: With a populated catalog, upload a card photo through the scanner page,
and verify the image is stored, OCR output and candidate matches are shown, a confirmed match
is added to the collection, and the stored entry references the uploaded image.

**Acceptance Scenarios**:

1. **Given** a populated catalog, **When** I take or upload a card photo on the scanner page,
   **Then** the image is uploaded and stored on the server and a scan record is created.
2. **Given** an uploaded image, **When** the server runs OCR, **Then** it extracts candidate
   card number, name, card language, and possible set information and displays them.
3. **Given** OCR results, **When** the system searches the catalog, **Then** it presents a
   ranked list of candidate cards, best match first.
4. **Given** candidate matches, **When** none is correct, **Then** I can manually search the
   catalog and select the right card, or flag that no catalog card matches.
5. **Given** I select a card, **When** I confirm with condition, quantity, purchase price,
   location, and notes, **Then** a collection entry is created linked to that card and to the
   stored front image.
6. **Given** OCR returns low-confidence or empty results, **When** I review them, **Then** I
   am never forced to accept an automatic match and can always correct or reject it.

---

### User Story 4 - Browse, Search, and Manage Collection (Priority: P2)

As the user, I browse and search my personal collection and catalog, filtering by card
language, set, name, or number, and I edit or remove collection entries as my holdings change.

**Why this priority**: Once cards are added, the collection must be reviewable and editable to
be worth maintaining; without it the data is write-only.

**Independent Test**: With several collection entries present, search and filter them, open an
entry, edit its fields, and delete an entry, verifying each change persists.

**Acceptance Scenarios**:

1. **Given** collection entries exist, **When** I search or filter by name, number, set, or
   card language, **Then** matching entries are listed.
2. **Given** I open a collection entry, **When** I change condition, quantity, price,
   location, or notes, **Then** the changes are saved and reflected immediately.
3. **Given** a collection entry, **When** I delete it, **Then** it is removed from my
   collection while the underlying catalog card remains.
4. **Given** I hold multiples of the same card, **When** I record quantity, **Then** the
   collection reflects the total count for that card and condition.

---

### User Story 5 - Switch UI Language Independent of Card Languages (Priority: P2)

As the user, I run the interface in my chosen UI culture (German, English, or Russian) while
managing cards in any supported card language, because the language I read the app in is
separate from the language printed on my cards.

**Why this priority**: Localization is required from the start and the UI/card-language
separation is a core distinguishing constraint, but it layers on top of the functional flows.

**Independent Test**: Switch the UI between de, en, and ru and confirm interface text changes,
while a Japanese or Chinese card in the catalog retains its own card-language data unchanged.

**Acceptance Scenarios**:

1. **Given** any supported UI culture is selected, **When** I use the app, **Then** all
   user-facing labels, messages, and errors appear in that culture.
2. **Given** the UI is set to German, **When** I view a Japanese, Korean, or Chinese card,
   **Then** the card's own language data is shown faithfully and is not translated into the
   UI culture.
3. **Given** I change the UI culture, **When** I reload, **Then** my chosen culture persists.
4. **Given** a translation for some text is missing in the active culture, **When** that text
   is shown, **Then** the system falls back to a default culture rather than showing blank.

---

### User Story 6 - Local Corrections and Manually Added Cards (Priority: P3)

As the user, I correct inaccurate imported card data and add cards that the external source
does not have, so my catalog reflects reality even where upstream data is wrong or missing.

**Why this priority**: Valuable for data quality but the core loop functions without it;
it refines rather than enables the experience.

**Independent Test**: Edit an imported card's field and add a brand-new manual card, then run
an import again and verify the correction and the manual card both survive.

**Acceptance Scenarios**:

1. **Given** an imported card with wrong data, **When** I edit it, **Then** my correction is
   stored locally and shown in place of the imported value.
2. **Given** a card missing from the external source, **When** I add it manually with its
   number, name, card language, and set, **Then** it becomes a catalog card usable for
   matching and collection.
3. **Given** local corrections exist, **When** a later import touches the same card, **Then**
   my corrections are preserved and not silently overwritten.

---

### Edge Cases

- Setup wizard is interrupted (browser closed) mid-way — on next launch the wizard resumes and
  no partial configuration enables normal usage.
- Two browser tabs both try to run the setup wizard — only one valid completion is accepted.
- Uploaded scan image exceeds the allowed size or is an unsupported format — upload is rejected
  with a clear message and no scan record is left dangling.
- OCR cannot read any text (blurry, dark, wrong side of card) — user sees an empty/low-
  confidence result and can retake or search manually; no card is added automatically.
- A card photographed in a language present on the card but absent from the catalog — system
  reports no confident match and offers manual search or manual add.
- External import source rate-limits or times out mid-import — partial progress is recorded,
  the failure is reported, and the catalog is left consistent.
- Configured image storage path becomes unwritable after setup — new uploads fail with a clear
  error pointing to storage configuration.
- Duplicate scan of a card already in the collection — user can choose to increment quantity or
  create a separate entry (e.g., different condition).

## Requirements *(mandatory)*

### Functional Requirements

**Initial Setup & Access Control**

- **FR-001**: On first startup with no completed setup, the system MUST present an initial
  setup wizard and MUST block access to all other functionality until setup completes.
- **FR-002**: The setup wizard MUST collect and validate: administrator username and password,
  default UI culture, the collection currency (single currency applied to all purchase prices),
  local image storage path, and database mode (embedded or external connection details).
- **FR-003**: The setup wizard MUST allow configuring optional settings: TCG data import
  settings, OCR settings, and scanner behavior defaults; these MAY be left at defaults.
- **FR-004**: The system MUST persist a flag marking setup as complete and MUST NOT show the
  wizard again once setup is complete.
- **FR-005**: The system MUST validate the database connection and the writability of the
  storage path before allowing setup to complete, reporting actionable errors on failure.
  Setup completion MUST be atomic: the admin account, configuration, and setup-complete flag
  are committed together or not at all; partial completion MUST NOT enable normal usage.
- **FR-006**: The system MUST require authentication as the administrator for all non-setup
  functionality.
- **FR-007**: The administrator password MUST be stored using a secure one-way hash; the
  system MUST never store or display the password in plain text.

**Card Catalog & Import**

- **FR-008**: The system MUST maintain a local catalog of Pokémon cards and sets independent of
  the external source's availability.
- **FR-009**: The system MUST import card and set metadata from an external TCG data source,
  with TCGdex as the initial source, and MUST be designed so additional sources can be added
  later.
- **FR-009a**: The system MUST let the user scope an import by selecting one or more specific
  sets and one or more specific card languages; only the selected set/language combinations are
  imported. The system MUST block import start and display a validation error if zero sets or
  zero card languages are selected.
- **FR-010**: The system MUST report import progress and results, including counts of imported,
  updated, and skipped records and any errors.
- **FR-011**: Re-running an import MUST update existing records (keyed by TCGdex card ID +
  card language) rather than create duplicates. If a manually added card's number, set, and
  card language match an imported record, the manual card MUST be retained and the TCGdex
  source reference attached to it silently; the manual card's data is NOT replaced.
- **FR-012**: The system MUST support card data in multiple card languages — at minimum German,
  English, Japanese, Korean, Simplified Chinese, and Traditional Chinese — stored per card.
- **FR-013**: The system MUST allow the user to edit (locally correct) imported card data and
  MUST preserve those corrections across subsequent imports.
- **FR-014**: The system MUST allow the user to manually add cards not present in the external
  source, including card number, name, card language, and set.
- **FR-015**: The system MUST let the user search and filter the catalog by name, card number,
  set, and card language.

**Scanner, OCR & Matching**

- **FR-016**: The system MUST provide a mobile-friendly scanner page that lets the user take or
  upload a photo of a card.
- **FR-017**: The system MUST upload the scan image to the server and store it at the
  configured storage location, recording its path.
- **FR-018**: The system MUST run OCR on the uploaded image on the server side.
- **FR-019**: OCR processing MUST attempt to extract card number, card name, card language, and
  possible set information from the image.
- **FR-020**: The system MUST suggest a ranked list of matching catalog cards based on OCR
  results using the following priority: (1) exact card number match within a matching set, (2)
  name similarity (fuzzy match) among remaining candidates. Candidates are ordered best first;
  ties broken by name similarity score.
- **FR-021**: The system MUST let the user manually confirm a suggested match, choose a
  different catalog card, or reject all suggestions.
- **FR-020a**: When the OCR engine's mean character confidence is below 50%, the system MUST
  display a "retake recommended" indicator alongside the results. The user may still proceed
  with any result regardless of confidence.
- **FR-022**: The system MUST NOT add any card to the collection without explicit user
  confirmation (no fully automatic recognition).
- **FR-023**: The system MUST accept uploaded scan images in JPEG, PNG, and WebP formats up to
  10 MB each, and MUST reject any upload outside these formats or exceeding the size limit with
  a clear message and no dangling scan record.

**Collection Management**

- **FR-024**: Upon confirmation, the system MUST create a collection entry linked to the chosen
  catalog card and to the stored front image.
- **FR-025**: A collection entry MUST store card condition, quantity, purchase price, storage
  location, free-text notes, and the front image path.
- **FR-025a**: Card condition MUST be recorded using the fixed grade set NM, LP, MP, HP, DMG
  (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged), and MUST be
  filterable by grade.
- **FR-025b**: Purchase price MUST be a numeric amount interpreted in the single collection
  currency configured at setup; the system MUST NOT store a per-entry currency.
- **FR-026**: The system MUST let the user browse, search, filter, edit, and delete collection
  entries.
- **FR-027**: Deleting a collection entry MUST NOT delete the underlying catalog card.
- **FR-028**: The system MUST allow recording multiple copies of the same card via quantity
  and/or separate entries distinguished by condition.

**Localization**

- **FR-029**: The UI MUST support localization and MUST ship with at least the de, en, and ru
  UI cultures from the first version.
- **FR-030**: UI culture MUST be selectable and persist for the user across sessions.
- **FR-031**: UI culture MUST be independent of card language; card-language data MUST be
  displayed faithfully regardless of the active UI culture.
- **FR-032**: When a localized string is missing for the active culture, the system MUST fall
  back to a default culture rather than display empty text.

**Storage & Data**

- **FR-033**: The system MUST store uploaded card images under the user-configured local
  storage path and reference them from collection entries.
- **FR-034**: The system MUST persist all catalog, collection, configuration, and scan data
  durably so it survives application restarts.

### Key Entities *(include if feature involves data)*

- **Administrator**: The single user/owner. Attributes: username, securely hashed password,
  preferred UI culture. Exactly one exists after setup.
- **Application Configuration**: System-wide settings captured at setup and editable later:
  setup-complete flag, default UI culture, collection currency, image storage path, database
  mode, import settings, OCR settings, scanner defaults.
- **Set**: A Pokémon card set/expansion. Attributes: identifier, name (per card language),
  release/series info, card count. Imported or manually added.
- **Card (Catalog Card)**: A distinct card definition. Attributes: card number, name, card
  language, link to set, source reference (e.g., TCGdex id, nullable for manual-only cards),
  origin (Imported | Manual), and any local-correction overlay. A physical printing in a given
  card language. Manual cards retain origin=Manual even when a matching upstream record is
  later imported; the source reference is updated silently (FR-011).
- **Local Correction**: User-supplied overrides for imported card fields, preserved across
  imports and associated with a specific catalog card.
- **Collection Entry**: A card the user owns. Attributes: link to catalog card, condition
  (NM/LP/MP/HP/DMG), quantity, purchase price (numeric, in the configured collection currency),
  storage location, notes, front image reference, date added.
- **Scan Job**: A scanning attempt. Attributes: uploaded image reference, timestamp, status,
  and link to its OCR result and resulting collection entry (if any).
- **OCR Result**: Extracted data for a scan. Attributes: detected card number, name, card
  language, possible set, mean character confidence (0–100), low-confidence flag (true when
  mean confidence < 50), and ranked candidate matches (ordered by: exact number match first,
  then name fuzzy-match score).
- **Import Job**: A catalog import run. Attributes: source, scope (selected sets and card
  languages), status, counts (imported/updated/skipped), errors, timestamps.
- **Image Asset**: A stored uploaded image. Attributes: storage path, format, size, associated
  scan/collection entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can go from a fresh install to a completed setup (admin account +
  storage + database configured) in under 5 minutes without external documentation.
- **SC-002**: Before setup completes, 100% of attempts to reach non-setup pages are redirected
  to the wizard.
- **SC-003**: After a catalog import, the user can find any imported card by name, number, or
  set via search, with relevant results returned in under 2 seconds for a typical catalog.
- **SC-004**: For a clearly photographed card, the correct catalog card appears among the top
  suggested matches in at least 80% of scans.
- **SC-005**: The user can complete the full scan-to-collection flow (photo → stored → OCR →
  confirm → added) for a single card in under 60 seconds on a phone.
- **SC-006**: No card is ever added to the collection without an explicit user confirmation
  (0% automatic additions).
- **SC-007**: Switching the UI culture among de, en, and ru updates all visible interface text,
  with no untranslated placeholder strings shown in the primary flows.
- **SC-008**: Card-language data (e.g., a Japanese card's name) remains displayed in its
  original card language regardless of the active UI culture, in 100% of cases.
- **SC-009**: Local corrections and manually added cards survive a subsequent re-import in 100%
  of cases.
- **SC-010**: All catalog, collection, configuration, and uploaded-image references persist
  across application restarts with no data loss.

## Assumptions

- Single-user, single-tenant: exactly one administrator; no multi-user roles, sharing, or
  public hosting in this version. Privacy relies on the user controlling their own deployment.
- Self-hosted deployment under the user's control; the application is reachable from the user's
  phone (e.g., same network) to use the scanner page.
- "Mobile scanner page" means a responsive web page used from a phone browser; no native mobile
  app is in scope.
- OCR runs on the server and assists matching; it is not expected to be fully accurate, and
  manual confirmation is always required.
- Card languages supported are at least de, en, ja, ko, zh-Hans, zh-Hant; UI cultures are de,
  en, ru. English is the default fallback UI culture unless the user chooses otherwise at setup.
- TCGdex is the initial external metadata source; importer is structured to allow other sources
  later, but only TCGdex is required for v1.
- Image storage is on the local filesystem at a user-configured path; cloud/object storage is
  out of scope for v1. Uploaded scan images are JPEG/PNG/WebP up to 10 MB each.
- Catalog import is scoped by user-selected sets and card languages rather than importing the
  full TCGdex dataset; this keeps first imports fast and storage bounded.
- Card condition uses the fixed grade set NM/LP/MP/HP/DMG; no third-party numeric grading scale
  is supported in v1.
- A single collection currency is chosen at setup and applied to all purchase prices; multi-
  currency holdings and currency conversion are out of scope for v1.
- Out of scope for v1 (non-goals): public multi-user hosting, marketplace integration,
  automatic price tracking, grading-company integration, fully automatic recognition without
  confirmation, native mobile app, and offline/in-browser OCR.
- Network access to the external TCG source is available during import; the app remains usable
  for browsing/scanning against the already-imported catalog when offline.
