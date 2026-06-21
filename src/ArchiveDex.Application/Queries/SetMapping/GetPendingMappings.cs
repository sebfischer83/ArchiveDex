using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Queries.SetMapping;

public sealed record GetPendingMappings(string Status = "Pending");

public sealed record PendingMappingDto(
    Guid Id,
    string IncomingSource,
    string IncomingLanguage,
    string IncomingExternalId,
    string IncomingName,
    DateOnly? IncomingReleaseDate,
    int? IncomingPrintedTotal,
    int? IncomingOfficialTotal,
    Guid? SuggestedCardSetId,
    string? SuggestedCardSetName,
    int Score,
    IReadOnlyList<string> Reasons,
    string Status);

public static class GetPendingMappingsHandler
{
    public static async Task<IReadOnlyList<PendingMappingDto>> Handle(
        GetPendingMappings query,
        ISetRepository repo,
        CancellationToken ct)
    {
        MappingStatus parsed = Enum.TryParse<MappingStatus>(query.Status, ignoreCase: true, out MappingStatus s) ? s : MappingStatus.Pending;
        IReadOnlyList<PendingSetMapping> pending = await repo.GetPendingByStatusAsync(parsed, ct);

        var results = new List<PendingMappingDto>(pending.Count);
        foreach (PendingSetMapping p in pending)
        {
            string? suggestedName = null;
            if (p.SuggestedCardSetId is { } sid)
                suggestedName = (await repo.GetByIdAsync(sid, ct))?.CanonicalName;

            results.Add(new PendingMappingDto(
                p.Id, p.IncomingSource, p.IncomingLanguage, p.IncomingExternalId, p.IncomingName,
                p.IncomingReleaseDate, p.IncomingPrintedTotal, p.IncomingOfficialTotal,
                p.SuggestedCardSetId, suggestedName, p.Score,
                DeserializeReasons(p.ReasonsJson), p.Status.ToString()));
        }
        return results;
    }

    private static IReadOnlyList<string> DeserializeReasons(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];
        try { return JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch { return []; }
    }
}
