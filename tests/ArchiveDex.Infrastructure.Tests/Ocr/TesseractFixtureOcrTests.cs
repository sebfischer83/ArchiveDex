using System.Text.Json;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Infrastructure.Ocr;
using Microsoft.Extensions.Options;

namespace ArchiveDex.Infrastructure.Tests.Ocr
{
    public sealed class TesseractFixtureOcrTests
    {
        private static readonly string FixtureDirectory = Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..",
            "Fixtures", "Scanning");

        [TesseractDataFact]
        public async Task ProcessAsync_ExtractsTextAndExpectedNumbers_FromFixtureImages()
        {
            var tessDataPath = TesseractDataFactAttribute.ResolveTessDataPath();
            Assert.False(string.IsNullOrWhiteSpace(tessDataPath));

            var engine = new TesseractOcrEngine(Options.Create(new TesseractOcrOptions
            {
                ImageBasePath = FixtureDirectory,
                TessDataPath = tessDataPath!,
                DefaultLanguages = TesseractDataFactAttribute.ResolveDefaultLanguages(tessDataPath!)
            }));

            foreach (ScanningFixture fixture in LoadFixtures())
            {
                OcrResult result = await engine.ProcessAsync(
                    Guid.NewGuid(),
                    fixture.File,
                    fixture.LanguageHint,
                    CancellationToken.None);

                Assert.False(string.IsNullOrWhiteSpace(result.RawText), $"OCR returned no text for {fixture.File}.");
                Assert.Contains(fixture.ExpectedNumber, NormalizeNumberText(result.RawText), StringComparison.OrdinalIgnoreCase);
                Assert.Equal(fixture.ExpectedNumber, result.DetectedNumber);
            }
        }

        private static IReadOnlyList<ScanningFixture> LoadFixtures()
        {
            var manifestPath = Path.Combine(FixtureDirectory, "fixtures.json");
            using FileStream stream = File.OpenRead(manifestPath);
            return JsonSerializer.Deserialize<List<ScanningFixture>>(stream, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? [];
        }

        private static string NormalizeNumberText(string value) => value.Replace(" ", string.Empty).Replace("\r", string.Empty).Replace("\n", string.Empty);

        private sealed record ScanningFixture(
            string File,
            string LanguageHint,
            string? ExpectedName,
            string ExpectedNumber,
            string? Notes);
    }

    public sealed class TesseractDataFactAttribute : FactAttribute
    {
        private static readonly string[] TessDataPathCandidates =
        [
            Environment.GetEnvironmentVariable("ARCHIVEDEX_TESSDATA_PATH") ?? string.Empty,
            Environment.GetEnvironmentVariable("TesseractOcr__TessDataPath") ?? string.Empty,
            "/usr/share/tesseract-ocr/5/tessdata",
            "/usr/share/tesseract-ocr/4.00/tessdata",
            @"C:\Program Files\Tesseract-OCR\tessdata"
        ];

        public TesseractDataFactAttribute()
        {
            var tessDataPath = ResolveTessDataPath();
            if (string.IsNullOrWhiteSpace(tessDataPath))
            {
                Skip = "Tesseract tessdata not found. Set ARCHIVEDEX_TESSDATA_PATH or run inside the Docker image.";
            }
        }

        public static string? ResolveTessDataPath() => TessDataPathCandidates
                .Where(path => !string.IsNullOrWhiteSpace(path))
                .Select(Path.GetFullPath)
                .FirstOrDefault(HasRequiredLanguageData);

        public static string ResolveDefaultLanguages(string tessDataPath)
        {
            (string, string)[] languages = new[]
            {
                ("eng", "eng"),
                ("deu", "deu"),
                ("jpn", "jpn"),
                ("kor", "kor"),
                ("chi_sim", "chi_sim"),
                ("chi_tra", "chi_tra")
            };

            return string.Join("+", languages
                .Where(language => File.Exists(Path.Combine(tessDataPath, $"{language.Item1}.traineddata")))
                .Select(language => language.Item2));
        }

        private static bool HasRequiredLanguageData(string path) => Directory.Exists(path) &&
                File.Exists(Path.Combine(path, "eng.traineddata")) &&
                File.Exists(Path.Combine(path, "deu.traineddata"));
    }
}
