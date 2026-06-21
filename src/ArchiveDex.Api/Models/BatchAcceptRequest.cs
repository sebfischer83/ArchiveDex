namespace ArchiveDex.Api.Models;

public sealed record AcceptBatchRequest(
    AcceptBatchDefaults? Defaults,
    List<AcceptBatchItem>? Items);

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
