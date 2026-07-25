using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Options;
using Xunit;

namespace ArchiveDex.Server.UnitTests;

public sealed class CardSetReferenceLookupTests
{
    private static readonly CardSetReferenceLookup Lookup = new(Options.Create(new CardSetReferenceOptions
    {
        Version = "test",
        Sets =
        [
            new CardSetReferenceEntry
            {
                Code = "CS2bC",
                Name = "Vivid Portrayals - Set B",
                Language = "zh-cn",
                Aliases = ["CS2B", "CS2BC"],
            },
            new CardSetReferenceEntry
            {
                Code = "CSV6C",
                Name = "Paradox Veil",
                Language = "zh-cn",
                Aliases = ["CSV6"],
            },
        ],
    }));

    [Theory]
    [InlineData("CS2bC", "CS2bC", "Vivid Portrayals - Set B")]
    [InlineData("cs2b", "CS2bC", "Vivid Portrayals - Set B")]
    [InlineData("CSV6C — Paradox Veil", "CSV6C", "Paradox Veil")]
    public void ResolveAcceptsPrintedCodesAliasesAndPollutedHints(
        string input,
        string expectedCode,
        string expectedName)
    {
        var result = Lookup.Resolve(input, "zh-cn");

        Assert.NotNull(result);
        Assert.Equal(expectedCode, result.Code);
        Assert.Equal(expectedName, result.Name);
    }

    [Fact]
    public void ResolveDoesNotApplyChineseReferenceToOtherLanguages()
    {
        Assert.Null(Lookup.Resolve("CS2B", "ko"));
    }
}
