# Set Identity & Merge Strategy

How ArchiveDex identifies, matches, merges and reviews Pokémon TCG **sets** coming
from multiple external sources (Limitless, TCGdex, TCGplayer, Serebii, Bulbapedia,
manual). Scope: sets only — card data and card matching are out of scope.

## Core rule

**Never merge sets by set code alone.** A code is only meaningful inside its own
`Source + Language` namespace:

- Limitless JP: `M1S`, `M2a`
- TCGdex: `sv01`, `sv10`, `sv11b`, `swsh3`
- TCGplayer / Serebii / Bulbapedia: own slugs / URLs

`M1S`, `sv11b`, `swsh3` are not globally comparable. A shared code across sources
is worth at most **5** match points.

## Entities

| Entity | Role |
|---|---|
| `CardSet` | Internal **canonical**, language-neutral set. |
| `CardSetExternalId` | Source-specific identifier for a logical set. Unique on `(Source, Language, ExternalId)`. |
| `SetMapping` | Explicit external-id → canonical mapping. Unique on `(Source, Language, ExternalId)`. |
| `PendingSetMapping` | Uncertain incoming match awaiting manual review. |
| `SetRelation` | Relationship between two canonical sets (not every match is same-set). |

`CardSet` is **language-neutral**: language lives on `CardSetExternalId` and on
`CardPrint`. One canonical set spans `en`/`ja`/… External-id metadata
(`SourceReleaseDate`, `SourcePrintedTotal`, …) is kept per source for auditing.

### Enums

```csharp
enum MappingConfidence { Low, Medium, High, Verified }
enum MappingStatus     { Pending, Accepted, Rejected, CreatedAsNewSet }
enum SetRelationType   { SameSet, PartOf, Contains, DerivedFrom, InternationalEquivalent, Unknown }
```

## Indexes

- `CardSetExternalId` → **unique** `(Source, Language, ExternalId)`, index `CardSetId`
- `SetMapping` → **unique** `(Source, Language, ExternalId)`, index `CardSetId`
- `PendingSetMapping` → index `(IncomingSource, IncomingLanguage, IncomingExternalId)`, index `Status`
- `SetRelation` → **unique** `(SourceSetId, TargetSetId, RelationType)`; both FKs `Restrict` (no cascade path)
- `CardSet` → index `CanonicalName`, `ReleaseDate`

## Import / merge algorithm (`ISetImportService.ImportSetAsync`)

1. **External id known** → reuse its `CardSet`, refresh source metadata. *(idempotent re-import)*
2. **Verified/manual `SetMapping` exists** → attach a new external id to the mapped set.
3. Otherwise **score** against existing canonical sets (`ISetMatchingService`).
4. **Score ≥ 90** → auto-attach external id to the match, write `SetMapping(High, IsManual=false)`.
5. **Otherwise create a fresh canonical set** and attach the external id, so card import never blocks.
   - **70 ≤ Score < 90** → also record a `PendingSetMapping(Pending)` suggesting a merge into the candidate.
   - **Score < 70** → clean new set, no pending.

### Scoring (`SetMatchingService`)

| Signal | Max | Detail |
|---|---|---|
| Name similarity | 35 | Levenshtein over normalized names (lowercase, de-diacritic, alnum only) |
| Release date | 30 | exact 30 · ≤7d 20 · ≤30d 10 |
| Printed/official count | 20 | printed exact 20 · official exact 15 · ±2 either 10 |
| Series / era | 10 | normalized equal |
| Shared external code | 5 | codes are not globally reliable |

Reasons are recorded per candidate and serialized to `PendingSetMapping.ReasonsJson`.

## Manual review (`ISetMappingService`, API only this round)

For each `PendingSetMapping`:

- **Accept** `(pendingId, cardSetId)` → merge provisional set into the chosen set
  (move external ids, cards, mappings, relations; delete emptied set),
  write `SetMapping(Verified, IsManual=true)`, status `Accepted`.
- **Reject** → status `Rejected`; provisional set stays standalone; not re-suggested
  (a new pending is only created if none is open for the same triple).
- **Create new set** → keep provisional as its own set, write `Verified` manual mapping, status `CreatedAsNewSet`.
- **Create relation** `(pendingId, targetCardSetId, relationType)` → record `SetRelation`
  instead of same-set merge, status `Accepted`.

### API

```
GET  /api/sets/pending?status=Pending
POST /api/sets/pending/{id}/accept       { cardSetId }
POST /api/sets/pending/{id}/reject
POST /api/sets/pending/{id}/create-new
POST /api/sets/pending/{id}/relation     { targetCardSetId, relationType }
```

Blazor review UI: follow-up (not in this round).

## Service contracts

```csharp
public interface ISetImportService
{
    Task<CardSet> ImportSetAsync(ImportedSetDto incoming, CancellationToken ct);
}

public interface ISetMatchingService
{
    Task<SetMatchResult> FindBestMatchAsync(ImportedSetDto incoming, CancellationToken ct);
}

public interface ISetMappingService
{
    Task AcceptPendingMappingAsync(Guid pendingMappingId, Guid cardSetId, CancellationToken ct);
    Task RejectPendingMappingAsync(Guid pendingMappingId, CancellationToken ct);
    Task CreateNewSetFromPendingAsync(Guid pendingMappingId, CancellationToken ct);
    Task CreateRelationFromPendingAsync(Guid pendingMappingId, Guid targetCardSetId, SetRelationType relationType, CancellationToken ct);
}
```

## Integration

`ImportJobService` routes every available set through `ISetImportService.ImportSetAsync`
(per language) before importing that set's cards; cards attach to the returned
canonical `CardSet`. `LoadImportSets` (import set picker) uses the same path.
Thresholds: `SetImportService.AutoMergeThreshold = 90`, `PendingThreshold = 70`.
