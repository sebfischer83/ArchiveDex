using System.ComponentModel.DataAnnotations;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Collection;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers
{
    public static class CollectionCreateHandler
    {
        [WolverinePost("/api/collection")]
        public static async Task<IResult> Handle(
            CreateCollectionInput input,
            ICatalogRepository catalogRepository,
            ICollectionRepository collectionRepository,
            CancellationToken ct)
        {
            try
            {
                var command = new CreateCollectionEntry(
                    input.CardPrintId,
                    input.Condition,
                    input.Quantity,
                    input.PurchasePrice,
                    input.StorageLocation,
                    input.Notes,
                    input.ForceCreate);

                CreateCollectionResult result = await CreateCollectionEntryHandler.Handle(
                    command, catalogRepository, collectionRepository, ct);

                return result.IsDuplicate ? Results.Conflict(result.Duplicate) : Results.Created($"/api/collection/{result.Entry!.Id}", result.Entry);
            }
            catch (ValidationException ex)
            {
                return Results.BadRequest(new { type = "validation_error", message = ex.Message });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
            {
                return Results.NotFound(new { type = "card_not_found", cardPrintId = input.CardPrintId });
            }
        }
    }

    public sealed record CreateCollectionInput(
        Guid CardPrintId,
        CardCondition Condition,
        int Quantity,
        decimal? PurchasePrice,
        string? StorageLocation,
        string? Notes,
        bool ForceCreate = false);
}
