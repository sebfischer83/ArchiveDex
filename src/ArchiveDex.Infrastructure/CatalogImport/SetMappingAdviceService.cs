using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport;

public sealed class SetMappingAdviceService(
    IUnitOfWork unitOfWork,
    ISetMappingAdvisor advisor,
    ILogger<SetMappingAdviceService> logger) : ISetMappingAdviceService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly DbContext _db = (DbContext)unitOfWork;

    public async Task<SetMappingAdvice?> AdvisePendingAsync(Guid pendingMappingId, CancellationToken ct = default)
    {
        PendingSetMapping? pending = await _db.Set<PendingSetMapping>()
            .FirstOrDefaultAsync(item => item.Id == pendingMappingId, ct);
        if (pending is null || pending.Status != MappingStatus.Pending)
            return null;

        CandidateJson[] serializedCandidates = DeserializeCandidates(pending.CandidatesJson);
        if (serializedCandidates.Length == 0)
            return null;

        Guid[] ids = serializedCandidates.Select(candidate => candidate.CardSetId).Distinct().ToArray();
        Dictionary<Guid, CardSet> sets = await _db.Set<CardSet>().AsNoTracking()
            .Where(set => ids.Contains(set.Id))
            .ToDictionaryAsync(set => set.Id, ct);
        SetMappingAdviceCandidate[] candidates = serializedCandidates
            .Where(candidate => sets.ContainsKey(candidate.CardSetId))
            .Select(candidate =>
            {
                CardSet set = sets[candidate.CardSetId];
                return new SetMappingAdviceCandidate(set.Id, set.CanonicalName, set.ReleaseDate, set.PrintedTotal,
                    set.OfficialTotal, candidate.Score, candidate.Reasons ?? []);
            })
            .ToArray();
        if (candidates.Length == 0)
            return null;

        var request = new SetMappingAdviceRequest(
            pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId, pending.IncomingName,
            pending.IncomingReleaseDate, pending.IncomingPrintedTotal, pending.IncomingOfficialTotal, candidates);
        SetMappingAdvice? advice = await advisor.AdviseAsync(request, ct);
        if (advice is null)
            return null;

        pending.AiDecision = advice.Decision.ToString();
        pending.AiRecommendedCardSetId = advice.RecommendedCardSetId;
        pending.AiConfidence = advice.Confidence;
        pending.AiReasonsJson = JsonSerializer.Serialize(advice.Reasons, JsonOptions);
        pending.AiModel = advice.Model;
        pending.AiAdvisedAt = advice.AdvisedAt;
        pending.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        logger.LogInformation(
            "AI set-mapping advice persisted. pendingMappingId={PendingMappingId} decision={Decision} confidence={Confidence} model={Model}",
            pending.Id, advice.Decision, advice.Confidence, advice.Model);
        return advice;
    }

    private static CandidateJson[] DeserializeCandidates(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return [];
        try
        {
            return JsonSerializer.Deserialize<CandidateJson[]>(json, JsonOptions) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }

    private sealed record CandidateJson(Guid CardSetId, string Name, int Score, string[]? Reasons);
}
