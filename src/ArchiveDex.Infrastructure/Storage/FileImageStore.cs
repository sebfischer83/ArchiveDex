using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using SkiaSharp;

namespace ArchiveDex.Infrastructure.Storage
{
    public class FileImageStore : IImageStore
    {
        private readonly string _basePath;

        public FileImageStore(string basePath)
        {
            _basePath = basePath;
            _ = Directory.CreateDirectory(_basePath);
        }

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp"
        };

        private const long MaxSizeBytes = 10 * 1024 * 1024;
        private const int JpegWebPQuality = 92;

        public async Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
        {
            var ext = Path.GetExtension(fileName);
            if (!AllowedExtensions.Contains(ext))
            {
                throw new InvalidOperationException($"Unsupported image format: {ext}. Allowed: JPEG, PNG, WebP.");
            }

            using var ms = new MemoryStream();
            await imageStream.CopyToAsync(ms, ct);
            ms.Position = 0;

            var id = Guid.NewGuid().ToString("N");
            var outExt = ".webp";
            var relativePath = Path.Combine(id[..2], id[2..4], $"{id}{outExt}");
            var fullPath = Path.Combine(_basePath, relativePath);
            _ = Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

            var isJpeg = ext.Equals(".jpg", StringComparison.OrdinalIgnoreCase)
                || ext.Equals(".jpeg", StringComparison.OrdinalIgnoreCase);

            ms.Position = 0;
            using var bitmap = SKBitmap.Decode(ms);
            if (bitmap is null)
            {
                throw new InvalidOperationException("Failed to decode image.");
            }

            var quality = isJpeg ? JpegWebPQuality : 100;
            using var data = bitmap.Encode(SKEncodedImageFormat.Webp, quality);

            await using var fs = new FileStream(fullPath, FileMode.Create);
            data.SaveTo(fs);

            var sizeBytes = new FileInfo(fullPath).Length;
            if (sizeBytes > MaxSizeBytes)
            {
                File.Delete(fullPath);
                throw new InvalidOperationException($"Image exceeds maximum size of {MaxSizeBytes / 1024 / 1024} MB.");
            }

            return new ImageAsset
            {
                Id = Guid.NewGuid(),
                RelativePath = relativePath,
                Format = ImageFormat.WebP,
                SizeBytes = sizeBytes,
                CreatedAt = DateTime.UtcNow
            };
        }

        public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default)
        {
            // Normalize URL-style forward slashes to OS path separator before validation.
            var normalized = relativePath
                .Replace('/', Path.DirectorySeparatorChar)
                .Replace('\\', Path.DirectorySeparatorChar);

            // Reject absolute paths or any ".." segment (path traversal guard).
            if (Path.IsPathRooted(normalized) ||
                normalized.Split(Path.DirectorySeparatorChar).Any(s => s == ".."))
            {
                throw new FileNotFoundException("Invalid image path.");
            }

            var fullPath = Path.Combine(_basePath, normalized);
            return Task.FromResult<Stream>(new FileStream(fullPath, FileMode.Open, FileAccess.Read));
        }

        public Task DeleteAsync(string relativePath, CancellationToken ct = default)
        {
            var normalized = relativePath
                .Replace('/', Path.DirectorySeparatorChar)
                .Replace('\\', Path.DirectorySeparatorChar);

            if (Path.IsPathRooted(normalized) ||
                normalized.Split(Path.DirectorySeparatorChar).Any(s => s == ".."))
            {
                return Task.CompletedTask;
            }

            var fullPath = Path.Combine(_basePath, normalized);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }
    }
}
