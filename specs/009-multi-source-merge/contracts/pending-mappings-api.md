# API Contracts: Multi-Source Catalog Merge

**Feature**: 009-multi-source-merge | **Date**: 2026-07-14

All endpoints: `Authorize(Policy = "Administrator")`, JSON, existing error-shape conventions (`{ error, code }`).

## Existing — reused unchanged

### `SetMappingController` — `api/sets/pending`

Already implemented and wired to the admin UI; this feature makes the import actually *produce* the rows it lists.

| Method | Route | Behavior (existing) | Contract addition (this feature) |
|---|---|---|---|
| GET | `api/sets/pending?status=Pending` | List `PendingSetMapping`s | Response items gain `score`, `reasons[]`, `candidates[]` (suggested + alternates) populated by the new resolver |
| POST | `api/sets/pending/{id}/accept` | Map to existing set | MUST persist `SetMapping(IsManual=true)` and trigger **re-merge of parked snapshots** for that source identity (FR-014) — no full re-import |
| POST | `api/sets/pending/{id}/create-new` | Create new canonical set | Same re-merge trigger |
| POST | `api/sets/pending/{id}/reject` | Dismiss | Identity recorded as Rejected; future runs skip + count it |
| POST | `api/sets/pending/{id}/relation` | Create `SetRelation` | unchanged |

## Extended

### `CatalogImportController` — `api/catalog-imports`

| Method | Route | Change |
|---|---|---|
| POST | `api/catalog-imports` | Request unchanged (`sources`, `languagesBySource`, `dryRun`, `downloadImages`, `mode`). Semantics: two-phase pipeline; `dryRun` = fetch + report only (FR-019). |
| GET | `api/catalog-imports/{id}` | Run DTO gains `conflictCount`, `pendingCount`, `phase` (`Fetching` \| `Merging`) |
| GET | `api/catalog-imports/{id}/report` | Report gains `perSource[]`: `{ source, language, setsSeen, cardsSeen, added, merged, skipped, conflicts, pendingCreated, errors, incomplete }` (FR-018; `incomplete=true` when source unreachable mid-run) |

## New

### Pending card mappings — `api/cards/pending`

Mirrors the set-pending contract (same UI patterns).

| Method | Route | Request | Response |
|---|---|---|---|
| GET | `api/cards/pending?status=Pending` | — | `[{ id, source, language, externalSetId, externalCardId, incomingName, incomingNumber, cardSetId, cardSetName, candidates: [{ cardPrintId, name, number, reasons[] }], createdAt }]` |
| POST | `api/cards/pending/{id}/assign` | `{ cardPrintId }` | 204; writes `CardExternalId`, re-merges staged data for that card |
| POST | `api/cards/pending/{id}/create-new` | — | 204; creates new `CardPrint` from staged snapshot, links, merges |
| POST | `api/cards/pending/{id}/reject` | — | 204 |

Errors: 404 unknown id; 409 `{ error, code: "ALREADY_RESOLVED" }` if status ≠ Pending; 409 `{ error, code: "IMPORT_ACTIVE" }` if a run is mid-merge.

### Catalog maintenance — duplicate cleanup (FR-020)

| Method | Route | Request | Response |
|---|---|---|---|
| POST | `api/catalog-maintenance/duplicate-cleanup` | `{ preview: bool }` | `preview=true`: 200 `{ groups: [{ survivorSetId, survivorName, mergedSetIds[], relinkedPrints, relinkedCollectionEntries, ambiguous }] }` — no writes. `preview=false`: 202, executes as background job; progress via existing job-status conventions. |

Guards: 409 `IMPORT_ACTIVE` while any import/transfer runs; execution refuses (500-class with explicit code `COLLECTION_SAFETY`) any plan step that would delete a print holding collection entries.

## Contract tests (constitution gate)

- `ArchiveDex.Api.Tests`: one test class per table row above — status codes, response shape, auth policy, 409 guards.
- Re-merge side effects (accept → parked cards appear) covered by integration tests in `ArchiveDex.Infrastructure.Tests`, not by API contract tests.
