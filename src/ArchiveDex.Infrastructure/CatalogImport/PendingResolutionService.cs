using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.CatalogImport;

/// <summary>Replays parked snapshots through the normal resolver and merge policy.</summary>
public sealed class PendingResolutionService(
    ICatalogImportRepository repository,
    CatalogReconciler reconciler,
    IUnitOfWork unitOfWork) : IPendingResolutionService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task ReMergeSetAsync(
        string source, string language, string externalSetId, Guid cardSetId, CancellationToken ct = default)
    {
        var setSnapshot = (await repository.GetLatestSetSnapshotsAsync(source, language, externalSetId, ct))
            .OrderByDescending(s => s.FetchedAt).FirstOrDefault();
        if (setSnapshot is null) return;

        var importedSet = string.IsNullOrWhiteSpace(setSnapshot.PayloadJson)
            ? null
            : JsonSerializer.Deserialize<ImportedSet>(setSnapshot.PayloadJson, JsonOptions);
        importedSet ??= new ImportedSet(setSnapshot.ExternalSetId, setSnapshot.RawName, setSnapshot.Series,
            setSnapshot.ReleaseDate, setSnapshot.PrintedTotal, setSnapshot.OfficialTotal, null, null);
        var setResult = await reconciler.UpsertSetAsync(source, language, externalSetId,
            CatalogImportMode.Update, false, importedSet, ct);
        if (setResult.Outcome == SetReconciliationOutcome.Ambiguous) return;

        var cards = await repository.GetLatestCardSnapshotsAsync(source, language, externalSetId, ct);
        foreach (var snapshot in cards)
        {
            var detail = string.IsNullOrWhiteSpace(snapshot.PayloadJson)
                ? null
                : JsonSerializer.Deserialize<ImportedCardDetail>(snapshot.PayloadJson, JsonOptions);
            var summary = new ImportedCardSummary(snapshot.ExternalCardId, snapshot.ExternalSetId,
                snapshot.Number, snapshot.Name, snapshot.Rarity, detail?.ImageUrl);
            await reconciler.UpsertCardPrintAsync(source, language, cardSetId, CatalogImportMode.Update,
                false, detail, summary, ct, snapshot.ImportRunId);
        }
        await unitOfWork.SaveChangesAsync(ct);
    }
}

/// <summary>Lists and resolves pending card identities with import-state guards.</summary>
public sealed class PendingCardMappingService(
    IUnitOfWork unitOfWork,
    ICatalogImportRepository repository,
    CatalogReconciler reconciler) : IPendingCardMappingService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly DbContext _db = (DbContext)unitOfWork;

    public async Task<IReadOnlyList<PendingCardMappingView>> ListAsync(MappingStatus status, CancellationToken ct = default)
    {
        var values = await _db.Set<PendingCardMapping>().AsNoTracking().Include(p => p.CardSet)
            .Where(p => p.Status == status).OrderBy(p => p.CreatedAt).ToListAsync(ct);
        return values.Select(p => new PendingCardMappingView(
            p.Id, p.Source, p.Language, p.ExternalSetId, p.ExternalCardId, p.IncomingName,
            p.IncomingNumber, p.CardSetId, p.CardSet.CanonicalName, DeserializeCandidates(p.CandidatesJson),
            p.Status, p.CreatedAt)).ToList();
    }

    public async Task AssignAsync(Guid id, Guid cardPrintId, CancellationToken ct = default)
    {
        await EnsureWritableAsync(ct);
        var pending = await GetOpenAsync(id, ct);
        if (!await _db.Set<CardPrint>().AnyAsync(c => c.Id == cardPrintId && c.CardSetId == pending.CardSetId, ct))
            throw new PendingMappingNotFoundException("Candidate card print was not found in the pending mapping's set.");
        await AttachAndReplayAsync(pending, cardPrintId, ct);
        pending.Status = MappingStatus.Accepted;
        pending.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task CreateNewAsync(Guid id, CancellationToken ct = default)
    {
        await EnsureWritableAsync(ct);
        var pending = await GetOpenAsync(id, ct);
        var snapshot = await FindSnapshotAsync(pending, ct);
        var card = new CardPrint
        {
            CardSetId = pending.CardSetId,
            CardLanguage = ParseLanguage(pending.Language),
            Number = pending.IncomingNumber,
            Name = pending.IncomingName,
            Origin = Origin.Imported
        };
        await _db.Set<CardPrint>().AddAsync(card, ct);
        await _db.SaveChangesAsync(ct);
        await AttachAndReplayAsync(pending, card.Id, ct, snapshot);
        pending.Status = MappingStatus.CreatedAsNewSet;
        pending.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task RejectAsync(Guid id, CancellationToken ct = default)
    {
        await EnsureWritableAsync(ct);
        var pending = await GetOpenAsync(id, ct);
        pending.Status = MappingStatus.Rejected;
        pending.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    private async Task AttachAndReplayAsync(
        PendingCardMapping pending, Guid cardPrintId, CancellationToken ct, SourceCardSnapshot? knownSnapshot = null)
    {
        if (!await _db.Set<CardExternalId>().AnyAsync(e => e.Source == pending.Source && e.Language == pending.Language &&
            e.ExternalId == pending.ExternalCardId, ct))
        {
            await _db.Set<CardExternalId>().AddAsync(new CardExternalId
            {
                CardPrintId = cardPrintId,
                Source = pending.Source,
                Language = pending.Language,
                ExternalId = pending.ExternalCardId,
                LastSeenAt = DateTime.UtcNow
            }, ct);
            await _db.SaveChangesAsync(ct);
        }

        var snapshot = knownSnapshot ?? await FindSnapshotAsync(pending, ct);
        if (snapshot is null) return;
        var detail = string.IsNullOrWhiteSpace(snapshot.PayloadJson)
            ? null
            : JsonSerializer.Deserialize<ImportedCardDetail>(snapshot.PayloadJson, JsonOptions);
        var summary = new ImportedCardSummary(snapshot.ExternalCardId, snapshot.ExternalSetId,
            snapshot.Number, snapshot.Name, snapshot.Rarity, detail?.ImageUrl);
        await reconciler.UpsertCardPrintAsync(pending.Source, pending.Language, pending.CardSetId,
            CatalogImportMode.Update, false, detail, summary, ct, snapshot.ImportRunId);
    }

    private async Task<SourceCardSnapshot?> FindSnapshotAsync(PendingCardMapping pending, CancellationToken ct)
    {
        var cards = await repository.GetLatestCardSnapshotsAsync(
            pending.Source, pending.Language, pending.ExternalSetId, ct);
        return cards.FirstOrDefault(c => c.NormalizedNumber == pending.IncomingNumber) ??
               cards.FirstOrDefault(c => c.Name == pending.IncomingName);
    }

    private async Task<PendingCardMapping> GetOpenAsync(Guid id, CancellationToken ct)
    {
        var pending = await _db.Set<PendingCardMapping>().FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new PendingMappingNotFoundException("Pending card mapping was not found.");
        if (pending.Status != MappingStatus.Pending)
            throw new PendingMappingAlreadyResolvedException($"Pending card mapping is already resolved as {pending.Status}.");
        return pending;
    }

    private async Task EnsureWritableAsync(CancellationToken ct)
    {
        if (await repository.HasActiveImportAsync(ct))
            throw new CatalogImportActiveException("A catalog import is active.");
    }

    private static IReadOnlyList<PendingCardCandidate> DeserializeCandidates(string json)
    {
        try
        {
            return (JsonSerializer.Deserialize<List<CandidateJson>>(json, JsonOptions) ?? [])
                .Select(c => new PendingCardCandidate(c.CardPrintId, c.Name, c.Number, c.Reasons)).ToList();
        }
        catch (JsonException) { return []; }
    }

    private static CardLanguage ParseLanguage(string language) =>
        Enum.TryParse<CardLanguage>(language.Replace("-", string.Empty), true, out var value) ? value : CardLanguage.en;

    private sealed record CandidateJson(Guid CardPrintId, string Name, string Number, List<string> Reasons);
}
