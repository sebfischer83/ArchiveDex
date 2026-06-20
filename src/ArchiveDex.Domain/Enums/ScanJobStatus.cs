namespace ArchiveDex.Domain.Enums
{
    public enum ScanJobStatus
    {
        Uploaded = 0,
        OcrRunning = 1,
        OcrComplete = 2,
        Confirmed = 3,
        Failed = 4,
        Rejected = 5
    }
}
