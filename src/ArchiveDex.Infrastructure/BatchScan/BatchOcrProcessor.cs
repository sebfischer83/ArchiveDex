using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.BatchScan.Services;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.BatchScan
{
    public class BatchOcrProcessor(IServiceScopeFactory scopeFactory, ILogger<BatchOcrProcessor> logger) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                Guid batchId;
                try
                {
                    batchId = await BatchOcrQueue.DequeueAsync(stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }

                try
                {
                    await ProcessBatchAsync(batchId, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Unhandled error processing batch {BatchId}", batchId);
                }
            }
        }

        private async Task ProcessBatchAsync(Guid batchId, CancellationToken ct)
        {
            using IServiceScope scope = scopeFactory.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IBatchScanRepository>();
            var ocrEngine = scope.ServiceProvider.GetRequiredService<IOcrEngine>();
            var imageStore = scope.ServiceProvider.GetRequiredService<IImageStore>();
            var catalogRepo = scope.ServiceProvider.GetRequiredService<ICatalogRepository>();
            var matchRanking = scope.ServiceProvider.GetRequiredService<MatchRankingService>();

            BatchScanJob? job = await repo.GetByIdAsync(batchId, ct);
            if (job is null || job.Status != BatchStatus.Uploading)
            {
                return;
            }

            job.Status = BatchStatus.Processing;
            await repo.UpdateJobAsync(job, ct);

            List<BatchScanItem> items = await repo.GetItemsByBatchIdAsync(batchId, ct);
            foreach (BatchScanItem item in items.OrderBy(i => i.SortOrder))
            {
                ct.ThrowIfCancellationRequested();

                if (item.FailureReason is not null)
                {
                    continue;
                }

                try
                {
                    var imagePath = item.ImageAsset.RelativePath;

                    OcrResult ocrResult = await ocrEngine.ProcessAsync(
                        Guid.NewGuid(), imagePath, null, ct);

                    var batchResult = new BatchScanResult
                    {
                        Id = Guid.NewGuid(),
                        BatchScanItemId = item.Id,
                        DetectedNumber = ocrResult.DetectedNumber,
                        DetectedName = ocrResult.DetectedName,
                        DetectedCardLanguage = ocrResult.DetectedCardLanguage,
                        DetectedSetHint = ocrResult.DetectedSetHint,
                        Confidence = ocrResult.Confidence,
                        RawText = ocrResult.RawText,
                        CandidateMatches = "[]",
                        ProcessedAt = DateTime.UtcNow
                    };

                    var candidates = await SearchCandidatesAsync(
                        catalogRepo, batchResult, ct);

                    var matches = matchRanking.RankMatches(ocrResult, candidates);
                    batchResult.CandidateMatches = System.Text.Json.JsonSerializer.Serialize(matches);

                    item.OcrResult = batchResult;
                    item.OcrResultId = batchResult.Id;

                    if (batchResult.Confidence >= 0.5f && matches.Count > 0)
                    {
                        item.MatchedCardPrintId = matches[0].CardId;
                        item.MatchStatus = BatchItemMatchStatus.Matched;
                    }

                    await repo.UpdateItemAsync(item, ct);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "OCR failed for batch item {ItemId}", item.Id);
                    item.FailureReason = ex.Message;
                    await repo.UpdateItemAsync(item, ct);
                }
            }

            job = await repo.GetByIdAsync(batchId, ct);
            if (job is not null)
            {
                job.Status = BatchStatus.ReadyForReview;
                await repo.UpdateJobAsync(job, ct);
            }
        }

        private static async Task<IReadOnlyList<CardPrint>> SearchCandidatesAsync(
            ICatalogRepository catalogRepo,
            BatchScanResult result,
            CancellationToken ct)
        {
            string? detectedNumber = result.DetectedNumber;
            string? detectedName = result.DetectedName;
            string? language = result.DetectedCardLanguage?.ToString();

            if (!string.IsNullOrEmpty(detectedNumber))
            {
                return await catalogRepo.SearchAsync(null, detectedNumber, null, language, 1, 20, ct);
            }

            if (!string.IsNullOrEmpty(detectedName))
            {
                return await catalogRepo.SearchAsync(detectedName, null, null, language, 1, 20, ct);
            }

            return [];
        }
    }
}
