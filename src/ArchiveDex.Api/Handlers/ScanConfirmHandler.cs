using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class ScanConfirmHandler
{
    [WolverinePost("/api/scans/{scanId}/confirm")]
    public static async Task<IResult> Handle(
        Guid scanId, ScanConfirmInput request,
        IScanRepository scanRepository,
        ICatalogRepository catalogRepository,
        ICollectionRepository collectionRepository,
        CancellationToken ct)
    {
        var scan = await scanRepository.GetByIdAsync(scanId, ct);
        if (scan is null)
            return Results.NotFound();

        _ = await catalogRepository.GetByIdAsync(request.CardId, ct)
            ?? throw new InvalidOperationException("Card not found");

        var entry = new CollectionEntry
        {
            Id = Guid.NewGuid(),
            CardPrintId = request.CardId,
            Condition = request.Condition,
            Quantity = request.Quantity,
            PurchasePrice = request.PurchasePrice,
            StorageLocation = request.StorageLocation,
            Notes = request.Notes,
            FrontImagePath = scan.ImageAsset.RelativePath,
            DateAdded = DateTime.UtcNow
        };

        await collectionRepository.AddAsync(entry, ct);
        scan.Status = ScanJobStatus.Confirmed;
        scan.ResultingCollectionEntryId = entry.Id;
        await scanRepository.UpdateAsync(scan, ct);

        return Results.Created($"/api/collection/{entry.Id}", CollectionEntryDto.FromEntry(entry));
    }
}

public sealed record ScanConfirmInput(
    Guid CardId, CardCondition Condition, int Quantity,
    decimal? PurchasePrice, string? StorageLocation, string? Notes);
