# Phase 0 Research: Full Catalog Import

All core decisions for the full catalog import are resolvable from the feature specification, existing project structure, and source clients. No open `NEEDS CLARIFICATION` markers remain.

## D1. Import Operation Surface

- **Decision**: Provide a Web UI at `/admin/import` for starting, monitoring, cancelling, resuming, and reviewing full catalog imports.
- **Rationale**: The import is long-running and requires visibility into source/language progress, errors, warnings, pending mappings, and image quality outcomes. A browser UI fits the existing single-admin self-hosted application model.
- **Alternatives considered**: CLI-only import (useful for automation but less discoverable and harder to inspect); hidden admin endpoint only (insufficient visibility).

## D2. Source Coverage

- **Decision**: Include all implemented catalog sources: TCGdex, Limitless, and Serebii.
- **Rationale**: The feature goal is a complete local database across all available sources. Existing clients already isolate source-specific fetch and parse logic.
- **Alternatives considered**: TCGdex-only first import (simpler MVP, but not a complete multi-source database); manual source import per language (too much user effort).

## D3. Language Coverage

- **Decision**: Import every currently supported source language: TCGdex `en`, `fr`, `es`, `it`, `pt`, `pt-br`, `de`, `nl`, `pl`, `ru`, `ja`, `ko`, `zh-hans`, `zh-hant`, `zh`, `id`, `th`; Limitless `en`, `ja`, `de`, `fr`, `es`, `it`, `pt`; Serebii `en`, `ja`.
- **Rationale**: The user explicitly requested all languages from all sources. Normalizing language codes at the import boundary prevents downstream mismatch.
- **Alternatives considered**: User-selected subset only (still supported as an option, but not the default full import behavior).

## D4. Staging Before Canonical Merge

- **Decision**: Persist source snapshots and checkpoints before merging into canonical catalog tables.
- **Rationale**: Staging enables resumability, dry-run validation, auditability, source-specific error reporting, and safer reconciliation. It avoids direct writes from unstable external responses into canonical records.
- **Alternatives considered**: Direct source-to-canonical upsert (simpler but harder to resume, inspect, or debug).

## D5. Idempotent Reconciliation

- **Decision**: Match by external IDs first, then fallback to deterministic set/card matching, and create pending mappings for ambiguous set matches.
- **Rationale**: A full import must be safe to repeat. External IDs are the strongest identity; fallback is required for cross-source merging; pending mappings avoid destructive false positives.
- **Alternatives considered**: Always create source-specific duplicates (inflates catalog); aggressive fuzzy auto-merge (risks incorrect canonical records).

## D6. Image Handling

- **Decision**: Download image candidates temporarily, score them, permanently store only the best image, and retain metadata for all candidates.
- **Rationale**: This provides high-quality catalog images without caching redundant source copies. Candidate metadata preserves traceability and supports later re-evaluation.
- **Alternatives considered**: Store every candidate (wastes storage); store first source image only (misses better quality); store only URLs (less reliable offline display).

## D7. Price Import

- **Decision**: Defer price import to a later feature.
- **Rationale**: Prices introduce market source selection, currency, condition, freshness, and historical tracking concerns that are separate from catalog completeness.
- **Alternatives considered**: Include prices in the full import (larger scope and higher rework risk).

## D8. Reliability and Progress

- **Decision**: Use persisted import runs, checkpoints, structured errors, and cancellation/resume state.
- **Rationale**: External services can rate-limit, time out, or change formats. The system must continue unrelated work and recover from interruptions without losing progress.
- **Alternatives considered**: Single transaction full import (too fragile and resource-heavy); in-memory progress only (not recoverable).

## D9. Testing Strategy

- **Decision**: Use fixture-backed source adapter tests, reconciliation/idempotency integration tests, image scoring tests, API contract tests, and bUnit Web UI tests.
- **Rationale**: The risky parts are source mapping, merge correctness, idempotency, failure isolation, image selection, and user-facing progress/reporting.
- **Alternatives considered**: Live-source-only tests (flaky and slow); unit-only tests (insufficient for EF and file-system behavior).
