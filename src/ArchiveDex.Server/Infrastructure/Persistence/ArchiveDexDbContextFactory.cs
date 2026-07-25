using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ArchiveDex.Server.Infrastructure.Persistence
{
    /// <summary>
    /// Design-time factory used by the EF Core tools (migrations add / database update).
    /// Its presence makes the tooling construct the context directly instead of running
    /// Program.cs, so startup side effects (e.g. applying migrations) do not execute
    /// during design-time operations. The connection string is only used by commands
    /// that touch the database and can be overridden via ConnectionStrings__PostgreSQL.
    /// </summary>
    public sealed class ArchiveDexDbContextFactory : IDesignTimeDbContextFactory<ArchiveDexDbContext>
    {
        public ArchiveDexDbContext CreateDbContext(string[] args)
        {
            var connectionString =
                Environment.GetEnvironmentVariable("ConnectionStrings__PostgreSQL")
                ?? "Host=localhost;Database=archivedex;Username=archivedex;Password=archivedex-dev-local";

            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            return new ArchiveDexDbContext(options);
        }
    }
}

