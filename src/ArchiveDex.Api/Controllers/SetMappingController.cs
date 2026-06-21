using System.Text.Json;
using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/sets/pending")]
public class SetMappingController(ISetRepository repo, ISetMappingService service) : ControllerBase
{
    [HttpGet]
    public async Task<IReadOnlyList<PendingSetMappingDto>> ListPending(CancellationToken ct, [FromQuery] string status = "Pending")
    {
        MappingStatus parsed = Enum.TryParse<MappingStatus>(status, ignoreCase: true, out MappingStatus s) ? s : MappingStatus.Pending;
        IReadOnlyList<PendingSetMapping> pending = await repo.GetPendingByStatusAsync(parsed, ct);

        var results = new List<PendingSetMappingDto>(pending.Count);
        foreach (PendingSetMapping p in pending)
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

    [HttpPost("{id:guid}/accept")]
    public async Task<IActionResult> Accept(Guid id, [FromBody] AcceptMappingRequest input, CancellationToken ct)
    {
        await service.AcceptPendingMappingAsync(id, input.CardSetId, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id, CancellationToken ct)
    {
        await service.RejectPendingMappingAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/create-new")]
    public async Task<IActionResult> CreateNew(Guid id, CancellationToken ct)
    {
        await service.CreateNewSetFromPendingAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/relation")]
    public async Task<IActionResult> Relation(Guid id, [FromBody] CreateRelationRequest input, CancellationToken ct)
    {
        await service.CreateRelationFromPendingAsync(id, input.TargetCardSetId, input.RelationType, ct);
        return NoContent();
    }

    private static IReadOnlyList<string> DeserializeReasons(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return [];

        try { return JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch { return []; }
    }
}

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
