using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Empty-target checks run immediately after validation and immediately before restore.
/// </summary>
public class CatalogImportEligibilityService
{
    private readonly ICatalogTransferRepository _repo;

    public CatalogImportEligibilityService(ICatalogTransferRepository repo)
    {
        _repo = repo;
    }

    public async Task<bool> IsTargetEligibleAsync(CancellationToken ct = default)
        => await _repo.IsTargetCatalogEmptyAsync(ct);
}
