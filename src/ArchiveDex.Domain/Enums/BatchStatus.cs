namespace ArchiveDex.Domain.Enums
{
    public enum BatchStatus
    {
        Uploading = 0,
        Processing = 1,
        ReadyForReview = 2,
        PartiallyAccepted = 3,
        Complete = 4
    }
}
