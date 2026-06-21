using ArchiveDex.Application.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/images")]
public class ImageController(IImageStore imageStore) : ControllerBase
{
    [HttpGet("{**fileName}")]
    public async Task<IActionResult> Get(string fileName, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(fileName) ||
            fileName.Contains("..") ||
            Path.IsPathRooted(fileName))
        {
            return BadRequest();
        }

        try
        {
            Stream stream = await imageStore.GetAsync(fileName, ct);
            return File(stream, GetContentType(fileName));
        }
        catch (FileNotFoundException)
        {
            return NotFound();
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
