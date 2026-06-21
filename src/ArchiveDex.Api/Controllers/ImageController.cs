using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Image;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/images")]
public class ImageController(IImageStore imageStore) : ControllerBase
{
    [HttpGet("{**fileName}")]
    public async Task<IActionResult> Get(string fileName, CancellationToken ct)
    {
        try
        {
            Stream stream = await GetImageHandler.Handle(new GetImage(fileName), imageStore, ct);
            return File(stream, GetContentType(fileName));
        }
        catch (ArgumentException)
        {
            return BadRequest();
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
