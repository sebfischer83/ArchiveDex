namespace ArchiveDex.Infrastructure.CatalogImport
{
    public enum SetReconciliationOutcome
    {
        ReusedExisting,
        CreatedNew,
        Ambiguous,
    }

    public readonly struct CatalogImportSetResult
    {
        public SetReconciliationOutcome Outcome { get; }
        public Guid CardSetId { get; }
        public bool CreatedSupportingItem { get; }

        public CatalogImportSetResult(SetReconciliationOutcome outcome, Guid cardSetId, bool createdSupportingItem)
        {
            Outcome = outcome;
            CardSetId = cardSetId;
            CreatedSupportingItem = createdSupportingItem;
        }
    }

    public enum CardReconciliationOutcome
    {
        Added,
        SkippedExisting,
        Ambiguous,
        Failed,
    }

    public readonly struct CatalogImportCardResult
    {
        public CardReconciliationOutcome Outcome { get; }
        public Guid? CardPrintId { get; }
        public string? AmbiguousReason { get; }
        public string? ErrorMessage { get; }

        public CatalogImportCardResult(CardReconciliationOutcome outcome, Guid? cardPrintId = null, string? ambiguousReason = null, string? errorMessage = null)
        {
            Outcome = outcome;
            CardPrintId = cardPrintId;
            AmbiguousReason = ambiguousReason;
            ErrorMessage = errorMessage;
        }
    }
}
