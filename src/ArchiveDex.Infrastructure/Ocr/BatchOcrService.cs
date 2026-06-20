using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Ocr
{
    public class BatchOcrService(IOcrEngine ocrEngine)
    {
        public async Task<BatchScanResult> ProcessItemAsync(BatchScanItem item, CancellationToken ct = default)
        {
            var imagePath = item.ImageAsset.RelativePath;

            OcrResult ocrResult = await ocrEngine.ProcessAsync(
                Guid.NewGuid(), imagePath, null, ct);

            return new BatchScanResult
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
        }
    }
}
