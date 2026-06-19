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

namespace ArchiveDex.Api.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Web.Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("archivedex_test")
        .WithUsername("archivedex")
        .WithPassword("archivedex")
        .Build();

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _container.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ArchiveDexDbContext>));
            if (descriptor is not null) services.Remove(descriptor);

            services.AddDbContext<ArchiveDexDbContext>(options =>
            {
                options.UseNpgsql(_container.GetConnectionString());
            });

            var tcgDescriptors = services
                .Where(d => d.ServiceType == typeof(ITcgDataSource))
                .ToList();
            foreach (var tcgDescriptor in tcgDescriptors)
            {
                services.Remove(tcgDescriptor);
            }

            services.AddScoped<ITcgDataSource, FakeTcgDataSource>();

            var backgroundJobDescriptors = services
                .Where(d => d.ServiceType == typeof(IBackgroundJobClient))
                .ToList();
            foreach (var backgroundJobDescriptor in backgroundJobDescriptors)
            {
                services.Remove(backgroundJobDescriptor);
            }

            services.AddSingleton<IBackgroundJobClient, FakeBackgroundJobClient>();
        });
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using var scope = host.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
        db.Database.EnsureCreated();

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
            CancellationToken ct = default)
        {
            return Task.FromResult<SetSummary?>(
                new(setId, "Sword & Shield", language, 216, 202,
                    new DateOnly(2020, 2, 7), "Sword & Shield"));
        }

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
            CancellationToken ct = default)
        {
            return Task.FromResult<CardDetailDto?>(null);
        }

        public Task<CardImageDownload?> DownloadCardImageAsync(
            string imageUrl,
            CancellationToken ct = default)
        {
            return Task.FromResult<CardImageDownload?>(null);
        }
    }

    private sealed class FakeBackgroundJobClient : IBackgroundJobClient
    {
        public string Create(Job job, IState state)
        {
            return Guid.NewGuid().ToString("N");
        }

        public bool ChangeState(string jobId, IState state, string expectedState)
        {
            return true;
        }
    }
}
