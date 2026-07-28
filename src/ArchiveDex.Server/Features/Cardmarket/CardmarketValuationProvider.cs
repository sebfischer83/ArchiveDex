using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Cardmarket;

/// <summary>
/// Prices a card from the uploaded Cardmarket files. Once a card is matched the lookup is a plain
/// database read, so a full collection run costs nothing and can be repeated as often as wanted.
/// The only paid step is resolving an ambiguous card, and that happens once per card, ever.
/// </summary>
public sealed class CardmarketValuationProvider(
    ArchiveDexDbContext db,
    CardmarketMatcher matcher) : IMarketValuationProvider
{
    public async Task<ValuationResult?> EvaluateAsync(ValuationRequest request, CancellationToken ct)
    {
        if (!request.Currency.Equals("EUR", StringComparison.OrdinalIgnoreCase)
            || request.CardRecordId is not { } cardRecordId)
            return null;

        var card = await db.CardRecords
            .Include(x => x.SetEdition)
            .FirstOrDefaultAsync(x => x.Id == cardRecordId, ct);
        if (card?.SetEdition?.CardmarketExpansionId is not { } expansionId)
            return null;

        var idProduct = card.CardmarketProductId ?? await ResolveIfWorthwhileAsync(card, expansionId, ct);
        if (idProduct is null) return null;

        var price = await db.CardmarketPrices.AsNoTracking()
            .FirstOrDefaultAsync(x => x.IdProduct == idProduct, ct);
        if (price is null) return null;

        var snapshot = await db.CardmarketImports.AsNoTracking()
            .Where(x => x.Kind == CardmarketImport.KindPrices)
            .OrderByDescending(x => x.ImportedAt)
            .Select(x => (DateTime?)x.SourceCreatedAt)
            .FirstOrDefaultAsync(ct);

        var (amount, method) = Pick(price, card.VariantKey);
        if (amount is not { } amountMinor) return null;

        return new ValuationResult(
            "AVAILABLE",
            amountMinor,
            "EUR",
            DateTime.UtcNow,
            snapshot ?? DateTime.UtcNow,
            "cardmarket",
            method,
            "HIGH",
            // The price guide has no condition dimension at all, so no condition factor was applied.
            ConditionApplied: false,
            Disclaimer: "Unverbindliche Schätzung auf Basis des Cardmarket-Preisguides.",
            SourceUrls: []);
    }

    /// <summary>
    /// Resolves the card unless a previous attempt already concluded it cannot be resolved. Without
    /// this the model would be paid again on every run for exactly the cards it could not answer.
    /// A catalogue upload after the last attempt lifts the block, since the candidates changed.
    /// </summary>
    private async Task<int?> ResolveIfWorthwhileAsync(CardRecord card, int expansionId, CancellationToken ct)
    {
        if (card.CardmarketMatchState is CardmarketMatchState.Unresolved or CardmarketMatchState.NoCandidate
            && card.CardmarketMatchedAt is { } attemptedAt)
        {
            var cataloguedAt = await db.CardmarketImports.AsNoTracking()
                .Where(x => x.Kind == CardmarketImport.KindProducts)
                .OrderByDescending(x => x.ImportedAt)
                .Select(x => (DateTime?)x.ImportedAt)
                .FirstOrDefaultAsync(ct);
            if (cataloguedAt is null || cataloguedAt <= attemptedAt)
                return null;
        }

        return await ResolveAsync(card, expansionId, ct);
    }

    private async Task<int?> ResolveAsync(CardRecord card, int expansionId, CancellationToken ct)
    {
        var candidates = await matcher.LoadCandidatesAsync(expansionId, ct);
        var match = await matcher.MatchAsync(card, candidates, LoadImageAsync, ct);

        card.CardmarketProductId = match.IdProduct;
        card.CardmarketMatchState = match.State;
        card.CardmarketMatchedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return match.IdProduct;

        // The full image, not the thumbnail: this call decides which rarity treatment the card is,
        // and foil patterns are simply not resolved at 400 px. Within a candidate group the price
        // spread reaches a factor of several hundred, so the extra input tokens are well spent.
        async Task<byte[]?> LoadImageAsync(CancellationToken token) =>
            await db.CardSpecimens.AsNoTracking()
                .Where(x => x.CardRecordId == card.Id)
                .OrderBy(x => x.CreatedAt)
                .Select(x => x.ImageAsset!.Content)
                .FirstOrDefaultAsync(token);
    }

    /// <summary>
    /// Chooses the price track from the card's finish, preferring the matching one but falling
    /// through to the other when it carries no quote. Cardmarket lists many premium variants only on
    /// the plain track; refusing to cross over would leave exactly the valuable cards unpriced.
    /// Track choice is a preference here, not a filter — the product itself already identifies the
    /// printing, so whichever track quotes it is that printing's market price.
    /// </summary>
    private static (long? AmountMinor, string Method) Pick(CardmarketPrice price, string variantKey)
    {
        var variant = variantKey.ToLowerInvariant();
        var plain = variant.Contains("non-holo") || variant.Contains("standard") || variant.Contains("normal");
        var preferHolo = !plain && variant.Contains("holo");

        (decimal? Value, string Name)[] holoTrack =
            [(price.Avg30Holo, "avg30-holo"), (price.Avg7Holo, "avg7-holo"), (price.TrendHolo, "trend-holo")];
        (decimal? Value, string Name)[] plainTrack =
            [(price.Avg30, "avg30"), (price.Avg7, "avg7"), (price.Trend, "trend"), (price.Avg, "avg")];

        var ordered = preferHolo ? holoTrack.Concat(plainTrack) : plainTrack.Concat(holoTrack);
        foreach (var (value, name) in ordered)
            if (value is { } money && money > 0)
                return ((long)decimal.Round(money * 100, 0), name);

        return (null, "none");
    }
}
