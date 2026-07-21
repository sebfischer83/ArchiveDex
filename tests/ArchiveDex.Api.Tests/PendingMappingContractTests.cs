using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using ArchiveDex.Api.Tests.CatalogTransfer;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests;

public class PendingMappingContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    [Fact]
    public async Task PendingCardEndpoints_RequireAdministrator()
    {
        using var anonymous = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/cards/pending")).StatusCode);

        using var user = CatalogTransferTestAuthentication.CreateClient(factory);
        Assert.Equal(HttpStatusCode.Forbidden, (await user.GetAsync("/api/cards/pending")).StatusCode);
    }

    [Fact]
    public async Task PendingCardList_AndUnknownResolution_FollowContract()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        await EnsureSetupCompleteAsync(client);

        var list = await client.GetAsync("/api/cards/pending?status=Pending");
        Assert.Equal(HttpStatusCode.OK, list.StatusCode);

        var unknown = await client.PostAsJsonAsync($"/api/cards/pending/{Guid.NewGuid()}/assign",
            new { cardPrintId = Guid.NewGuid() });
        Assert.Equal(HttpStatusCode.NotFound, unknown.StatusCode);
        Assert.Contains("NOT_FOUND", await unknown.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task ResolvedAndActiveImport_ReturnConflictCodes()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        await EnsureSetupCompleteAsync(client);
        var resolvedId = await SeedPendingCardAsync(MappingStatus.Rejected);
        var resolved = await client.PostAsync($"/api/cards/pending/{resolvedId}/reject", null);
        Assert.Equal(HttpStatusCode.Conflict, resolved.StatusCode);
        Assert.Contains("ALREADY_RESOLVED", await resolved.Content.ReadAsStringAsync());

        var pendingId = await SeedPendingCardAsync(MappingStatus.Pending);
        Guid runId;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            var run = new CatalogImportRun
            {
                Status = CatalogImportStatus.Running,
                Mode = CatalogImportMode.Update,
                SelectedSourcesJson = "[]",
                SelectedLanguagesJson = "{}"
            };
            db.CatalogImportRuns.Add(run);
            await db.SaveChangesAsync();
            runId = run.Id;
        }
        try
        {
            var active = await client.PostAsync($"/api/cards/pending/{pendingId}/reject", null);
            Assert.Equal(HttpStatusCode.Conflict, active.StatusCode);
            Assert.Contains("IMPORT_ACTIVE", await active.Content.ReadAsStringAsync());
        }
        finally
        {
            using var scope = factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            (await db.CatalogImportRuns.FindAsync(runId))!.Status = CatalogImportStatus.Completed;
            await db.SaveChangesAsync();
        }
    }

    [Fact]
    public async Task PendingSetAndRunDtos_ExposeCandidatesAndReportFields()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        await EnsureSetupCompleteAsync(client);
        Guid runId;
        Guid pendingSetId;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            var set = new CardSet { CanonicalName = "Candidate", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            db.CardSets.Add(set);
            var pendingSet = new PendingSetMapping
            {
                IncomingSource = "Fixture", IncomingLanguage = "en", IncomingExternalId = Guid.NewGuid().ToString("N"),
                IncomingName = "Incoming", SuggestedCardSet = set, Score = 88,
                ReasonsJson = "[\"Name match\"]",
                CandidatesJson = JsonSerializer.Serialize(new[] { new { cardSetId = set.Id, name = set.CanonicalName, score = 88, reasons = new[] { "Name match" } } }),
                AiDecision = "Candidate", AiRecommendedCardSetId = set.Id, AiConfidence = .91m,
                AiReasonsJson = "[\"AI name match\"]", AiModel = "deepseek-v4-flash", AiAdvisedAt = DateTime.UtcNow,
                Status = MappingStatus.Pending, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            };
            db.PendingSetMappings.Add(pendingSet);
            pendingSetId = pendingSet.Id;
            var run = new CatalogImportRun
            {
                Status = CatalogImportStatus.Completed, Mode = CatalogImportMode.Update,
                SelectedSourcesJson = "[]", SelectedLanguagesJson = "{}", ConflictCount = 3, PendingCount = 2,
                PerSourceStatsJson = "[{\"source\":\"Fixture\",\"language\":\"en\",\"setsSeen\":1,\"cardsSeen\":2}]"
            };
            db.CatalogImportRuns.Add(run);
            await db.SaveChangesAsync();
            runId = run.Id;
        }

        var sets = await client.GetStringAsync("/api/sets/pending");
        Assert.Contains("candidates", sets, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("aiAdvice", sets, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("deepseek-v4-flash", sets, StringComparison.OrdinalIgnoreCase);
        var disabledAdvice = await client.PostAsync($"/api/sets/pending/{pendingSetId}/ai-advice", null);
        Assert.Equal(HttpStatusCode.NoContent, disabledAdvice.StatusCode);
        var status = await client.GetStringAsync($"/api/catalog-imports/{runId}");
        Assert.Contains("conflictCount", status);
        Assert.Contains("pendingCount", status);
        Assert.Contains("phase", status);
        var report = await client.GetStringAsync($"/api/catalog-imports/{runId}/report");
        Assert.Contains("perSource", report);
    }

    private async Task<Guid> SeedPendingCardAsync(MappingStatus status)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
        var run = new CatalogImportRun { Status = CatalogImportStatus.Completed, Mode = CatalogImportMode.Update,
            SelectedSourcesJson = "[]", SelectedLanguagesJson = "{}" };
        var set = new CardSet { CanonicalName = "Pending", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
        var pending = new PendingCardMapping
        {
            ImportRun = run, CardSet = set, Source = "Fixture", Language = "en", ExternalSetId = "set",
            ExternalCardId = $"set-{Guid.NewGuid():N}", IncomingName = "Card", IncomingNumber = "001",
            CandidatesJson = "[]", Status = status, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        db.PendingCardMappings.Add(pending);
        await db.SaveChangesAsync();
        return pending.Id;
    }

    private static async Task EnsureSetupCompleteAsync(HttpClient client)
    {
        var state = await client.GetFromJsonAsync<SetupState>("/api/setup/state");
        if (state?.IsSetupComplete == true) return;
        await client.AddAntiforgeryTokenAsync();
        var response = await client.PostAsJsonAsync("/api/setup/complete", new
        {
            adminUserName = $"admin-{Guid.NewGuid():N}", adminPassword = "Password1!", defaultUiCulture = "en",
            collectionCurrency = "EUR", imageStoragePath = Path.Combine(Path.GetTempPath(), "archivedex-test-images")
        });
        response.EnsureSuccessStatusCode();
    }

    private sealed record SetupState(bool IsSetupComplete);
}
