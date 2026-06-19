using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Infrastructure.Setup;

public class SetupState : ISetupState
{
    private readonly IConfigStore _configStore;

    public SetupState(IConfigStore configStore)
    {
        _configStore = configStore;
    }

    public async Task<bool> IsSetupCompleteAsync(CancellationToken ct = default)
    {
        var config = await _configStore.GetAsync(ct).ConfigureAwait(false);
        return config.IsSetupComplete;
    }
}
