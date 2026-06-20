using ArchiveDex.Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers
{
    public static class ImageGetHandler
    {
        [WolverineGet("/api/images/{*fileName}")]
        public static async Task<IResult> Handle(
            string fileName,
            IImageStore imageStore,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(fileName) ||
                fileName.Contains("..") ||
                Path.IsPathRooted(fileName))
            {
                return Results.BadRequest();
            }

            try
            {
                Stream stream = await imageStore.GetAsync(fileName, ct);
                return Results.File(stream, GetContentType(fileName));
            }
            catch (FileNotFoundException)
            {
                return Results.NotFound();
            }
        }

        private static string GetContentType(string fileName) => Path.GetExtension(fileName).ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }
}
