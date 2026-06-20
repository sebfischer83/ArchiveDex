using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions
{
    public interface IScanRepository
    {
        Task<ScanJob?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task AddAsync(ScanJob scanJob, ImageAsset imageAsset, OcrResult ocrResult, CancellationToken ct = default);
        Task UpdateAsync(ScanJob scanJob, CancellationToken ct = default);
    }
}
