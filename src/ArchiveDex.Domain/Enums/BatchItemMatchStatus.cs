namespace ArchiveDex.Domain.Enums
{
    public enum BatchItemMatchStatus
    {
        PendingReview = 0,
        Matched = 1,
        Overridden = 2,
        NoMatch = 3,
        Accepted = 4,
        Rejected = 5
    }
}
