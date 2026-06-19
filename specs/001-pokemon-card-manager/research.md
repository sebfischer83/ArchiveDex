# Phase 0 Research: ArchiveDex

All Technical Context items were resolvable from the spec, clarifications, and the
recommended stack; no open NEEDS CLARIFICATION remain. Decisions and rationale below.

## D1. Frontend framework

- **Decision**: Blazor Web App (.NET 9) with InteractiveServer render mode.
- **Rationale**: Solo developer on a .NET backend; one language, shared DTOs/validation,
  server-side routing makes the setup gate and cookie auth trivial. OCR is server-side, so the
  client needs no heavy compute. Single-user scale doesn't justify SPA complexity. Server
  render keeps mobile payload light vs WASM.
- **Alternatives considered**: Blazor WASM (large client payload, separate authenticated API —
  rejected); Angular SPA + API (second toolchain, token auth, CORS, duplicated types — rejected,
  no benefit at this scale).

## D2. Database: external + embedded modes

- **Decision**: EF Core 9 with a provider switch selected in the setup wizard — Npgsql for
  PostgreSQL (external) and `Microsoft.EntityFrameworkCore.Sqlite` for embedded mode.
- **Rationale**: Spec FR-002 requires "embedded or external" choice. EF Core abstracts both;
  one model, provider-specific migrations. SQLite covers zero-dependency embedded; PostgreSQL
  covers durable/external. Provider chosen at setup, persisted to config, bound at startup.
- **Caveats**: Keep two migration assemblies/paths (one per provider) — EF Core migrations are
  provider-specific. Avoid provider-specific SQL in queries; use LINQ. Case-insensitive search
  handled per provider (Postgres `citext`/`ILIKE`, SQLite `NOCASE` collation).
- **Alternatives considered**: Single-provider Postgres only (violates embedded requirement);
  LiteDB/raw SQLite (loses EF tooling and the unified model).

## D3. OCR engine

- **Decision**: Tesseract via the `Tesseract` .NET wrapper over native libtesseract, with
  language packs eng, deu, jpn, kor, chi_sim, chi_tra mounted on the filesystem.
- **Rationale**: Spec mandates server-side Tesseract. Wrapper is mature; language packs map
  1:1 to required card languages. Card-language hint (when known from scanner default or user
  selection) selects the trained-data set to improve accuracy.
- **Budget**: target < 8 s per image including preprocessing on a typical self-host CPU; this
  supports the < 60 s end-to-end flow (SC-005) with human confirmation time.
- **Alternatives considered**: Cloud OCR (violates self-hosted/privacy intent); in-browser OCR
  (explicit non-goal).

## D4. Image preprocessing (optional)

- **Decision**: OpenCvSharp4 preprocessing behind a feature toggle (OCR settings in setup):
  grayscale, deskew, adaptive threshold, optional crop to card bounds before OCR.
- **Rationale**: Improves OCR hit-rate toward the ≥ 80% top-match target (SC-004) for clear
  scans. Optional so the system runs without the native OpenCV dependency if disabled.
- **Alternatives considered**: ImageSharp-only basic ops (insufficient for deskew/threshold);
  no preprocessing (lower accuracy).

## D5. TCGdex import (scoped by set + card language)

- **Decision**: HttpClient REST client against the TCGdex v2 API
  (`https://api.tcgdex.net/v2/{lang}`), iterating user-selected sets and card languages.
  Imports run as a background job with progress reporting; upserts keyed by TCGdex card id +
  language. Local corrections stored as a separate overlay so re-import never clobbers them.
- **Rationale**: FR-009/FR-009a require source-pluggable, scope-by-set-and-language import.
  TCGdex exposes per-language endpoints, matching the model. Upsert satisfies FR-011 (no
  duplicates); overlay satisfies FR-013 (corrections survive re-import).
- **Alternatives considered**: Full-dataset dump (heavy, rejected per clarification); official
  JS SDK (not .NET; use REST directly).

## D6. Localization (UI) vs card language (data)

- **Decision**: `Microsoft.Extensions.Localization` with `.resx` per UI culture (de/en/ru),
  `RequestLocalizationMiddleware`, cookie-persisted culture, English as default fallback. Card
  language is a data attribute on Card/Set, never routed through UI localization.
- **Rationale**: Enforces FR-029..FR-032 and the spec's central UI-vs-card-language separation
  (SC-008). Fallback to default culture prevents blank strings (FR-032).
- **Alternatives considered**: DB-stored translations (overkill for 3 static UI cultures);
  client-side i18n libs (N/A for Blazor Server).

## D7. Authentication (single admin)

- **Decision**: ASP.NET Core Identity with a single admin user provisioned by the setup wizard;
  cookie authentication; password stored with ASP.NET Identity's PBKDF2 hasher.
- **Rationale**: FR-006/FR-007 require admin auth and secure one-way password hashing. Identity
  provides hashing, lockout, and cookie auth out of the box without building crypto by hand.
- **Alternatives considered**: Hand-rolled cookie auth + manual hashing (more code, more risk);
  external IdP/OAuth (unnecessary for a single self-hosted user).

## D8. Setup gate

- **Decision**: Middleware + a persisted `SetupState` flag. Until setup completes, all requests
  except the wizard routes and required static assets redirect to the wizard; once complete,
  wizard routes redirect away. Completion is atomic (single transaction writing config + admin
  + flag) to survive interrupted/concurrent attempts (edge cases).
- **Rationale**: FR-001/FR-004/FR-005 and the "interrupted/two-tab" edge cases.
- **Alternatives considered**: Client-side guard only (bypassable); env-var-only config (fails
  the guided-wizard requirement).

## D9. Image storage

- **Decision**: Filesystem `IImageStore` writing to the configured path; validates JPEG/PNG/WebP
  and ≤ 10 MB (FR-023); stores a relative path referenced by ScanJob/CollectionEntry. Writes
  validated for path writability at setup and re-checked on upload failure.
- **Rationale**: FR-017/FR-023/FR-033; cloud/object storage is out of scope (assumption).

## D10. Testing strategy

- **Decision**: xUnit across layers; Testcontainers spins real PostgreSQL for Infrastructure
  integration tests and SQLite file DB for embedded-mode tests; WebApplicationFactory for API
  contract tests; bUnit for Blazor components (setup-gate routing, localization fallback).
- **Rationale**: Constitution II (test-first, contract + integration on boundaries). Real DB in
  tests catches provider-specific issues from D2.
