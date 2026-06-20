using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Testcontainers.PostgreSql;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Infrastructure.Persistence;
using Hangfire;
using Hangfire.Common;
using Hangfire.States;

namespace ArchiveDex.Api.Tests
{
    public class TestWebApplicationFactory : WebApplicationFactory<Web.Program>, IAsyncLifetime
    {
        private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
            .WithImage("postgres:16-alpine")
            .WithDatabase("archivedex_test")
            .WithUsername("archivedex")
            .WithPassword("archivedex")
            .Build();

        public async Task InitializeAsync() => await _container.StartAsync();

        public new async Task DisposeAsync() => await _container.DisposeAsync();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            _ = builder.UseEnvironment("Testing");

            _ = builder.ConfigureServices(services =>
            {
                ServiceDescriptor? descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ArchiveDexDbContext>));
                if (descriptor is not null)
                {
                    _ = services.Remove(descriptor);
                }

                _ = services.AddDbContext<ArchiveDexDbContext>(options =>
                {
                    _ = options.UseNpgsql(_container.GetConnectionString());
                });

                var tcgDescriptors = services
                    .Where(d => d.ServiceType == typeof(ITcgDataSource))
                    .ToList();
                foreach (ServiceDescriptor? tcgDescriptor in tcgDescriptors)
                {
                    _ = services.Remove(tcgDescriptor);
                }

                _ = services.AddScoped<ITcgDataSource, FakeTcgDataSource>();

                var backgroundJobDescriptors = services
                    .Where(d => d.ServiceType == typeof(IBackgroundJobClient))
                    .ToList();
                foreach (ServiceDescriptor? backgroundJobDescriptor in backgroundJobDescriptors)
                {
                    _ = services.Remove(backgroundJobDescriptor);
                }

                _ = services.AddSingleton<IBackgroundJobClient, FakeBackgroundJobClient>();
            });
        }

        protected override IHost CreateHost(IHostBuilder builder)
        {
            IHost host = base.CreateHost(builder);

            using IServiceScope scope = host.Services.CreateScope();
            ArchiveDexDbContext db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            _ = db.Database.EnsureCreated();

            return host;
        }

        private sealed class FakeTcgDataSource : ITcgDataSource
        {
            public string SourceName => "TCGdex";

            public Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(
                string language,
                CancellationToken ct = default)
            {
                IReadOnlyList<SetSummary> sets =
                [
                    new("swsh1", "Sword & Shield", language, 216, 202)
                ];
                return Task.FromResult(sets);
            }

            public Task<SetSummary?> GetSetMetaAsync(
                string setId,
                string language,
                CancellationToken ct = default) => Task.FromResult<SetSummary?>(
                    new(setId, "Sword & Shield", language, 216, 202,
                        new DateOnly(2020, 2, 7), "Sword & Shield"));

            public Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(
                string setId,
                string language,
                CancellationToken ct = default)
            {
                IReadOnlyList<CardImportDto> cards =
                [
                    new($"{setId}-001", "001", "Test Card", "Common", null)
                ];
                return Task.FromResult(cards);
            }

            public Task<CardDetailDto?> GetCardDetailAsync(
                string cardId,
                string language,
                CancellationToken ct = default) => Task.FromResult<CardDetailDto?>(null);

            public Task<CardImageDownload?> DownloadCardImageAsync(
                string imageUrl,
                CancellationToken ct = default) => Task.FromResult<CardImageDownload?>(null);
        }

        private sealed class FakeBackgroundJobClient : IBackgroundJobClient
        {
            public string Create(Job job, IState state) => Guid.NewGuid().ToString("N");

            public bool ChangeState(string jobId, IState state, string expectedState) => true;
        }
    }
}
