using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Scanning;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class ScanStatusHandler
{
    [WolverineGet("/api/scans/{scanId}")]
    public static async Task<IResult> Handle(
        Guid scanId,
        IScanRepository scanRepository,
        ICatalogRepository catalogRepository,
        CancellationToken ct)
    {
        var scan = await scanRepository.GetByIdAsync(scanId, ct);
        if (scan is null)
            return Results.NotFound();

        var candidateCards = new List<object>();
        foreach (var candidate in DeserializeCandidates(scan.OcrResult?.CandidateMatches))
        {
            var card = await catalogRepository.GetByIdAsync(candidate.CardId, ct);
            candidateCards.Add(new
            {
                cardId = candidate.CardId,
                score = candidate.Score,
                number = card?.Number ?? string.Empty,
                name = card?.Name ?? string.Empty,
                rarity = card?.Rarity,
                cardLanguage = card?.CardLanguage.ToString()
            });
        }

        return Results.Ok(new
        {
            scan.Id,
            status = scan.Status.ToString(),
            imageUrl = $"/api/images/{scan.ImageAsset.RelativePath.Replace('\\', '/')}",
            ocr = scan.OcrResult is not null ? new
            {
                scan.OcrResult.DetectedNumber,
                scan.OcrResult.DetectedName,
                detectedCardLanguage = scan.OcrResult.DetectedCardLanguage?.ToString(),
                scan.OcrResult.DetectedSetHint,
                scan.OcrResult.Confidence,
                candidates = candidateCards
            } : null
        });
    }

    private static IReadOnlyList<CandidateMatch> DeserializeCandidates(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return [];

        return JsonSerializer.Deserialize<List<CandidateMatch>>(json) ?? [];
    }
}
