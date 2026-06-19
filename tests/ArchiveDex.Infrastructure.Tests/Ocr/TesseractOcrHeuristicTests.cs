using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Ocr;

namespace ArchiveDex.Infrastructure.Tests.Ocr;

public sealed class TesseractOcrHeuristicTests
{
    [Theory]
    [InlineData("Saltigant ex\nKP 340\nSCR DE\n089/142", CardLanguage.de)]
    [InlineData("龙王蝎V\nHP 210\n079/115 RR", CardLanguage.zhHans)]
    [InlineData("포켓몬 카드\nHP 120", CardLanguage.ko)]
    [InlineData("リザードン\nHP 330", CardLanguage.ja)]
    public void DetectLanguage_InfersLikelyCardLanguage(string rawText, CardLanguage expected)
    {
        Assert.Equal(expected, TesseractOcrEngine.DetectLanguage(rawText));
    }

    [Theory]
    [InlineData("Saltigant ex\nKP 340\nSCR DE\n089/142", "SCR DE")]
    [InlineData("Koraidon ex\nSVP DE\n197", "SVP DE")]
    [InlineData("Fiaro\nPOR DE\n091/088", "POR DE")]
    [InlineData("霜奶仙VMAX\nCS2bC D 070/115 RRR", "CS2BC")]
    public void DetectSetHint_ExtractsKnownSetCodeShapes(string rawText, string expected)
    {
        Assert.Equal(expected, TesseractOcrEngine.DetectSetHint(rawText));
    }
}
