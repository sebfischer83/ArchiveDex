using System.Security.Cryptography;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace ArchiveDex.Server.Infrastructure.Images
{
    public class ImageNormalizationService
    {
        private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png", "image/webp"];
        private const long MaxEncodedBytes = 15 * 1024 * 1024;
        private const int MaxPixels = 30_000_000;
        private const int MaxDimension = 8192;
        private const int ThumbnailMaxDim = 400;
        private const int NormalizedMaxDim = 2400;

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

            image.Metadata.ExifProfile = null;

            int normalizedW, normalizedH;
            if (image.Width > image.Height && image.Width > NormalizedMaxDim)
            { normalizedW = NormalizedMaxDim; normalizedH = (int)(image.Height * (NormalizedMaxDim / (double)image.Width)); }
            else if (image.Height > NormalizedMaxDim)
            { normalizedH = NormalizedMaxDim; normalizedW = (int)(image.Width * (NormalizedMaxDim / (double)image.Height)); }
            else { normalizedW = image.Width; normalizedH = image.Height; }

            image.Mutate(x => x.Resize(normalizedW, normalizedH));

            var normalizedStream = new MemoryStream();
            await image.SaveAsJpegAsync(normalizedStream, ct);
            normalizedStream.Position = 0;

            var thumbW = ThumbnailMaxDim;
            var thumbH = (int)(normalizedH * (ThumbnailMaxDim / (double)normalizedW));
            if (thumbH > ThumbnailMaxDim) { thumbH = ThumbnailMaxDim; thumbW = (int)(normalizedW * (ThumbnailMaxDim / (double)normalizedH)); }

            image.Mutate(x => x.Resize(thumbW, thumbH));
            var thumbStream = new MemoryStream();
            await image.SaveAsJpegAsync(thumbStream, ct);
            thumbStream.Position = 0;

            mem.Position = 0;
            byte[] uploadHash = SHA256.HashData(mem);
            normalizedStream.Position = 0;
            byte[] normalizedHash = SHA256.HashData(normalizedStream);

            return new ImageResult(
                normalizedStream.ToArray(),
                thumbStream.ToArray(),
                "image/jpeg",
                (long)normalizedStream.Length,
                normalizedW, normalizedH,
                uploadHash,
                normalizedHash);
        }

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
        byte[] UploadSha256, byte[] NormalizedSha256);

    public class ImageValidationException : Exception
    {
        public string Code { get; }
        public ImageValidationException(string code, string message) : base(message) { Code = code; }
    }
}
