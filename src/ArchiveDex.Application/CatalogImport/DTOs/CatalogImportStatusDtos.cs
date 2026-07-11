using System.Text.Json.Serialization;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.CatalogImport.DTOs
{
    public record CatalogImportRunDto(
        Guid Id,
        string Status,
        string Mode,
        bool IsDryRun,
        bool DownloadImages,
        DateTime? StartedAt,
        DateTime? FinishedAt,
        int ImportedCount,
        int UpdatedCount,
        int MergedCount,
        int SkippedCount,
        int AddedCount,
        int AddedSupportingItemCount,
        int AmbiguousCount,
        int ErrorCount,
        int WarningCount,
        List<CatalogImportCheckpointDto> Checkpoints);

    public record CatalogImportCheckpointDto(
        string Source,
        string Language,
        string? SetExternalId,
        string Phase,
        bool IsCompleted,
        int ProcessedCount,
        DateTime UpdatedAt);

    public record CatalogImportReportDto(
        CatalogImportRunDto Run,
        List<SourceSummaryDto> SourceSummaries,
        ImageQualitySummaryDto ImageSummary,
        int PendingMappingCount,
        int AmbiguousCardCount);

    public record SourceSummaryDto(
        string Source,
        string Language,
        int SetsProcessed,
        int CardsProcessed,
        int Errors,
        int Warnings);

    public record ImageQualityReportDto(
        ImageQualitySummaryDto Summary,
        List<ImageCandidateDto> Candidates);

    public record ImageQualitySummaryDto(
        int SelectedImages,
        int FailedDownloads,
        int CardsWithoutImages,
        int SetsWithoutImages,
        int CandidatesAnalyzed);

    public record ImageCandidateDto(
        string EntityType,
        Guid? EntityId,
        string Source,
        string SourceUrl,
        int? Width,
        int? Height,
        string? Format,
        long? FileSizeBytes,
        decimal? QualityScore,
        bool IsSelected,
        string? Error);

    public record SourceImportErrorDto(
        string Severity,
        string? Source,
        string? Language,
        string? SetExternalId,
        string? CardExternalId,
        string? Phase,
        string Code,
        string Message,
        DateTime OccurredAt);

    public class StartCatalogImportRequest
    {
        public List<string> Sources { get; set; } = [];
        public Dictionary<string, List<string>> LanguagesBySource { get; set; } = new();
        public bool DryRun { get; set; }
        public bool DownloadImages { get; set; } = true;
        public bool ReanalyzeExistingImages { get; set; } = true;
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public CatalogImportMode Mode { get; set; } = CatalogImportMode.Update;
    }
}
