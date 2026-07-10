using ArchiveDex.Application.CatalogTransfer.Package;

namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Reads and writes portable catalog transfer packages.
/// </summary>
public interface ICatalogTransferArchive
{
    Task WritePackageAsync(
        Stream outputStream,
        CatalogSnapshot snapshot,
        IAsyncEnumerable<CatalogPackageImage> images,
        CancellationToken ct = default);
    Task WriteStreamedPackageAsync(
        Stream outputStream,
        Stream catalogStream,
        CatalogSnapshotSummary summary,
        IAsyncEnumerable<CatalogPackageImage> images,
        CancellationToken ct = default);
    Task<CatalogTransferManifest> ReadManifestAsync(Stream packageStream, CancellationToken ct = default);
    Task VisitCatalogItemsAsync(
        Stream packageStream,
        Func<string, string, CancellationToken, Task> visitItem,
        CancellationToken ct = default);
    Task<CatalogSnapshot> ReadCatalogSnapshotAsync(Stream packageStream, CancellationToken ct = default);
    Task ReadImagesAsync(Stream packageStream, string stagingRoot, CatalogTransferManifest manifest, CancellationToken ct = default);
}
