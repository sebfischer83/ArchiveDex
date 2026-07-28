using System.Security.Cryptography;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace ArchiveDex.Server.Infrastructure.Images
{
    /// <param name="detection">
    /// Optional. When present, a deskewed cut-out of the card is produced alongside the normalized
    /// image and offered as an alternative during review. It never replaces the normalized image
    /// here: analysis always runs on the full photo, so a crop can never degrade recognition.
    /// </param>
    /// <summary>Lets a test stand in for the detector without pulling in the native library.</summary>
    public interface ICardCropDetector
    {
        CardDetectionResult Detect(byte[] imageBytes);
    }

    public class ImageNormalizationService(ICardCropDetector? detection = null)
    {
        private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png", "image/webp"];
        private const long MaxEncodedBytes = 15 * 1024 * 1024;
        private const int MaxPixels = 30_000_000;
        private const int MaxDimension = 8192;
        private const int ThumbnailMaxDim = 400;
        private const int NormalizedMaxDim = 2400;

        /// <summary>
        /// The full-size image is not just for display: the valuation pipeline shows it to a vision
        /// model that has to tell rarity treatments apart (textured, full-art, gold, secret rare).
        /// Those are fine holographic patterns, and they are the first thing lossy compression
        /// destroys, so this stays well above the quality a thumbnail needs.
        /// </summary>
        private const int NormalizedWebpQuality = 88;
        private const int ThumbnailWebpQuality = 80;

        public async Task<ImageResult> NormalizeAsync(Stream sourceStream, string contentType, CancellationToken ct = default)
        {
            contentType = contentType.Split(';', 2)[0].Trim().ToLowerInvariant();
            if (!AllowedContentTypes.Contains(contentType))
                throw new ImageValidationException("UNSUPPORTED_FORMAT", "Image format not supported.");

            var buffer = new byte[MaxEncodedBytes + 1];
            var mem = new MemoryStream();
            var totalRead = 0;
            int read;
            while ((read = await sourceStream.ReadAsync(buffer.AsMemory(totalRead, Math.Min(buffer.Length - totalRead, 8192)), ct)) > 0)
            {
                totalRead += read;
                if (totalRead > MaxEncodedBytes)
                    throw new ImageValidationException("IMAGE_TOO_LARGE", "Image exceeds 15 MiB limit.");
                mem.Write(buffer, totalRead - read, read);
            }

            mem.Position = 0;
            if (!SignatureMatches(mem.GetBuffer().AsSpan(0, totalRead), contentType))
                throw new ImageValidationException("UNSUPPORTED_FORMAT", "Image content does not match its declared format.");

            using var image = await Image.LoadAsync(mem, ct);

            if (image.Width * (long)image.Height > MaxPixels || image.Width > MaxDimension || image.Height > MaxDimension)
                throw new ImageValidationException("IMAGE_TOO_LARGE", "Image pixel dimensions exceed limits.");

            image.Mutate(x => x.AutoOrient());
            image.Metadata.ExifProfile = null;

            int normalizedW, normalizedH;
            if (image.Width > image.Height && image.Width > NormalizedMaxDim)
            { normalizedW = NormalizedMaxDim; normalizedH = (int)(image.Height * (NormalizedMaxDim / (double)image.Width)); }
            else if (image.Height > NormalizedMaxDim)
            { normalizedH = NormalizedMaxDim; normalizedW = (int)(image.Width * (NormalizedMaxDim / (double)image.Height)); }
            else { normalizedW = image.Width; normalizedH = image.Height; }

            image.Mutate(x => x.Resize(normalizedW, normalizedH));

            var normalizedStream = new MemoryStream();
            await image.SaveAsWebpAsync(normalizedStream, CreateWebpEncoder(NormalizedWebpQuality), ct);
            normalizedStream.Position = 0;

            // Scale down only. An image already smaller than the thumbnail box is left as it is;
            // blowing it up would cost bytes and add nothing.
            var thumbScale = Math.Min(1.0, ThumbnailMaxDim / (double)Math.Max(normalizedW, normalizedH));
            if (thumbScale < 1.0)
            {
                var thumbW = Math.Max(1, (int)Math.Round(normalizedW * thumbScale));
                var thumbH = Math.Max(1, (int)Math.Round(normalizedH * thumbScale));
                image.Mutate(x => x.Resize(thumbW, thumbH));
            }

            var thumbStream = new MemoryStream();
            await image.SaveAsWebpAsync(thumbStream, CreateWebpEncoder(ThumbnailWebpQuality), ct);
            thumbStream.Position = 0;

            mem.Position = 0;
            byte[] uploadHash = SHA256.HashData(mem);
            normalizedStream.Position = 0;
            byte[] normalizedHash = SHA256.HashData(normalizedStream);

            var normalizedBytes = normalizedStream.ToArray();
            var crop = await BuildCropAsync(normalizedBytes, ct);

            return new ImageResult(
                normalizedBytes,
                thumbStream.ToArray(),
                "image/webp",
                (long)normalizedStream.Length,
                normalizedW, normalizedH,
                uploadHash,
                normalizedHash,
                crop);
        }

        /// <summary>
        /// Detects the card in the normalized image and re-encodes the deskewed cut-out. Runs on the
        /// normalized bytes rather than the upload so the crop inherits the orientation fix and the
        /// stripped metadata. Any failure simply means no crop is offered.
        /// </summary>
        private async Task<ImageCrop?> BuildCropAsync(byte[] normalized, CancellationToken ct)
        {
            if (detection is null) return null;

            CardDetectionResult detected;
            try
            {
                detected = detection.Detect(normalized);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                // Second guard behind the detector's own. An upload must never fail because the
                // optional crop could not be produced, whatever the reason.
                return null;
            }

            if (!detected.Found) return null;

            using var cropped = Image.Load(detected.Cropped!);
            cropped.Metadata.ExifProfile = null;

            var contentStream = new MemoryStream();
            await cropped.SaveAsWebpAsync(contentStream, CreateWebpEncoder(NormalizedWebpQuality), ct);

            var scale = Math.Min(1.0, ThumbnailMaxDim / (double)Math.Max(cropped.Width, cropped.Height));
            if (scale < 1.0)
            {
                cropped.Mutate(x => x.Resize(
                    Math.Max(1, (int)Math.Round(cropped.Width * scale)),
                    Math.Max(1, (int)Math.Round(cropped.Height * scale))));
            }

            var thumbnailStream = new MemoryStream();
            await cropped.SaveAsWebpAsync(thumbnailStream, CreateWebpEncoder(ThumbnailWebpQuality), ct);

            var content = contentStream.ToArray();
            return new ImageCrop(
                content,
                thumbnailStream.ToArray(),
                SHA256.HashData(content),
                (float)detected.Quad!.Confidence);
        }

        private static WebpEncoder CreateWebpEncoder(int quality) => new()
        {
            FileFormat = WebpFileFormatType.Lossy,
            Quality = quality,
            SkipMetadata = true,
        };

        private static bool SignatureMatches(ReadOnlySpan<byte> bytes, string contentType) => contentType switch
        {
            "image/jpeg" => bytes.Length >= 3 && bytes[0] == 0xff && bytes[1] == 0xd8 && bytes[2] == 0xff,
            "image/png" => bytes.Length >= 8 && bytes[..8].SequenceEqual(new byte[] { 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a }),
            "image/webp" => bytes.Length >= 12
                && bytes[..4].SequenceEqual("RIFF"u8)
                && bytes.Slice(8, 4).SequenceEqual("WEBP"u8),
            _ => false,
        };
    }

    public record ImageResult(
        byte[] Content, byte[] Thumbnail,
        string ContentType, long ByteLength, int Width, int Height,
        byte[] UploadSha256, byte[] NormalizedSha256,
        /// <summary>Alternative cut-out offered during review; null when no card was found.</summary>
        ImageCrop? Crop = null);

    public record ImageCrop(byte[] Content, byte[] Thumbnail, byte[] Sha256, float Confidence);

    public class ImageValidationException : Exception
    {
        public string Code { get; }
        public ImageValidationException(string code, string message) : base(message) { Code = code; }
    }
}
