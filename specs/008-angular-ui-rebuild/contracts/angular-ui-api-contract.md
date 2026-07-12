# Angular UI API Contract Additions

The Angular client uses the existing same-origin `/api` surface. Existing controller contracts remain authoritative unless explicitly extended below. All protected endpoints use the existing ASP.NET Core Identity cookie session and return a consistent user-safe error envelope.

## Session and Account

| Method | Path | Purpose | Authorization |
|--------|------|---------|---------------|
| `GET` | `/api/session` | Read authentication, display name, roles, and setup requirement | Anonymous, returns unauthenticated context when no session |
| `POST` | `/api/session/sign-in` | Start an existing Identity cookie session | Anonymous |
| `POST` | `/api/session/sign-out` | End the current session | Authenticated |
| `GET` | `/api/account` | Read current account profile | Authenticated |
| `PUT` | `/api/account` | Update supported account details | Authenticated |

## Setup

`/api/setup/*` remains available during initial setup. Its responses expose whether setup is required so the UI can route to setup before protected workflow screens.

## Existing Workflow APIs Required By The New UI

| Workflow | Required API family | Browser behavior to preserve |
|----------|---------------------|------------------------------|
| Catalog | `/api/catalog/*`, `/api/images/*` | Browse, search, filter, detail, image display |
| Collection | `/api/collection/*` | Browse, create, update, validation feedback |
| Single scan | `/api/scans/*` | Submit, status, confirm, error/retry feedback |
| Batch scan | `/api/batch-scans/*` | Review, accept, match status, recovery actions |
| Legacy selective import | `/api/import/*` | Existing import jobs and status display |
| Full catalog import | `/api/catalog-imports/*` | Start, active/status, cancel, resume, report, errors, image quality |
| Catalog transfer | `/api/catalog-transfers/*` | Create/upload, status, cancel, recovery, download/report |
| Set mappings | `/api/sets/pending/*` | Review and resolve pending mappings |

## Required Contract Rules

- Protected workflow APIs return `401` for no session and `403` for insufficient role; the UI maps each to session recovery or access-denied states.
- Failed business actions return a user-safe message and stable error code; the UI must not infer success from transport completion alone.
- Long-running operation endpoints expose status, progress/phase where available, warnings, errors, and allowed actions.
- API routes remain excluded from the Angular fallback route.
- The catalog-transfer and catalog-import APIs receive any missing browser-facing operations currently performed only by Blazor DI before the cutover.

## Authorization Matrix

| Surface | Anonymous | Authenticated User | Administrator |
|---------|-----------|--------------------|---------------|
| `/api/session`, sign-in, setup status | Allowed | Allowed | Allowed |
| Sign-out and current account | Denied | Allowed for own account | Allowed for own account |
| Setup mutation | Allowed only while setup is required | Denied after setup | Denied after setup unless setup state explicitly requires it |
| Catalog browse/detail/images | Denied unless a future product requirement opens public catalog access | Allowed | Allowed |
| Collection and scan workflows | Denied | Allowed for the current user | Allowed where current business rules permit |
| Batch scan review, full import, catalog transfer, pending set mappings, and administration | Denied | Denied | Allowed |

Every protected controller action is tested for `401`, `403`, and its allowed role before cutover. Client navigation may hide unavailable actions but never replaces server authorization.
