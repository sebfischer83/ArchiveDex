using ArchiveDex.Server.Infrastructure.Images;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    /// <summary>
    /// Runs the detector over real photos and reports hit rate against distortion. Not a pass/fail
    /// unit test: it measures quality on actual shooting conditions and writes the crops out for a
    /// human to look at. Skipped automatically when the sample folder is absent.
    ///
    /// The output is warped onto a canvas with the true card ratio, so a detected quadrilateral that
    /// deviates from that ratio is stretched by exactly that deviation. The aspect tolerance
    /// therefore trades hit rate directly against visible distortion.
    /// </summary>
    public sealed class CardDetectionBenchmark
    {
        private static readonly string SampleFolder =
            Path.Combine(FindRepositoryRoot() ?? ".", "data");

        private static readonly string OutputFolder =
            Path.Combine(Path.GetTempPath(), "archivedex-card-detection");

        [Fact]
        public void ReportHitRateAgainstDistortion()
        {
            if (!Directory.Exists(SampleFolder)) return;
            var photos = Directory.GetFiles(SampleFolder, "*.JPEG")
                .Concat(Directory.GetFiles(SampleFolder, "*.jpg"))
                .OrderBy(x => x)
                .ToList();
            if (photos.Count == 0) return;

            Directory.CreateDirectory(OutputFolder);
            var report = new List<string>();

            foreach (var tolerance in new[] { 0.12, 0.08, 0.06, 0.04, 0.03 })
            {
                var service = new CardDetectionService(
                    Options.Create(new CardDetectionOptions { AspectTolerance = tolerance }),
                    NullLogger<CardDetectionService>.Instance);

                var found = 0;
                var worstDistortion = 0.0;
                foreach (var path in photos)
                {
                    var result = service.Detect(File.ReadAllBytes(path));
                    if (!result.Found) continue;

                    found++;
                    var stretch = MeasuredAspect(result.Quad!) / (63.0 / 88.0);
                    worstDistortion = Math.Max(worstDistortion, Math.Abs(stretch - 1));

                    // Only the shipping configuration writes files, so the folder stays comparable.
                    if (Math.Abs(tolerance - new CardDetectionOptions().AspectTolerance) < 0.0001)
                    {
                        File.WriteAllBytes(
                            Path.Combine(OutputFolder, $"{Path.GetFileNameWithoutExtension(path)}.png"),
                            result.Cropped!);
                    }
                }

                report.Add($"tolerance {tolerance:F2}  ->  {found}/{photos.Count} detected"
                    + $" ({100.0 * found / photos.Count:F0} %)"
                    + $", worst distortion {worstDistortion * 100:F1} %");
            }

            report.Add($"crops written to {OutputFolder}");
            File.WriteAllLines(Path.Combine(OutputFolder, "report.txt"), report);
            Assert.True(true, string.Join(Environment.NewLine, report));
        }

        /// <summary>Short side over long side of the detected quadrilateral, averaged per side pair.</summary>
        private static double MeasuredAspect(CardQuad quad)
        {
            var c = quad.Corners;
            double Distance(int a, int b) =>
                Math.Sqrt(Math.Pow(c[a].X - c[b].X, 2) + Math.Pow(c[a].Y - c[b].Y, 2));

            var width = (Distance(0, 1) + Distance(3, 2)) / 2;
            var height = (Distance(0, 3) + Distance(1, 2)) / 2;
            return Math.Min(width, height) / Math.Max(width, height);
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
