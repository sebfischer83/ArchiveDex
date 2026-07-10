namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Target-local catalog image validation, staging, promotion, and deletion.
/// </summary>
public interface ICatalogImageStore
{
    Task<bool> HasCapacityAsync(long requiredBytes, CancellationToken ct = default);
    Task StageImageAsync(string stagingRoot, string contentHash, Stream stream, CancellationToken ct = default);
    Task PromoteImagesAsync(string stagingRoot, string targetRoot, CancellationToken ct = default);
    Task DeletePromotedAsync(string targetRoot, CancellationToken ct = default);
    Task DeleteStagingAsync(string stagingRoot, CancellationToken ct = default);
    string ResolveImagePath(string targetRoot, string contentHash, string format);
}
