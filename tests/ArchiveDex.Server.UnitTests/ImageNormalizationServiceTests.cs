using ArchiveDex.Server.Infrastructure.Images;
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
    }
}
