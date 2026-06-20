namespace ArchiveDex.Web.Services
{
    public class ScannerSession
    {
        public Guid? LastScanId { get; set; }
        public Guid? SelectedCardId { get; set; }
        public string? ImageUrl { get; set; }
        public string? DetectedNumber { get; set; }
        public string? DetectedName { get; set; }
        public double? Confidence { get; set; }
        public List<CandidateItem> Candidates { get; set; } = [];
        public bool IsScanning { get; set; }
        public bool IsComplete { get; set; }
        public string? Error { get; set; }
        public bool IsBatchMode { get; set; }
        public Guid? ActiveBatchId { get; set; }
        public int BatchUploadProgress { get; set; }
        public int BatchUploadTotal { get; set; }

        public void Reset()
        {
            LastScanId = null;
            SelectedCardId = null;
            ImageUrl = null;
            DetectedNumber = null;
            DetectedName = null;
            Confidence = null;
            Candidates = [];
            IsScanning = false;
            IsComplete = false;
            Error = null;
        }

        public void ResetBatch()
        {
            ActiveBatchId = null;
            BatchUploadProgress = 0;
            BatchUploadTotal = 0;
        }
    }

    public class CandidateItem
    {
        public Guid CardId { get; set; }
        public int Score { get; set; }
        public string Number { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Rarity { get; set; }
        public string? CardLanguage { get; set; }
    }
}
