# Research: Direct Add to Collection from Catalog

**Feature**: 002-add-to-collection
**Date**: 2026-06-20

## R1: Modal/Dialog Pattern for Reusable Add Form

**Decision**: Create a dedicated `AddToCollectionDialog.razor` component using a CSS-overlay modal pattern with Blazor event callbacks.

**Rationale**: 
- The feature spec requires the same form to appear as a "dialog" over both the catalog detail page and the catalog card list page. In-page state toggling (the existing pattern in `ScannerConfirm.razor`) works for single-page flows but does not cleanly support reuse across two different pages.
- No existing generic modal/dialog component exists in the codebase. The only `<dialog>` element is the built-in Blazor SSR `ReconnectModal`.
- A dedicated Blazor component with `[Parameter]` callbacks and `RenderFragment`-style content projection allows the same form logic, validation, and submission to live in one place while being invoked from both `CatalogCardView.razor` and `CatalogBrowse.razor`.

**Alternatives considered**:
- **In-page state toggling on each page separately**: Rejected — would duplicate form logic across two pages, violating DRY (Constitution Principle I).
- **Navigate to a dedicated add page**: Rejected — spec requires staying on the same page (FR-007, FR-008).
- **Third-party modal library (e.g., Blazored.Modal)**: Rejected — Constitution Principle IV forbids new dependencies without justification; a simple CSS overlay is sufficient.

**Implementation approach**:
- Component: `ArchiveDex.Web/Components/Shared/AddToCollectionDialog.razor`
- Parameters: `CardPrintId` (Guid), `OnConfirm` (EventCallback), `OnCancel` (EventCallback)
- Uses a CSS overlay (`position: fixed; z-index: 1000`) with backdrop click-to-dismiss
- Uses `InteractiveServer` render mode (same as all page components)
- Follows `ad-` CSS class prefix convention

## R2: Duplicate Detection Strategy

**Decision**: Check for existing `CollectionEntry` with same `CardPrintId` + same `Condition` on the server during form submission, before creating a new entry. When a duplicate is found, return a specific response that the UI interprets to show a choice prompt.

**Rationale**:
- The check must be server-side to prevent race conditions (two browser tabs adding the same card simultaneously).
- EF Core can efficiently query `WHERE CardPrintId = @id AND Condition = @condition` with existing FK index on `CardPrintId`.
- Returning a distinct response code or flag avoids a two-phase submit (pre-check → submit) and keeps the flow simple.

**Alternatives considered**:
- **Client-side pre-check before showing form**: Rejected — stale data risk; another tab could add the card between check and submit.
- **Two-phase API (check endpoint + create endpoint)**: Rejected — adds complexity and an extra round-trip with no UX benefit over the single-request approach.
- **Always create separate entries, warn after**: Rejected — spec requires explicit user choice (FR-010).

**Implementation approach**:
- Application command handler: `CreateCollectionEntryHandler.Handle()`
  1. Receive `CreateCollectionEntry` command with `CardPrintId`, `Condition`, `Quantity`, etc.
  2. Query for existing entry: `repo.FindByCardAndConditionAsync(cardPrintId, condition)`
  3. If found → return `DuplicateDetectedResult` with existing entry summary
  4. If not found → create new `CollectionEntry`, save, return `CollectionEntryDto`
- API handler translates `DuplicateDetectedResult` to HTTP 409 Conflict with the existing entry's details in the response body, enabling the UI to render the merge-vs-separate choice.
- `ICollectionRepository` gets one new method: `FindByCardAndConditionAsync(Guid cardPrintId, CardCondition condition, CancellationToken ct)` → `Task<CollectionEntry?>`

## R3: API Handler Pattern Choice

**Decision**: Follow **Pattern A** (direct repository usage in the API handler) for initial simplicity, with the option to extract an Application-layer command handler later if logic becomes complex.

**Rationale**:
- Existing handlers like `CollectionUpdateHandler.cs` and `ScanConfirmHandler.cs` already use this pattern — calling repositories directly from the API handler.
- The create flow has moderate logic (duplicate check, conditional creation) but remains a single operation that fits cleanly in a static handler method.
- Using an Application-layer command handler (`CreateCollectionEntry.cs`) keeps the API handler thin and enables reuse if the command is ever needed outside the HTTP context.

**Revised Decision**: Use an **Application-layer command handler** (`CreateCollectionEntryHandler`) called from the API handler. This provides:
- Testability: the command handler can be unit-tested independently of HTTP concerns
- Reuse: if the collection create logic is needed in another context (e.g., future bulk add)
- Consistency: matches the pattern used by `CreateCardHandler`, `UpdateCollectionEntryHandler`, etc.

**Implementation approach**:
- `ArchiveDex.Application/Commands/Collection/CreateCollectionEntry.cs`:
  - `CreateCollectionEntry` record (command input)
  - `CreateCollectionEntryResult` — discriminated union: `Created(CollectionEntryDto)` | `DuplicateExists(existingSummary)`
  - `CreateCollectionEntryHandler` static class with `Handle` method
- `ArchiveDex.Api/Handlers/CollectionCreateHandler.cs`:
  - `[WolverinePost("/api/collection")]`
  - Delegates to `CreateCollectionEntryHandler.Handle()`
  - Maps `DuplicateExists` → `Results.Conflict(...)`, `Created` → `Results.Created(...)`

## R4: Form Validation Approach

**Decision**: Use standard Blazor form validation (`EditForm` with `DataAnnotationsValidator`) combined with the existing `CardCondition` enum and client-side input constraints.

**Rationale**:
- Blazor's built-in `EditForm` + `DataAnnotationsValidator` is already used across the application (e.g., setup wizard forms).
- No new validation library needed — `[Required]`, `[Range(1, int.MaxValue)]`, `[Range(0, double.MaxValue)]` cover all validation rules (FR-005).
- The `CardCondition` enum is already defined in `ArchiveDex.Domain.Enums`; the dropdown binds directly to enum values.

**Implementation approach**:
- Form model: private class or record with `[Required] CardCondition Condition`, `[Range(1, int.MaxValue)] int Quantity`, `[Range(0, double.MaxValue)] decimal? PurchasePrice`, optional `string? StorageLocation`, `string? Notes`
- `EditForm` with `OnValidSubmit` → calls `HttpClient.PostAsJsonAsync`
- Disable submit button during submission (prevents double-submit per edge case)
- On HTTP 409 Conflict → show merge/separate choice instead of closing dialog

## R5: Double-Submit Prevention

**Decision**: Disable the submit button immediately on first click and re-enable only on error. Use a boolean `_isSubmitting` flag in the Blazor component.

**Rationale**:
- Simple, no server-side idempotency key needed for this scale.
- Matches the pattern in `ScannerConfirm.razor` (`_isConfirming` flag).
- The duplicate check itself acts as a secondary safeguard — even if two requests slip through, the second will find the first's entry and offer to merge.

## Summary of New Dependencies

None. All implementation uses existing framework features and project conventions.
