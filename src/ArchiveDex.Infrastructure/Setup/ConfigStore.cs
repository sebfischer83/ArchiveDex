using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Setup;

public class ConfigStore : IConfigStore
{
    private readonly Persistence.ArchiveDexDbContext _db;

    public ConfigStore(Persistence.ArchiveDexDbContext db)
    {
        _db = db;
    }

    public async Task<ApplicationConfiguration> GetAsync(CancellationToken ct = default)
    {
        var config = await _db.ApplicationConfigurations.FirstOrDefaultAsync(ct).ConfigureAwait(false);
        if (config is null)
        {
            config = new ApplicationConfiguration();
            _db.ApplicationConfigurations.Add(config);
            await _db.SaveChangesAsync(ct).ConfigureAwait(false);
        }
        return config;
    }

    public async Task SaveAsync(ApplicationConfiguration config, CancellationToken ct = default)
    {
        _db.ApplicationConfigurations.Update(config);
        await _db.SaveChangesAsync(ct).ConfigureAwait(false);
    }
}
