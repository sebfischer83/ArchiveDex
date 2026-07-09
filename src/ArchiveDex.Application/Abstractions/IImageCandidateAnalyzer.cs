using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions
{
    public interface IImageCandidateAnalyzer
    {
        Task<ImageCandidateMetadata> AnalyzeAsync(
            string source, string sourceUrl, ImageEntityType entityType,
            Guid? entityId, Guid importRunId, CancellationToken ct = default);

        Task<CatalogImageAsset?> SelectAndStoreBestAsync(
            List<ImageCandidateMetadata> candidates,
            string storageRootPath,
            CancellationToken ct = default);

        Task DeleteTemporaryFilesAsync(List<ImageCandidateMetadata> candidates, CancellationToken ct = default);
    }
}
