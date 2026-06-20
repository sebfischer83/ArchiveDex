using System.Text.Json;

namespace ArchiveDex.Infrastructure.Tests.Ocr
{
    public sealed class ScanningFixtureManifestTests
    {
        private static readonly string FixtureDirectory = Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..",
            "Fixtures", "Scanning");

        [Fact]
        public void FixtureManifest_ReferencesExistingUploadableImages()
        {
            IReadOnlyList<ScanningFixture> fixtures = LoadFixtures();

            if (fixtures.Count == 0)
            {
                return;
            }

            foreach (ScanningFixture fixture in fixtures)
            {
                var path = Path.Combine(FixtureDirectory, fixture.File);
                Assert.True(File.Exists(path), $"Missing fixture image: {fixture.File}");
                Assert.True(new FileInfo(path).Length <= 10 * 1024 * 1024, $"Fixture exceeds upload limit: {fixture.File}");
                Assert.True(IsSupportedImageName(fixture.File), $"Unsupported fixture extension: {fixture.File}");
                Assert.False(string.IsNullOrWhiteSpace(fixture.LanguageHint));
                Assert.False(string.IsNullOrWhiteSpace(fixture.ExpectedNumber));
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

        private static bool IsSupportedImageName(string fileName) => Path.GetExtension(fileName).ToLowerInvariant() is ".jpg" or ".jpeg" or ".png" or ".webp";

        private sealed record ScanningFixture(
            string File,
            string LanguageHint,
            string? ExpectedName,
            string ExpectedNumber,
            string? Notes);
    }
}
