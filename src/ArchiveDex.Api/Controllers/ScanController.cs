using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Scan;
using ArchiveDex.Application.Common;
using ArchiveDex.Application.Queries.Scan;
using ArchiveDex.Application.Scanning;
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
        CreateScanResult result = await CreateScanHandler.Handle(
            new CreateScan(stream, image.FileName, cardLanguageHint),
            imageStore, ocrEngine, scanRepository, catalogRepository, matchRanking, ct);

        return Created($"/api/scans/{result.Id}", new
        {
            result.Id,
            result.Status,
            imageUrl = $"/api/images/{result.RelativePath.Replace('\\', '/')}"
        });
    }

    [HttpGet("{scanId:guid}")]
    public async Task<IActionResult> GetStatus(Guid scanId, CancellationToken ct)
    {
        ScanStatusResponse? result = await GetScanStatusHandler.Handle(
            new GetScanStatus(scanId), scanRepository, catalogRepository, ct);
        if (result is null) return NotFound();

        return Ok(new
        {
            result.Id,
            result.Status,
            imageUrl = $"/api/images/{result.ImageUrl.Replace('\\', '/')}",
            ocr = new
            {
                result.Ocr?.DetectedNumber,
                result.Ocr?.DetectedName,
                detectedCardLanguage = result.Ocr?.DetectedCardLanguage,
                result.Ocr?.DetectedSetHint,
                result.Ocr?.Confidence,
                candidates = result.Candidates.Select(c => new
                {
                    cardId = c.CardId,
                    c.Score,
                    c.Number,
                    c.Name,
                    c.Rarity,
                    c.CardLanguage
                })
            }
        });
    }

    [HttpPost("{scanId:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid scanId, [FromBody] ScanConfirmRequest request, CancellationToken ct)
    {
        CollectionEntryDto entry = await ConfirmScanHandler.Handle(
            new ConfirmScan(scanId, request.CardId, request.Condition,
                request.Quantity, request.PurchasePrice, request.StorageLocation, request.Notes),
            scanRepository, catalogRepository, collectionRepository, ct);

        return Created($"/api/collection/{entry.Id}", entry);
    }

    [HttpPost("{scanId:guid}/reject")]
    public async Task<IActionResult> Reject(Guid scanId, CancellationToken ct)
    {
        await RejectScanHandler.Handle(new RejectScan(scanId), scanRepository, ct);
        return NoContent();
    }
}
