using ArchiveDex.Server.Features.Capture;

namespace ArchiveDex.Server.Features.Collection
{
    public sealed record UpdateCardRequest(
        Guid? CatalogReferenceId,
        string OriginalName,
        string? GermanName,
        string? GermanNameUnavailableReason,
        string PrintedNumber,
        string SetIdentifier,
        string SetName,
        string Language,
        string VariantKey,
        string? CollectorNumber = null,
        string? SetTotal = null)
    {
        public ReviewCaptureRequest ToReviewRequest() => new(
            CatalogReferenceId,
            OriginalName,
            GermanName,
            GermanNameUnavailableReason,
            PrintedNumber,
            SetIdentifier,
            SetName,
            Language,
            VariantKey,
            "NM",
            CollectorNumber,
            SetTotal);
    }
}
