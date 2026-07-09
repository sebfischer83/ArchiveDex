using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions
{
    public interface ICatalogImportRepository
    {
        Task<CatalogImportRun?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<CatalogImportRun?> GetActiveImportAsync(CancellationToken ct = default);
        Task AddRunAsync(CatalogImportRun run, CancellationToken ct = default);
        Task UpdateRunAsync(CatalogImportRun run, CancellationToken ct = default);
        Task<bool> HasActiveImportAsync(CancellationToken ct = default);

        Task UpsertCheckpointAsync(CatalogImportCheckpoint checkpoint, CancellationToken ct = default);
        Task<List<CatalogImportCheckpoint>> GetCheckpointsByRunIdAsync(Guid importRunId, CancellationToken ct = default);

        Task AddSetSnapshotAsync(SourceSetSnapshot snapshot, CancellationToken ct = default);
        Task AddCardSnapshotAsync(SourceCardSnapshot snapshot, CancellationToken ct = default);

        Task AddErrorAsync(SourceImportError error, CancellationToken ct = default);
        Task<List<SourceImportError>> GetErrorsByRunIdAsync(Guid importRunId, string? severity = null, CancellationToken ct = default);

        Task AddImageCandidateMetadataAsync(ImageCandidateMetadata metadata, CancellationToken ct = default);
        Task<List<ImageCandidateMetadata>> GetImageCandidatesByRunIdAsync(Guid importRunId, CancellationToken ct = default);

        Task AddCatalogImageAssetAsync(CatalogImageAsset asset, CancellationToken ct = default);
        Task<CatalogImageAsset?> GetCatalogImageAssetAsync(string entityType, Guid entityId, CancellationToken ct = default);
    }
}
