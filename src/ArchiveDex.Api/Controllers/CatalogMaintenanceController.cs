using ArchiveDex.Application.Abstractions;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/catalog-maintenance")]
[Authorize(Policy = "Administrator")]
public sealed class CatalogMaintenanceController(
    IDuplicateCleanupService cleanup,
    ICatalogImportRepository imports,
    ICatalogTransferRepository transfers,
    IBackgroundJobClient jobs) : ControllerBase
{
    [HttpPost("duplicate-cleanup")]
    public async Task<IActionResult> DuplicateCleanup([FromBody] DuplicateCleanupRequest request, CancellationToken ct)
    {
        if (await imports.HasActiveImportAsync(ct) || await transfers.HasActiveOperationAsync(ct))
            return Conflict(new { error = "A catalog operation is active.", code = "IMPORT_ACTIVE" });
        try
        {
            if (request.Preview) return Ok(await cleanup.PreviewAsync(ct));
            var jobId = jobs.Enqueue<IDuplicateCleanupService>(service => service.ExecuteAsync(CancellationToken.None));
            return Accepted(new { jobId });
        }
        catch (CollectionSafetyException ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { error = ex.Message, code = "COLLECTION_SAFETY" });
        }
    }
}

public sealed record DuplicateCleanupRequest(bool Preview);
