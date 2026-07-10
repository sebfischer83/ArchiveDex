using ArchiveDex.Application.CatalogTransfer.Package;

namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Batched enumeration of only in-scope canonical catalog records and readable images.
/// </summary>
public interface ICatalogSnapshotStore
{
    /// <summary>
    /// Writes the catalog JSON directly to <paramref name="output" in bounded pages.
    /// </summary>
    Task<CatalogSnapshotSummary> WriteSnapshotAsync(Stream output, CancellationToken ct = default);
    Task<CatalogSnapshot> CreateSnapshotAsync(CancellationToken ct = default);
    IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(CancellationToken ct = default);
    IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(CatalogSnapshot snapshot, CancellationToken ct = default);
    Task CleanupAsync(CancellationToken ct = default);
    Task<bool> IsTargetEligibleForImportAsync(CancellationToken ct = default);
}
