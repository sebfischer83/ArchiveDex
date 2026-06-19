using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Scanning;

public class MatchRankingService
{
    public List<CandidateMatch> RankMatches(OcrResult ocr, IReadOnlyList<CardPrint> candidates)
    {
        var results = new List<CandidateMatch>();

        foreach (var card in candidates)
        {
            var score = 0;
            if (!string.IsNullOrEmpty(ocr.DetectedNumber) &&
                !string.IsNullOrEmpty(card.Number) &&
                card.Number.Contains(ocr.DetectedNumber, StringComparison.OrdinalIgnoreCase))
                score += 40;

            if (!string.IsNullOrEmpty(ocr.DetectedName) &&
                !string.IsNullOrEmpty(card.Name) &&
                card.Name.Contains(ocr.DetectedName, StringComparison.OrdinalIgnoreCase))
                score += 50;

            if (ocr.DetectedCardLanguage.HasValue && card.CardLanguage == ocr.DetectedCardLanguage.Value)
                score += 10;

            if (!string.IsNullOrWhiteSpace(ocr.DetectedSetHint) &&
                card.CardSet is not null &&
                (card.CardSet.CanonicalName.Contains(ocr.DetectedSetHint, StringComparison.OrdinalIgnoreCase) ||
                 card.CardSet.ExternalIds.Any(x => x.ExternalId.Contains(ocr.DetectedSetHint, StringComparison.OrdinalIgnoreCase))))
                score += 20;

            if (score > 0)
                results.Add(new CandidateMatch(card.Id, score));
        }

        return results.OrderByDescending(c => c.Score).Take(10).ToList();
    }
}

public sealed record CandidateMatch(Guid CardId, int Score);
