using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions;

public interface IImageStore
{
    Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default);
    Task<Stream> GetAsync(string relativePath, CancellationToken ct = default);
    Task DeleteAsync(string relativePath, CancellationToken ct = default);
}
