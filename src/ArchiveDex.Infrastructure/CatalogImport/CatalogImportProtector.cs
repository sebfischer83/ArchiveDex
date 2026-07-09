using System;
using System.Collections.Generic;
using System.Linq;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public record LocalCorrectionRecord(Guid Id, string? EffectiveName);

    public record CanonicalUpdateResult(string EffectiveName);

    public static class CatalogImportProtector
    {
        public static void VerifyCollectionEntriesPreserved(HashSet<Guid> before, Guid[] after)
        {
            foreach (var id in before)
            {
                if (!after.Contains(id))
                    throw new InvalidOperationException($"CollectionEntry {id} was lost during import.");
            }
        }

        public static CanonicalUpdateResult ApplyCanonicalUpdate(
            LocalCorrectionRecord? localCorrection, string importedName)
        {
            if (localCorrection?.EffectiveName != null)
                return new CanonicalUpdateResult(localCorrection.EffectiveName);
            return new CanonicalUpdateResult(importedName);
        }

        public static bool ShouldAutoOverwriteImage(
            bool isManuallySelected, decimal newQualityScore, decimal existingQualityScore)
        {
            if (isManuallySelected) return false;
            return newQualityScore > existingQualityScore;
        }
    }
}
