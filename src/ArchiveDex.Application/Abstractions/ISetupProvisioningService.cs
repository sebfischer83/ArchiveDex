using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions;

public interface ISetupProvisioningService
{
    Task ProvisionAsync(SetupProvisioningRequest request, CancellationToken ct = default);
}

public sealed record SetupProvisioningRequest(
    string AdminUserName,
    string AdminPassword,
    UiCulture DefaultUiCulture,
    string CollectionCurrency,
    string ImageStoragePath);

public sealed class SetupAlreadyCompletedException : InvalidOperationException
{
    public SetupAlreadyCompletedException() : base("Setup is already complete.") { }
}

public sealed class SetupValidationException(IReadOnlyList<string> messages)
    : InvalidOperationException("Setup validation failed.")
{
    public IReadOnlyList<string> Messages { get; } = messages;
}
