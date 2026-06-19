using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Collection;

public sealed record UpdateCollectionEntry(
    Guid EntryId,
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes
);

public static class UpdateCollectionEntryHandler
{
    public static async Task<CollectionEntryDto> Handle(
        UpdateCollectionEntry command,
        ICollectionRepository repo,
        CancellationToken ct)
    {
        var entry = await repo.GetByIdAsync(command.EntryId, ct)
            ?? throw new InvalidOperationException("Collection entry not found.");

        entry.Condition = command.Condition;
        entry.Quantity = command.Quantity;
        entry.PurchasePrice = command.PurchasePrice;
        entry.StorageLocation = command.StorageLocation;
        entry.Notes = command.Notes;

        await repo.UpdateAsync(entry, ct);
        return CollectionEntryDto.FromEntry(entry);
    }
}
