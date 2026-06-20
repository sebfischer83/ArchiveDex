using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions
{
    /// <summary>Incoming set as reported by an external source for one language.</summary>
    public sealed record ImportedSetDto(
        string Source,
        string Language,
        string ExternalId,
        string Name,
        DateOnly? ReleaseDate = null,
        int? PrintedTotal = null,
        int? OfficialTotal = null,
        string? Url = null,
        string? Series = null);

    /// <summary>Best candidate found for an incoming set, with score and explanation.</summary>
    public sealed record SetMatchResult(
        CardSet? CardSet,
        int Score,
        IReadOnlyList<string> Reasons);

    public interface ISetImportService
    {
        /// <summary>
        /// Resolves an incoming set to a canonical <see cref="CardSet"/>:
        /// reuse via external id, reuse via verified/manual mapping, auto-attach on
        /// high confidence, or create a new set (recording a pending mapping when uncertain).
        /// Always returns a usable CardSet so card import can proceed.
        /// </summary>
        Task<CardSet> ImportSetAsync(ImportedSetDto incoming, CancellationToken cancellationToken);
    }

    public interface ISetMatchingService
    {
        Task<SetMatchResult> FindBestMatchAsync(ImportedSetDto incoming, CancellationToken cancellationToken);
    }

    public interface ISetMappingService
    {
        Task AcceptPendingMappingAsync(Guid pendingMappingId, Guid cardSetId, CancellationToken cancellationToken);
        Task RejectPendingMappingAsync(Guid pendingMappingId, CancellationToken cancellationToken);
        Task CreateNewSetFromPendingAsync(Guid pendingMappingId, CancellationToken cancellationToken);
        Task CreateRelationFromPendingAsync(Guid pendingMappingId, Guid targetCardSetId, SetRelationType relationType, CancellationToken cancellationToken);
    }
}
