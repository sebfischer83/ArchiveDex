# Quickstart & Validation Guide: ArchiveDex

End-to-end validation that the MVP works. Proves the spec's primary flow (US1–US3) against the
running app. Implementation details live in `tasks.md`; this is a run/validate guide.

## Prerequisites

- Docker + Docker Compose installed.
- Tesseract trained-data files for eng, deu, jpn, kor, chi_sim, chi_tra available to the
  container (mounted volume `./traineddata`).
- A sample card photo (JPEG/PNG/WebP, ≤ 10 MB) on a phone or disk.

## Start the app

```bash
# from repo root
docker compose -f deploy/docker-compose.yml up --build
# app: http://localhost:8080  (Postgres + image/traineddata volumes start with it)
```

For embedded mode, choose SQLite in the setup wizard — no external DB needed; the Postgres
service is only used when "External" is selected.

## Scenario 1 — Setup gate + wizard (US1, FR-001..FR-007)

1. Open `http://localhost:8080/` in a fresh instance.
   - **Expect**: redirected to the setup wizard; visiting `/collection`, `/catalog`, `/scan`
     also redirects to the wizard.
2. Submit an invalid storage path or unreachable DB connection.
   - **Expect**: `POST /api/setup/validate` reports the specific failure; cannot advance.
3. Complete the wizard: admin user/password, default UI culture, collection currency, writable
   image path, DB mode.
   - **Expect**: signed in as admin; reopening `/` shows the app, not the wizard; visiting the
     wizard URL now redirects away.

## Scenario 2 — Scoped catalog import (US2, FR-009a/FR-010/FR-011)

1. Open Import, pick a source (TCGdex), select one or more sets and card languages, start.
   - **Expect**: `202` job; progress shows imported/updated/skipped counts.
2. Search the catalog for an imported card by name/number/set.
   - **Expect**: results in < 2 s (SC-003); names shown in the card's own language.
3. Run the same import again.
   - **Expect**: records updated, not duplicated; any local correction preserved (FR-013).

## Scenario 3 — Scan → OCR → match → add (US3, FR-016..FR-024, SC-004/SC-005/SC-006)

1. On a phone, open `http://<host>:8080/scan`, take/upload a clear card photo.
   - **Expect**: `201` scan job (status Uploaded); image stored under the configured path.
2. Wait for OCR.
   - **Expect**: `GET /api/scans/{id}` returns detected number/name/card-language/set hint and a
     ranked candidate list; for a clear scan the correct card is among the top candidates
     (target ≥ 80%, SC-004).
3. If the top suggestion is wrong, search manually and pick the right card; or reject all.
   - **Expect**: never auto-added (SC-006); rejection adds nothing.
4. Confirm with condition (NM/LP/MP/HP/DMG), quantity, optional price/location/notes.
   - **Expect**: `201` collection entry linked to the chosen card and the stored front image;
     whole flow completes in < 60 s on a phone (SC-005).

## Scenario 4 — UI culture vs card language (US5, FR-031/SC-008)

1. Switch UI culture among de/en/ru.
   - **Expect**: all interface text changes; choice persists across reload; no blank/untranslated
     strings in primary flows (SC-007).
2. View a Japanese/Korean/Chinese card while UI is German.
   - **Expect**: card name stays in its own language, untranslated (SC-008).

## Scenario 5 — Collection management (US4, FR-026/FR-027)

1. Search/filter collection by name, set, card language, condition; edit an entry; delete one.
   - **Expect**: edits persist; deleting an entry leaves the catalog card intact.

## Automated test entry points

- `dotnet test` runs all layers.
- Contract tests assert the OpenAPI fragments in `contracts/`.
- Integration tests cover the setup gate, scoped import upsert, and scan→confirm flow
  (Testcontainers Postgres + SQLite file DB).
