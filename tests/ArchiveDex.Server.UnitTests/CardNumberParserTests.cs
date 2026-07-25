using ArchiveDex.Server.Features.Capture;
using Xunit;

namespace ArchiveDex.Server.UnitTests;

public sealed class CardNumberParserTests
{
    [Theory]
    [InlineData("100/200", "100", "200")]
    [InlineData("201/200", "201", "200")]
    [InlineData("TG01/TG30", "TG01", "TG30")]
    [InlineData("SVP001", "SVP001", null)]
    [InlineData("124/115 SR", "124", "115")]
    [InlineData("1107/07 ★★★", "1107", "07")]
    public void ParseSeparatesCollectorNumberAndSetTotal(
        string printedNumber,
        string expectedCollectorNumber,
        string? expectedSetTotal)
    {
        var result = CardNumberParser.Parse(printedNumber);

        Assert.Equal(expectedCollectorNumber, result.CollectorNumber);
        Assert.Equal(expectedSetTotal, result.SetTotal);
        Assert.Equal(expectedSetTotal is null
            ? expectedCollectorNumber
            : $"{expectedCollectorNumber}/{expectedSetTotal}", result.PrintedNumber);
        Assert.True(CardNumberParser.IsValid(result));
    }

    [Fact]
    public void ParsePrefersExplicitSeparateFields()
    {
        var result = CardNumberParser.Parse("100/200", "201", "200");

        Assert.Equal("201/200", result.PrintedNumber);
    }

    [Fact]
    public void IsValidRejectsAdditionalSlashes()
    {
        var result = CardNumberParser.Parse("100/200/300");

        Assert.False(CardNumberParser.IsValid(result));
    }

    [Fact]
    public void ParseCleansExplicitFieldsToo()
    {
        var result = CardNumberParser.Parse(null, " 201 ", "200 SAR");

        Assert.Equal("201/200", result.PrintedNumber);
    }
}
