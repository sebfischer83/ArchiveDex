using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

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

        public async Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
        {
            var ext = Path.GetExtension(fileName);
            if (!AllowedExtensions.Contains(ext))
            {
                throw new InvalidOperationException($"Unsupported image format: {ext}. Allowed: JPEG, PNG, WebP.");
            }

            ImageFormat format = ext.ToLowerInvariant() switch
            {
                ".jpg" or ".jpeg" => ImageFormat.Jpeg,
                ".png" => ImageFormat.Png,
                ".webp" => ImageFormat.WebP,
                _ => throw new InvalidOperationException("Unsupported format")
            };

            var id = Guid.NewGuid().ToString("N");
            var relativePath = Path.Combine(id[..2], id[2..4], $"{id}{ext}");
            var fullPath = Path.Combine(_basePath, relativePath);
            _ = Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

            await using var fs = new FileStream(fullPath, FileMode.Create);
            await imageStream.CopyToAsync(fs, ct);
            var sizeBytes = fs.Length;

            if (sizeBytes > MaxSizeBytes)
            {
                File.Delete(fullPath);
                throw new InvalidOperationException($"Image exceeds maximum size of {MaxSizeBytes / 1024 / 1024} MB.");
            }

            return new ImageAsset
            {
                Id = Guid.NewGuid(),
                RelativePath = relativePath,
                Format = format,
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
