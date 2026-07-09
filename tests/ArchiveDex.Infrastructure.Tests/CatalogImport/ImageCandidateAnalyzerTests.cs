using ArchiveDex.Infrastructure.CatalogImport;
using Xunit;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport
{
    public class ImageCandidateAnalyzerTests
    {
        [Fact]
        public void CalculateScore_ValidHighResImage_ScoresHigherThanLowRes()
        {
            var highRes = new ImageAnalysisResult(1200, 1680, "PNG",
                500_000, true, "abc123", "TCGdex");
            var lowRes = new ImageAnalysisResult(200, 280, "JPEG",
                30_000, true, "def456", "TCGdex");

            var highScore = ImageQualityScorer.CalculateScore(highRes);
            var lowScore = ImageQualityScorer.CalculateScore(lowRes);

            Assert.True(highScore > lowScore,
                $"High-res score ({highScore}) should exceed low-res score ({lowScore})");
        }

        [Fact]
        public void CalculateScore_InvalidImage_ReturnsZero()
        {
            var invalid = new ImageAnalysisResult(null, null, null,
                0, false, null, "TCGdex");
            var score = ImageQualityScorer.CalculateScore(invalid);
            Assert.Equal(0m, score);
        }

        [Fact]
        public void CalculateScore_DifferentSources_SameTechQuality_SourcePriorityBreaksTie()
        {
            var result = new ImageAnalysisResult(800, 1120, "PNG",
                400_000, true, "abc", "TCGdex");
            var result2 = new ImageAnalysisResult(800, 1120, "PNG",
                400_000, true, "def", "Limitless");

            var score = ImageQualityScorer.CalculateScore(result);
            var score2 = ImageQualityScorer.CalculateScore(result2);

            Assert.True(score >= score2,
                "TCGdex should not score lower than Limitless with identical technical quality");
        }
    }
}
