using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Api.Tests.CatalogTransfer;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests;

public class CatalogMaintenanceContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    [Fact]
    public async Task DuplicateCleanup_PreviewReturnsPlan_AndExecuteIsAccepted()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        var preview = await client.PostAsJsonAsync("/api/catalog-maintenance/duplicate-cleanup", new { preview = true });
        Assert.Equal(HttpStatusCode.OK, preview.StatusCode);
        Assert.Contains("groups", await preview.Content.ReadAsStringAsync(), StringComparison.OrdinalIgnoreCase);

        var execute = await client.PostAsJsonAsync("/api/catalog-maintenance/duplicate-cleanup", new { preview = false });
        Assert.Equal(HttpStatusCode.Accepted, execute.StatusCode);
    }

    [Fact]
    public async Task DuplicateCleanup_RequiresAdministrator_AndRejectsActiveImport()
    {
        using var user = CatalogTransferTestAuthentication.CreateClient(factory);
        Assert.Equal(HttpStatusCode.Forbidden,
            (await user.PostAsJsonAsync("/api/catalog-maintenance/duplicate-cleanup", new { preview = true })).StatusCode);

        Guid runId;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            var run = new CatalogImportRun { Status = CatalogImportStatus.Running, Mode = CatalogImportMode.Update,
                SelectedSourcesJson = "[]", SelectedLanguagesJson = "{}" };
            db.CatalogImportRuns.Add(run);
            await db.SaveChangesAsync();
            runId = run.Id;
        }
        try
        {
            using var admin = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
            var response = await admin.PostAsJsonAsync("/api/catalog-maintenance/duplicate-cleanup", new { preview = true });
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            Assert.Contains("IMPORT_ACTIVE", await response.Content.ReadAsStringAsync());
        }
        finally
        {
            using var scope = factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            (await db.CatalogImportRuns.FindAsync(runId))!.Status = CatalogImportStatus.Completed;
            await db.SaveChangesAsync();
        }
    }
}
