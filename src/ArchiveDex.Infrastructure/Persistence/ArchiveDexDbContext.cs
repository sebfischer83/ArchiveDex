using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Persistence;

public class ArchiveDexDbContext : IdentityDbContext<Administrator, IdentityRole<Guid>, Guid>, IUnitOfWork
{
    public ArchiveDexDbContext(DbContextOptions<ArchiveDexDbContext> options) : base(options) { }

    public DbSet<ApplicationConfiguration> ApplicationConfigurations => Set<ApplicationConfiguration>();
    public DbSet<CardSet> CardSets => Set<CardSet>();
    public DbSet<CardSetExternalId> CardSetExternalIds => Set<CardSetExternalId>();
    public DbSet<SetMapping> SetMappings => Set<SetMapping>();
    public DbSet<PendingSetMapping> PendingSetMappings => Set<PendingSetMapping>();
    public DbSet<SetRelation> SetRelations => Set<SetRelation>();
    public DbSet<CardPrint> CardPrints => Set<CardPrint>();
    public DbSet<CardExternalId> CardExternalIds => Set<CardExternalId>();
    public DbSet<LocalCorrection> LocalCorrections => Set<LocalCorrection>();
    public DbSet<CollectionEntry> CollectionEntries => Set<CollectionEntry>();
    public DbSet<ScanJob> ScanJobs => Set<ScanJob>();
    public DbSet<OcrResult> OcrResults => Set<OcrResult>();
    public DbSet<ImportJob> ImportJobs => Set<ImportJob>();
    public DbSet<ImageAsset> ImageAssets => Set<ImageAsset>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationConfiguration>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.IsSetupComplete).IsRequired();
            e.Property(c => c.DefaultUiCulture).HasConversion<string>().IsRequired();
            e.Property(c => c.CollectionCurrency).HasMaxLength(3).IsRequired();
            e.Property(c => c.ImageStoragePath).IsRequired();
            e.Property(c => c.DatabaseMode).HasConversion<string>().IsRequired();
        });

        modelBuilder.Entity<CardSet>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.CanonicalName);
            e.HasIndex(s => s.ReleaseDate);
            e.HasMany(s => s.ExternalIds).WithOne(x => x.CardSet).HasForeignKey(x => x.CardSetId);
        });

        modelBuilder.Entity<CardSetExternalId>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.Source, x.Language, x.ExternalId }).IsUnique();
            e.HasIndex(x => x.CardSetId);
        });

        modelBuilder.Entity<SetMapping>(e =>
        {
            e.HasKey(m => m.Id);
            e.HasIndex(m => new { m.Source, m.Language, m.ExternalId }).IsUnique();
            e.HasIndex(m => m.CardSetId);
            e.Property(m => m.Confidence).HasConversion<string>().IsRequired();
            e.HasOne(m => m.CardSet).WithMany().HasForeignKey(m => m.CardSetId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PendingSetMapping>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => new { p.IncomingSource, p.IncomingLanguage, p.IncomingExternalId });
            e.HasIndex(p => p.Status);
            e.Property(p => p.Status).HasConversion<string>().IsRequired();
            e.HasOne(p => p.SuggestedCardSet).WithMany().HasForeignKey(p => p.SuggestedCardSetId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<SetRelation>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => new { r.SourceSetId, r.TargetSetId, r.RelationType }).IsUnique();
            e.Property(r => r.RelationType).HasConversion<string>().IsRequired();
            e.Property(r => r.Confidence).HasConversion<string>().IsRequired();
            e.HasOne(r => r.SourceSet).WithMany().HasForeignKey(r => r.SourceSetId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.TargetSet).WithMany().HasForeignKey(r => r.TargetSetId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CardPrint>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => new { c.CardLanguage, c.Number });
            e.HasIndex(c => c.Name);
            e.HasIndex(c => c.CardSetId);
            e.Property(c => c.CardLanguage).HasConversion<string>().IsRequired();
            e.Property(c => c.Origin).HasConversion<string>().IsRequired();
            e.HasOne(c => c.CardSet).WithMany(s => s.Cards).HasForeignKey(c => c.CardSetId);
            e.HasOne(c => c.LocalCorrection).WithOne(lc => lc.CardPrint).HasForeignKey<LocalCorrection>(lc => lc.CardPrintId);
            e.HasMany(c => c.ExternalIds).WithOne(x => x.CardPrint).HasForeignKey(x => x.CardPrintId);
        });

        modelBuilder.Entity<CardExternalId>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.Source, x.ExternalId, x.Language }).IsUnique();
        });

        modelBuilder.Entity<LocalCorrection>(e =>
        {
            e.HasKey(lc => lc.Id);
            e.HasIndex(lc => lc.CardPrintId).IsUnique();
        });

        modelBuilder.Entity<CollectionEntry>(e =>
        {
            e.HasKey(ce => ce.Id);
            e.Property(ce => ce.Condition).HasConversion<string>().IsRequired();
            e.HasOne(ce => ce.CardPrint).WithMany(c => c.CollectionEntries).HasForeignKey(ce => ce.CardPrintId);
        });

        modelBuilder.Entity<ScanJob>(e =>
        {
            e.HasKey(sj => sj.Id);
            e.Property(sj => sj.Status).HasConversion<string>().IsRequired();
            e.HasOne(sj => sj.ImageAsset).WithMany().HasForeignKey(sj => sj.ImageAssetId);
            e.HasOne(sj => sj.OcrResult).WithOne(or => or.ScanJob).HasForeignKey<OcrResult>(or => or.ScanJobId);
        });

        modelBuilder.Entity<OcrResult>(e =>
        {
            e.HasKey(or => or.Id);
            e.Property(or => or.DetectedCardLanguage).HasConversion<string>();
        });

        modelBuilder.Entity<ImportJob>(e =>
        {
            e.HasKey(ij => ij.Id);
            e.Property(ij => ij.Status).HasConversion<string>().IsRequired();
        });

        modelBuilder.Entity<ImageAsset>(e =>
        {
            e.HasKey(ia => ia.Id);
            e.Property(ia => ia.Format).HasConversion<string>().IsRequired();
        });
    }
}
