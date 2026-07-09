namespace ArchiveDex.Application.CatalogImport
{
    public record ExternalIdEntry(string Source, string Language, string ExternalId, Guid CardSetId);

    public record SetCandidate(string NormalizedName, DateOnly? ReleaseDate, int? PrintedTotal, Guid SetId);

    public static class CatalogImportSetMatcher
    {
        public static SetCandidate? MatchByExternalId(
            string source, string language, string externalId,
            IEnumerable<ExternalIdEntry> existingExternalIds)
        {
            return existingExternalIds
                .Where(e => e.Source == source && e.Language == language && e.ExternalId == externalId)
                .Select(e => new SetCandidate(string.Empty, null, null, e.CardSetId))
                .FirstOrDefault();
        }

        public static SetCandidate? MatchByFallback(
            string normalizedName, DateOnly? releaseDate, int? printedTotal,
            IEnumerable<SetCandidate> candidates)
        {
            return candidates.FirstOrDefault(c =>
                string.Equals(c.NormalizedName, normalizedName, StringComparison.OrdinalIgnoreCase)
                && c.ReleaseDate == releaseDate
                && c.PrintedTotal == printedTotal);
        }
    }
}
