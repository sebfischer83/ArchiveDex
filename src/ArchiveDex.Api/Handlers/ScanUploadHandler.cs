using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers
{
    public static class ScanUploadHandler
    {
        [WolverinePost("/api/scans")]
        public static async Task<IResult> Handle(
            IFormFile image,
            string? cardLanguageHint,
            IImageStore imageStore,
            IOcrEngine ocrEngine,
            IScanRepository scanRepository,
            ICatalogRepository catalogRepository,
            MatchRankingService matchRanking,
            CancellationToken ct)
        {
            if (image is null || image.Length == 0)
            {
                return Results.BadRequest("Image is required.");
            }

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
            return Results.Created($"/api/scans/{scanJob.Id}", dto);
        }
    }
}
