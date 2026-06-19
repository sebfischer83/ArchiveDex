using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class CollectionUpdateHandler
{
    [WolverinePut("/api/collection/{entryId}")]
    public static async Task<IResult> Handle(
        Guid entryId, CollectionUpdateInput input, ICollectionRepository repo, CancellationToken ct)
    {
        var entry = await repo.GetByIdAsync(entryId, ct);
        if (entry is null) return Results.NotFound();

        entry.Condition = input.Condition;
        entry.Quantity = input.Quantity;
        entry.PurchasePrice = input.PurchasePrice;
        entry.StorageLocation = input.StorageLocation;
        entry.Notes = input.Notes;

        await repo.UpdateAsync(entry, ct);
        return Results.Ok(CollectionEntryDto.FromEntry(entry));
    }
}

public sealed record CollectionUpdateInput(
    CardCondition Condition, int Quantity,
    decimal? PurchasePrice, string? StorageLocation, string? Notes);
