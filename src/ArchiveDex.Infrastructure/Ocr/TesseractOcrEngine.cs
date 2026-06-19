using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;
using Tesseract;

namespace ArchiveDex.Infrastructure.Ocr;

public class TesseractOcrEngine : IOcrEngine
{
    private static readonly Regex SlashCardNumberRegex = new(
        @"(?ix)\b\d{1,3}[a-z]?\s*/\s*\d{1,3}[a-z]?\b",
        RegexOptions.Compiled);

    private static readonly Regex PromoCardNumberRegex = new(
        @"(?ix)\b(?:SVP|SWSH|SM|XY|BW|POP|PR|PROMO)\s*(?:DE|EN|JP|KO|CN|CHT)?\s*(\d{1,3})\b",
        RegexOptions.Compiled);

    private static readonly Regex SetHintRegex = new(
        @"(?ix)\b(?:[A-Z]{2,5}(?:\s+(?:DE|EN|JP|KO|CN|CHT))?|[A-Z]{1,3}\d[A-Z]{1,3})\b",
        RegexOptions.Compiled);

    private readonly TesseractOcrOptions _options;

    public TesseractOcrEngine(IOptions<TesseractOcrOptions> options)
    {
        _options = options.Value;
    }

    public Task<OcrResult> ProcessAsync(
        Guid scanJobId, string imagePath, string? cardLanguageHint, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        var fullPath = ResolveImagePath(imagePath);
        var languages = ResolveTesseractLanguages(cardLanguageHint);

        using var engine = new TesseractEngine(_options.TessDataPath, languages, EngineMode.Default);
        using var image = Pix.LoadFromFile(fullPath);
        using var page = engine.Process(image);

        var rawText = page.GetText() ?? string.Empty;
        var lines = rawText
            .Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .ToArray();

        var detectedNumber = DetectNumber(rawText);
        var detectedLanguage = ResolveCardLanguage(cardLanguageHint) ?? DetectLanguage(rawText);

        var result = new OcrResult
        {
            Id = Guid.NewGuid(),
            ScanJobId = scanJobId,
            RawText = rawText,
            DetectedNumber = detectedNumber,
            DetectedName = DetectName(lines, detectedNumber),
            DetectedCardLanguage = detectedLanguage,
            DetectedSetHint = DetectSetHint(rawText),
            Confidence = page.GetMeanConfidence()
        };

        return Task.FromResult(result);
    }

    private string ResolveImagePath(string imagePath)
    {
        if (Path.IsPathRooted(imagePath))
            return imagePath;

        var basePath = Path.GetFullPath(_options.ImageBasePath);
        var fullPath = Path.GetFullPath(Path.Combine(basePath, imagePath));

        if (!fullPath.StartsWith(basePath, StringComparison.OrdinalIgnoreCase))
            throw new FileNotFoundException("Invalid image path.");

        return fullPath;
    }

    private string ResolveTesseractLanguages(string? cardLanguageHint)
    {
        return ResolveCardLanguage(cardLanguageHint) switch
        {
            CardLanguage.de => "deu",
            CardLanguage.en => "eng",
            CardLanguage.ja => "jpn",
            CardLanguage.ko => "kor",
            CardLanguage.zhHans => "chi_sim",
            CardLanguage.zhHant => "chi_tra",
            _ => _options.DefaultLanguages
        };
    }

    private static CardLanguage? ResolveCardLanguage(string? cardLanguageHint)
    {
        if (string.IsNullOrWhiteSpace(cardLanguageHint))
            return null;

        var normalized = cardLanguageHint.Replace("-", string.Empty);
        return Enum.TryParse<CardLanguage>(normalized, ignoreCase: true, out var language)
            ? language
            : null;
    }

    private static string? DetectNumber(string rawText)
    {
        foreach (var line in LinesFromBottom(rawText))
        {
            var slashMatch = SlashCardNumberRegex.Match(line);
            if (slashMatch.Success)
                return Regex.Replace(slashMatch.Value, @"\s+", string.Empty);
        }

        foreach (var line in LinesFromBottom(rawText))
        {
            var promoMatch = PromoCardNumberRegex.Match(line);
            if (promoMatch.Success)
                return promoMatch.Groups[1].Value;
        }

        return null;
    }

    public static string? DetectSetHint(string rawText)
    {
        var lines = rawText
            .Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Reverse();

        foreach (var line in lines)
        {
            var match = SetHintRegex.Match(line);
            if (!match.Success)
                continue;

            var value = Regex.Replace(match.Value.Trim(), @"\s+", " ").ToUpperInvariant();
            if (value is "HP" or "KP" or "RR" or "RRR" or "EX" or "VMAX")
                continue;

            if (SlashCardNumberRegex.IsMatch(value) || PromoCardNumberRegex.IsMatch(value))
                continue;

            return value;
        }

        return null;
    }

    public static CardLanguage? DetectLanguage(string rawText)
    {
        var hasKana = rawText.Any(c => c is >= '\u3040' and <= '\u30ff');
        if (hasKana)
            return CardLanguage.ja;

        var cjkCount = rawText.Count(c => c is >= '\u4e00' and <= '\u9fff');
        if (cjkCount >= 2)
            return CardLanguage.zhHans;

        var hangulCount = rawText.Count(c => c is >= '\uac00' and <= '\ud7af');
        if (hangulCount >= 2)
            return CardLanguage.ko;

        if (Regex.IsMatch(rawText, @"(?i)\b[A-Z]{2,5}\s+DE\b") ||
            rawText.Contains("KP", StringComparison.OrdinalIgnoreCase) ||
            rawText.Contains("Fähigkeit", StringComparison.OrdinalIgnoreCase) ||
            rawText.Contains("Rueckzug", StringComparison.OrdinalIgnoreCase) ||
            rawText.Contains("Rückzug", StringComparison.OrdinalIgnoreCase))
            return CardLanguage.de;

        if (rawText.Any(c => "äöüÄÖÜß".Contains(c)))
            return CardLanguage.de;

        return null;
    }

    private static string? DetectName(IReadOnlyList<string> lines, string? detectedNumber)
    {
        foreach (var line in lines.Take(8))
        {
            var value = line.Trim();
            if (value.Length < 2 || value.Length > 60)
                continue;

            if (!string.IsNullOrWhiteSpace(detectedNumber) &&
                value.Contains(detectedNumber, StringComparison.OrdinalIgnoreCase))
                continue;

            if (SlashCardNumberRegex.IsMatch(value) || PromoCardNumberRegex.IsMatch(value))
                continue;

            if (value.Contains("Pokemon", StringComparison.OrdinalIgnoreCase) ||
                value.Contains("Illustr", StringComparison.OrdinalIgnoreCase) ||
                value.Contains("HP", StringComparison.OrdinalIgnoreCase))
                continue;

            return value;
        }

        return null;
    }

    private static IEnumerable<string> LinesFromBottom(string rawText)
    {
        return rawText
            .Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .Reverse();
    }
}
