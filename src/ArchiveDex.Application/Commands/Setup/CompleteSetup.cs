using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Setup
{
    public sealed class CompleteSetup
    {
        public string AdminUserName { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = string.Empty;
        public string DefaultUiCulture { get; set; } = "en";
        public string CollectionCurrency { get; set; } = "EUR";
        public string ImageStoragePath { get; set; } = "/app/images";
    }

    public static class CompleteSetupHandler
    {
        public static async Task Handle(
            CompleteSetup command,
            ISetupEnvironmentValidator environmentValidator,
            ISetupProvisioningService provisioningService,
            CancellationToken ct)
        {
            var validationCommand = new ValidateSetup
            {
                AdminUserName = command.AdminUserName,
                AdminPassword = command.AdminPassword,
                DefaultUiCulture = command.DefaultUiCulture,
                CollectionCurrency = command.CollectionCurrency,
                ImageStoragePath = command.ImageStoragePath
            };
            SetupValidateResponse validation = await ValidateSetupHandler.Handle(validationCommand, environmentValidator, ct);
            if (!validation.DatabaseReachable || !validation.StorageWritable || validation.Messages.Count > 0)
            {
                throw new SetupValidationException(validation.Messages);
            }

            await provisioningService.ProvisionAsync(new SetupProvisioningRequest(
                command.AdminUserName,
                command.AdminPassword,
                Enum.Parse<UiCulture>(command.DefaultUiCulture, ignoreCase: true),
                command.CollectionCurrency.ToUpperInvariant(),
                Path.GetFullPath(command.ImageStoragePath)), ct);
        }
    }
}
