using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Setup;

public sealed class CompleteSetup
{
    public string AdminUserName { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
    public string DefaultUiCulture { get; set; } = "en";
    public string CollectionCurrency { get; set; } = "EUR";
}

public static class CompleteSetupHandler
{
    public static async Task Handle(
        CompleteSetup command,
        IConfigStore configStore,
        IAdminProvisioner adminProvisioner,
        CancellationToken ct)
    {
        var config = await configStore.GetAsync(ct);

        if (config.IsSetupComplete)
            throw new InvalidOperationException("Setup is already complete.");

        config.DefaultUiCulture = Enum.Parse<UiCulture>(command.DefaultUiCulture, ignoreCase: true);
        config.CollectionCurrency = command.CollectionCurrency.ToUpperInvariant();
        config.ImageStoragePath = "/app/images";
        config.IsSetupComplete = true;

        await configStore.SaveAsync(config, ct);

        await adminProvisioner.ProvisionAsync(
            command.AdminUserName, command.AdminPassword,
            config.DefaultUiCulture, ct);
    }
}
