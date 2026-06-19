using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public sealed record PendingSetMappingDto(
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

public sealed record CardSetDto(
    Guid Id,
    string CanonicalName,
    string? Series,
    DateOnly? ReleaseDate,
    int? PrintedTotal,
    int? OfficialTotal);

public sealed record AcceptMappingInput(Guid CardSetId);
public sealed record CreateRelationInput(Guid TargetCardSetId, SetRelationType RelationType);

public static class SetMappingHandler
{
    [WolverineGet("/api/sets/pending")]
    public static async Task<IReadOnlyList<PendingSetMappingDto>> ListPending(
        ISetRepository repo,
        CancellationToken ct,
        string status = "Pending")
    {
        var parsed = Enum.TryParse<MappingStatus>(status, ignoreCase: true, out var s) ? s : MappingStatus.Pending;
        var pending = await repo.GetPendingByStatusAsync(parsed, ct);

        var results = new List<PendingSetMappingDto>(pending.Count);
        foreach (var p in pending)
        {
            string? suggestedName = null;
            if (p.SuggestedCardSetId is { } sid)
                suggestedName = (await repo.GetByIdAsync(sid, ct))?.CanonicalName;

            results.Add(new PendingSetMappingDto(
                p.Id, p.IncomingSource, p.IncomingLanguage, p.IncomingExternalId, p.IncomingName,
                p.IncomingReleaseDate, p.IncomingPrintedTotal, p.IncomingOfficialTotal,
                p.SuggestedCardSetId, suggestedName, p.Score,
                DeserializeReasons(p.ReasonsJson), p.Status.ToString()));
        }
        return results;
    }

    [WolverinePost("/api/sets/pending/{id}/accept")]
    public static async Task<IResult> Accept(
        Guid id, AcceptMappingInput input,
        ISetMappingService service, CancellationToken ct)
    {
        await service.AcceptPendingMappingAsync(id, input.CardSetId, ct);
        return Results.NoContent();
    }

    [WolverinePost("/api/sets/pending/{id}/reject")]
    public static async Task<IResult> Reject(
        Guid id, ISetMappingService service, CancellationToken ct)
    {
        await service.RejectPendingMappingAsync(id, ct);
        return Results.NoContent();
    }

    [WolverinePost("/api/sets/pending/{id}/create-new")]
    public static async Task<IResult> CreateNew(
        Guid id, ISetMappingService service, CancellationToken ct)
    {
        await service.CreateNewSetFromPendingAsync(id, ct);
        return Results.NoContent();
    }

    [WolverinePost("/api/sets/pending/{id}/relation")]
    public static async Task<IResult> Relation(
        Guid id, CreateRelationInput input,
        ISetMappingService service, CancellationToken ct)
    {
        await service.CreateRelationFromPendingAsync(id, input.TargetCardSetId, input.RelationType, ct);
        return Results.NoContent();
    }

    private static IReadOnlyList<string> DeserializeReasons(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];
        try { return System.Text.Json.JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch { return []; }
    }
}
