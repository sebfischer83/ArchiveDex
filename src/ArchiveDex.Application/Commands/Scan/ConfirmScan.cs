using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace ArchiveDex.Application.Commands.Scan;

public sealed record ConfirmScan(
    Guid ScanId,
    Guid CardId,
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes);

public static class ConfirmScanHandler
{
    public static async Task<CollectionEntryDto> Handle(
        ConfirmScan command,
        IScanRepository scanRepository,
        ICatalogRepository catalogRepository,
        ICollectionRepository collectionRepository,
        CancellationToken ct)
    {
        if (command.Quantity < 1)
        {
            throw new ValidationException("Quantity must be at least 1.");
        }
        if (command.PurchasePrice is < 0)
        {
            throw new ValidationException("Purchase price cannot be negative.");
        }

        ScanJob? scan = await scanRepository.GetByIdAsync(command.ScanId, ct)
            ?? throw new InvalidOperationException("Scan not found");

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
            FrontImagePath = scan.ImageAsset.RelativePath,
            DateAdded = DateTime.UtcNow
        };

        await collectionRepository.AddAsync(entry, ct);

        scan.Status = ScanJobStatus.Confirmed;
        scan.ResultingCollectionEntryId = entry.Id;
        await scanRepository.UpdateAsync(scan, ct);

        return CollectionEntryDto.FromEntry(entry);
    }
}
