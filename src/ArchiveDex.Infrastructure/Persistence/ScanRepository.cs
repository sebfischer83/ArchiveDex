using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.Persistence
{
    public sealed class ScanRepository(ArchiveDexDbContext db) : IScanRepository
    {
        private readonly ArchiveDexDbContext _db = db;

        public async Task<ScanJob?> GetByIdAsync(Guid id, CancellationToken ct = default) => await _db.ScanJobs
                .Include(s => s.ImageAsset)
                .Include(s => s.OcrResult)
                .FirstOrDefaultAsync(s => s.Id == id, ct);

        public async Task AddAsync(ScanJob scanJob, ImageAsset imageAsset, OcrResult ocrResult, CancellationToken ct = default)
        {
            _ = _db.ImageAssets.Add(imageAsset);
            _ = _db.ScanJobs.Add(scanJob);
            _ = _db.OcrResults.Add(ocrResult);
            _ = await _db.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(ScanJob scanJob, CancellationToken ct = default)
        {
            _ = _db.ScanJobs.Update(scanJob);
            _ = await _db.SaveChangesAsync(ct);
        }
    }
}
