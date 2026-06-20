using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Sets
{
    /// <summary>
    /// Scores an incoming set against existing canonical sets.
    /// Set codes are deliberately weak signals — name, date and counts dominate.
    /// </summary>
    public class SetMatchingService(ISetRepository repo) : ISetMatchingService
    {
        // Point budgets
        private const double NameMax = 35;
        private const double DateMax = 30;
        private const double CountMax = 20;
        private const double SeriesMax = 10;
        private const double SharedCodeMax = 5;

        private readonly ISetRepository _repo = repo;

        public async Task<SetMatchResult> FindBestMatchAsync(ImportedSetDto incoming, CancellationToken ct)
        {
            IReadOnlyList<CardSet> candidates = await _repo.GetAllWithExternalIdsAsync(ct);

            CardSet? best = null;
            var bestScore = 0;
            IReadOnlyList<string> bestReasons = [];

            foreach (CardSet candidate in candidates)
            {
                (var score, List<string>? reasons) = Score(incoming, candidate);
                if (score > bestScore)
                {
                    bestScore = score;
                    best = candidate;
                    bestReasons = reasons;
                }
            }

            return new SetMatchResult(best, bestScore, bestReasons);
        }

        private static (int Score, List<string> Reasons) Score(ImportedSetDto incoming, CardSet candidate)
        {
            var reasons = new List<string>();
            double score = 0;

            // Name similarity — up to 35
            var sim = SetNameNormalizer.Similarity(incoming.Name, candidate.CanonicalName);
            var namePts = sim * NameMax;
            score += namePts;
            if (namePts > 0)
            {
                reasons.Add($"Name similarity {sim:P0} (+{namePts:0})");
            }

            // Release date — up to 30 (exact 30, ≤7d 20, ≤30d 10)
            if (incoming.ReleaseDate.HasValue && candidate.ReleaseDate.HasValue)
            {
                var days = Math.Abs(incoming.ReleaseDate.Value.DayNumber - candidate.ReleaseDate.Value.DayNumber);
                var datePts = days switch
                {
                    0 => DateMax,
                    <= 7 => 20,
                    <= 30 => 10,
                    _ => 0
                };
                score += datePts;
                if (datePts > 0)
                {
                    reasons.Add($"Release date within {days}d (+{datePts:0})");
                }
            }

            // Card counts — up to 20 (printed exact 20, official exact 15, ±2 either 10)
            double countPts = 0;
            if (incoming.PrintedTotal.HasValue && candidate.PrintedTotal.HasValue
                && incoming.PrintedTotal == candidate.PrintedTotal)
            {
                countPts = CountMax;
            }
            else if (incoming.OfficialTotal.HasValue && candidate.OfficialTotal.HasValue
                && incoming.OfficialTotal == candidate.OfficialTotal)
            {
                countPts = 15;
            }
            else if (CloseBy(incoming.PrintedTotal, candidate.PrintedTotal, 2)
                || CloseBy(incoming.OfficialTotal, candidate.OfficialTotal, 2))
            {
                countPts = 10;
            }

            score += countPts;
            if (countPts > 0)
            {
                reasons.Add($"Card count match (+{countPts:0})");
            }

            // Series / era — up to 10
            if (!string.IsNullOrWhiteSpace(incoming.Series) && !string.IsNullOrWhiteSpace(candidate.Series)
                && SetNameNormalizer.Normalize(incoming.Series) == SetNameNormalizer.Normalize(candidate.Series))
            {
                score += SeriesMax;
                reasons.Add($"Series match (+{SeriesMax:0})");
            }

            // Same external code in another source — max 5 (codes are not globally reliable)
            var incomingCode = SetNameNormalizer.Normalize(incoming.ExternalId);
            if (incomingCode.Length > 0 && candidate.ExternalIds.Any(x =>
                    SetNameNormalizer.Normalize(x.ExternalId) == incomingCode))
            {
                score += SharedCodeMax;
                reasons.Add($"Shared external code (+{SharedCodeMax:0})");
            }

            return ((int)Math.Round(score), reasons);
        }

        private static bool CloseBy(int? a, int? b, int tolerance)
            => a.HasValue && b.HasValue && Math.Abs(a.Value - b.Value) <= tolerance;
    }
}
