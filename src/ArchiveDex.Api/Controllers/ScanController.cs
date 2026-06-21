using System.Text.Json;
using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/scans")]
public class ScanController(
    IImageStore imageStore,
    IOcrEngine ocrEngine,
    IScanRepository scanRepository,
    ICatalogRepository catalogRepository,
    ICollectionRepository collectionRepository,
    MatchRankingService matchRanking) : ControllerBase
{
    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Upload([FromForm] IFormFile image, [FromForm] string? cardLanguageHint, CancellationToken ct)
    {
        if (image is null || image.Length == 0)
            return BadRequest("Image is required.");

        await using Stream stream = image.OpenReadStream();
        ImageAsset imageAsset = await imageStore.StoreAsync(stream, image.FileName, ct);

        var scanJob = new ScanJob
        {
            Id = Guid.NewGuid(),
            ImageAssetId = imageAsset.Id,
            Status = ScanJobStatus.OcrRunning,
            CreatedAt = DateTime.UtcNow
        };

        OcrResult? ocrResult = await ocrEngine.ProcessAsync(scanJob.Id, imageAsset.RelativePath, cardLanguageHint, ct);
        ocrResult.ScanJobId = scanJob.Id;

        IReadOnlyList<CardPrint> catalogCards = await catalogRepository.SearchAsync(
            ocrResult.DetectedName ?? ocrResult.DetectedNumber,
            ocrResult.DetectedNumber,
            null, null, 1, 50, ct);

        List<CandidateMatch> candidates = matchRanking.RankMatches(ocrResult, catalogCards);
        ocrResult.CandidateMatches = JsonSerializer.Serialize(candidates);

        scanJob.OcrResult = ocrResult;
        scanJob.ImageAsset = imageAsset;
        scanJob.Status = ScanJobStatus.OcrComplete;

        await scanRepository.AddAsync(scanJob, imageAsset, ocrResult, ct);

        var candidateCards = candidates.Select(c =>
        {
            CardPrint? card = catalogCards.FirstOrDefault(x => x.Id == c.CardId);
            return new
            {
                cardId = c.CardId,
                score = c.Score,
                number = card?.Number ?? "",
                name = card?.Name ?? "",
                rarity = card?.Rarity,
                cardLanguage = card?.CardLanguage.ToString()
            };
        }).ToList();

        var dto = new
        {
            scanJob.Id,
            status = scanJob.Status.ToString(),
            imageUrl = $"/api/images/{imageAsset.RelativePath.Replace('\\', '/')}",
            ocr = ocrResult is not null ? new
            {
                ocrResult.DetectedNumber,
                ocrResult.DetectedName,
                detectedCardLanguage = ocrResult.DetectedCardLanguage?.ToString(),
                ocrResult.DetectedSetHint,
                ocrResult.Confidence,
                candidates = candidateCards
            } : null
        };
        return Created($"/api/scans/{scanJob.Id}", dto);
    }

    [HttpGet("{scanId:guid}")]
    public async Task<IActionResult> GetStatus(Guid scanId, CancellationToken ct)
    {
        ScanJob? scan = await scanRepository.GetByIdAsync(scanId, ct);
        if (scan is null)
            return NotFound();

        var candidateCards = new List<object>();
        foreach (CandidateMatch candidate in DeserializeCandidates(scan.OcrResult?.CandidateMatches))
        {
            CardPrint? card = await catalogRepository.GetByIdAsync(candidate.CardId, ct);
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

        return Ok(new
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

    [HttpPost("{scanId:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid scanId, [FromBody] ScanConfirmRequest request, CancellationToken ct)
    {
        ScanJob? scan = await scanRepository.GetByIdAsync(scanId, ct);
        if (scan is null)
            return NotFound();

        _ = await catalogRepository.GetByIdAsync(request.CardId, ct)
            ?? throw new InvalidOperationException("Card not found");

        var entry = new CollectionEntry
        {
            Id = Guid.NewGuid(),
            CardPrintId = request.CardId,
            Condition = request.Condition,
            Quantity = request.Quantity,
            PurchasePrice = request.PurchasePrice,
            StorageLocation = request.StorageLocation,
            Notes = request.Notes,
            FrontImagePath = scan.ImageAsset.RelativePath,
            DateAdded = DateTime.UtcNow
        };

        await collectionRepository.AddAsync(entry, ct);
        scan.Status = ScanJobStatus.Confirmed;
        scan.ResultingCollectionEntryId = entry.Id;
        await scanRepository.UpdateAsync(scan, ct);

        return Created($"/api/collection/{entry.Id}", CollectionEntryDto.FromEntry(entry));
    }

    [HttpPost("{scanId:guid}/reject")]
    public async Task<IActionResult> Reject(Guid scanId, CancellationToken ct)
    {
        ScanJob? scan = await scanRepository.GetByIdAsync(scanId, ct);
        if (scan is null)
            return NotFound();

        scan.Status = ScanJobStatus.Rejected;
        await scanRepository.UpdateAsync(scan, ct);
        return NoContent();
    }

    private static IReadOnlyList<CandidateMatch> DeserializeCandidates(string? json)
    {
        return string.IsNullOrWhiteSpace(json) ? [] : (IReadOnlyList<CandidateMatch>)(JsonSerializer.Deserialize<List<CandidateMatch>>(json) ?? []);
    }
}
