# Screen Inventory: Modern Angular UI Rebuild

**Feature**: 008-angular-ui-rebuild | **Date**: 2026-07-11

## Route Mapping and Parity Status

| Legacy Route | Replacement Route | Migration Behavior | Workflow | Status | Acceptance Journey |
|---|---|---|---|---|---|
| `/` | `/` | Redirect gate (setup check → /setup or /catalog) | Shell | Verified | Shell boot + session guard |
| `/setup` | `/setup` | Identical path | Setup | Verified | Setup completion flow |
| `/sign-in` | `/sign-in` | New dedicated route (was server-side) | Authentication | Verified | Sign-in with session recovery |
| `/account` | `/account` | Identical path | Account | Verified | Account + password update |
| `/not-found` | `/not-found` | Identical path | Error states | Verified | Shared states component |
| `/access-denied` | `/access-denied` | Identical path | Error states | Verified | Role-guarded redirect |
| `/catalog` | `/catalog` | Identical path | Catalog browse | Verified | Set/card list with search |
| `/catalog/card/{Id:guid}` | `/catalog/card/:id` | Persisted identifier, inline detail | Catalog detail | Verified | Card detail with attacks/stats |
| `/catalog/transfer` | `/transfer` | Redirect to transfer (admin-only) | Catalog transfer | Verified | Export/import operations |
| `/import` | `/import` | Identical path | Catalog import | Verified | Full + selective import |
| `/collection` | `/collection` | Identical path | Collection | Verified | Entry list + create/delete |
| `/collection/card/{Id:guid}` | `/collection/card/:id` | Persisted identifier, inline detail | Collection detail | Verified | Entry detail view |
| `/scan` | `/scan` | Identical path | Scan | Verified | Single scan upload + OCR |
| `/scan/result` | `/scan` (inline) | Inline OCR results | Scan results | Verified | OCR candidate selection |
| `/scan/confirm/{CardId:guid}` | `/scan` (inline) | Inline confirmation | Scan confirm | Verified | Confirm → collection |
| `/scan/batch/review/{BatchId:guid}` | `/batch-scan/:batchId` | Direct replacement with batch ID | Batch scan review | Implemented | T036 batch-scan component |
| `/scan/batch/accept/{BatchId:guid}` | `/batch-scan/:batchId` (accept-all action) | Consolidated into batch-scan route | Batch accept | Implemented | T036 batch-scan component |
| `/admin/import` | `/import` (admin tab) | Consolidated under import | Admin import | Verified | Admin-only import tab |
| `/design` | Not migrated | Retired (dev tool only) | Dev | N/A | N/A |

## Unretired Blazor Pages

The following Blazor pages remain active until the production cutover phase:

- `Home.razor`, `Setup/Setup.razor`, `NotFound.razor`, `Catalog/CatalogBrowse.razor`, `Catalog/CatalogCardView.razor`, `Catalog/Transfer.razor`, `Catalog/Import.razor`, `Collection/CollectionPage.razor`, `Collection/CollectionCardView.razor`, `Scanner/ScannerHome.razor`, `Scanner/ScannerResult.razor`, `Scanner/ScannerConfirm.razor`, `Scanner/BatchReview.razor`, `Scanner/BatchAccept.razor`, `Admin/ImportAdmin.razor`
- `Components/Layout/MainLayout.razor`, `Components/Pages/DesignPreview.razor`

## Post-Cutover Retirement

All Blazor pages, layouts, scanner session state (`Services/ScannerSession.cs`), and UI-only static assets under `wwwroot/` will be removed during `T049`. Only static Angular assets and retained server API controllers remain.
