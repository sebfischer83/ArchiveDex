using System.ComponentModel.DataAnnotations;
using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Collection;
using ArchiveDex.Application.Common;
using ArchiveDex.Application.Queries.Collection;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/collection")]
public class CollectionController(
    ICatalogRepository catalogRepository,
    ICollectionRepository collectionRepository) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<CollectionEntryDto>> Search(
        [FromQuery] string? q,
        [FromQuery] Guid? setId,
        [FromQuery] string? cardLanguage,
        [FromQuery] string? condition,
        CancellationToken ct,
        [FromQuery] int page = 1) =>
        SearchCollectionHandler.Handle(new SearchCollection(q, setId, cardLanguage, condition, page), collectionRepository, ct);

    [HttpGet("{entryId:guid}")]
    public async Task<IActionResult> Get(Guid entryId, CancellationToken ct)
    {
        CollectionEntryDto? entry = await GetCollectionEntryHandler.Handle(
            new GetCollectionEntry(entryId), collectionRepository, ct);
        return entry is null ? NotFound() : Ok(entry);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCollectionRequest input, CancellationToken ct)
    {
        try
        {
            var command = new CreateCollectionEntry(
                input.CardPrintId, input.Condition, input.Quantity,
                input.PurchasePrice, input.StorageLocation, input.Notes,
                input.ForceCreate, input.MergeDuplicate);

            CreateCollectionResult result = await CreateCollectionEntryHandler.Handle(
                command, catalogRepository, collectionRepository, ct);

            return result.IsDuplicate
                ? Conflict(result.Duplicate)
                : Created($"/api/collection/{result.Entry!.Id}", result.Entry);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { type = "validation_error", message = ex.Message });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { type = "card_not_found", cardPrintId = input.CardPrintId });
        }
    }

    [HttpPut("{entryId:guid}")]
    public async Task<IActionResult> Update(Guid entryId, [FromBody] CollectionUpdateRequest input, CancellationToken ct)
    {
        CollectionEntryDto dto = await UpdateCollectionEntryHandler.Handle(
            new UpdateCollectionEntry(entryId, input.Condition, input.Quantity,
                input.PurchasePrice, input.StorageLocation, input.Notes), collectionRepository, ct);
        return Ok(dto);
    }

    [HttpDelete("{entryId:guid}")]
    public async Task<IActionResult> Delete(Guid entryId, CancellationToken ct)
    {
        await DeleteCollectionEntryHandler.Handle(new DeleteCollectionEntry(entryId), collectionRepository, ct);
        return NoContent();
    }

    [HttpGet("sets")]
    public Task<IReadOnlyList<CollectionSetSummary>> GetSets(CancellationToken ct) =>
        GetCollectionSetsHandler.Handle(new GetCollectionSets(), collectionRepository, ct);
}
