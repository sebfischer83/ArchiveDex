namespace ArchiveDex.Application.CatalogImport
{
    public record CardExternalIdEntry(string Source, string Language, string ExternalId, Guid CardPrintId);

    public record CardPrintCandidate(Guid SetId, string NormalizedNumber, string Language, Guid CardPrintId);

    public static class CatalogImportCardMatcher
    {
        public static CardPrintCandidate? MatchByExternalId(
            string source, string language, string externalId,
            IEnumerable<CardExternalIdEntry> existingExternalIds)
        {
            return existingExternalIds
                .Where(e => e.Source == source && e.Language == language && e.ExternalId == externalId)
                .Select(e => new CardPrintCandidate(Guid.Empty, string.Empty, string.Empty, e.CardPrintId))
                .FirstOrDefault();
        }

        public static CardPrintCandidate? MatchByFallback(
            Guid setId, string normalizedNumber, string language,
            IEnumerable<CardPrintCandidate> candidates)
        {
            return candidates.FirstOrDefault(c =>
                c.SetId == setId
                && string.Equals(c.NormalizedNumber, normalizedNumber, StringComparison.OrdinalIgnoreCase)
                && string.Equals(c.Language, language, StringComparison.OrdinalIgnoreCase));
        }
    }
}
