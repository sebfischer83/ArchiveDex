using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.Persistence;

public class ImportJobStore : IImportJobStore
{
    private readonly ArchiveDexDbContext _db;

    public ImportJobStore(ArchiveDexDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(ImportJob job, CancellationToken ct = default)
    {
        _db.ImportJobs.Add(job);
        await _db.SaveChangesAsync(ct);
    }

    public Task<ImportJob?> GetAsync(Guid id, CancellationToken ct = default)
    {
        return _db.ImportJobs.FirstOrDefaultAsync(j => j.Id == id, ct);
    }

    public async Task<IReadOnlyList<ImportJob>> ListRecentAsync(int count = 20, CancellationToken ct = default)
    {
        return await _db.ImportJobs
            .OrderByDescending(j => j.StartedAt ?? DateTime.MinValue)
            .ThenByDescending(j => j.Id)
            .Take(count)
            .ToListAsync(ct);
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _db.SaveChangesAsync(ct);
    }
}
