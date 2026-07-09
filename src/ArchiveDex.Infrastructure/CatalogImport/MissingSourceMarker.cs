using System;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public record MissingSourceExternalId(
        Guid Id, string Source, string ExternalId, string Language,
        bool IsMissingFromSource, DateTime? LastSeenAt, DateTime? MissingDetectedAt = null);

    public static class MissingSourceMarker
    {
        public static MissingSourceExternalId MarkAsMissing(
            MissingSourceExternalId externalId, bool foundInCurrentRun)
        {
            if (foundInCurrentRun)
            {
                return externalId with
                {
                    IsMissingFromSource = false,
                    LastSeenAt = DateTime.UtcNow,
                    MissingDetectedAt = null
                };
            }

            return externalId with
            {
                IsMissingFromSource = true,
                MissingDetectedAt = DateTime.UtcNow
            };
        }
    }
}
