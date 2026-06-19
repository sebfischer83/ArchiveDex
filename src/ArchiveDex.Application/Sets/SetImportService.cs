using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Sets;

public class SetImportService : ISetImportService
{
    public const int AutoMergeThreshold = 90;
    public const int PendingThreshold = 70;

    private readonly ISetRepository _repo;
    private readonly ISetMatchingService _matching;

    public SetImportService(ISetRepository repo, ISetMatchingService matching)
    {
        _repo = repo;
        _matching = matching;
    }

    public async Task<CardSet> ImportSetAsync(ImportedSetDto incoming, CancellationToken ct)
    {
        // 1. External id already known → reuse, refresh source + canonical metadata.
        var existingExt = await _repo.FindExternalIdAsync(incoming.Source, incoming.Language, incoming.ExternalId, ct);
        if (existingExt is not null)
        {
            RefreshExternalMetadata(existingExt, incoming);
            var owner = await _repo.GetByIdAsync(existingExt.CardSetId, ct)
                ?? throw new InvalidOperationException("CardSet vanished.");
            EnrichCanonical(owner, incoming);
            await _repo.SaveChangesAsync(ct);
            return owner;
        }

        // 2. Verified/manual mapping exists → attach external id to mapped set.
        var mapping = await _repo.FindActiveMappingAsync(incoming.Source, incoming.Language, incoming.ExternalId, ct);
        if (mapping is not null)
        {
            await AttachExternalIdAsync(incoming, mapping.CardSetId, ct);
            return await _repo.GetByIdAsync(mapping.CardSetId, ct) ?? throw new InvalidOperationException("Mapped CardSet missing.");
        }

        // 3. Score against existing canonical sets.
        var match = await _matching.FindBestMatchAsync(incoming, ct);

        // 4. High confidence → auto-attach to the matched set.
        if (match.CardSet is not null && match.Score >= AutoMergeThreshold)
        {
            await AttachExternalIdAsync(incoming, match.CardSet.Id, ct);
            await _repo.UpsertMappingAsync(incoming.Source, incoming.Language, incoming.ExternalId,
                match.CardSet.Id, MappingConfidence.High, isManual: false, ct);
            return match.CardSet;
        }

        // 5. Otherwise create a fresh canonical set, attach the external id to it.
        var newSet = await CreateCanonicalAsync(incoming, ct);

        // Uncertain band → record a pending mapping suggesting a merge into the candidate.
        if (match.CardSet is not null && match.Score >= PendingThreshold)
        {
            var alreadyOpen = await _repo.HasOpenPendingAsync(incoming.Source, incoming.Language, incoming.ExternalId, ct);
            if (!alreadyOpen)
            {
                await _repo.AddPendingAsync(new PendingSetMapping
                {
                    Id = Guid.NewGuid(),
                    IncomingSource = incoming.Source,
                    IncomingLanguage = incoming.Language,
                    IncomingExternalId = incoming.ExternalId,
                    IncomingName = incoming.Name,
                    IncomingReleaseDate = incoming.ReleaseDate,
                    IncomingPrintedTotal = incoming.PrintedTotal,
                    IncomingOfficialTotal = incoming.OfficialTotal,
                    SuggestedCardSetId = match.CardSet.Id,
                    Score = match.Score,
                    ReasonsJson = JsonSerializer.Serialize(match.Reasons),
                    Status = MappingStatus.Pending,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }, ct);
                await _repo.SaveChangesAsync(ct);
            }
        }

        return newSet;
    }

    private async Task<CardSet> CreateCanonicalAsync(ImportedSetDto incoming, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var set = new CardSet
        {
            Id = Guid.NewGuid(),
            CanonicalName = incoming.Name,
            Series = incoming.Series,
            ReleaseDate = incoming.ReleaseDate,
            PrintedTotal = incoming.PrintedTotal,
            OfficialTotal = incoming.OfficialTotal,
            CreatedAt = now,
            UpdatedAt = now,
            ExternalIds =
            [
                new CardSetExternalId
                {
                    Id = Guid.NewGuid(),
                    Source = incoming.Source,
                    Language = incoming.Language,
                    ExternalId = incoming.ExternalId,
                    ExternalName = incoming.Name,
                    Url = incoming.Url,
                    SourceReleaseDate = incoming.ReleaseDate,
                    SourcePrintedTotal = incoming.PrintedTotal,
                    SourceOfficialTotal = incoming.OfficialTotal,
                    CreatedAt = now,
                    UpdatedAt = now
                }
            ]
        };
        await _repo.AddAsync(set, ct);
        return set;
    }

    private async Task AttachExternalIdAsync(ImportedSetDto incoming, Guid cardSetId, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        await _repo.AddExternalIdAsync(new CardSetExternalId
        {
            Id = Guid.NewGuid(),
            CardSetId = cardSetId,
            Source = incoming.Source,
            Language = incoming.Language,
            ExternalId = incoming.ExternalId,
            ExternalName = incoming.Name,
            Url = incoming.Url,
            SourceReleaseDate = incoming.ReleaseDate,
            SourcePrintedTotal = incoming.PrintedTotal,
            SourceOfficialTotal = incoming.OfficialTotal,
            CreatedAt = now,
            UpdatedAt = now
        }, ct);
        await _repo.SaveChangesAsync(ct);
    }

    /// <summary>Fill canonical fields that are still empty when richer source data arrives.</summary>
    private static void EnrichCanonical(CardSet set, ImportedSetDto incoming)
    {
        var changed = false;
        if (set.ReleaseDate is null && incoming.ReleaseDate is not null) { set.ReleaseDate = incoming.ReleaseDate; changed = true; }
        if (string.IsNullOrWhiteSpace(set.Series) && !string.IsNullOrWhiteSpace(incoming.Series)) { set.Series = incoming.Series; changed = true; }
        if (set.PrintedTotal is null && incoming.PrintedTotal is not null) { set.PrintedTotal = incoming.PrintedTotal; changed = true; }
        if (set.OfficialTotal is null && incoming.OfficialTotal is not null) { set.OfficialTotal = incoming.OfficialTotal; changed = true; }
        if (changed) set.UpdatedAt = DateTime.UtcNow;
    }

    private static void RefreshExternalMetadata(CardSetExternalId ext, ImportedSetDto incoming)
    {
        ext.ExternalName = incoming.Name;
        ext.Url = incoming.Url;
        ext.SourceReleaseDate = incoming.ReleaseDate;
        ext.SourcePrintedTotal = incoming.PrintedTotal;
        ext.SourceOfficialTotal = incoming.OfficialTotal;
        ext.UpdatedAt = DateTime.UtcNow;
    }
}
