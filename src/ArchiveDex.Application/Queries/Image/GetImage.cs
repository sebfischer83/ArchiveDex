using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Image;

public sealed record GetImage(string FileName);

public static class GetImageHandler
{
    public static async Task<Stream> Handle(
        GetImage query,
        IImageStore imageStore,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(query.FileName) ||
            query.FileName.Contains("..") ||
            Path.IsPathRooted(query.FileName))
        {
            throw new ArgumentException("Invalid file name.");
        }

        return await imageStore.GetAsync(query.FileName, ct);
    }
}
