# Phase 1 Data Model: ArchiveDex

Derived from spec Key Entities + Functional Requirements + clarifications. Persisted via EF
Core (PostgreSQL or SQLite). All text stored UTF-8/Unicode to support CJK card data.

## Enums & Value Objects

### CardCondition (enum)

Fixed grade set (FR-025a, clarification):

| Value | Meaning |
|-------|---------|
| NM | Near Mint |
| LP | Lightly Played |
| MP | Moderately Played |
| HP | Heavily Played |
| DMG | Damaged |

### CardLanguage (enum / lookup)

Supported card languages (FR-012): `de`, `en`, `ja`, `ko`, `zh-Hans`, `zh-Hant`. Distinct from
UI culture. Stored as a stable string code.

### UiCulture (enum / lookup)

UI cultures (FR-029): `de`, `en`, `ru`. Default fallback `en`.

### DatabaseMode (enum)

`Embedded` (SQLite) | `External` (PostgreSQL).

## Entities

### Administrator

The single user. (FR-006, FR-007; ASP.NET Identity user.)

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| UserName | string | unique, required |
| PasswordHash | string | PBKDF2 via Identity; never plaintext |
| PreferredUiCulture | UiCulture | persists per FR-030 |

Rules: exactly one administrator exists after setup. No self-registration.

### ApplicationConfiguration

System-wide settings captured at setup, editable later (FR-002, FR-003, FR-004).

| Field | Type | Notes |
|-------|------|-------|
| Id | int | PK (singleton row) |
| IsSetupComplete | bool | setup gate flag (FR-001/FR-004) |
| DefaultUiCulture | UiCulture | wizard-chosen default |
| CollectionCurrency | string | ISO 4217 code; single currency (FR-025b) |
| ImageStoragePath | string | validated writable (FR-005/FR-033) |
| DatabaseMode | DatabaseMode | embedded/external |
| ImportSettings | json | optional TCGdex defaults (source, default langs/sets) |
| OcrSettings | json | preprocessing on/off, default card-language hint |
| ScannerDefaults | json | scanner behavior defaults |

### Set

A card set/expansion (FR-008). Imported or manual.

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| SourceSetId | string? | TCGdex set id (null if manual) |
| Code | string | set code |
| CardLanguage | CardLanguage | language of this set's data |
| Name | string | localized to the set's card language |
| Series | string? | series/era |
| CardCount | int? | total cards |
| Origin | enum | Imported \| Manual |

Index: (`CardLanguage`, `Code`), (`SourceSetId`, `CardLanguage`).

### Card (Catalog Card)

A distinct card printing in a given card language (FR-008, FR-012, FR-014).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| SourceCardId | string? | TCGdex card id (null if manual) |
| SetId | Guid | FK → Set |
| CardLanguage | CardLanguage | language printed on the card |
| Number | string | card number within set |
| Name | string | name in the card's language (faithful, untranslated) |
| Rarity | string? | optional |
| Origin | enum | Imported \| Manual |

Indexes (perf, SC-003): (`CardLanguage`, `Number`), (`Name`) case-insensitive, (`SetId`),
unique (`SourceCardId`, `CardLanguage`) when SourceCardId not null. Upsert key for import =
(`SourceCardId`, `CardLanguage`) (D5, FR-011).

### LocalCorrection

User overrides for imported card fields, preserved across imports (FR-013).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| CardId | Guid | FK → Card, unique (one overlay per card) |
| NameOverride | string? | |
| NumberOverride | string? | |
| SetOverride | Guid? | FK → Set |
| OtherOverrides | json | extensible field overrides |
| UpdatedAt | datetime | |

Rule: effective card value = correction override ?? imported value. Import upsert MUST NOT
touch LocalCorrection rows (FR-013).

### CollectionEntry

A card the user owns (FR-024..FR-028).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| CardId | Guid | FK → Card (catalog card) |
| Condition | CardCondition | NM/LP/MP/HP/DMG (FR-025a), filterable |
| Quantity | int | ≥ 1 (FR-028) |
| PurchasePrice | decimal? | numeric, in ApplicationConfiguration.CollectionCurrency (FR-025b) |
| StorageLocation | string? | free text |
| Notes | string? | free text |
| FrontImagePath | string | FK-ish → ImageAsset path (FR-024/FR-025) |
| DateAdded | datetime | |

Rules: deleting an entry MUST NOT delete its Card (FR-027). Multiple copies via Quantity and/or
separate entries differing by Condition (FR-028).

### ScanJob

A scanning attempt (FR-016..FR-024).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ImageAssetId | Guid | FK → ImageAsset |
| CreatedAt | datetime | |
| Status | enum | Uploaded \| OcrRunning \| OcrComplete \| Confirmed \| Failed \| Rejected |
| OcrResultId | Guid? | FK → OcrResult |
| ResultingCollectionEntryId | Guid? | set on confirmation (FR-024) |

State transitions: Uploaded → OcrRunning → OcrComplete → (Confirmed | Rejected); any → Failed
on error. No auto-confirm (FR-022).

### OcrResult

Extracted data + candidate matches for a scan (FR-018..FR-021).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| ScanJobId | Guid | FK → ScanJob |
| DetectedNumber | string? | |
| DetectedName | string? | |
| DetectedCardLanguage | CardLanguage? | |
| DetectedSetHint | string? | |
| Confidence | float? | overall confidence |
| RawText | string? | full OCR text |
| CandidateMatches | json | ordered list of {CardId, score}, best first (FR-020) |

### ImportJob

A catalog import run (FR-009..FR-011).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| Source | string | "TCGdex" (extensible) |
| SelectedSets | json | set ids/codes chosen (FR-009a) |
| SelectedCardLanguages | json | languages chosen (FR-009a) |
| Status | enum | Pending \| Running \| Completed \| Failed |
| ImportedCount | int | |
| UpdatedCount | int | |
| SkippedCount | int | |
| Errors | json | |
| StartedAt / FinishedAt | datetime | |

### ImageAsset

A stored uploaded image (FR-017, FR-023, FR-033).

| Field | Type | Notes |
|-------|------|-------|
| Id | Guid | PK |
| RelativePath | string | under ApplicationConfiguration.ImageStoragePath |
| Format | enum | Jpeg \| Png \| WebP (FR-023) |
| SizeBytes | long | ≤ 10 MB enforced on upload (FR-023) |
| CreatedAt | datetime | |

## Relationships (summary)

- Set 1—* Card
- Card 1—0..1 LocalCorrection
- Card 1—* CollectionEntry
- CollectionEntry *—1 ImageAsset (FrontImage)
- ScanJob 1—1 ImageAsset, 1—0..1 OcrResult, 1—0..1 CollectionEntry (result)
- ImportJob standalone (writes Sets + Cards)

## Validation Rules (cross-cutting)

- Quantity ≥ 1; PurchasePrice ≥ 0 when present.
- CardLanguage and UiCulture validated against supported sets; never conflated (FR-031, SC-008).
- Image upload rejected unless format ∈ {Jpeg,Png,WebP} and size ≤ 10 MB (FR-023).
- Setup completion atomic: ApplicationConfiguration.IsSetupComplete set true only with valid
  admin + writable storage + reachable DB in one transaction (FR-005, edge cases).
