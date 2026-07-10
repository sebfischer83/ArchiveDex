namespace ArchiveDex.Application.CatalogTransfer.Package;

/// <summary>
/// A verified source image that can be reopened and streamed into a transfer package.
/// Source paths remain private to the infrastructure implementation.
/// </summary>
public sealed record CatalogPackageImage(
    string ContentHash,
    string Format,
    long ByteLength,
    Func<CancellationToken, Task<Stream>> OpenReadAsync);
