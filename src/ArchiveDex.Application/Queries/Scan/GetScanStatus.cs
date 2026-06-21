using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Queries.Scan;

public sealed record GetScanStatus(Guid ScanId);

public sealed record ScanStatusResponse(
    Guid Id,
    string Status,
    string ImageUrl,
    OcrStatusResult? Ocr,
    List<CandidateResult> Candidates);

public sealed record OcrStatusResult(
    string? DetectedNumber,
    string? DetectedName,
    string? DetectedCardLanguage,
    string? DetectedSetHint,
    float? Confidence);

public sealed record CandidateResult(
    Guid CardId,
    int Score,
    string Number,
    string Name,
    string? Rarity,
    string? CardLanguage);

public static class GetScanStatusHandler
{
    public static async Task<ScanStatusResponse?> Handle(
        GetScanStatus query,
        IScanRepository scanRepository,
        ICatalogRepository catalogRepository,
        CancellationToken ct)
    {
        ScanJob? scan = await scanRepository.GetByIdAsync(query.ScanId, ct);
        if (scan is null) return null;

        var candidates = new List<CandidateResult>();
        foreach (CandidateMatch c in DeserializeCandidates(scan.OcrResult?.CandidateMatches))
        {
            CardPrint? card = await catalogRepository.GetByIdAsync(c.CardId, ct);
            candidates.Add(new CandidateResult(
                c.CardId, c.Score,
                card?.Number ?? "", card?.Name ?? "",
                card?.Rarity, card?.CardLanguage.ToString()));
        }

        OcrStatusResult? ocr = scan.OcrResult is not null ? new OcrStatusResult(
            scan.OcrResult.DetectedNumber,
            scan.OcrResult.DetectedName,
            scan.OcrResult.DetectedCardLanguage?.ToString(),
            scan.OcrResult.DetectedSetHint,
            scan.OcrResult.Confidence) : null;

        return new ScanStatusResponse(
            scan.Id, scan.Status.ToString(),
            scan.ImageAsset.RelativePath,
            ocr, candidates);
    }

    private static IReadOnlyList<CandidateMatch> DeserializeCandidates(string? json) =>
        string.IsNullOrWhiteSpace(json) ? [] : (IReadOnlyList<CandidateMatch>)(JsonSerializer.Deserialize<List<CandidateMatch>>(json) ?? []);
}
