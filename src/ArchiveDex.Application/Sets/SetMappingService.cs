using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Sets
{
    public class SetMappingService(
        ISetRepository repo,
        ICatalogTransferRepository? transferRepository = null) : ISetMappingService
    {
        private readonly ISetRepository _repo = repo;
        private readonly ICatalogTransferRepository? _transferRepository = transferRepository;

        /// <summary>Accept: attach the incoming external id to the chosen set, merging the provisional set into it.</summary>
        public async Task AcceptPendingMappingAsync(Guid pendingMappingId, Guid cardSetId, CancellationToken ct)
        {
            await EnsureCatalogWritesAllowedAsync(ct);
            PendingSetMapping pending = await GetOpenPendingAsync(pendingMappingId, ct);

            CardSetExternalId ext = await _repo.FindExternalIdAsync(
                pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId, ct)
                ?? throw new InvalidOperationException("Provisional external id not found for pending mapping.");

            if (ext.CardSetId != cardSetId)
            {
                await _repo.MergeAsync(ext.CardSetId, cardSetId, ct);
            }

            await _repo.UpsertMappingAsync(
                pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId,
                cardSetId, MappingConfidence.Verified, isManual: true, ct);

            Close(pending, MappingStatus.Accepted);
            await _repo.SaveChangesAsync(ct);
        }

        public async Task RejectPendingMappingAsync(Guid pendingMappingId, CancellationToken ct)
        {
            await EnsureCatalogWritesAllowedAsync(ct);
            PendingSetMapping pending = await GetOpenPendingAsync(pendingMappingId, ct);
            Close(pending, MappingStatus.Rejected);
            await _repo.SaveChangesAsync(ct);
        }

        /// <summary>Keep the provisional set as its own canonical set; record a verified manual mapping.</summary>
        public async Task CreateNewSetFromPendingAsync(Guid pendingMappingId, CancellationToken ct)
        {
            await EnsureCatalogWritesAllowedAsync(ct);
            PendingSetMapping pending = await GetOpenPendingAsync(pendingMappingId, ct);

            CardSetExternalId ext = await _repo.FindExternalIdAsync(
                pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId, ct)
                ?? throw new InvalidOperationException("Provisional external id not found for pending mapping.");

            await _repo.UpsertMappingAsync(
                pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId,
                ext.CardSetId, MappingConfidence.Verified, isManual: true, ct);

            Close(pending, MappingStatus.CreatedAsNewSet);
            await _repo.SaveChangesAsync(ct);
        }

        /// <summary>Not the same set: relate the provisional set to a target and keep both.</summary>
        public async Task CreateRelationFromPendingAsync(Guid pendingMappingId, Guid targetCardSetId, SetRelationType relationType, CancellationToken ct)
        {
            await EnsureCatalogWritesAllowedAsync(ct);
            PendingSetMapping pending = await GetOpenPendingAsync(pendingMappingId, ct);

            CardSetExternalId ext = await _repo.FindExternalIdAsync(
                pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId, ct)
                ?? throw new InvalidOperationException("Provisional external id not found for pending mapping.");

            DateTime now = DateTime.UtcNow;
            await _repo.AddRelationAsync(new SetRelation
            {
                Id = Guid.NewGuid(),
                SourceSetId = ext.CardSetId,
                TargetSetId = targetCardSetId,
                RelationType = relationType,
                Confidence = MappingConfidence.Verified,
                IsManual = true,
                CreatedAt = now,
                UpdatedAt = now
            }, ct);

            await _repo.UpsertMappingAsync(
                pending.IncomingSource, pending.IncomingLanguage, pending.IncomingExternalId,
                ext.CardSetId, MappingConfidence.Verified, isManual: true, ct);

            Close(pending, MappingStatus.Accepted);
            await _repo.SaveChangesAsync(ct);
        }

        private async Task<PendingSetMapping> GetOpenPendingAsync(Guid id, CancellationToken ct)
        {
            PendingSetMapping pending = await _repo.GetPendingAsync(id, ct)
                ?? throw new InvalidOperationException("Pending mapping not found.");
            return pending.Status != MappingStatus.Pending
                ? throw new InvalidOperationException($"Pending mapping already resolved as {pending.Status}.")
                : pending;
        }

        private async Task EnsureCatalogWritesAllowedAsync(CancellationToken ct)
        {
            if (_transferRepository is not null && await _transferRepository.HasActiveOperationAsync(ct))
                throw new InvalidOperationException("A catalog transfer is active; catalog changes are blocked.");
        }

        private static void Close(PendingSetMapping pending, MappingStatus status)
        {
            pending.Status = status;
            pending.UpdatedAt = DateTime.UtcNow;
        }
    }
}
