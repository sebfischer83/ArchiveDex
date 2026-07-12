# Feature Specification: Modern Angular UI Rebuild

**Feature Branch**: `008-angular-ui-rebuild`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Plane den Umbau der UI auf eine moderne Angular Web App, diese soll von der Server Anwendung ausgeliefert werden. Nutze moderne UI Frameworks wie Taiga UI. Mache eine klare stringente UI."

## Clarifications

### Session 2026-07-11

- Q: Soll das neue UI schrittweise parallel zum bisherigen UI ausgerollt werden oder alle bisherigen Seiten in einem Release ersetzen? → A: Einmalige Umstellung: Neues UI ersetzt alle bisherigen Seiten in einem Release.
- Q: Umfasst die einmalige Umstellung auch Anmeldung, Konto- und Einrichtungsseiten? → A: Vollständiger Cutover: auch Anmeldung, Konto- und Einrichtungsseiten gehören zum neuen UI.
- Q: Soll der UI-Cutover feste Ladezeitziele haben? → A: Keine feste Zeitvorgabe, nur sichtbares Ladefeedback.
- Q: Muss die neue Oberfläche auch beim lokalen Docker-Compose-Debugging aus der Serveranwendung ausgeliefert werden? → A: Ja, die Anwendung soll beim Debuggen der Docker-Compose-Projektdatei in Visual Studio erstellt und vom Server ausgeliefert werden.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use A Modern Unified Application Shell (Priority: P1)

As an administrator or collection user, I open ArchiveDex and use a consistent, modern application shell with clear navigation, readable layouts, and predictable page structure across catalog, collection, scan, import, and administration workflows.

**Why this priority**: The main value of the redesign is replacing the current fragmented server-rendered experience with one coherent UI foundation that all existing workflows can use.

**Independent Test**: Open the application, sign in if required, navigate between the primary sections, and verify that the layout, navigation, status states, and visual hierarchy remain consistent on desktop and mobile widths.

**Acceptance Scenarios**:

1. **Given** the server application is running, **When** a user opens the application root, **Then** the new web interface is served by the server application without requiring a separate frontend service.
2. **Given** a user is authenticated, **When** they navigate through catalog, collection, scan, import, transfer, and administration areas, **Then** each area is reachable from one clear navigation model.
3. **Given** a user resizes the browser from desktop to mobile width, **When** they continue using the application, **Then** navigation and core page content remain usable without horizontal scrolling or hidden primary actions.
4. **Given** a user lands on an unknown route, **When** the route is not recognized by the UI, **Then** the application presents a clear not-found state with a path back to primary navigation.
5. **Given** a user signs in, manages their account, or completes required application setup, **When** they use the application, **Then** those pages follow the same redesigned visual and interaction system.

---

### User Story 2 - Complete Existing Workflows In The New Interface (Priority: P1)

As an existing ArchiveDex user, I can complete the same essential catalog and collection workflows in the redesigned interface without losing capabilities or changing the meaning of existing operations.

**Why this priority**: The redesign must not be only cosmetic; it must preserve the product's current functional value while improving usability.

**Independent Test**: Execute representative end-to-end flows for browsing the catalog, managing collection entries, starting/reviewing catalog imports, reviewing scan results, and viewing transfer status using only the new interface.

**Acceptance Scenarios**:

1. **Given** catalog data exists, **When** a user browses, searches, filters, and opens card details, **Then** the same core catalog information and images are available in the new interface.
2. **Given** a user manages their collection, **When** they add, edit, or review collection entries, **Then** the workflow remains available with validation and confirmation feedback.
3. **Given** an administrator starts or monitors catalog imports or transfers, **When** they use the new interface, **Then** progress, warnings, errors, and final outcomes remain visible.
4. **Given** a user reviews scan or batch-scan results, **When** they open the new interface, **Then** pending items, matching status, and review actions remain accessible.
5. **Given** an existing backend validation rule rejects a user action, **When** the new interface receives that failure, **Then** the user sees a clear, actionable message and no misleading success state.

---

### User Story 3 - Experience A Clear, Stringent Visual System (Priority: P2)

As a user, I experience a calm, disciplined interface with consistent spacing, typography, controls, empty states, loading states, and feedback messages so I can understand where I am and what to do next.

**Why this priority**: The requested redesign specifically calls for a clear and stringent UI, which requires consistency and polish beyond simply moving pages to a new shell.

**Independent Test**: Review the primary screens and shared UI states against a documented visual standard and verify consistent component usage, responsive behavior, and accessibility expectations.

**Acceptance Scenarios**:

1. **Given** a user opens any primary workflow, **When** page content is loading, empty, successful, warning, or failed, **Then** the interface uses consistent state presentations with meaningful text.
2. **Given** a user interacts with forms, tables, filters, dialogs, and action buttons, **When** controls appear on different pages, **Then** labels, spacing, validation, and disabled states are visually consistent.
3. **Given** a keyboard-only user navigates the application, **When** they move through menus, forms, dialogs, and lists, **Then** focus order, focus visibility, and primary actions remain understandable.
4. **Given** a user changes the supported interface language, **When** they use the redesigned UI, **Then** navigation labels, page headings, actions, feedback, and empty states appear in that language where existing translations are available.

---

### Edge Cases

- The backend is reachable but a requested dataset is empty: the UI shows a useful empty state and a next action rather than a blank page.
- A long-running operation is active: the UI shows current status and prevents duplicate conflicting submissions.
- A network request fails or times out: the UI shows retry or recovery guidance without losing entered form data where possible.
- The user opens a deep link directly: the server-delivered UI loads and restores the intended route when the user has access.
- The user lacks permission for an area: the UI shows an access-denied state and does not expose restricted actions.
- Existing saved URLs or bookmarks target old UI paths: users are guided to the corresponding new location where a direct equivalent exists.
- Large catalog or collection lists are viewed: the UI remains responsive and presents clear loading/progress feedback.

## Requirements *(mandatory)*

### Functional Requirements

**Application Delivery and Navigation**

- **FR-001**: The server application MUST deliver the redesigned web interface as the sole primary user interface for ArchiveDex after one production cutover.
- **FR-002**: The redesigned UI MUST provide one consistent application shell with primary navigation for catalog, collection, scanning, import, transfer, and administration areas.
- **FR-003**: The redesigned UI MUST support direct links and browser refreshes for routable application screens without requiring a separate frontend service to be running.
- **FR-004**: The redesigned UI MUST preserve authentication and authorization behavior for all existing protected workflows.
- **FR-005**: The redesigned UI MUST provide clear not-found and access-denied states with navigation back to allowed areas.

**Workflow Preservation**

- **FR-006**: Users MUST be able to browse, search, filter, and open catalog card details from the redesigned UI.
- **FR-007**: Users MUST be able to view and manage collection entries from the redesigned UI with validation feedback for rejected actions.
- **FR-008**: Users MUST be able to review scan and batch-scan items, including match status and available review actions, from the redesigned UI.
- **FR-009**: Administrators MUST be able to start, monitor, cancel, resume, and review catalog imports from the redesigned UI where those actions are currently available.
- **FR-010**: Administrators MUST be able to use catalog transfer workflows from the redesigned UI where those workflows are currently available.
- **FR-011**: The redesigned UI MUST not remove or silently change the business meaning of existing user actions.

**Visual System and Usability**

- **FR-012**: The redesigned UI MUST use a consistent component system for navigation, forms, tables, cards, dialogs, alerts, buttons, empty states, loading states, and confirmations.
- **FR-013**: The redesigned UI MUST present a clear visual hierarchy on every primary page, including page title, primary action, secondary actions, content region, and feedback region where applicable.
- **FR-014**: The redesigned UI MUST support desktop and mobile browser widths for all primary workflows.
- **FR-015**: The redesigned UI MUST provide keyboard-accessible navigation, dialogs, forms, and primary actions.
- **FR-016**: The redesigned UI MUST preserve existing interface-language support for navigation, page headings, actions, feedback messages, and workflow status text.
- **FR-017**: The redesigned UI MUST show clear loading, empty, success, warning, and error states for primary workflows.

**Migration and Compatibility**

- **FR-018**: Existing user data, catalog data, collection data, imports, transfers, scans, and settings MUST remain compatible with the redesigned UI.
- **FR-019**: Existing backend validation and error messages MUST be surfaced in a user-understandable way without exposing unnecessary technical detail.
- **FR-020**: The redesigned UI MUST provide a migration path for old user-facing routes by redirecting or guiding users to corresponding new screens where a direct equivalent exists.
- **FR-021**: The visual redesign MUST be delivered with a documented screen inventory covering all primary current UI areas before the old UI is retired.
- **FR-022**: The production cutover MUST replace all current user-facing pages in scope with the redesigned UI; the previous UI MUST not remain available as a parallel user workflow after a successful cutover.
- **FR-023**: The redesigned UI MUST include sign-in, account, and required application-setup pages in the same visual and interaction system as authenticated workflows.
- **FR-024**: The server application MUST deliver the same redesigned UI when the application is started through the supported local containerized debugging workflow, without requiring a separately started frontend service.

### Key Entities

- **Application Shell**: The persistent top-level interface containing navigation, user/session context, layout regions, and global feedback.
- **Primary Workflow Screen**: A user-facing screen that supports catalog browsing, collection management, scan review, import, transfer, or administration work.
- **Navigation Item**: A primary or secondary entry point that routes users to a workflow screen and communicates current location.
- **UI State**: A standardized presentation for loading, empty, success, warning, error, access-denied, and not-found conditions.
- **Screen Inventory**: The migration record mapping existing UI areas and user-facing routes to redesigned screens.
- **Design System Rule**: A documented reusable rule for visual hierarchy, spacing, typography, controls, and interaction feedback.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of primary current user workflows listed in the screen inventory are reachable in the redesigned UI before the old UI is retired.
- **SC-002**: At least 95% of representative catalog, collection, scan review, import, transfer, and administration journeys can be completed successfully in acceptance testing using only the redesigned UI.
- **SC-003**: Users can reach any primary workflow from application start in no more than three navigation actions on desktop and mobile widths.
- **SC-004**: 100% of primary workflow screens provide visible loading, empty, and error states where those states can occur.
- **SC-005**: Keyboard-only acceptance testing can complete the representative journeys without blocked primary actions.
- **SC-006**: In usability review, at least 90% of participants can identify their current section, the primary action, and the next recovery step after an error without assistance.
- **SC-007**: 100% of primary application loads and route changes that enter a loading state display meaningful progress or loading feedback until the requested content, empty state, or error state is available.

## Assumptions

- The requested Angular-based rebuild and Taiga UI preference are explicit technology constraints for planning; this specification defines the user-visible outcomes and boundaries.
- The server application remains the single deployable entry point for users and serves the redesigned interface.
- The supported local containerized debugging workflow builds the redesigned UI and serves it through the server application.
- Existing backend capabilities, permissions, data models, and workflows remain authoritative; this feature changes the UI experience, not business rules.
- The redesigned UI replaces the current user-facing web UI in one production cutover after parity is proven through the screen inventory and acceptance tests.
- Sign-in, account, and required application-setup pages are included in the cutover scope rather than retained as server-rendered exceptions.
- Existing supported interface languages remain the supported localization scope for the redesigned UI.
- Native mobile applications are outside this feature; responsive browser use is in scope.
