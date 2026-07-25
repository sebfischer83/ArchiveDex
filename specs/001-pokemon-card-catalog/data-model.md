# Data Model: KI-gestützter Pokémon-Kartenkatalog

## Overview

The model separates deterministic reference catalog data, the owner's grouped card records, physical specimens, images, and temporary capture analysis. Every owner-controlled relationship is scoped by the immutable owner ID. PostgreSQL constraints are the final authority for identity and lifecycle invariants.

## Entity Relationships

```text
ApplicationUser
  ├── CaptureDraft ── 1:1 ── ImageAsset (Draft)
  └── SetEdition
        └── CardRecord
              └── CardSpecimen ── 1:1 ── ImageAsset (Attached)

CatalogSetReference
  └── CatalogCardReference

SetEdition ── optional reference ── CatalogSetReference
CardRecord ── optional reference ── CatalogCardReference
```

## ApplicationUser

Represents the single provisioned collection owner while retaining a stable ownership boundary.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key; immutable |
| UserName | text | Required, normalized unique value |
| Password/session fields | identity-managed | Never exposed in card contracts |
| CreatedAt | timestamptz | Required UTC |

The first release provisions one owner. Every collection, draft, and image query is owner-scoped even though only one account exists.

## CatalogSetReference

Versioned multilingual reference data imported from the selected catalog snapshot.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| Namespace | text | Required, e.g. `tcgdex` |
| ExternalId | text | Required |
| CatalogVersion | text | Required |
| LanguageCode | text | Required controlled language code |
| SetIdentifier | text | Official abbreviation/code when available |
| Name | text | Required localized display name |
| ImportedAt | timestamptz | Required UTC |

**Unique**: `(Namespace, ExternalId, CatalogVersion, LanguageCode)`.

## CatalogCardReference

One localized printing/finish reference from the pinned catalog.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| CatalogSetReferenceId | UUID | Required foreign key |
| Namespace | text | Required |
| ExternalId | text | Required |
| CrossLanguageId | text | Nullable when no mapping exists |
| PrintedName | text | Required |
| PrintedNumber | text | Required, preserved verbatim |
| CollectorNumber | text | Required portion before `/` |
| SetTotal | text | Nullable portion after `/`; does not limit CollectorNumber |
| NumberNormalized | text | Required conservative normalized CollectorNumber |
| VariantKey | text | Required; `standard` default |
| LanguageCode | text | Required |
| CatalogVersion | text | Required |

**Unique**: `(Namespace, ExternalId, CatalogVersion, LanguageCode, VariantKey)`.

## SetEdition

The collection browsing unit for one owner, set identity, and card language.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| OwnerId | UUID | Required foreign key |
| CatalogSetReferenceId | UUID | Nullable for manually described unknown sets |
| SetIdentifier | text | Required display value |
| SetIdentifierNormalized | text | Required identity value |
| Name | text | Required confirmed value |
| LanguageCode | text | Required confirmed value |
| CreatedAt / UpdatedAt | timestamptz | Required UTC |
| Version | xmin | Optimistic concurrency token |

**Unique**: `(OwnerId, SetIdentifierNormalized, LanguageCode)`.

## CardRecord

Groups all owned physical specimens of the same card printing and language.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| OwnerId | UUID | Required foreign key |
| SetEditionId | UUID | Required foreign key |
| CatalogCardReferenceId | UUID | Nullable for a manually described card |
| PrintedNumber | text | Required display value |
| CollectorNumber | text | Required portion before `/`, e.g. `201` |
| SetTotal | text | Nullable portion after `/`, e.g. `200` |
| NumberNormalized | text | Required identity value derived from CollectorNumber only |
| NumberSortKey | text | Required deterministic natural-sort key |
| VariantKey | text | Required, e.g. standard, holo, reverse-holo |
| OriginalName | text | Required confirmed name as printed |
| GermanName | text | Nullable |
| GermanNameUnavailableReason | text | Nullable |
| CreatedAt / UpdatedAt | timestamptz | Required UTC |
| Version | xmin | Optimistic concurrency token |

**Unique**: `(OwnerId, SetEditionId, NumberNormalized, VariantKey)`.

Exactly one of `GermanName` and `GermanNameUnavailableReason` must be present. Names are editable display data and are not part of identity.
`CollectorNumber` may be numerically greater than `SetTotal` for secret or special cards, for example `201/200`.

## CardSpecimen

Represents one physical card beneath a CardRecord.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| OwnerId | UUID | Required foreign key |
| CardRecordId | UUID | Required foreign key |
| ImageAssetId | UUID | Required unique foreign key |
| Condition | enum text | NM, LP, MP, HP, or DMG |
| ValuationAmountMinor | bigint | Nullable; non-negative |
| ValuationCurrency | char(3) | Nullable; EUR only in v1 |
| ValuedAt | timestamptz | Nullable UTC |
| MarketDataAsOf | timestamptz | Nullable UTC |
| ValuationProvider | text | Nullable |
| ValuationMethod | text | Nullable |
| ValuationConfidence | enum text | Nullable: high, medium, low |
| ConditionAppliedToValuation | boolean | Nullable with valuation |
| CreatedAt / UpdatedAt | timestamptz | Required UTC |
| Version | xmin | Optimistic concurrency token |

Valuation amount, currency, provider, method, and timestamps are either all absent or form one complete last-successful valuation. A failed refresh performs no update.

## ValuationRefreshJob

Persists one collection-wide price refresh. A single active job is allowed per owner. The cursor is the last processed card's creation timestamp and UUID, so the worker resumes safely after navigation or a server restart. Counts track processed, updated, unavailable, and failed card records; individual provider failures never clear an existing specimen valuation.

## ImageAsset

Stores one normalized image and thumbnail outside ordinary metadata projections.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| OwnerId | UUID | Required foreign key |
| State | enum text | draft or attached |
| Content | bytea | Required normalized browser-safe image |
| Thumbnail | bytea | Required normalized thumbnail |
| ContentType | text | Required server-derived allowlisted value |
| ByteLength | bigint | Required; ≤15 MiB upload policy |
| Width / Height | integer | Required; decoded image ≤30 megapixels |
| UploadSha256 | bytea(32) | Required |
| NormalizedSha256 | bytea(32) | Required |
| DuplicateMatchImageId | UUID | Nullable self-reference; delete sets null |
| DuplicateOverrideAt | timestamptz | Nullable |
| CreatedAt | timestamptz | Required UTC |
| ExpiresAt | timestamptz | Required only for draft state |

Hashes are indexed by owner but deliberately not unique. One attached image belongs to exactly one specimen. Binary columns are never selected by list queries.

## CaptureDraft

Persists upload, analysis, review, and retry state before finalization.

| Field | Type | Rules |
|-------|------|-------|
| Id | UUID | Primary key |
| OwnerId | UUID | Required foreign key |
| ImageAssetId | UUID | Required unique foreign key to a draft image |
| Status | enum text | See state machine below |
| AnalysisProposal | jsonb | Nullable provider-neutral schema |
| ConfirmedFields | jsonb | Nullable reviewed values |
| CandidateReferences | jsonb | Nullable bounded candidate list |
| ErrorCode | text | Nullable stable application code |
| ErrorDetail | text | Nullable user-safe context; no secrets/raw payload |
| ProviderCorrelationId | text | Nullable internal diagnostic value |
| RetryCount | integer | Required, bounded |
| CreatedAt / UpdatedAt / ExpiresAt | timestamptz | Required UTC |
| Version | xmin | Optimistic concurrency token |

### Capture State Machine

```text
Uploaded → Analyzing
Analyzing → NeedsReview | NeedsNewImage | Failed
NeedsNewImage → Uploaded (replacement image)
Failed → Analyzing (retry when retryable)
NeedsReview → NeedsReview (correction/confirmation)
NeedsReview → Finalized
Uploaded | NeedsReview | NeedsNewImage | Failed → Deleted/Expired
```

Finalization occurs in one transaction: lock draft, acquire owner/hash advisory lock, recheck duplicate, upsert SetEdition and CardRecord, insert CardSpecimen, attach ImageAsset, and remove CaptureDraft.

## Condition Mapping

| API Value | Display Label |
|-----------|---------------|
| NM | Near Mint |
| LP | Lightly Played |
| MP | Moderately Played |
| HP | Heavily Played |
| DMG | Damaged |

The AI supplies a proposal and limitations; the confirmed value is mandatory before finalization.

## Identity, Concurrency, and Deletion

- UUIDv7 identifiers are immutable; email, names, and filenames never identify records.
- Owner ID is included in all owner-controlled queries and natural uniqueness constraints.
- Composite foreign-key enforcement or equivalent database constraints prevent cross-owner relationships.
- ETags expose optimistic versions. Stale edits return `409 Conflict`; they are never silently overwritten.
- Editing set, language, number, or variant may move specimens to an existing target CardRecord in one transaction.
- Permanent specimen deletion removes its ImageAsset and removes the CardRecord only when no specimens remain.
- Drafts expire after seven days and are removed with their unreferenced image in bounded cleanup batches.

## Core Indexes and Complexity

- Unique SetEdition identity index `(OwnerId, SetIdentifierNormalized, LanguageCode)`.
- Unique CardRecord identity index `(OwnerId, SetEditionId, NumberNormalized, VariantKey)`.
- Card browsing index `(OwnerId, SetEditionId, NumberSortKey, Id)`.
- Specimen index `(OwnerId, CardRecordId, Id)` and unique `ImageAssetId`.
- Partial attached-image hash indexes `(OwnerId, UploadSha256)` and `(OwnerId, NormalizedSha256)`.
- Draft cleanup index `(OwnerId, Status, ExpiresAt)`.
- Catalog lookup indexes on language, normalized number, set, and normalized printed name.

List operations use indexed keyset pagination and have expected complexity O(log n + page-size). No operation loads all image bytes or all collection rows.

## Backup and Scale Boundary

PostgreSQL and images share one named data volume and one consistent encrypted off-host backup. Initial policy is nightly custom-format backup, 14–30 daily copies, 8–12 weekly copies, checksums, and monthly restore tests. Object storage migration is triggered by 50–100 GB image data, missed backup/restore windows, or multi-host requirements.
