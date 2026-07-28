namespace ArchiveDex.Server.Infrastructure.Images;

public sealed class CardDetectionOptions
{
    /// <summary>
    /// Long edge the detection pass works on. Full resolution adds noise and time without helping:
    /// a card edge that is invisible at 1000 px is not going to be found at 4000 px either.
    /// </summary>
    public int WorkingLongEdge { get; set; } = 1000;

    /// <summary>Smallest share of the frame a candidate must cover to be considered the card.</summary>
    public double MinimumAreaShare { get; set; } = 0.15;

    /// <summary>Largest share; anything above this is the frame itself, not an object in it.</summary>
    public double MaximumAreaShare { get; set; } = 0.98;

    /// <summary>
    /// Trading card geometry: 63 × 88 mm. Every candidate is judged against this after the
    /// perspective is undone, which is what separates a card from a table edge or a binder page.
    /// </summary>
    public double TargetAspectRatio { get; set; } = 63.0 / 88.0;

    /// <summary>
    /// Relative deviation from <see cref="TargetAspectRatio"/> still treated as a card. This doubles
    /// as the distortion ceiling: the crop is warped onto a canvas with the exact card ratio, so a
    /// quadrilateral that is off by this much gets stretched by this much. Measured against real
    /// photos, 0.06 keeps every hit that 0.12 found while halving the worst-case stretch; going to
    /// 0.04 starts losing cards.
    /// </summary>
    public double AspectTolerance { get; set; } = 0.06;

    /// <summary>Minimum score before a crop is offered at all.</summary>
    public double MinimumConfidence { get; set; } = 0.55;

    /// <summary>Long edge of the produced crop; the short edge follows the card ratio.</summary>
    public int OutputLongEdge { get; set; } = 1675;
}

/// <param name="Corners">Top-left, top-right, bottom-right, bottom-left in source pixel coordinates.</param>
/// <param name="Confidence">0..1; how card-shaped and how cleanly bounded the quadrilateral was.</param>
public sealed record CardQuad(IReadOnlyList<(double X, double Y)> Corners, double Confidence);

/// <param name="Cropped">Deskewed card, or null when nothing convincing was found.</param>
/// <param name="Quad">The accepted quadrilateral; null when no crop was produced.</param>
public sealed record CardDetectionResult(byte[]? Cropped, CardQuad? Quad)
{
    public bool Found => Cropped is not null;

    public static readonly CardDetectionResult NotFound = new(null, null);
}
