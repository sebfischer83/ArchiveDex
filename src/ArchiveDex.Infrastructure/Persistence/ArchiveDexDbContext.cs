using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Persistence
{
    public class ArchiveDexDbContext(DbContextOptions<ArchiveDexDbContext> options) : IdentityDbContext<Administrator, IdentityRole<Guid>, Guid>(options), IUnitOfWork
    {
        public DbSet<ApplicationConfiguration> ApplicationConfigurations => Set<ApplicationConfiguration>();
        public DbSet<CardSet> CardSets => Set<CardSet>();
        public DbSet<CardSetExternalId> CardSetExternalIds => Set<CardSetExternalId>();
        public DbSet<SetMapping> SetMappings => Set<SetMapping>();
        public DbSet<PendingSetMapping> PendingSetMappings => Set<PendingSetMapping>();
        public DbSet<SetRelation> SetRelations => Set<SetRelation>();
        public DbSet<CardPrint> CardPrints => Set<CardPrint>();
        public DbSet<CardExternalId> CardExternalIds => Set<CardExternalId>();
        public DbSet<CardTranslation> CardTranslations => Set<CardTranslation>();
        public DbSet<LocalCorrection> LocalCorrections => Set<LocalCorrection>();
        public DbSet<CollectionEntry> CollectionEntries => Set<CollectionEntry>();
        public DbSet<ScanJob> ScanJobs => Set<ScanJob>();
        public DbSet<OcrResult> OcrResults => Set<OcrResult>();
        public DbSet<ImportJob> ImportJobs => Set<ImportJob>();
        public DbSet<ImageAsset> ImageAssets => Set<ImageAsset>();
        public DbSet<BatchScanJob> BatchScanJobs => Set<BatchScanJob>();
        public DbSet<BatchScanItem> BatchScanItems => Set<BatchScanItem>();
        public DbSet<BatchScanResult> BatchScanResults => Set<BatchScanResult>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            _ = modelBuilder.Entity<ApplicationConfiguration>(e =>
            {
                _ = e.HasKey(c => c.Id);
                _ = e.Property(c => c.IsSetupComplete).IsRequired();
                _ = e.Property(c => c.DefaultUiCulture).HasConversion<string>().IsRequired();
                _ = e.Property(c => c.CollectionCurrency).HasMaxLength(3).IsRequired();
                _ = e.Property(c => c.ImageStoragePath).IsRequired();
                _ = e.Property(c => c.DatabaseMode).HasConversion<string>().IsRequired();
            });

            _ = modelBuilder.Entity<CardSet>(e =>
            {
                _ = e.HasKey(s => s.Id);
                _ = e.HasIndex(s => s.CanonicalName);
                _ = e.HasIndex(s => s.ReleaseDate);
                _ = e.Property(s => s.ImagePath).HasMaxLength(512);
                _ = e.HasMany(s => s.ExternalIds).WithOne(x => x.CardSet).HasForeignKey(x => x.CardSetId);
            });

            _ = modelBuilder.Entity<CardSetExternalId>(e =>
            {
                _ = e.HasKey(x => x.Id);
                _ = e.HasIndex(x => new { x.Source, x.Language, x.ExternalId }).IsUnique();
                _ = e.HasIndex(x => x.CardSetId);
            });

            _ = modelBuilder.Entity<SetMapping>(e =>
            {
                _ = e.HasKey(m => m.Id);
                _ = e.HasIndex(m => new { m.Source, m.Language, m.ExternalId }).IsUnique();
                _ = e.HasIndex(m => m.CardSetId);
                _ = e.Property(m => m.Confidence).HasConversion<string>().IsRequired();
                _ = e.HasOne(m => m.CardSet).WithMany().HasForeignKey(m => m.CardSetId).OnDelete(DeleteBehavior.Cascade);
            });

            _ = modelBuilder.Entity<PendingSetMapping>(e =>
            {
                _ = e.HasKey(p => p.Id);
                _ = e.HasIndex(p => new { p.IncomingSource, p.IncomingLanguage, p.IncomingExternalId });
                _ = e.HasIndex(p => p.Status);
                _ = e.Property(p => p.Status).HasConversion<string>().IsRequired();
                _ = e.HasOne(p => p.SuggestedCardSet).WithMany().HasForeignKey(p => p.SuggestedCardSetId).OnDelete(DeleteBehavior.SetNull);
            });

            _ = modelBuilder.Entity<SetRelation>(e =>
            {
                _ = e.HasKey(r => r.Id);
                _ = e.HasIndex(r => new { r.SourceSetId, r.TargetSetId, r.RelationType }).IsUnique();
                _ = e.Property(r => r.RelationType).HasConversion<string>().IsRequired();
                _ = e.Property(r => r.Confidence).HasConversion<string>().IsRequired();
                _ = e.HasOne(r => r.SourceSet).WithMany().HasForeignKey(r => r.SourceSetId).OnDelete(DeleteBehavior.Restrict);
                _ = e.HasOne(r => r.TargetSet).WithMany().HasForeignKey(r => r.TargetSetId).OnDelete(DeleteBehavior.Restrict);
            });

            _ = modelBuilder.Entity<CardPrint>(e =>
            {
                _ = e.HasKey(c => c.Id);
                _ = e.HasIndex(c => new { c.CardLanguage, c.Number });
                _ = e.HasIndex(c => c.Name);
                _ = e.HasIndex(c => c.CardSetId);
                _ = e.Property(c => c.CardLanguage).HasConversion<string>().IsRequired();
                _ = e.Property(c => c.Origin).HasConversion<string>().IsRequired();
                _ = e.HasOne(c => c.CardSet).WithMany(s => s.Cards).HasForeignKey(c => c.CardSetId);
                _ = e.HasOne(c => c.LocalCorrection).WithOne(lc => lc.CardPrint).HasForeignKey<LocalCorrection>(lc => lc.CardPrintId);
                _ = e.HasMany(c => c.ExternalIds).WithOne(x => x.CardPrint).HasForeignKey(x => x.CardPrintId);
                _ = e.HasMany(c => c.Translations).WithOne(t => t.CardPrint).HasForeignKey(t => t.CardPrintId);
            });

            _ = modelBuilder.Entity<CardExternalId>(e =>
            {
                _ = e.HasKey(x => x.Id);
                _ = e.HasIndex(x => new { x.Source, x.ExternalId, x.Language }).IsUnique();
            });

            _ = modelBuilder.Entity<CardTranslation>(e =>
            {
                _ = e.HasKey(t => t.Id);
                _ = e.HasIndex(t => new { t.CardPrintId, t.Language }).IsUnique();
                _ = e.Property(t => t.Language).IsRequired();
            });

            _ = modelBuilder.Entity<LocalCorrection>(e =>
            {
                _ = e.HasKey(lc => lc.Id);
                _ = e.HasIndex(lc => lc.CardPrintId).IsUnique();
            });

            _ = modelBuilder.Entity<CollectionEntry>(e =>
            {
                _ = e.HasKey(ce => ce.Id);
                _ = e.Property(ce => ce.Condition).HasConversion<string>().IsRequired();
                _ = e.HasOne(ce => ce.CardPrint).WithMany(c => c.CollectionEntries).HasForeignKey(ce => ce.CardPrintId);
            });

            _ = modelBuilder.Entity<ScanJob>(e =>
            {
                _ = e.HasKey(sj => sj.Id);
                _ = e.Property(sj => sj.Status).HasConversion<string>().IsRequired();
                _ = e.HasOne(sj => sj.ImageAsset).WithMany().HasForeignKey(sj => sj.ImageAssetId);
                _ = e.HasOne(sj => sj.OcrResult).WithOne(or => or.ScanJob).HasForeignKey<OcrResult>(or => or.ScanJobId);
            });

            _ = modelBuilder.Entity<OcrResult>(e =>
            {
                _ = e.HasKey(or => or.Id);
                _ = e.Property(or => or.DetectedCardLanguage).HasConversion<string>();
            });

            _ = modelBuilder.Entity<ImportJob>(e =>
            {
                _ = e.HasKey(ij => ij.Id);
                _ = e.Property(ij => ij.Status).HasConversion<string>().IsRequired();
            });

            _ = modelBuilder.Entity<ImageAsset>(e =>
            {
                _ = e.HasKey(ia => ia.Id);
                _ = e.Property(ia => ia.Format).HasConversion<string>().IsRequired();
            });

            _ = modelBuilder.Entity<BatchScanJob>(e =>
            {
                _ = e.HasKey(b => b.Id);
                _ = e.Property(b => b.Status).HasConversion<string>().IsRequired();
                _ = e.HasMany(b => b.Items).WithOne(i => i.BatchScanJob).HasForeignKey(i => i.BatchScanJobId);
            });

            _ = modelBuilder.Entity<BatchScanItem>(e =>
            {
                _ = e.HasKey(i => i.Id);
                _ = e.HasIndex(i => i.BatchScanJobId);
                _ = e.HasIndex(i => i.MatchStatus);
                _ = e.Property(i => i.MatchStatus).HasConversion<string>().IsRequired();
                _ = e.Property(i => i.FailureReason).HasMaxLength(500);
                _ = e.HasOne(i => i.BatchScanJob).WithMany(b => b.Items).HasForeignKey(i => i.BatchScanJobId);
                _ = e.HasOne(i => i.ImageAsset).WithMany().HasForeignKey(i => i.ImageAssetId).OnDelete(DeleteBehavior.SetNull);
                _ = e.HasOne(i => i.OcrResult).WithOne(r => r.BatchScanItem).HasForeignKey<BatchScanResult>(r => r.BatchScanItemId);
                _ = e.HasOne(i => i.MatchedCardPrint).WithMany().HasForeignKey(i => i.MatchedCardPrintId).OnDelete(DeleteBehavior.SetNull);
                _ = e.HasOne(i => i.CollectionEntry).WithMany().HasForeignKey(i => i.CollectionEntryId).OnDelete(DeleteBehavior.SetNull);
            });

            _ = modelBuilder.Entity<BatchScanResult>(e =>
            {
                _ = e.HasKey(r => r.Id);
                _ = e.HasIndex(r => r.BatchScanItemId).IsUnique();
                _ = e.Property(r => r.DetectedCardLanguage).HasConversion<string>();
                _ = e.Property(r => r.CandidateMatches).IsRequired();
            });
        }
    }
}
