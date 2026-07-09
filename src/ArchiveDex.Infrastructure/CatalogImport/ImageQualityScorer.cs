namespace ArchiveDex.Infrastructure.CatalogImport
{
    public record ImageAnalysisResult(
        int? Width, int? Height, string? Format,
        long? FileSizeBytes, bool IsValid, string? Sha256, string Source);

    public static class ImageQualityScorer
    {
        public static decimal CalculateScore(ImageAnalysisResult result)
        {
            if (!result.IsValid || result.Width == null || result.Height == null)
                return 0m;

            decimal resolutionScore = Math.Min((decimal)(result.Width * result.Height) / 1_000_000m, 10m);
            decimal formatScore = result.Format?.ToUpperInvariant() switch
            {
                "PNG" or "WEBP" => 2m,
                "JPEG" or "JPG" => 1.5m,
                _ => 1m
            };
            decimal sourceScore = result.Source?.ToUpperInvariant() switch
            {
                "TCGDEX" => 0.5m,
                _ => 0.1m
            };
            decimal sizeScore = result.FileSizeBytes > 10_000 ? 1m : 0m;

            return resolutionScore + formatScore + sourceScore + sizeScore;
        }
    }
}
