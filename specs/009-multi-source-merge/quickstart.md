# Quickstart: Validating the Multi-Source Catalog Merge

**Feature**: 009-multi-source-merge

## Prerequisites

- Docker (PostgreSQL 16 via `docker-compose up db`)
- .NET 10 SDK; Node for the Angular ClientApp
- Admin account (setup flow) for all endpoints below

```powershell
docker-compose up -d db
dotnet run --project src/ArchiveDex.Web   # serves API + Angular UI
```

Automated checks:

```powershell
dotnet test                                            # all backend suites
npx playwright test --config src/ArchiveDex.Web/ClientApp/playwright.config.ts   # e2e (admin review flow)
```

### Optional DeepSeek mapping advice

DeepSeek is disabled by default. Configure the key outside source control and enable the advisor before starting the app:

```powershell
$env:DeepSeekMappingAdvisor__Enabled = "true"
$env:DeepSeekMappingAdvisor__ApiKey = "your-deepseek-api-key"
dotnet run --project src/ArchiveDex.Web
```

For Docker Compose, use the mapped host variables instead:

```powershell
$env:DEEPSEEK_MAPPING_ENABLED = "true"
$env:DEEPSEEK_API_KEY = "your-deepseek-api-key"
docker compose up --build archivedex.web
```

The default model is `deepseek-v4-flash` through the OpenAI-compatible `https://api.deepseek.com/chat/completions` endpoint. Optional settings live under `DeepSeekMappingAdvisor` in `appsettings.json` (`BaseUrl`, `Model`, `TimeoutSeconds`, `CacheHours`, `MaxCandidates`). The advisor runs only after an uncertain mapping has already been parked. Its response is stored separately from the heuristic suggestion and always requires an administrator to accept it. Missing credentials, timeouts, API failures, invalid JSON, and recommendations outside the supplied candidate list do not fail the import. Existing pending rows can be advised or refreshed with `POST /api/sets/pending/{id}/ai-advice` or the **Ask AI** action in the admin area.

## Scenario 1 — One set, three sources, one canonical set (US1 / SC-001)

1. Start an import limited to one known set's sources: `POST /api/catalog-imports` with `sources: ["TCGdex","Limitless","Serebii"]`, languages `en` + `de` (see [contracts/pending-mappings-api.md](contracts/pending-mappings-api.md)).
2. After completion, query the catalog for the set name.
3. **Expected**: exactly one `CardSet`; its external references contain one row per (source, language) that provides it; no near-duplicate set names in the set list.

## Scenario 2 — Order independence (US2 / SC-002, SC-005)

1. On an empty database, run import order TCGdex → Limitless → Serebii. Export/dump the merged card rows of one set.
2. Reset database; run Serebii → Limitless → TCGdex. Dump again.
3. **Expected**: identical merged values both times; game data from TCGdex, release date from Limitless, provenance visible in `FieldSourcesJson`.
4. Re-run the first import unchanged. **Expected**: report shows 0 changed values (idempotence).

## Scenario 3 — Ambiguity becomes reviewable, resolution re-merges (US3 / SC-003, SC-004)

1. Import a source set engineered (or fixture-mocked) to match two existing sets with similar confidence.
2. **Expected**: no new set created; `GET /api/sets/pending` lists it with score, reasons, candidates; run report `pendingCount` ≥ 1; the set's cards are parked, not imported.
3. Resolve via `POST /api/sets/pending/{id}/accept` with the correct set.
4. **Expected**: parked cards appear under the chosen set without a new import run; a `SetMapping(IsManual=true)` exists; re-running the import applies the decision silently.
5. UI check: admin area shows the pending queue and the accept/create-new/reject actions (Playwright covers this flow).

## Scenario 4 — Best image wins (US4 / FR-016..017)

1. Import an entity whose sources provide a small PNG thumbnail (Serebii) and a high-resolution image (TCGdex).
2. **Expected**: selected `CatalogImageAsset` has real `Width`/`Height` (non-zero) and is the high-resolution candidate; a manually re-selected image survives the next import.

## Scenario 5 — Dry run writes nothing (FR-019)

1. `POST /api/catalog-imports` with `dryRun: true` on a populated database; capture row counts of all catalog tables first.
2. **Expected**: full report (per-source stats, would-be pendings/conflicts) present; all catalog row counts unchanged.

## Scenario 6 — Existing duplicates converge safely (FR-020 / SC-006)

1. On a database containing known pre-existing duplicate sets: `POST /api/catalog-maintenance/duplicate-cleanup` with `preview: true`.
2. **Expected**: plan lists survivor + merged sets and collection re-links; no writes.
3. Execute with `preview: false`; wait for job completion.
4. **Expected**: duplicates merged; `SELECT count(*) FROM "CollectionEntries"` unchanged before/after; no print with collection entries deleted.

## Performance check (SC-007, Constitution IV)

Time a full single-source import (TCGdex `en`) before and after the change on the same dataset; the two-phase pipeline with per-run set-list caching must not exceed the pre-change duration's order of magnitude, and card-detail fetching must show O(sets) — not O(cards) — set-list requests in the import logs (structured log fields exist for request counting).

Validation recorded 2026-07-14:

- `MultiSourceMergePerformanceTests`: 50,000 cards × three source-policy merges completed in **195 ms** on the validation host (linear 150,000 policy operations; 10-second guard budget).
- `AdapterCachingTests` and `TcgDexAdapterTests`: one set-list/detail request per `(source, language, set)` despite repeated card-detail reads, replacing the former one request per card behavior.
- The live full-catalog wall-clock result remains environment/network dependent; reproduce it against a fixed source snapshot before release with the command above so it can be compared to the deployment host's historical single-source duration.

Regenerate the reviewed seed with:

```powershell
dotnet run --project tools/ArchiveDex.SetMappingGenerator -- data/set-mappings.json
dotnet test tests/ArchiveDex.Infrastructure.Tests --filter SeedMappingDataTests
```
