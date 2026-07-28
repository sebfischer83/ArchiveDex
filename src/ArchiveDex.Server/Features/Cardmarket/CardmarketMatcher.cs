using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ArchiveDex.Server.Features.Cardmarket;

public sealed class CardmarketMatchOptions
{
    /// <summary>
    /// Price spread inside a candidate group, in euro cents, below which the median is taken instead
    /// of paying for a model call. Defaults to the valuation guard's own tolerance: an error smaller
    /// than that would not even be flagged.
    /// </summary>
    public long NarrowSpreadMinor { get; set; } = 200;

    /// <summary>Upper bound on candidates handed to the model, cheapest and dearest kept.</summary>
    public int MaximumAiCandidates { get; set; } = 24;
}

/// <param name="IdProduct">Cardmarket product.</param>
/// <param name="Name">Catalogue name, always English.</param>
/// <param name="PriceMinor">Best available price in euro cents, holo track preferred.</param>
public sealed record CardmarketCandidate(int IdProduct, int IdMetacard, string Name, long? PriceMinor);

public sealed record CardmarketMatch(int? IdProduct, string State);

/// <summary>
/// Ties a card record to one Cardmarket product. Cheap paths first: a single candidate needs no
/// thinking, a group whose prices barely differ needs no thinking either, and only a genuinely
/// costly choice is worth a model call.
/// </summary>
public sealed class CardmarketMatcher(
    ArchiveDexDbContext db,
    IOptions<CardmarketMatchOptions> options,
    ICardmarketDisambiguator disambiguator)
{
    private readonly CardmarketMatchOptions _options = options.Value;

    /// <summary>
    /// Reads every priced single of an expansion. Callers resolving a whole set should hoist this
    /// out of their loop; it is one query per expansion, not per card.
    /// </summary>
    public async Task<IReadOnlyList<CardmarketCandidate>> LoadCandidatesAsync(
        int expansionId, CancellationToken ct)
    {
        var rows = await db.CardmarketProducts.AsNoTracking()
            .Where(x => x.IdExpansion == expansionId)
            .GroupJoin(
                db.CardmarketPrices.AsNoTracking(),
                product => product.IdProduct,
                price => price.IdProduct,
                (product, prices) => new { product, prices })
            .SelectMany(x => x.prices.DefaultIfEmpty(), (x, price) => new
            {
                x.product.IdProduct,
                x.product.IdMetacard,
                x.product.Name,
                price!.Avg30, price.Avg30Holo, price.Trend, price.TrendHolo, price.Avg7, price.Avg,
            })
            .ToListAsync(ct);

        return rows
            .Select(x => new CardmarketCandidate(
                x.IdProduct, x.IdMetacard, x.Name,
                BestPriceMinor(x.Avg30Holo, x.Avg30, x.TrendHolo, x.Trend, x.Avg7, x.Avg)))
            .OrderBy(x => x.IdProduct)
            .ToList();
    }

    /// <summary>
    /// Picks the product for one card. <paramref name="imageBytes"/> is only read when the choice is
    /// expensive enough to warrant the model.
    /// </summary>
    public async Task<CardmarketMatch> MatchAsync(
        CardRecord card,
        IReadOnlyList<CardmarketCandidate> candidates,
        Func<CancellationToken, Task<byte[]?>> imageBytes,
        CancellationToken ct)
    {
        if (candidates.Count == 0)
            return new CardmarketMatch(null, CardmarketMatchState.NoCandidate);
        if (candidates.Count == 1)
            return new CardmarketMatch(candidates[0].IdProduct, CardmarketMatchState.Unique);

        // Collapse each printing into one representative, so the model never sees near-duplicates
        // that cost the same anyway.
        var groups = candidates
            .GroupBy(x => x.IdMetacard)
            .Select(group => Collapse([.. group]))
            .ToList();

        if (groups.Count == 1)
        {
            var only = groups[0];
            return new CardmarketMatch(
                only.Representative.IdProduct,
                only.Collapsed ? CardmarketMatchState.NarrowSpread : CardmarketMatchState.Unique);
        }

        var shortlist = Shortlist(groups);
        var image = await imageBytes(ct);
        var chosen = await disambiguator.ChooseAsync(card, shortlist, image, ct);
        return chosen is { } idProduct
            ? new CardmarketMatch(idProduct, CardmarketMatchState.AiResolved)
            : new CardmarketMatch(null, CardmarketMatchState.Unresolved);
    }

    private sealed record Group(CardmarketCandidate Representative, bool Collapsed, IReadOnlyList<CardmarketCandidate> Members);

    /// <summary>
    /// Reduces one printing's variants to a single candidate when their prices sit close together;
    /// otherwise keeps the spread visible so the model can pick the right rarity tier.
    /// </summary>
    private Group Collapse(IReadOnlyList<CardmarketCandidate> members)
    {
        var priced = members.Where(x => x.PriceMinor is not null)
            .OrderBy(x => x.PriceMinor).ToList();
        if (priced.Count == 0)
            return new Group(members[0], false, members);
        if (priced.Count == 1)
            return new Group(priced[0], false, priced);

        var spread = priced[^1].PriceMinor!.Value - priced[0].PriceMinor!.Value;
        if (spread < _options.NarrowSpreadMinor)
            return new Group(priced[priced.Count / 2], true, priced);

        // Wide spread: the cheapest and the dearest carry the decision, so show both ends.
        return new Group(priced[0], false, priced);
    }

    /// <summary>
    /// Flattens groups into the list handed to the model, keeping every printing represented and,
    /// where a printing spans a wide price range, both ends of that range.
    /// </summary>
    private List<CardmarketCandidate> Shortlist(List<Group> groups)
    {
        var shortlist = new List<CardmarketCandidate>();
        foreach (var group in groups)
        {
            shortlist.Add(group.Representative);
            if (group.Collapsed || group.Members.Count < 2) continue;
            var dearest = group.Members[^1];
            if (dearest.IdProduct != group.Representative.IdProduct) shortlist.Add(dearest);
        }

        if (shortlist.Count <= _options.MaximumAiCandidates) return shortlist;

        // Too many to send: keep the extremes, which is where a wrong pick actually costs money.
        var ordered = shortlist.OrderBy(x => x.PriceMinor ?? long.MaxValue).ToList();
        var half = _options.MaximumAiCandidates / 2;
        return [.. ordered.Take(half), .. ordered.Skip(ordered.Count - half)];
    }

    /// <summary>Holo track wins when present: it is the one most singles actually trade on.</summary>
    private static long? BestPriceMinor(params decimal?[] candidates)
    {
        foreach (var value in candidates)
            if (value is { } money && money > 0)
                return (long)decimal.Round(money * 100, 0);
        return null;
    }
}
