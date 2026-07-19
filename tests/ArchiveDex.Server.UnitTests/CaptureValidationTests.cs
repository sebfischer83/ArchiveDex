using ArchiveDex.Server.Features.Capture;
using Xunit;

namespace ArchiveDex.Server.UnitTests;

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
