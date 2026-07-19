using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class MigrationTests
{
    [Fact]
    public async Task InitialMigrationAppliesToPostgreSql18()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var postgres = new PostgreSqlBuilder("postgres:18.4-bookworm").Build();
        await postgres.StartAsync(cancellationToken);

        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseNpgsql(postgres.GetConnectionString())
            .Options;
        await using var db = new ArchiveDexDbContext(options);
        await db.Database.MigrateAsync(cancellationToken);

        await db.Database.OpenConnectionAsync(cancellationToken);
        await using var command = db.Database.GetDbConnection().CreateCommand();
        command.CommandText = "SELECT count(*) FROM information_schema.columns WHERE column_name = 'ImageAssetId1'";
        var shadowColumnCount = (long)(await command.ExecuteScalarAsync(cancellationToken) ?? -1L);
        var pendingMigrations = await db.Database.GetPendingMigrationsAsync(cancellationToken);

        Assert.Equal(0, shadowColumnCount);
        Assert.Empty(pendingMigrations);
    }
}
