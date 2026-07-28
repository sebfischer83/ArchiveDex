using Microsoft.Extensions.Options;
using OpenCvSharp;

namespace ArchiveDex.Server.Infrastructure.Images;

/// <summary>
/// Finds the single trading card in a photo and undoes its perspective, the classic document-scanner
/// pipeline narrowed by one strong prior: a card is always 63 × 88 mm. Candidates whose corrected
/// shape does not match that ratio are rejected, which is what keeps table edges, binder pages and
/// shadows out of the results.
///
/// Returns nothing rather than guessing. A missing crop leaves the photo as it was; a wrong crop
/// would cut away part of a card.
/// </summary>
public sealed partial class CardDetectionService(
    IOptions<CardDetectionOptions> options,
    ILogger<CardDetectionService> logger) : ICardCropDetector
{
    private readonly CardDetectionOptions _options = options.Value;

    /// <summary>
    /// Set once the native library proves unusable, so a missing system dependency costs one failed
    /// attempt instead of one per uploaded image. Static because the fault is process-wide.
    /// </summary>
    private static bool _nativeUnavailable;

    public CardDetectionResult Detect(byte[] imageBytes)
    {
        if (_nativeUnavailable) return CardDetectionResult.NotFound;

        try
        {
            using var source = Mat.FromImageData(imageBytes, ImreadModes.Color);
            if (source.Empty()) return CardDetectionResult.NotFound;

            var quad = FindCard(source);
            if (quad is null) return CardDetectionResult.NotFound;

            using var warped = Warp(source, quad.Corners);
            return new CardDetectionResult(warped.ImEncode(".png"), quad);
        }
        catch (Exception exception) when (exception
            is TypeInitializationException or DllNotFoundException or EntryPointNotFoundException
            or BadImageFormatException)
        {
            // The native OpenCV build is missing or unloadable, typically a system library absent
            // from the container image. Cropping is an enhancement, so uploads keep working without it.
            _nativeUnavailable = true;
            LogNativeUnavailable(logger, exception);
            return CardDetectionResult.NotFound;
        }
        catch (Exception exception) when (exception is not OutOfMemoryException)
        {
            // Detection is an enhancement; no failure here may reject the photo.
            LogDetectionFailed(logger, exception);
            return CardDetectionResult.NotFound;
        }
    }

    /// <summary>Runs the search on a downscaled copy and maps the winning corners back.</summary>
    internal CardQuad? FindCard(Mat source)
    {
        var scale = _options.WorkingLongEdge / (double)Math.Max(source.Width, source.Height);
        if (scale >= 1.0) scale = 1.0;

        using var working = new Mat();
        Cv2.Resize(source, working, new Size(
            Math.Max(1, (int)Math.Round(source.Width * scale)),
            Math.Max(1, (int)Math.Round(source.Height * scale))));

        // Padding the frame so that edge-touching cards form closed contours was tried and measured:
        // it turned 12 hits into 5, because the seam it creates is itself a near-perfect rectangle
        // and a 3:4 phone frame falls inside card tolerance. Cards cut off by the frame stay misses.
        var frameArea = (double)working.Width * working.Height;
        var best = default(CardQuad);

        // Two passes: a plain edge map, and one on a contrast-boosted copy. Dark card borders on a
        // dark surface disappear in the first but survive the second.
        foreach (var edges in BuildEdgeMaps(working))
        {
            using (edges)
            {
                Cv2.FindContours(edges, out var contours, out _,
                    RetrievalModes.List, ContourApproximationModes.ApproxSimple);

                foreach (var contour in contours)
                {
                    var candidate = ScoreContour(contour, frameArea, scale);
                    if (candidate is not null && (best is null || candidate.Confidence > best.Confidence))
                        best = candidate;
                }
            }
        }

        return best is not null && best.Confidence >= _options.MinimumConfidence ? best : null;
    }

    private static IEnumerable<Mat> BuildEdgeMaps(Mat working)
    {
        using var gray = new Mat();
        Cv2.CvtColor(working, gray, ColorConversionCodes.BGR2GRAY);

        using var blurred = new Mat();
        Cv2.GaussianBlur(gray, blurred, new Size(5, 5), 0);

        var plain = new Mat();
        Cv2.Canny(blurred, plain, 40, 120);
        Cv2.Dilate(plain, plain, Cv2.GetStructuringElement(MorphShapes.Rect, new Size(3, 3)));
        yield return plain;

        // CLAHE lifts a dark border off a dark background, where a global threshold cannot.
        using var equalised = new Mat();
        using var clahe = Cv2.CreateCLAHE(3.0, new Size(8, 8));
        clahe.Apply(blurred, equalised);

        var boosted = new Mat();
        Cv2.Canny(equalised, boosted, 30, 90);
        Cv2.Dilate(boosted, boosted, Cv2.GetStructuringElement(MorphShapes.Rect, new Size(3, 3)));
        yield return boosted;
    }

    /// <summary>
    /// Turns one contour into a scored quadrilateral, or null when it cannot be a card.
    /// Coordinates are divided by <paramref name="scale"/> to return to source pixels.
    /// </summary>
    private CardQuad? ScoreContour(Point[] contour, double frameArea, double scale)
    {
        var area = Cv2.ContourArea(contour);
        var share = area / frameArea;
        if (share < _options.MinimumAreaShare || share > _options.MaximumAreaShare) return null;

        var perimeter = Cv2.ArcLength(contour, true);
        var approximated = Cv2.ApproxPolyDP(contour, 0.02 * perimeter, true);
        if (approximated.Length != 4 || !Cv2.IsContourConvex(approximated)) return null;

        var ordered = OrderCorners(approximated);
        var (width, height) = SideLengths(ordered);
        if (width <= 1 || height <= 1) return null;

        // Cards are photographed upright, but a landscape shot is still a card; compare both ways.
        var ratio = width / height;
        var aspectError = Math.Min(
            Math.Abs(ratio - _options.TargetAspectRatio) / _options.TargetAspectRatio,
            Math.Abs(1 / ratio - _options.TargetAspectRatio) / _options.TargetAspectRatio);
        if (aspectError > _options.AspectTolerance) return null;

        // A true rectangle seen through a camera keeps near-90° corners; a shadow blob does not.
        var squareness = Squareness(ordered);
        if (squareness < 0.6) return null;

        // How much of its own bounding quad the contour fills. A clean card edge scores ~1.
        var fill = Math.Min(1.0, area / (width * height));

        var aspectScore = 1 - aspectError / _options.AspectTolerance;

        // Size matters, and it was missing here: a card-shaped rectangle inside the artwork scores
        // just as well on shape as the card's own outline, and could win on the other terms alone.
        // The card is the dominant object in the frame, so among card-shaped candidates the biggest
        // one is the card. Without this the crop can be a stretched detail of the picture.
        var areaScore = Math.Clamp(share / _options.MaximumAreaShare, 0, 1);

        var confidence = (0.40 * aspectScore) + (0.25 * areaScore)
            + (0.20 * squareness) + (0.15 * fill);

        var corners = ordered.Select(p => (X: p.X / scale, Y: p.Y / scale)).ToList();
        return new CardQuad(corners, Math.Clamp(confidence, 0, 1));
    }

    /// <summary>Top-left, top-right, bottom-right, bottom-left.</summary>
    internal static Point2f[] OrderCorners(IEnumerable<Point> points)
    {
        var all = points.Select(p => new Point2f(p.X, p.Y)).ToArray();
        var centreX = all.Average(p => p.X);
        var centreY = all.Average(p => p.Y);

        // Sorting by angle around the centroid yields the ring order regardless of contour direction.
        var ring = all
            .OrderBy(p => Math.Atan2(p.Y - centreY, p.X - centreX))
            .ToArray();

        // Rotate the ring so it starts at the corner closest to the origin, i.e. the top-left one.
        var start = 0;
        var bestDistance = double.MaxValue;
        for (var i = 0; i < ring.Length; i++)
        {
            var distance = (ring[i].X * ring[i].X) + (ring[i].Y * ring[i].Y);
            if (distance < bestDistance) { bestDistance = distance; start = i; }
        }

        return [ring[start], ring[(start + 1) % 4], ring[(start + 2) % 4], ring[(start + 3) % 4]];
    }

    private static (double Width, double Height) SideLengths(Point2f[] ordered)
    {
        var top = Distance(ordered[0], ordered[1]);
        var bottom = Distance(ordered[3], ordered[2]);
        var left = Distance(ordered[0], ordered[3]);
        var right = Distance(ordered[1], ordered[2]);
        return ((top + bottom) / 2, (left + right) / 2);
    }

    /// <summary>1 when all four interior angles are 90°, falling off as the shape shears.</summary>
    private static double Squareness(Point2f[] ordered)
    {
        var worst = 0.0;
        for (var i = 0; i < 4; i++)
        {
            var previous = ordered[(i + 3) % 4];
            var current = ordered[i];
            var next = ordered[(i + 1) % 4];

            var ax = previous.X - current.X;
            var ay = previous.Y - current.Y;
            var bx = next.X - current.X;
            var by = next.Y - current.Y;

            var lengths = Math.Sqrt((ax * ax) + (ay * ay)) * Math.Sqrt((bx * bx) + (by * by));
            if (lengths <= 0) return 0;

            var cosine = Math.Abs(((ax * bx) + (ay * by)) / lengths);
            worst = Math.Max(worst, cosine);
        }

        return Math.Max(0, 1 - worst);
    }

    private static double Distance(Point2f a, Point2f b) =>
        Math.Sqrt(((a.X - b.X) * (a.X - b.X)) + ((a.Y - b.Y) * (a.Y - b.Y)));

    private Mat Warp(Mat source, IReadOnlyList<(double X, double Y)> corners)
    {
        var ordered = corners.Select(c => new Point2f((float)c.X, (float)c.Y)).ToArray();
        var (width, height) = SideLengths(ordered);
        var portrait = height >= width;

        var longEdge = _options.OutputLongEdge;
        var shortEdge = (int)Math.Round(longEdge * _options.TargetAspectRatio);
        var targetWidth = portrait ? shortEdge : longEdge;
        var targetHeight = portrait ? longEdge : shortEdge;

        Point2f[] destination =
        [
            new(0, 0),
            new(targetWidth - 1, 0),
            new(targetWidth - 1, targetHeight - 1),
            new(0, targetHeight - 1),
        ];

        using var transform = Cv2.GetPerspectiveTransform(ordered, destination);
        var warped = new Mat();
        Cv2.WarpPerspective(source, warped, transform, new Size(targetWidth, targetHeight),
            InterpolationFlags.Cubic);
        return warped;
    }

    [LoggerMessage(Microsoft.Extensions.Logging.LogLevel.Warning,
        "Card detection failed; the photo is kept unchanged")]
    private static partial void LogDetectionFailed(ILogger logger, Exception exception);

    [LoggerMessage(Microsoft.Extensions.Logging.LogLevel.Error,
        "The native OpenCV library could not be loaded, so no card crops will be offered for the "
        + "lifetime of this process. Uploads continue to work. Check that the container provides "
        + "OpenCV's system dependencies (libfreetype6, libgomp1).")]
    private static partial void LogNativeUnavailable(ILogger logger, Exception exception);
}
