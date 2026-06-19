using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.Persistence;

public sealed class ScanRepository : IScanRepository
{
    private readonly ArchiveDexDbContext _db;

    public ScanRepository(ArchiveDexDbContext db) => _db = db;

    public async Task<ScanJob?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.ScanJobs
            .Include(s => s.ImageAsset)
            .Include(s => s.OcrResult)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
    }

    public async Task AddAsync(ScanJob scanJob, ImageAsset imageAsset, OcrResult ocrResult, CancellationToken ct = default)
    {
        _db.ImageAssets.Add(imageAsset);
        _db.ScanJobs.Add(scanJob);
        _db.OcrResults.Add(ocrResult);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ScanJob scanJob, CancellationToken ct = default)
    {
        _db.ScanJobs.Update(scanJob);
        await _db.SaveChangesAsync(ct);
    }
}
