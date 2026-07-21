using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions;

public interface IPendingResolutionService
{
    Task ReMergeSetAsync(string source, string language, string externalSetId, Guid cardSetId, CancellationToken ct = default);
}

public sealed record PendingCardCandidate(Guid CardPrintId, string Name, string Number, IReadOnlyList<string> Reasons);

public sealed record PendingCardMappingView(
    Guid Id,
    string Source,
    string Language,
    string ExternalSetId,
    string ExternalCardId,
    string IncomingName,
    string IncomingNumber,
    Guid CardSetId,
    string CardSetName,
    IReadOnlyList<PendingCardCandidate> Candidates,
    MappingStatus Status,
    DateTime CreatedAt);

public interface IPendingCardMappingService
{
    Task<IReadOnlyList<PendingCardMappingView>> ListAsync(MappingStatus status, CancellationToken ct = default);
    Task AssignAsync(Guid id, Guid cardPrintId, CancellationToken ct = default);
    Task CreateNewAsync(Guid id, CancellationToken ct = default);
    Task RejectAsync(Guid id, CancellationToken ct = default);
}

public sealed class PendingMappingNotFoundException(string message) : InvalidOperationException(message);
public sealed class PendingMappingAlreadyResolvedException(string message) : InvalidOperationException(message);
public sealed class CatalogImportActiveException(string message) : InvalidOperationException(message);
