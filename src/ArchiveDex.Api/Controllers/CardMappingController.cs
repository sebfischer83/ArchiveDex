using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Import;
using ArchiveDex.Application.Queries.Import;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/cards/pending")]
[Authorize(Policy = "Administrator")]
public sealed class CardMappingController(IPendingCardMappingService service) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<PendingCardMappingView>> List(
        [FromQuery] string status = "Pending", CancellationToken ct = default) =>
        LoadPendingCardMappingsHandler.Handle(new LoadPendingCardMappings(status), service, ct);

    [HttpPost("{id:guid}/assign")]
    public Task<IActionResult> Assign(Guid id, [FromBody] AssignPendingCardRequest request, CancellationToken ct) =>
        Resolve(new ResolvePendingCardMapping(id, PendingCardResolutionAction.Assign, request.CardPrintId), ct);

    [HttpPost("{id:guid}/create-new")]
    public Task<IActionResult> CreateNew(Guid id, CancellationToken ct) =>
        Resolve(new ResolvePendingCardMapping(id, PendingCardResolutionAction.CreateNew), ct);

    [HttpPost("{id:guid}/reject")]
    public Task<IActionResult> Reject(Guid id, CancellationToken ct) =>
        Resolve(new ResolvePendingCardMapping(id, PendingCardResolutionAction.Reject), ct);

    private async Task<IActionResult> Resolve(ResolvePendingCardMapping command, CancellationToken ct)
    {
        try
        {
            await ResolvePendingCardMappingHandler.Handle(command, service, ct);
            return NoContent();
        }
        catch (PendingMappingNotFoundException ex)
        {
            return NotFound(new { error = ex.Message, code = "NOT_FOUND" });
        }
        catch (PendingMappingAlreadyResolvedException ex)
        {
            return Conflict(new { error = ex.Message, code = "ALREADY_RESOLVED" });
        }
        catch (CatalogImportActiveException ex)
        {
            return Conflict(new { error = ex.Message, code = "IMPORT_ACTIVE" });
        }
    }
}

public sealed record AssignPendingCardRequest(Guid CardPrintId);
