namespace ArchiveDex.Server.Features.Cardmarket;

/// <summary>
/// How a card record was tied to a Cardmarket product. Stored on the card so a resolution is made
/// once and then reused by every later price run for free.
/// </summary>
public static class CardmarketMatchState
{
    /// <summary>Exactly one product carried the card's name in the expansion.</summary>
    public const string Unique = "unique";

    /// <summary>
    /// Several candidates, but their prices sit close enough together that picking the median costs
    /// less than the valuation guard's tolerance. Not worth spending a model call on.
    /// </summary>
    public const string NarrowSpread = "narrowSpread";

    /// <summary>Candidates differed enough in price that a vision model picked between them.</summary>
    public const string AiResolved = "aiResolved";

    /// <summary>Owner picked the product by hand.</summary>
    public const string Manual = "manual";

    /// <summary>Candidates exist but none could be settled on; the card stays unpriced.</summary>
    public const string Unresolved = "unresolved";

    /// <summary>The expansion holds no product matching this card at all.</summary>
    public const string NoCandidate = "noCandidate";

    public static readonly string[] All =
        [Unique, NarrowSpread, AiResolved, Manual, Unresolved, NoCandidate];
}
