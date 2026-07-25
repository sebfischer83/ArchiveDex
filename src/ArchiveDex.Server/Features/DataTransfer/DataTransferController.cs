using System.Buffers;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Server.Features.DataTransfer;

[ApiController]
[Route("api/v1/data-transfer")]
public sealed partial class DataTransferController(
    DataTransferService transfer,
    IConfiguration configuration,
    ILogger<DataTransferController> logger) : ControllerBase
{
    private const long DefaultMaximumArchiveBytes = 40L * 1024 * 1024 * 1024;

    [HttpGet("export")]
    public async Task Export(CancellationToken ct)
    {
        var fileName = $"ArchiveDex-{DateTime.UtcNow:yyyyMMdd-HHmmss}.zip";
        Response.StatusCode = StatusCodes.Status200OK;
        Response.ContentType = "application/zip";
        Response.Headers.ContentDisposition = $"attachment; filename=\"{fileName}\"";
        Response.Headers.CacheControl = "private, no-store";
        await transfer.ExportAsync(GetOwnerId(), Response.Body, ct);
    }

    [HttpPost("import")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Import(CancellationToken ct)
    {
        if (Request.ContentType is not ("application/zip" or "application/octet-stream"))
            return ProblemResult(400, "INVALID_IMPORT_CONTENT_TYPE", "Bitte eine ArchiveDex-ZIP-Datei auswählen.");

        var maximumBytes = configuration.GetValue<long?>("DataTransfer:MaxArchiveBytes")
            ?? DefaultMaximumArchiveBytes;
        if (Request.ContentLength is > 0 && Request.ContentLength > maximumBytes)
            return ProblemResult(413, "IMPORT_TOO_LARGE", "Die Importdatei überschreitet das konfigurierte Größenlimit.");

        var tempPath = Path.Combine(Path.GetTempPath(), $"archivedex-import-{Guid.CreateVersion7():N}.zip");
        try
        {
            var copied = await CopyRequestToFileAsync(tempPath, maximumBytes, ct);
            if (copied < 0)
                return ProblemResult(413, "IMPORT_TOO_LARGE", "Die Importdatei überschreitet das konfigurierte Größenlimit.");
            if (copied == 0)
                return ProblemResult(400, "INVALID_IMPORT_ARCHIVE", "Die Importdatei ist leer.");

            var result = await transfer.ImportAsync(GetOwnerId(), tempPath, maximumBytes, ct);
            return Ok(result);
        }
        catch (InvalidDataException exception)
        {
            LogInvalidArchive(logger, exception);
            return ProblemResult(400, "INVALID_IMPORT_ARCHIVE", exception.Message);
        }
        finally
        {
            try { System.IO.File.Delete(tempPath); }
            catch (IOException exception) { LogTempCleanupFailed(logger, exception, tempPath); }
        }
    }

    private async Task<long> CopyRequestToFileAsync(
        string path,
        long maximumBytes,
        CancellationToken ct)
    {
        await using var output = new FileStream(
            path, FileMode.CreateNew, FileAccess.Write, FileShare.None,
            128 * 1024, FileOptions.Asynchronous | FileOptions.SequentialScan);
        var buffer = ArrayPool<byte>.Shared.Rent(128 * 1024);
        long total = 0;
        try
        {
            while (true)
            {
                var read = await Request.Body.ReadAsync(buffer, ct);
                if (read == 0) break;
                total += read;
                if (total > maximumBytes) return -1;
                await output.WriteAsync(buffer.AsMemory(0, read), ct);
            }
            return total;
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }

    private ObjectResult ProblemResult(int status, string code, string detail)
    {
        var problem = new ProblemDetails { Title = code, Status = status, Detail = detail };
        problem.Extensions["code"] = code;
        return StatusCode(status, problem);
    }

    private Guid GetOwnerId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    [LoggerMessage(LogLevel.Warning, "Rejected invalid collection import archive")]
    private static partial void LogInvalidArchive(ILogger logger, Exception exception);

    [LoggerMessage(LogLevel.Warning, "Could not delete temporary import file {Path}")]
    private static partial void LogTempCleanupFailed(ILogger logger, Exception exception, string path);
}
