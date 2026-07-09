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

        public static IEnumerable<object> FindExistingCardPrints(
            IEnumerable<object> first, IEnumerable<object> second)
        {
            return first.Intersect(second);
        }

        public static IEnumerable<object> FindExistingExternalIds(
            IEnumerable<object> first, IEnumerable<object> second)
        {
            return first.Intersect(second);
        }

        public static IEnumerable<object> FindNewCardPrints(
            IEnumerable<object> first, IEnumerable<object> second)
        {
            var existingSet = new HashSet<object>(first);
            return second.Where(x => !existingSet.Contains(x));
        }
    }
}
