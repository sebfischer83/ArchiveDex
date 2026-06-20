using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Commands.Setup
{
    public sealed class ValidateSetup
    {
        public string AdminUserName { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = string.Empty;
        public string DefaultUiCulture { get; set; } = "en";
        public string CollectionCurrency { get; set; } = "EUR";
    }

    public sealed class SetupValidateResponse
    {
        public bool DatabaseReachable { get; set; }
        public bool StorageWritable { get; set; }
        public List<string> Messages { get; set; } = [];
    }

    public static class ValidateSetupHandler
    {
        public static async Task<SetupValidateResponse> Handle(
            ValidateSetup command,
            IUnitOfWork unitOfWork,
            CancellationToken ct)
        {
            var messages = new List<string>();
            var dbReachable = false;
            var storageWritable = false;

            if (string.IsNullOrWhiteSpace(command.AdminUserName))
            {
                messages.Add("Admin username is required.");
            }

            if (string.IsNullOrWhiteSpace(command.AdminPassword) || command.AdminPassword.Length < 8)
            {
                messages.Add("Admin password must be at least 8 characters.");
            }

            if (!new[] { "de", "en", "ru" }.Contains(command.DefaultUiCulture?.ToLower()))
            {
                messages.Add("UI culture must be de, en, or ru.");
            }

            if (string.IsNullOrWhiteSpace(command.CollectionCurrency) || command.CollectionCurrency.Length != 3)
            {
                messages.Add("Currency must be a valid ISO 4217 code.");
            }

            try
            {
                _ = await unitOfWork.SaveChangesAsync(ct);
                dbReachable = true;
            }
            catch
            {
                messages.Add("Database is not reachable.");
            }

            return new SetupValidateResponse
            {
                DatabaseReachable = dbReachable,
                StorageWritable = storageWritable,
                Messages = messages
            };
        }
    }
}
