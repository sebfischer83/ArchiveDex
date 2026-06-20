using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Setup
{
    public class SetupState(IConfigStore configStore) : ISetupState
    {
        private readonly IConfigStore _configStore = configStore;

        public async Task<bool> IsSetupCompleteAsync(CancellationToken ct = default)
        {
            ApplicationConfiguration config = await _configStore.GetAsync(ct).ConfigureAwait(false);
            return config.IsSetupComplete;
        }
    }
}
