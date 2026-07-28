using ArchiveDex.Server.Infrastructure.Images;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;
using SixLabors.ImageSharp.PixelFormats;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class ImageNormalizationServiceTests
    {
        [Fact]
        public async Task RejectsDisallowedContentType()
        {
            var service = new ImageNormalizationService();
            await using var stream = new MemoryStream([1, 2, 3]);

            var error = await Assert.ThrowsAsync<ImageValidationException>(
                () => service.NormalizeAsync(stream, "image/gif", TestContext.Current.CancellationToken));

            Assert.Equal("UNSUPPORTED_FORMAT", error.Code);
        }

        [Fact]
        public async Task RejectsContentThatDoesNotMatchDeclaredType()
        {
            var service = new ImageNormalizationService();
            await using var stream = new MemoryStream("not a jpeg"u8.ToArray());

            var error = await Assert.ThrowsAsync<ImageValidationException>(
                () => service.NormalizeAsync(stream, "image/jpeg", TestContext.Current.CancellationToken));

            Assert.Equal("UNSUPPORTED_FORMAT", error.Code);
        }

        [Fact]
        public async Task ProducesOrientedWebpWithoutExifMetadata()
        {
            using var sourceImage = new Image<Rgba32>(40, 20);
            sourceImage.Metadata.ExifProfile = new ExifProfile();
            sourceImage.Metadata.ExifProfile.SetValue(ExifTag.Orientation, (ushort)6);
            sourceImage.Metadata.ExifProfile.SetValue(ExifTag.GPSLatitudeRef, "N");

            await using var upload = new MemoryStream();
            await sourceImage.SaveAsJpegAsync(upload, TestContext.Current.CancellationToken);
            upload.Position = 0;

            var service = new ImageNormalizationService();
            var result = await service.NormalizeAsync(
                upload, "image/jpeg", TestContext.Current.CancellationToken);

            Assert.Equal("image/webp", result.ContentType);
            Assert.Equal(20, result.Width);
            Assert.Equal(40, result.Height);
            AssertWebpSignature(result.Content);
            AssertWebpSignature(result.Thumbnail);

            using var normalized = Image.Load(result.Content);
            Assert.Null(normalized.Metadata.ExifProfile);
        }

        [Fact]
        public async Task SmallImageIsNotBlownUpIntoTheThumbnailBox()
        {
            using var sourceImage = new Image<Rgba32>(120, 80);

            await using var upload = new MemoryStream();
            await sourceImage.SaveAsPngAsync(upload, TestContext.Current.CancellationToken);
            upload.Position = 0;

            var service = new ImageNormalizationService();
            var result = await service.NormalizeAsync(
                upload, "image/png", TestContext.Current.CancellationToken);

            using var thumbnail = Image.Load(result.Thumbnail);
            Assert.Equal(120, thumbnail.Width);
            Assert.Equal(80, thumbnail.Height);
        }

        [Fact]
        public async Task LargeImageIsScaledIntoTheThumbnailBoxKeepingItsAspectRatio()
        {
            using var sourceImage = new Image<Rgba32>(1600, 800);

            await using var upload = new MemoryStream();
            await sourceImage.SaveAsPngAsync(upload, TestContext.Current.CancellationToken);
            upload.Position = 0;

            var service = new ImageNormalizationService();
            var result = await service.NormalizeAsync(
                upload, "image/png", TestContext.Current.CancellationToken);

            using var thumbnail = Image.Load(result.Thumbnail);
            Assert.Equal(400, thumbnail.Width);
            Assert.Equal(200, thumbnail.Height);
        }

        [Fact]
        public async Task FullSizeImageKeepsMoreDetailThanTheThumbnailEncoding()
        {
            // The vision model reads the full-size image to judge foil treatments, so it must not be
            // encoded as coarsely as a list thumbnail. Same pixels, so only quality can differ.
            using var sourceImage = new Image<Rgba32>(600, 400);
            for (var y = 0; y < 400; y++)
                for (var x = 0; x < 600; x++)
                    sourceImage[x, y] = new Rgba32((byte)(x * 7 % 256), (byte)(y * 13 % 256), (byte)((x + y) * 3 % 256));

            await using var upload = new MemoryStream();
            await sourceImage.SaveAsPngAsync(upload, TestContext.Current.CancellationToken);
            upload.Position = 0;

            var service = new ImageNormalizationService();
            var result = await service.NormalizeAsync(
                upload, "image/png", TestContext.Current.CancellationToken);

            // Re-encoding the very same pixels at thumbnail quality has to come out smaller. Comparing
            // the full image against its own thumbnail would not work: downscaling concentrates
            // detail, so bytes per pixel rise no matter what quality was used.
            using var full = Image.Load(result.Content);
            Assert.Equal(600, full.Width);

            await using var atThumbnailQuality = new MemoryStream();
            await full.SaveAsWebpAsync(
                atThumbnailQuality,
                new WebpEncoder { FileFormat = WebpFileFormatType.Lossy, Quality = 80, SkipMetadata = true },
                TestContext.Current.CancellationToken);

            Assert.True(atThumbnailQuality.Length < result.Content.Length,
                $"full-size {result.Content.Length} B should exceed a quality-80 encode of the same "
                + $"pixels ({atThumbnailQuality.Length} B)");
        }

        /// <summary>Stands in for a detector whose native library is missing, as happened in the container.</summary>
        private sealed class ThrowingDetector(Exception failure) : ICardCropDetector
        {
            public CardDetectionResult Detect(byte[] imageBytes) => throw failure;
        }

        private sealed class SilentDetector : ICardCropDetector
        {
            public CardDetectionResult Detect(byte[] imageBytes) => CardDetectionResult.NotFound;
        }

        [Theory]
        // The exact failure that rejected all 17 uploads, plus the raw form underneath it.
        [InlineData(typeof(TypeInitializationException))]
        [InlineData(typeof(DllNotFoundException))]
        [InlineData(typeof(InvalidOperationException))]
        public async Task ADetectorThatBlowsUpMustNotRejectTheUpload(Type failureType)
        {
            var failure = failureType == typeof(TypeInitializationException)
                ? new TypeInitializationException("OpenCvSharp.Internal.NativeMethods", new DllNotFoundException())
                : (Exception)Activator.CreateInstance(failureType)!;

            using var sourceImage = new Image<Rgba32>(600, 400);
            await using var upload = new MemoryStream();
            await sourceImage.SaveAsPngAsync(upload, TestContext.Current.CancellationToken);
            upload.Position = 0;

            var service = new ImageNormalizationService(new ThrowingDetector(failure));
            var result = await service.NormalizeAsync(
                upload, "image/png", TestContext.Current.CancellationToken);

            // The photo still normalizes; only the optional crop is missing.
            Assert.Null(result.Crop);
            AssertWebpSignature(result.Content);
            AssertWebpSignature(result.Thumbnail);
        }

        [Fact]
        public async Task NoCropIsOfferedWhenNoCardIsDetected()
        {
            using var sourceImage = new Image<Rgba32>(600, 400);
            await using var upload = new MemoryStream();
            await sourceImage.SaveAsPngAsync(upload, TestContext.Current.CancellationToken);
            upload.Position = 0;

            var service = new ImageNormalizationService(new SilentDetector());
            var result = await service.NormalizeAsync(
                upload, "image/png", TestContext.Current.CancellationToken);

            Assert.Null(result.Crop);
        }

        private static void AssertWebpSignature(byte[] content)
        {
            Assert.True(content.Length >= 12);
            Assert.Equal("RIFF"u8.ToArray(), content[..4]);
            Assert.Equal("WEBP"u8.ToArray(), content[8..12]);
        }
    }
}
