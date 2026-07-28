using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace ArchiveDex.E2E
{
    /// <summary>
    /// Boots the real host in the <c>Testing</c> environment. The smoke test only asks whether the
    /// application root responds, so the host must skip the startup migration and owner provisioning
    /// it performs everywhere else — otherwise the test would require a live PostgreSQL instance.
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
                "Host=localhost;Port=1;Database=archivedex-smoke-tests;Username=none;Password=none");
            builder.UseSetting("DataProtection:Path", Path.Combine(Path.GetTempPath(), "archivedex-smoke-tests"));
        }
    }
}
