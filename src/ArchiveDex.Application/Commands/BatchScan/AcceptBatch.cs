using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.BatchScan.DTOs;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.BatchScan;

public sealed record AcceptBatch(
    Guid BatchId,
    List<AcceptBatchItem> Items,
    AcceptBatchDefaults? Defaults);

public sealed record AcceptBatchDefaults(
    string? Condition,
    int? Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes);

public sealed record AcceptBatchItem(
    Guid ItemId,
    string? Condition,
    int? Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes,
    string? DuplicateAction);

public static class AcceptBatchHandler
{
    public static async Task<BatchAcceptResult> Handle(
        AcceptBatch command,
        IBatchScanRepository batchRepo,
        ICollectionRepository collectionRepo,
        ICatalogRepository catalogRepo,
        CancellationToken ct)
    {
        BatchScanJob? job = await batchRepo.GetByIdAsync(command.BatchId, ct)
            ?? throw new InvalidOperationException("Batch not found.");

        if (job.Status != BatchStatus.ReadyForReview && job.Status != BatchStatus.PartiallyAccepted)
            throw new InvalidOperationException("Batch is not ready for acceptance.");

        var acceptedEntryIds = new List<Guid>();
        var duplicateConflicts = new List<DuplicateConflictDto>();

        string defaultCondition = command.Defaults?.Condition ?? "NM";
        int defaultQuantity = command.Defaults?.Quantity ?? 1;

        foreach (var acceptItem in command.Items)
        {
            BatchScanItem? item = job.Items.FirstOrDefault(i => i.Id == acceptItem.ItemId);
            if (item is null || item.MatchedCardPrintId is null) continue;
            if (item.MatchStatus is BatchItemMatchStatus.NoMatch or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.Accepted) continue;

            CardPrint? card = await catalogRepo.GetByIdAsync(item.MatchedCardPrintId.Value, ct);
            if (card is null) continue;

            var condition = Enum.TryParse<CardCondition>(
                acceptItem.Condition ?? defaultCondition, out var parsed) ? parsed : CardCondition.NM;
            var quantity = acceptItem.Quantity ?? defaultQuantity;

            CollectionEntry? existing = await collectionRepo.FindByCardAndConditionAsync(card.Id, condition, ct);
            if (existing is not null)
            {
                var duplicateAction = acceptItem.DuplicateAction?.ToLowerInvariant() ?? "skip";
                if (duplicateAction == "merge")
                {
                    existing.Quantity += quantity;
                    decimal? purchasePrice = acceptItem.PurchasePrice ?? command.Defaults?.PurchasePrice;
                    if (purchasePrice.HasValue) existing.PurchasePrice = purchasePrice.Value;
                    existing.StorageLocation = acceptItem.StorageLocation ?? command.Defaults?.StorageLocation ?? existing.StorageLocation;
                    existing.Notes = acceptItem.Notes ?? command.Defaults?.Notes ?? existing.Notes;
                    await collectionRepo.UpdateAsync(existing, ct);

                    item.CollectionEntryId = existing.Id;
                    item.MatchStatus = BatchItemMatchStatus.Accepted;
                    await batchRepo.UpdateItemAsync(item, ct);

                    acceptedEntryIds.Add(existing.Id);
                    continue;
                }

                if (duplicateAction != "separate")
                {
                    duplicateConflicts.Add(new DuplicateConflictDto(
                        item.Id, existing.Id,
                        card.Name ?? "Unknown", condition.ToString(),
                        "Card already in collection. Merge quantities or create separate entry."));
                    continue;
                }
            }

            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = condition,
                Quantity = quantity,
                PurchasePrice = acceptItem.PurchasePrice ?? command.Defaults?.PurchasePrice,
                StorageLocation = acceptItem.StorageLocation ?? command.Defaults?.StorageLocation,
                Notes = acceptItem.Notes ?? command.Defaults?.Notes,
                FrontImagePath = item.ImageAsset?.RelativePath ?? string.Empty,
                DateAdded = DateTime.UtcNow
            };

            await collectionRepo.AddAsync(entry, ct);

            item.CollectionEntryId = entry.Id;
            item.MatchStatus = BatchItemMatchStatus.Accepted;
            await batchRepo.UpdateItemAsync(item, ct);

            acceptedEntryIds.Add(entry.Id);
        }

        job = await batchRepo.GetByIdAsync(command.BatchId, ct);
        if (job is not null)
        {
            bool allResolved = job.Items.All(i =>
                i.MatchStatus is BatchItemMatchStatus.Accepted or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.NoMatch);
            job.Status = allResolved ? BatchStatus.Complete : BatchStatus.PartiallyAccepted;
            if (allResolved) job.CompletedAt = DateTime.UtcNow;
            await batchRepo.UpdateJobAsync(job, ct);
        }

        return new BatchAcceptResult(
            acceptedEntryIds.Count, duplicateConflicts,
            job?.Status.ToString() ?? "Unknown", acceptedEntryIds);
    }
}
