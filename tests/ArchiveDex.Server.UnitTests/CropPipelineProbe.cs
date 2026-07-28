using ArchiveDex.Server.Infrastructure.Images;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    /// <summary>
    /// Reproduces exactly what the upload path produces — normalize, detect, re-encode — and reports
    /// the dimensions of every artefact. Diagnostic only; skipped when the sample folder is absent.
    /// </summary>
    public sealed class CropPipelineProbe
    {
        [Fact]
        public async Task ReportDimensionsThroughTheRealUploadPath()
        {
            var root = FindRepositoryRoot();
            if (root is null) return;
            var folder = Path.Combine(root, "data");
            if (!Directory.Exists(folder)) return;

            var outputFolder = Path.Combine(Path.GetTempPath(), "archivedex-crop-probe");
            Directory.CreateDirectory(outputFolder);

            var detector = new CardDetectionService(
                Options.Create(new CardDetectionOptions()),
                NullLogger<CardDetectionService>.Instance);
            var service = new ImageNormalizationService(detector);

            var lines = new List<string>();
            foreach (var path in Directory.GetFiles(folder, "*.JPEG").OrderBy(x => x))
            {
                var name = Path.GetFileNameWithoutExtension(path);
                await using var upload = File.OpenRead(path);
                var result = await service.NormalizeAsync(
                    upload, "image/jpeg", TestContext.Current.CancellationToken);

                using var normalized = Image.Load(result.Content);
                var line = $"{name}  normalized {normalized.Width}x{normalized.Height}"
                    + $" ({normalized.Width / (double)normalized.Height:F3})";

                if (result.Crop is { } crop)
                {
                    using var cropped = Image.Load(crop.Content);
                    using var thumb = Image.Load(crop.Thumbnail);
                    line += $"  |  crop {cropped.Width}x{cropped.Height}"
                        + $" ({cropped.Width / (double)cropped.Height:F3})"
                        + $"  thumb {thumb.Width}x{thumb.Height}"
                        + $" ({thumb.Width / (double)thumb.Height:F3})";
                    File.WriteAllBytes(Path.Combine(outputFolder, $"{name}-crop.webp"), crop.Content);
                }
                else
                {
                    line += "  |  no crop";
                }

                lines.Add(line);
            }

            File.WriteAllLines(Path.Combine(outputFolder, "dimensions.txt"), lines);
            Assert.True(true, string.Join(Environment.NewLine, lines));
        }

        private static string? FindRepositoryRoot()
        {
            var directory = new DirectoryInfo(AppContext.BaseDirectory);
            while (directory is not null)
            {
                if (File.Exists(Path.Combine(directory.FullName, "ArchiveDex.slnx")))
                    return directory.FullName;
                directory = directory.Parent;
            }

            return null;
        }
    }
}
