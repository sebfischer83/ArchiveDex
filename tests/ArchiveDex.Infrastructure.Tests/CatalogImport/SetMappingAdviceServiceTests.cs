using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using System.Text.Json;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public sealed class SetMappingAdviceServiceTests
{
    [Fact]
    public async Task Advice_IsPersistedWithoutReplacingHeuristicSuggestion()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;
        await using var db = new ArchiveDexDbContext(options);
        await db.Database.OpenConnectionAsync();
        await db.Database.EnsureCreatedAsync();

        var heuristicId = Guid.NewGuid();
        var aiId = Guid.NewGuid();
        db.CardSets.AddRange(
            new CardSet { Id = heuristicId, CanonicalName = "Heuristic", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new CardSet { Id = aiId, CanonicalName = "AI", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        var pending = new PendingSetMapping
        {
            IncomingSource = "Limitless", IncomingLanguage = "en", IncomingExternalId = "SVI", IncomingName = "Scarlet Violet",
            SuggestedCardSetId = heuristicId, Score = 60,
            CandidatesJson = JsonSerializer.Serialize(new[]
            {
                new { cardSetId = heuristicId, name = "Heuristic", score = 60, reasons = Array.Empty<string>() },
                new { cardSetId = aiId, name = "AI", score = 55, reasons = Array.Empty<string>() }
            }),
            Status = MappingStatus.Pending, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        db.PendingSetMappings.Add(pending);
        await db.SaveChangesAsync();

        var service = new SetMappingAdviceService(
            db,
            new StubAdvisor(new SetMappingAdvice(SetMappingAdviceDecision.Candidate, aiId, .87m, ["Cross-language match"], "deepseek-v4-flash", DateTime.UtcNow)),
            NullLogger<SetMappingAdviceService>.Instance);

        SetMappingAdvice? advice = await service.AdvisePendingAsync(pending.Id);

        Assert.NotNull(advice);
        Assert.Equal(heuristicId, pending.SuggestedCardSetId);
        Assert.Equal(aiId, pending.AiRecommendedCardSetId);
        Assert.Equal("Candidate", pending.AiDecision);
        Assert.Equal(.87m, pending.AiConfidence);
        Assert.Equal("deepseek-v4-flash", pending.AiModel);
        Assert.Contains("Cross-language match", pending.AiReasonsJson);
    }

    private sealed class StubAdvisor(SetMappingAdvice result) : ISetMappingAdvisor
    {
        public Task<SetMappingAdvice?> AdviseAsync(SetMappingAdviceRequest request, CancellationToken ct = default) =>
            Task.FromResult<SetMappingAdvice?>(result);
    }
}
