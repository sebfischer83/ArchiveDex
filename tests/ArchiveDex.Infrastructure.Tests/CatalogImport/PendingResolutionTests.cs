using System.Text.Json;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Application.Sets;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Tests.CatalogImport.Fixtures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class PendingResolutionTests
{
    [Fact]
    public async Task Accept_WritesManualMapping_AndReplaysParkedCards_WhileRejectedIdentityIsSkipped()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-pending-resolution-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var target = new CardSet { CanonicalName = "Target", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                var run = new CatalogImportRun { Status = CatalogImportStatus.Completed, Mode = CatalogImportMode.Update,
                    SelectedSourcesJson = "[]", SelectedLanguagesJson = "{}" };
                var pending = new PendingSetMapping
                {
                    IncomingSource = "Fixture", IncomingLanguage = "en", IncomingExternalId = "parked",
                    IncomingName = "Parked", SuggestedCardSet = target, Score = 70, ReasonsJson = "[]",
                    Status = MappingStatus.Pending, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
                };
                db.AddRange(target, run, pending);
                db.SourceSetSnapshots.Add(new SourceSetSnapshot
                {
                    ImportRun = run, Source = "Fixture", Language = "en", ExternalSetId = "parked",
                    RawName = "Parked", NormalizedName = "parked", PayloadJson = JsonSerializer.Serialize(SourceDataBuilders.Set("parked", "Parked")),
                    FetchedAt = DateTime.UtcNow
                });
                var detail = SourceDataBuilders.Card("parked", "parked-1", "1", "Parked Card");
                db.SourceCardSnapshots.Add(new SourceCardSnapshot
                {
                    ImportRun = run, Source = "Fixture", Language = "en", ExternalSetId = "parked",
                    ExternalCardId = "parked-1", Number = "1", NormalizedNumber = "001", Name = "Parked Card",
                    NormalizedName = "parked card", PayloadJson = JsonSerializer.Serialize(detail), FetchedAt = DateTime.UtcNow
                });
                await db.SaveChangesAsync();

                var importRepo = new CatalogImportRepository(db);
                var reconciler = new CatalogReconciler(db, NullLogger<CatalogReconciler>.Instance);
                var replay = new PendingResolutionService(importRepo, reconciler, db);
                var service = new SetMappingService(new SetRepository(db), null, replay);

                await service.AcceptPendingMappingAsync(pending.Id, target.Id, default);

                var mapping = await db.SetMappings.SingleAsync();
                Assert.True(mapping.IsManual);
                Assert.Equal(target.Id, mapping.CardSetId);
                Assert.Single(await db.CardPrints.Where(c => c.CardSetId == target.Id).ToListAsync());
                Assert.Single(await db.CardSetExternalIds.Where(e => e.CardSetId == target.Id).ToListAsync());

                var rejected = new PendingSetMapping
                {
                    IncomingSource = "Fixture", IncomingLanguage = "en", IncomingExternalId = "rejected",
                    IncomingName = "Rejected", Status = MappingStatus.Rejected,
                    CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
                };
                db.PendingSetMappings.Add(rejected);
                await db.SaveChangesAsync();
                var resolution = await new SetResolver(db, NullLogger<SetResolver>.Instance)
                    .ResolveAsync("Fixture", "en", "rejected", SourceDataBuilders.Set("rejected", "Rejected"), false);
                Assert.Equal(SetResolutionKind.Rejected, resolution.Kind);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }
}
