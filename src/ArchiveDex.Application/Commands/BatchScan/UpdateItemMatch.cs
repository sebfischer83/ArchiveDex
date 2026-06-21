using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.BatchScan;

public sealed record UpdateItemMatch(Guid BatchId, Guid ItemId, Guid CardPrintId);

public sealed record UpdateItemMatchResult(
    Guid Id,
    Guid BatchId,
    int SortOrder,
    string? ImageUrl,
    string MatchStatus,
    bool IsReviewed,
    Guid? MatchedCardPrintId);

public static class UpdateItemMatchHandler
{
    public static async Task<UpdateItemMatchResult> Handle(
        UpdateItemMatch command,
        IBatchScanRepository batchRepo,
        ICatalogRepository catalogRepo,
        CancellationToken ct)
    {
        BatchScanItem? item = await batchRepo.GetItemByIdAsync(command.BatchId, command.ItemId, ct)
            ?? throw new InvalidOperationException("Item not found.");

        CardPrint? card = await catalogRepo.GetByIdAsync(command.CardPrintId, ct)
            ?? throw new InvalidOperationException("Card not found in catalog.");

        item.MatchedCardPrintId = card.Id;
        item.MatchStatus = BatchItemMatchStatus.Overridden;
        item.IsReviewed = true;

        await batchRepo.UpdateItemAsync(item, ct);

        return new UpdateItemMatchResult(
            item.Id, item.BatchScanJobId, item.SortOrder,
            item.ImageAsset is null ? null : $"/api/images/{item.ImageAsset.RelativePath.Replace('\\', '/')}",
            item.MatchStatus.ToString(), item.IsReviewed, item.MatchedCardPrintId);
    }
}
