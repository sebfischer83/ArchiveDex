# Quickstart Validation: Modern Angular UI Rebuild

## Prerequisites

- .NET 10 SDK
- Node.js LTS version selected by the Angular workspace
- Docker Desktop or compatible Docker engine
- Visual Studio with Container Tools for Docker Compose debugging

## Local Build

```bash
dotnet build ArchiveDex.slnx
dotnet test ArchiveDex.slnx
```

The Web project build produces the Angular browser assets before the server starts. Browse the URL printed by `ArchiveDex.Web`; do not start a separate frontend server.

## Visual Studio Docker Compose Debug Validation

1. Select `docker-compose` / `docker-compose.dcproj` as the startup project in Visual Studio.
2. Start debugging.
3. Confirm the `archivedex.web` container builds the Angular client and hosts the application URL opened by Visual Studio.
4. Open a deep Angular route directly, refresh it, and confirm the same route is restored.
5. Confirm `/api/*` responses remain JSON and are not replaced by the Angular entry document.
6. Before cutover, confirm the Angular preview route does not replace the active Blazor root route.

## Cutover Acceptance Journeys

### Application Shell

1. Open the root route, catalog, collection, scan, import, transfer, administration, account, and setup routes.
2. Confirm responsive desktop/mobile navigation, current-location indication, not-found handling, and access-denied handling.
3. Navigate with keyboard only through shell navigation, a dialog, a form, and a primary action.

### Catalog and Collection

1. Browse, search, filter, and open a catalog card with an image.
2. Add or update a collection entry and verify validation feedback for an invalid value.
3. Confirm loading, empty, and error states are visible where applicable.

### Operations

1. Start or inspect a supported scan, batch scan, catalog import, and catalog transfer.
2. Confirm active progress, warnings/errors, cancel/resume/review actions, and final outcome are visible.
3. Confirm duplicate submissions are blocked while an incompatible operation is active.

### Localization and Authentication

1. Sign in, sign out, and view account information through the new UI.
2. Change each supported interface language.
3. Confirm shell labels, page headings, actions, status text, empty states, and errors use the selected language.

### Cutover and Route Compatibility

1. Verify every screen-inventory entry defines a replacement route and migration behavior.
2. Open each legacy route and verify its configured redirect, guided replacement, or retirement explanation.
3. Record the number of navigation actions from application start to every primary workflow; each must be three or fewer.
4. Run the usability review and retain evidence that at least 90% of participants identify their location, primary action, and error recovery step.

## Expected Results

- No legacy Blazor page is required to complete a primary workflow.
- Every screen inventory entry is marked verified before the old UI is retired.
- The same static client is served by the ASP.NET host in normal, published, and Docker Compose debug runs.
- Browser end-to-end tests and API/host tests pass before cutover.
