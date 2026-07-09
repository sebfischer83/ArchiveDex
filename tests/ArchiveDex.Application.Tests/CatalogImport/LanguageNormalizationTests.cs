using Xunit;
using ArchiveDex.Application.CatalogImport;

namespace ArchiveDex.Application.Tests.CatalogImport
{
    public class LanguageNormalizationTests
    {
        [Theory]
        [InlineData("ptBr", "pt-br")]
        [InlineData("zhHans", "zh-hans")]
        [InlineData("zhHant", "zh-hant")]
        [InlineData("jp", "ja")]
        [InlineData("en", "en")]
        [InlineData("de", "de")]
        [InlineData("ja", "ja")]
        [InlineData("ko", "ko")]
        public void NormalizeLanguage_NormalizesSourceSpecificCodes(string input, string expected)
        {
            var result = CatalogImportLanguageNormalizer.Normalize(input);
            Assert.Equal(expected, result);
        }

        [Fact]
        public void NormalizeLanguage_NullOrEmpty_ReturnsEmpty()
        {
            Assert.Equal(string.Empty, CatalogImportLanguageNormalizer.Normalize(null!));
            Assert.Equal(string.Empty, CatalogImportLanguageNormalizer.Normalize(string.Empty));
        }

        [Fact]
        public void NormalizeLanguage_TrimsWhitespace()
        {
            var result = CatalogImportLanguageNormalizer.Normalize("  en  ");
            Assert.Equal("en", result);
        }
    }
}
