using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Infrastructure.Storage;

/// <summary>
/// Target-local catalog image validation, staging, promotion, capacity checks,
/// and cleanup for catalog import.
/// </summary>
public class CatalogTransferImageStore : ICatalogImageStore
{
    private readonly string _baseRoot;

    public CatalogTransferImageStore(string baseRoot = "/app/images")
    {
        _baseRoot = baseRoot;
    }

    public Task<bool> HasCapacityAsync(long requiredBytes, CancellationToken ct = default)
    {
        try
        {
            var drive = new DriveInfo(Path.GetPathRoot(_baseRoot) ?? "/");
            var available = drive.AvailableFreeSpace;
            const long stagingOverhead = 50L * 1024 * 1024;
            return Task.FromResult(available >= requiredBytes + stagingOverhead);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public async Task StageImageAsync(string stagingRoot, string contentHash, Stream stream, CancellationToken ct = default)
    {
        var stagingDir = Path.Combine(stagingRoot, "images", contentHash[..2], contentHash[2..4]);
        Directory.CreateDirectory(stagingDir);

        var destPath = Path.Combine(stagingDir, $"{contentHash}");
        await using var fs = new FileStream(destPath, FileMode.Create, FileAccess.Write);
        await stream.CopyToAsync(fs, ct);
    }

    public Task PromoteImagesAsync(string stagingRoot, string targetRoot, CancellationToken ct = default)
    {
        var stagingImagesDir = Path.Combine(stagingRoot, "images");
        if (!Directory.Exists(stagingImagesDir)) return Task.CompletedTask;

        var targetImagesDir = Path.Combine(_baseRoot, targetRoot);
        Directory.CreateDirectory(targetImagesDir);

        foreach (var srcFile in Directory.EnumerateFiles(stagingImagesDir, "*", SearchOption.AllDirectories))
        {
            var relativePath = Path.GetRelativePath(stagingImagesDir, srcFile);
            var destPath = Path.Combine(targetImagesDir, relativePath);
            var destDir = Path.GetDirectoryName(destPath)!;
            if (!Directory.Exists(destDir))
                Directory.CreateDirectory(destDir);
            File.Move(srcFile, destPath, overwrite: true);
        }

        return Task.CompletedTask;
    }

    public Task DeletePromotedAsync(string targetRoot, CancellationToken ct = default)
    {
        string fullPath = Path.GetFullPath(Path.Combine(_baseRoot, targetRoot));
        string root = Path.GetFullPath(_baseRoot).TrimEnd(Path.DirectorySeparatorChar)
            + Path.DirectorySeparatorChar;
        if (fullPath.StartsWith(root, StringComparison.Ordinal) && Directory.Exists(fullPath))
            Directory.Delete(fullPath, recursive: true);
        return Task.CompletedTask;
    }

    public Task DeleteStagingAsync(string stagingRoot, CancellationToken ct = default)
    {
        if (Directory.Exists(stagingRoot))
        {
            try { Directory.Delete(stagingRoot, recursive: true); }
            catch { /* best effort */ }
        }
        return Task.CompletedTask;
    }

    public string ResolveImagePath(string targetRoot, string contentHash, string format)
    {
        var ext = format.Trim().TrimStart('.').ToLowerInvariant() switch
        {
            "jpeg" or "jpg" => ".jpg",
            "png" => ".png",
            _ => ".webp",
        };
        return $"{targetRoot}/sha256/{contentHash}{ext}";
    }

    private static readonly char[] SafePathChars = "abcdef0123456789".ToCharArray();

    private static bool IsSafeRelativePath(string path)
    {
        if (string.IsNullOrWhiteSpace(path)) return false;
        if (Path.IsPathRooted(path)) return false;
        if (path.Contains("..")) return false;
        return true;
    }
}
