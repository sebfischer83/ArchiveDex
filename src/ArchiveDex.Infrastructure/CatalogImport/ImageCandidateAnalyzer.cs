using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class ImageCandidateAnalyzer : IImageCandidateAnalyzer
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ImageCandidateAnalyzer> _logger;

        public ImageCandidateAnalyzer(IHttpClientFactory httpClientFactory, ILogger<ImageCandidateAnalyzer> logger)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<ImageCandidateMetadata> AnalyzeAsync(
            string source, string sourceUrl, ImageEntityType entityType,
            Guid? entityId, Guid importRunId, CancellationToken ct = default)
        {
            var metadata = new ImageCandidateMetadata
            {
                ImportRunId = importRunId,
                EntityType = entityType,
                EntityId = entityId,
                Source = source,
                SourceUrl = sourceUrl,
                AnalyzedAt = DateTime.UtcNow
            };

            try
            {
                var httpClient = _httpClientFactory.CreateClient("CatalogImport");
                var response = await httpClient.GetAsync(sourceUrl, ct);
                if (!response.IsSuccessStatusCode)
                {
                    metadata.Error = $"HTTP {(int)response.StatusCode}";
                    return metadata;
                }

                var contentType = response.Content.Headers.ContentType?.MediaType;
                var bytes = await response.Content.ReadAsByteArrayAsync(ct);
                if (bytes.Length == 0)
                {
                    metadata.Error = "Empty response body";
                    return metadata;
                }

                metadata.FileSizeBytes = bytes.Length;
                metadata.Format = DetectFormat(sourceUrl, contentType);
                metadata.Sha256 = ComputeSha256(bytes);
                metadata.QualityScore = CalculateScore(metadata, source);
            }
            catch (Exception ex)
            {
                metadata.Error = $"Download failed: {ex.Message}";
            }

            return metadata;
        }

        public async Task<CatalogImageAsset?> SelectAndStoreBestAsync(
            List<ImageCandidateMetadata> candidates,
            string storageRootPath,
            CancellationToken ct = default)
        {
            var valid = candidates
                .Where(c => c.Error == null && c.QualityScore.HasValue)
                .OrderByDescending(c => c.QualityScore!.Value)
                .ThenByDescending(c => c.FileSizeBytes ?? 0)
                .ThenBy(c => c.Source is "TCGdex" ? 0 : c.Source is "Limitless" ? 1 : 2)
                .ThenBy(c => c.SourceUrl)
                .ToList();

            if (valid.Count == 0) return null;

            var best = valid[0];
            foreach (var c in valid.Skip(1))
                c.IsSelected = false;

            if (best.EntityId == null) return null;

            var asset = new CatalogImageAsset
            {
                EntityType = best.EntityType,
                EntityId = best.EntityId.Value,
                Source = best.Source,
                SourceUrl = best.SourceUrl,
                Width = best.Width ?? 0,
                Height = best.Height ?? 0,
                Format = best.Format ?? "unknown",
                FileSizeBytes = best.FileSizeBytes ?? 0,
                Sha256 = best.Sha256 ?? string.Empty,
                QualityScore = best.QualityScore ?? 0,
                IsManuallySelected = false,
                LocalPath = BuildLocalPath(storageRootPath, best),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            best.IsSelected = true;
            return asset;
        }

        public Task DeleteTemporaryFilesAsync(List<ImageCandidateMetadata> candidates, CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        private static decimal CalculateScore(ImageCandidateMetadata metadata, string source)
        {
            decimal fileSizeScore = Math.Min((decimal)(metadata.FileSizeBytes ?? 0) / 100_000m, 10m);

            decimal formatScore = metadata.Format?.ToUpperInvariant() switch
            {
                "PNG" => 2m,
                "WEBP" => 2m,
                "JPEG" or "JPG" => 1.5m,
                _ => 1m
            };

            decimal sourceScore = source?.ToUpperInvariant() switch
            {
                "TCGDEX" => 0.5m,
                "LIMITLESS" => 0.2m,
                _ => 0.1m
            };

            return fileSizeScore + formatScore + sourceScore;
        }

        private static string DetectFormat(string url, string? contentType)
        {
            if (!string.IsNullOrWhiteSpace(contentType))
            {
                if (contentType.Contains("png")) return "PNG";
                if (contentType.Contains("webp")) return "WEBP";
                if (contentType.Contains("jpeg") || contentType.Contains("jpg")) return "JPEG";
            }
            var ext = Path.GetExtension(url)?.ToLowerInvariant();
            return ext switch
            {
                ".png" => "PNG",
                ".webp" => "WEBP",
                ".jpg" or ".jpeg" => "JPEG",
                _ => "unknown"
            };
        }

        private static string ComputeSha256(byte[] bytes)
        {
            var hash = System.Security.Cryptography.SHA256.HashData(bytes);
            return Convert.ToHexStringLower(hash);
        }

        private static string BuildLocalPath(string rootPath, ImageCandidateMetadata best)
        {
            var dir = best.EntityType switch
            {
                ImageEntityType.CardSet => Path.Combine(rootPath, "sets"),
                ImageEntityType.CardPrint => Path.Combine(rootPath, "cards"),
                _ => Path.Combine(rootPath, "other")
            };
            Directory.CreateDirectory(dir);
            var ext = best.Format?.ToLowerInvariant() switch
            {
                "png" => ".png",
                "webp" => ".webp",
                "jpeg" or "jpg" => ".jpg",
                _ => ".png"
            };
            return Path.Combine(dir, $"{best.EntityId}{ext}");
        }
    }
}
