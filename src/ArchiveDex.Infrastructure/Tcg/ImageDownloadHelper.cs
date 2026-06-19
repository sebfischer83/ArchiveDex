using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Infrastructure.Tcg;

internal static class ImageDownloadHelper
{
    public static async Task<CardImageDownload?> DownloadAsync(
        HttpClient http,
        string imageUrl,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(imageUrl)) return null;

        using var response = await http.GetAsync(imageUrl, ct);
        if (!response.IsSuccessStatusCode) return null;

        var stream = new MemoryStream();
        await response.Content.CopyToAsync(stream, ct);
        stream.Position = 0;

        var fileName = Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri)
            ? Path.GetFileName(uri.AbsolutePath)
            : Path.GetFileName(imageUrl);

        if (string.IsNullOrWhiteSpace(fileName))
            fileName = "card-image";

        return new CardImageDownload(stream, fileName);
    }
}
