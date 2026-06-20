using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Setup
{
    public class ConfigStore(Persistence.ArchiveDexDbContext db) : IConfigStore
    {
        private readonly Persistence.ArchiveDexDbContext _db = db;

        public async Task<ApplicationConfiguration> GetAsync(CancellationToken ct = default)
        {
            ApplicationConfiguration? config = await _db.ApplicationConfigurations.FirstOrDefaultAsync(ct).ConfigureAwait(false);
            if (config is null)
            {
                config = new ApplicationConfiguration();
                _ = _db.ApplicationConfigurations.Add(config);
                _ = await _db.SaveChangesAsync(ct).ConfigureAwait(false);
            }
            return config;
        }

        public async Task SaveAsync(ApplicationConfiguration config, CancellationToken ct = default)
        {
            _ = _db.ApplicationConfigurations.Update(config);
            _ = await _db.SaveChangesAsync(ct).ConfigureAwait(false);
        }
    }
}
