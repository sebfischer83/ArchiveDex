# Research: Add-Only Full Catalog Import

**Feature**: 007-add-only-import | **Date**: 2026-07-11

## Decision 1: Classification Strategy

**Decision**: Perform classification inline within the existing `CatalogReconciler`, but return typed card and set reconciliation results rather than only entities. The results distinguish `Added`, `SkippedExisting`, `Ambiguous`, and `Failed`, and the set result carries the resolved set ID used for card reconciliation.

**Rationale**: The existing identity check (`CardExternalId` lookup by source+language+externalId) provides a match candidate, but returning the entity alone cannot distinguish an add from a skip for correct counts. Typed outcomes keep branching local to reconciliation, let the orchestrator count outcomes accurately, and ensure cards receive the resolved `CardSet.Id` rather than `Guid.Empty`.

**Alternatives considered**:
- *Pre-classification in the orchestrator*: Would require duplicating the external-ID lookup logic or adding a separate classification pass, increasing complexity without benefit.
- *Separate AddOnlyReconciler*: Would duplicate most of `UpsertCardPrintAsync` and `UpsertSetAsync`; the behavior difference is a single early-return branch, not a separate flow.

## Decision 2: Handling `MarkMissingSourceReferences` in Add-Only Mode

**Decision**: Skip `MarkMissingSourceReferencesAsync` entirely when mode is `AddOnly`.

**Rationale**: This method marks existing `CardSetExternalId` and `CardExternalId` records as `IsMissingFromSource` when they are not found in the current source data. This would modify existing catalog items (FR-009, FR-010 prohibit any changes to existing items). Skipping the call preserves the existing source-presence status of all catalog items.

**Alternatives considered**:
- *Call with mode flag to skip updates*: Equivalent to skipping entirely; adds unnecessary parameter plumbing.
- *Only skip card-level marking*: Inconsistent; sets should also be protected.

## Decision 3: Snapshot Creation in Add-Only Mode

**Decision**: Continue creating `SourceCardSnapshot` and `SourceSetSnapshot` records for all incoming items, including those that are skipped.

**Rationale**: Snapshots serve as an audit trail and enable idempotency verification (FR-014). Recording every incoming card/set — even skipped ones — allows the report to account for all processed items and proves the add-only run evaluated the full source data. The snapshot entity does not modify any existing catalog record.

**Alternatives considered**:
- *Skip snapshots for skipped items*: Would lose audit trail; the report would have no evidence that skipped cards were considered.

## Decision 4: Report Count Fields

**Decision**: Add `AddedCount`, `AddedSupportingItemCount`, and `AmbiguousCount` fields to `CatalogImportRun`. Repurpose `SkippedCount` for add-only mode to count existing cards that were skipped. In update mode, `ImportedCount` tracks created cards; `UpdatedCount` and `MergedCount` track modifications. In add-only mode, `AddedCount` counts new cards, `AddedSupportingItemCount` counts created sets, `SkippedCount` counts existing cards bypassed, `AmbiguousCount` counts cards flagged for review, and `UpdatedCount`/`MergedCount` are always zero.

**Rationale**: Dedicated add-only counts avoid semantic ambiguity and satisfy FR-016's separate reporting requirement for cards, supporting items, and ambiguous cards. Existing count fields remain for compatibility with update-mode consumers.

**Alternatives considered**:
- *Separate AddOnly import run entity*: Over-engineered; the run is identical in structure, differing only in behavior.
- *Generic count dictionary*: Loses type safety and makes reporting queries more complex.

## Decision 5: Mode Persistence

**Decision**: Store mode as a `CatalogImportMode` enum column (`int` in PostgreSQL) on `CatalogImportRun`.

**Rationale**: The mode must be immutable for the run's lifetime (FR-002). Storing it as a column alongside the existing JSON-serialized options keeps it in the primary entity, queryable, and visible in status queries without deserializing JSON. EF Core enum-to-int mapping is natively supported. A new migration adds the non-nullable column with a default of `Update` (0).

**Alternatives considered**:
- *Store in SelectedSourcesJson / new JSON column*: Would require JSON deserialization for every status check; loses queryability.
- *Separate mode reference table*: Unnecessary indirection for a two-value concept.

## Decision 6: Fallback Match Handling (Ambiguous Cards)

**Decision**: When `UpsertCardPrintAsync` in AddOnly mode encounters a card where the external ID is not found but the fallback match (`TryFallbackCardMatchAsync`) finds multiple candidates or an ambiguous match, do NOT create or modify any card. Instead, log a warning, record an error with severity "Warning" and code "AMBIGUOUS_CARD", and increment `AmbiguousCount`.

**Rationale**: FR-013 requires leaving the catalog unchanged for cards that cannot be uniquely classified. The existing fallback match is deterministic (set ID + number + language), so ambiguous cases are rare but possible (e.g., duplicate numbers in a set). Treating them as ambiguous rather than creating a duplicate is the safe choice.

**Alternatives considered**:
- *Create anyway and flag*: Violates the non-duplicate guarantee (FR-008, FR-014).
- *Skip silently*: Loses visibility; the administrator must know which cards need review.

## Decision 7: Set Cleanup (FR-020)

**Decision**: Track which sets were created during the run and, after processing completes, delete any set that was created but has no successfully added cards associated with it.

**Rationale**: FR-020 requires that orphaned sets not remain in the catalog. Since a set may be created early in the run but all its cards may fail, a post-processing cleanup pass handles this edge case. The strategy uses an in-memory `HashSet<Guid>` of newly created set IDs; after the run, any set in the set with zero `CardPrint` children is deleted.

**Alternatives considered**:
- *Deferred set creation* (create set only after at least one card succeeds): Requires buffering card data per set, complicates the streaming pipeline.
- *Database trigger*: Introduces hidden behavior; violates the explicit Infrastructure-layer control pattern.

## Decision 8: Localization Strategy

**Decision**: Add resource keys for mode labels, confirmation messages, and report headings to the existing `.resx` files. Provide English (primary), German, and Russian translations.

**Rationale**: FR-018 requires mode labels in all supported interface languages. The project already uses `Microsoft.Extensions.Localization` with three `.resx` files. Adding ~8 new keys is minimal overhead.

**Keys needed**:
- `ImportModeLabel` / `ImportModeUpdate` / `ImportModeAddOnly`
- `ImportAddOnlyExplanation` / `ImportAddOnlyConfirmation`
- `ReportAddedCards` / `ReportSkippedCards` / `ReportAmbiguousCards`
- `ImportModeAddOnlyWarning` (confirmation warning text)
- `ReportAddedSupportingItems`

## Decision 9: Preview Uses Classification Without Mutation

**Decision**: Run the same set/card classification pipeline for dry-run and real add-only imports. Dry-run returns predicted reconciliation results and increments report counts, but does not persist catalog entities, external IDs, source status, or images.

**Rationale**: FR-017 requires preview to use real-run rules. Reusing the classifier prevents preview/report divergence while keeping the existing no-mutation guarantee.

**Alternatives considered**:
- *Counts-only approximation*: Can diverge from real matching behavior and violates FR-017.
- *Run full mutation then roll back*: Risks visible state or filesystem changes and is unsuitable for image handling.

## Decision 10: Performance Evidence

**Decision**: Add an opt-in deterministic 100,000-card benchmark test that records elapsed time, uses no external-source delay, and is run on the documented baseline host outside normal pull-request CI.

**Rationale**: SC-006 is a measurable acceptance requirement. A deterministic fixture and documented execution provide release evidence without making ordinary CI hardware-dependent.

**Alternatives considered**:
- *No automated benchmark*: Leaves SC-006 unvalidated.
- *Run the full benchmark on every pull request*: Makes CI slow and unreliable across variable runners.
