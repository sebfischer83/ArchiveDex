using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Scan;

public sealed record CreateScan(
    Stream ImageStream,
    string FileName,
    string? CardLanguageHint);

public sealed record CreateScanResult(
    Guid Id,
    string Status,
    string RelativePath);

public static class CreateScanHandler
{
    public static async Task<CreateScanResult> Handle(
        CreateScan command,
        IImageStore imageStore,
        IOcrEngine ocrEngine,
        IScanRepository scanRepository,
        ICatalogRepository catalogRepository,
        MatchRankingService matchRanking,
        CancellationToken ct)
    {
        if (command.ImageStream is null || command.ImageStream.Length == 0)
            throw new ArgumentException("Image is required.");

        ImageAsset imageAsset = await imageStore.StoreAsync(command.ImageStream, command.FileName, ct);

        var scanJob = new ScanJob
        {
            Id = Guid.NewGuid(),
            ImageAssetId = imageAsset.Id,
            Status = ScanJobStatus.OcrRunning,
            CreatedAt = DateTime.UtcNow
        };

        OcrResult? ocrResult = await ocrEngine.ProcessAsync(scanJob.Id, imageAsset.RelativePath, command.CardLanguageHint, ct);
        ocrResult.ScanJobId = scanJob.Id;

        IReadOnlyList<CardPrint> catalogCards = await catalogRepository.SearchAsync(
            ocrResult.DetectedName ?? ocrResult.DetectedNumber,
            ocrResult.DetectedNumber, null, null, 1, 50, ct);

        List<CandidateMatch> candidates = matchRanking.RankMatches(ocrResult, catalogCards);
        ocrResult.CandidateMatches = JsonSerializer.Serialize(candidates);

        scanJob.OcrResult = ocrResult;
        scanJob.ImageAsset = imageAsset;
        scanJob.Status = ScanJobStatus.OcrComplete;

        await scanRepository.AddAsync(scanJob, imageAsset, ocrResult, ct);

        return new CreateScanResult(scanJob.Id, scanJob.Status.ToString(), imageAsset.RelativePath);
    }
}
