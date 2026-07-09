using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class CatalogImportRepository : ICatalogImportRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly DbSet<CatalogImportRun> _runs;
        private readonly DbSet<CatalogImportCheckpoint> _checkpoints;
        private readonly DbSet<SourceSetSnapshot> _setSnapshots;
        private readonly DbSet<SourceCardSnapshot> _cardSnapshots;
        private readonly DbSet<SourceImportError> _errors;
        private readonly DbSet<ImageCandidateMetadata> _imageCandidates;
        private readonly DbSet<CatalogImageAsset> _imageAssets;

        public CatalogImportRepository(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            var dbContext = (DbContext)unitOfWork;
            _runs = dbContext.Set<CatalogImportRun>();
            _checkpoints = dbContext.Set<CatalogImportCheckpoint>();
            _setSnapshots = dbContext.Set<SourceSetSnapshot>();
            _cardSnapshots = dbContext.Set<SourceCardSnapshot>();
            _errors = dbContext.Set<SourceImportError>();
            _imageCandidates = dbContext.Set<ImageCandidateMetadata>();
            _imageAssets = dbContext.Set<CatalogImageAsset>();
        }

        public async Task<CatalogImportRun?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await _runs.Include(r => r.Checkpoints).FirstOrDefaultAsync(r => r.Id == id, ct);

        public async Task<CatalogImportRun?> GetActiveImportAsync(CancellationToken ct = default)
            => await _runs.Include(r => r.Checkpoints)
                .FirstOrDefaultAsync(r => r.Status == Domain.Enums.CatalogImportStatus.Running
                    || r.Status == Domain.Enums.CatalogImportStatus.Cancelling, ct);

        public async Task AddRunAsync(CatalogImportRun run, CancellationToken ct = default)
        {
            await _runs.AddAsync(run, ct);
        }

        public Task UpdateRunAsync(CatalogImportRun run, CancellationToken ct = default)
        {
            _runs.Update(run);
            return Task.CompletedTask;
        }

        public async Task<bool> HasActiveImportAsync(CancellationToken ct = default)
        {
            return await _runs.AnyAsync(r =>
                r.Status == Domain.Enums.CatalogImportStatus.Running ||
                r.Status == Domain.Enums.CatalogImportStatus.Cancelling, ct);
        }

        public async Task UpsertCheckpointAsync(CatalogImportCheckpoint checkpoint, CancellationToken ct = default)
        {
            var existing = await _checkpoints.FirstOrDefaultAsync(c =>
                c.ImportRunId == checkpoint.ImportRunId &&
                c.Source == checkpoint.Source &&
                c.Language == checkpoint.Language &&
                c.SetExternalId == checkpoint.SetExternalId &&
                c.Phase == checkpoint.Phase, ct);

            if (existing != null)
            {
                existing.IsCompleted = checkpoint.IsCompleted;
                existing.ProcessedCount = checkpoint.ProcessedCount;
                existing.UpdatedAt = checkpoint.UpdatedAt;
            }
            else
            {
                await _checkpoints.AddAsync(checkpoint, ct);
            }
        }

        public async Task<List<CatalogImportCheckpoint>> GetCheckpointsByRunIdAsync(Guid importRunId, CancellationToken ct = default)
            => await _checkpoints.Where(c => c.ImportRunId == importRunId).ToListAsync(ct);

        public async Task AddSetSnapshotAsync(SourceSetSnapshot snapshot, CancellationToken ct = default)
            => await _setSnapshots.AddAsync(snapshot, ct);

        public async Task AddCardSnapshotAsync(SourceCardSnapshot snapshot, CancellationToken ct = default)
            => await _cardSnapshots.AddAsync(snapshot, ct);

        public async Task AddErrorAsync(SourceImportError error, CancellationToken ct = default)
            => await _errors.AddAsync(error, ct);

        public async Task<List<SourceImportError>> GetErrorsByRunIdAsync(Guid importRunId, string? severity = null, CancellationToken ct = default)
        {
            var query = _errors.Where(e => e.ImportRunId == importRunId);
            if (!string.IsNullOrWhiteSpace(severity))
                query = query.Where(e => e.Severity == severity);
            return await query.ToListAsync(ct);
        }

        public async Task AddImageCandidateMetadataAsync(ImageCandidateMetadata metadata, CancellationToken ct = default)
            => await _imageCandidates.AddAsync(metadata, ct);

        public async Task<List<ImageCandidateMetadata>> GetImageCandidatesByRunIdAsync(Guid importRunId, CancellationToken ct = default)
            => await _imageCandidates.Where(m => m.ImportRunId == importRunId).ToListAsync(ct);

        public async Task AddCatalogImageAssetAsync(CatalogImageAsset asset, CancellationToken ct = default)
            => await _imageAssets.AddAsync(asset, ct);

        public async Task<CatalogImageAsset?> GetCatalogImageAssetAsync(string entityType, Guid entityId, CancellationToken ct = default)
        {
            var type = Enum.Parse<Domain.Enums.ImageEntityType>(entityType);
            return await _imageAssets.FirstOrDefaultAsync(a => a.EntityType == type && a.EntityId == entityId, ct);
        }
    }
}
