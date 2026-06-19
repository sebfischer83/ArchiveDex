using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Scan;

public sealed record ConfirmScan(
    Guid ScanId,
    Guid CardId,
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes
);

public static class ConfirmScanHandler
{
    public static async Task<CollectionEntryDto> Handle(
        ConfirmScan command,
        ICatalogRepository catalogRepository,
        ICollectionRepository collectionRepository,
        CancellationToken ct)
    {
        _ = await catalogRepository.GetByIdAsync(command.CardId, ct)
            ?? throw new InvalidOperationException("Card not found");

        var entry = new CollectionEntry
        {
            Id = Guid.NewGuid(),
            CardPrintId = command.CardId,
            Condition = command.Condition,
            Quantity = command.Quantity,
            PurchasePrice = command.PurchasePrice,
            StorageLocation = command.StorageLocation,
            Notes = command.Notes,
            FrontImagePath = string.Empty,
            DateAdded = DateTime.UtcNow
        };

        await collectionRepository.AddAsync(entry, ct);
        return CollectionEntryDto.FromEntry(entry);
    }
}
