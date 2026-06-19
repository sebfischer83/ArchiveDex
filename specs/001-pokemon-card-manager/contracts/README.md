# API Contracts: ArchiveDex

ArchiveDex exposes a JSON HTTP API (consumed by the Blazor UI and the mobile scanner page) plus
the Blazor UI itself. These OpenAPI fragments define the machine-readable contract surface
(Constitution III: human + machine output). All endpoints except setup require an authenticated
admin cookie; all non-setup endpoints are blocked by the setup gate until setup completes.

| File | Surface | Key requirements |
|------|---------|------------------|
| `setup.openapi.yaml` | First-run setup wizard | FR-001..FR-007 |
| `catalog-import.openapi.yaml` | TCGdex import + catalog search | FR-008..FR-015, FR-009a |
| `scan-ocr.openapi.yaml` | Scanner upload, OCR, match suggestions | FR-016..FR-023 |
| `collection.openapi.yaml` | Collection CRUD | FR-024..FR-028 |

Conventions:
- Errors use RFC 7807 problem+json with localized `title`/`detail` (active UI culture).
- Currency-bearing amounts are numeric; the currency is the single configured
  `CollectionCurrency` (not per-request).
- Card-language data is returned verbatim, never translated to the UI culture.
