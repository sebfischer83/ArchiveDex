using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Hosting;

namespace ArchiveDex.Server.ContractTests
{
    /// <summary>
    /// Boots the real host in the <c>Testing</c> environment. These tests exercise HTTP contracts
    /// (health, session, antiforgery) that never touch the database, so the host must skip the
    /// startup migration and owner provisioning it performs everywhere else — otherwise running the
    /// suite would require a live PostgreSQL instance.
    /// </summary>
    public sealed class TestingHostFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            // The Testing environment loads no appsettings of its own, but the host refuses to build
            // without a connection string. Nothing here opens a connection; a test that starts
            // touching the database should fail loudly on connect rather than pass by accident.
            builder.UseSetting("ConnectionStrings:PostgreSQL",
                "Host=localhost;Port=1;Database=archivedex-contract-tests;Username=none;Password=none");
            builder.UseSetting("DataProtection:Path", Path.Combine(Path.GetTempPath(), "archivedex-contract-tests"));
            // The test client speaks plain HTTP, as does the app behind its container's terminator
            // (docker-compose sets Security__RequireHttpsCookies=false). Leaving the default on
            // would make the antiforgery filter throw about SSL instead of rejecting the request.
            builder.UseSetting("Security:RequireHttpsCookies", "false");
        }
    }
}
