using System;
using System.Collections.Generic;
using System.Linq;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public static class CatalogImportDeduplication
    {
        public static IEnumerable<string> DeduplicateSets(IEnumerable<string> first, IEnumerable<string> second)
        {
            return first.Union(second).Distinct();
        }

        public static IEnumerable<object> FindDuplicateCardPrints(
            IEnumerable<object> first, IEnumerable<object> second)
        {
            return first.Intersect(second);
        }

        public static IEnumerable<object> FindDuplicateExternalIds(
            IEnumerable<object> first, IEnumerable<object> second)
        {
            return first.Intersect(second);
        }

        public static IEnumerable<object> FindNewCardPrints(
            IEnumerable<object> first, IEnumerable<object> second)
        {
            return second.Except(first);
        }
    }
}
