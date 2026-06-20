using System.Globalization;
using System.Text;

namespace ArchiveDex.Application.Sets
{
    public static class SetNameNormalizer
    {
        /// <summary>Lowercase, strip diacritics, drop all non-alphanumerics.</summary>
        public static string Normalize(string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return string.Empty;
            }

            var decomposed = name.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder(decomposed.Length);
            foreach (var ch in decomposed)
            {
                UnicodeCategory cat = CharUnicodeInfo.GetUnicodeCategory(ch);
                if (cat == UnicodeCategory.NonSpacingMark)
                {
                    continue;
                }

                if (char.IsLetterOrDigit(ch))
                {
                    _ = sb.Append(char.ToLowerInvariant(ch));
                }
            }
            return sb.ToString();
        }

        /// <summary>Similarity in [0,1] based on Levenshtein distance over normalized names.</summary>
        public static double Similarity(string? a, string? b)
        {
            var na = Normalize(a);
            var nb = Normalize(b);
            if (na.Length == 0 && nb.Length == 0)
            {
                return 1.0;
            }

            if (na.Length == 0 || nb.Length == 0)
            {
                return 0.0;
            }

            if (na == nb)
            {
                return 1.0;
            }

            var dist = Levenshtein(na, nb);
            var maxLen = Math.Max(na.Length, nb.Length);
            return 1.0 - ((double)dist / maxLen);
        }

        private static int Levenshtein(string a, string b)
        {
            var prev = new int[b.Length + 1];
            var curr = new int[b.Length + 1];
            for (var j = 0; j <= b.Length; j++)
            {
                prev[j] = j;
            }

            for (var i = 1; i <= a.Length; i++)
            {
                curr[0] = i;
                for (var j = 1; j <= b.Length; j++)
                {
                    var cost = a[i - 1] == b[j - 1] ? 0 : 1;
                    curr[j] = Math.Min(Math.Min(curr[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
                }
                (prev, curr) = (curr, prev);
            }
            return prev[b.Length];
        }
    }
}
