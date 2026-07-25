using ArchiveDex.Server.Features.Capture;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class CaptureValidationTests
    {
        [Fact]
        public void ValidReviewHasNoErrors()
        {
            var request = new ReviewCaptureRequest(
                null, "Bulbasaur", "Bisasam", null, "001/102", "BS", "Base Set", "en", "standard", "NM");

            var errors = CaptureValidation.Validate(request);

            Assert.Empty(errors);
        }

        [Theory]
        [InlineData("Simplified Chinese", "zh-cn")]
        [InlineData("Chinese (Traditional)", "zh-tw")]
        [InlineData("German", "de")]
        [InlineData("JA", "ja")]
        public void ReviewLanguageIsNormalizedToCode(string input, string expected)
        {
            var request = new ReviewCaptureRequest(
                null, "Bulbasaur", "Bisasam", null, "001/102", "BS", "Base Set", input, "standard", "NM");

            var normalized = CaptureValidation.Normalize(request);

            Assert.Equal(expected, normalized.Language);
            Assert.Empty(CaptureValidation.Validate(normalized));
        }

        [Theory]
        [InlineData("MINT")]
        [InlineData("")]
        public void InvalidConditionIsRejected(string condition)
        {
            var request = new ReviewCaptureRequest(
                null, "Bulbasaur", "Bisasam", null, "001/102", "BS", "Base Set", "en", "standard", condition);

            var errors = CaptureValidation.Validate(request);

            Assert.Contains(nameof(request.Condition), errors.Keys);
        }

        [Fact]
        public void GermanNameAndUnavailableReasonAreMutuallyExclusive()
        {
            var both = new ReviewCaptureRequest(
                null, "Bulbasaur", "Bisasam", "Unknown", "001/102", "BS", "Base Set", "en", "standard", "NM");
            var neither = both with { GermanName = null, GermanNameUnavailableReason = null };

            Assert.Contains(nameof(both.GermanName), CaptureValidation.Validate(both).Keys);
            Assert.Contains(nameof(neither.GermanName), CaptureValidation.Validate(neither).Keys);
        }
    }
}
