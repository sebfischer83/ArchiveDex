using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.SetMapping;
using ArchiveDex.Application.Queries.SetMapping;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/sets/pending")]
public class SetMappingController(ISetRepository repo, ISetMappingService service) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<PendingMappingDto>> ListPending(CancellationToken ct, [FromQuery] string status = "Pending") =>
        GetPendingMappingsHandler.Handle(new GetPendingMappings(status), repo, ct);

    [HttpPost("{id:guid}/accept")]
    public async Task<IActionResult> Accept(Guid id, [FromBody] AcceptMappingRequest input, CancellationToken ct)
    {
        await AcceptMappingHandler.Handle(new AcceptMapping(id, input.CardSetId), service, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id, CancellationToken ct)
    {
        await RejectMappingHandler.Handle(new RejectMapping(id), service, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/create-new")]
    public async Task<IActionResult> CreateNew(Guid id, CancellationToken ct)
    {
        await CreateSetFromPendingHandler.Handle(new CreateSetFromPending(id), service, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/relation")]
    public async Task<IActionResult> Relation(Guid id, [FromBody] CreateRelationRequest input, CancellationToken ct)
    {
        await CreateRelationFromPendingHandler.Handle(
            new CreateRelationFromPending(id, input.TargetCardSetId, input.RelationType), service, ct);
        return NoContent();
    }
}
