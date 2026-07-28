using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Infrastructure.Persistence
{
    public class ArchiveDexDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public ArchiveDexDbContext(DbContextOptions<ArchiveDexDbContext> options) : base(options) { }

        public DbSet<ImageAsset> ImageAssets => Set<ImageAsset>();
        public DbSet<CaptureBatch> CaptureBatches => Set<CaptureBatch>();
        public DbSet<CaptureDraft> CaptureDrafts => Set<CaptureDraft>();
        public DbSet<CatalogSetReference> CatalogSetReferences => Set<CatalogSetReference>();
        public DbSet<CatalogCardReference> CatalogCardReferences => Set<CatalogCardReference>();
        public DbSet<CardmarketProduct> CardmarketProducts => Set<CardmarketProduct>();
        public DbSet<CardmarketPrice> CardmarketPrices => Set<CardmarketPrice>();
        public DbSet<CardmarketImport> CardmarketImports => Set<CardmarketImport>();
        public DbSet<SetEdition> SetEditions => Set<SetEdition>();
        public DbSet<CardRecord> CardRecords => Set<CardRecord>();
        public DbSet<CardSpecimen> CardSpecimens => Set<CardSpecimen>();
        public DbSet<SpecimenValuationHistory> SpecimenValuationHistories => Set<SpecimenValuationHistory>();
        public DbSet<ValuationRefreshJob> ValuationRefreshJobs => Set<ValuationRefreshJob>();
        public DbSet<FinalizationRecord> FinalizationRecords => Set<FinalizationRecord>();

        private static readonly string[] CardmarketMoneyColumns =
            ["Avg30", "Avg30Holo", "Avg7", "Avg7Holo", "Trend", "TrendHolo", "Avg", "Low"];

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ImageAsset>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Content).HasColumnType("bytea");
                e.Property(x => x.Thumbnail).HasColumnType("bytea");
                e.Property(x => x.CroppedContent).HasColumnType("bytea");
                e.Property(x => x.CroppedThumbnail).HasColumnType("bytea");
                e.Property(x => x.CroppedSha256).HasColumnType("bytea");
                e.HasIndex(x => new { x.OwnerId, x.UploadSha256 }).HasFilter("\"State\" = 'attached'");
                e.HasIndex(x => new { x.OwnerId, x.NormalizedSha256 }).HasFilter("\"State\" = 'attached'");
                e.ToTable(table =>
                {
                    table.HasCheckConstraint("CK_ImageAsset_State", "\"State\" IN ('draft', 'attached')");
                    table.HasCheckConstraint("CK_ImageAsset_UploadSha256", "octet_length(\"UploadSha256\") = 32");
                    table.HasCheckConstraint("CK_ImageAsset_NormalizedSha256", "octet_length(\"NormalizedSha256\") = 32");
                    table.HasCheckConstraint("CK_ImageAsset_Dimensions", "\"Width\" > 0 AND \"Height\" > 0 AND \"Width\"::bigint * \"Height\" <= 30000000");
                    // A crop is all-or-nothing: content, thumbnail and hash exist together or not at all.
                    table.HasCheckConstraint("CK_ImageAsset_Crop",
                        "(\"CroppedContent\" IS NULL AND \"CroppedThumbnail\" IS NULL AND \"CroppedSha256\" IS NULL)"
                        + " OR (\"CroppedContent\" IS NOT NULL AND \"CroppedThumbnail\" IS NOT NULL"
                        + " AND octet_length(\"CroppedSha256\") = 32)");
                    table.HasCheckConstraint("CK_ImageAsset_Expiry", "(\"State\" = 'draft' AND \"ExpiresAt\" IS NOT NULL) OR (\"State\" = 'attached' AND \"ExpiresAt\" IS NULL)");
                });
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<ImageAsset>().WithMany().HasForeignKey(x => x.DuplicateMatchImageId).OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<CaptureBatch>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.OwnerId, x.ExpiresAt });
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<CaptureDraft>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.OwnerId, x.Status, x.ExpiresAt });
                e.HasIndex(x => new { x.OwnerId, x.BatchId, x.Status });
                e.HasIndex(x => new { x.Status, x.UpdatedAt })
                    .HasFilter("\"ProviderCorrelationId\" IS NOT NULL");
                e.HasIndex(x => new { x.OwnerId, x.IdempotencyKey }).IsUnique();
                e.HasIndex(x => x.ImageAssetId).IsUnique();
                e.Property(x => x.AnalysisProposal).HasColumnType("jsonb");
                e.Property(x => x.ConfirmedFields).HasColumnType("jsonb");
                e.Property(x => x.CandidateReferences).HasColumnType("jsonb");
                e.HasOne(x => x.ImageAsset).WithOne().HasForeignKey<CaptureDraft>(x => x.ImageAssetId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<CaptureBatch>().WithMany().HasForeignKey(x => x.BatchId).OnDelete(DeleteBehavior.SetNull);
                e.ToTable(table =>
                {
                    table.HasCheckConstraint("CK_CaptureDraft_Status", "\"Status\" IN ('uploaded', 'analyzing', 'needsReview', 'needsNewImage', 'failed')");
                    table.HasCheckConstraint("CK_CaptureDraft_RetryCount", "\"RetryCount\" >= 0 AND \"RetryCount\" <= 3");
                });
                e.Property(x => x.Version).IsRowVersion();
            });

            builder.Entity<CatalogSetReference>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.Namespace, x.ExternalId, x.CatalogVersion, x.LanguageCode }).IsUnique();
            });

            builder.Entity<CatalogCardReference>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.Namespace, x.ExternalId, x.CatalogVersion, x.LanguageCode, x.VariantKey }).IsUnique();
                e.HasOne(x => x.CatalogSetReference).WithMany().HasForeignKey(x => x.CatalogSetReferenceId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<CardmarketProduct>(e =>
            {
                e.HasKey(x => x.IdProduct);
                e.Property(x => x.IdProduct).ValueGeneratedNever();
                // Every lookup starts from the expansion a set maps to.
                e.HasIndex(x => new { x.IdExpansion, x.IdMetacard });
                e.HasIndex(x => new { x.IdExpansion, x.Name });
            });

            builder.Entity<CardmarketPrice>(e =>
            {
                e.HasKey(x => x.IdProduct);
                e.Property(x => x.IdProduct).ValueGeneratedNever();
                foreach (var money in CardmarketMoneyColumns)
                    e.Property<decimal?>(money).HasColumnType("numeric(12,2)");
            });

            builder.Entity<CardmarketImport>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.Kind, x.ImportedAt });
                e.ToTable(table => table.HasCheckConstraint(
                    "CK_CardmarketImport_Kind", "\"Kind\" IN ('products', 'prices')"));
            });

            builder.Entity<SetEdition>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.OwnerId, x.SetIdentifierNormalized, x.LanguageCode }).IsUnique();
                e.HasOne(x => x.Owner).WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.CatalogSetReference).WithMany().HasForeignKey(x => x.CatalogSetReferenceId).OnDelete(DeleteBehavior.SetNull);
                e.Property(x => x.Version).IsRowVersion();
            });

            builder.Entity<CardRecord>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.OwnerId, x.SetEditionId, x.NumberNormalized, x.VariantKey }).IsUnique();
                e.HasIndex(x => new { x.OwnerId, x.SetEditionId, x.NumberSortKey, x.Id });
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.SetEdition).WithMany(x => x.CardRecords).HasForeignKey(x => x.SetEditionId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<CatalogCardReference>().WithMany().HasForeignKey(x => x.CatalogCardReferenceId).OnDelete(DeleteBehavior.SetNull);
                e.ToTable(table => table.HasCheckConstraint("CK_CardRecord_GermanName", "(\"GermanName\" IS NOT NULL) <> (\"GermanNameUnavailableReason\" IS NOT NULL)"));
                e.Property(x => x.Version).IsRowVersion();
            });

            builder.Entity<CardRecord>(e => e.ToTable(table => table.HasCheckConstraint(
                "CK_CardRecord_CardmarketMatchState",
                "\"CardmarketMatchState\" IS NULL OR \"CardmarketMatchState\" IN "
                + "('unique', 'narrowSpread', 'aiResolved', 'manual', 'unresolved', 'noCandidate')")));

            builder.Entity<CardSpecimen>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.ValuationSourceUrlsJson).HasColumnType("jsonb");
                e.HasIndex(x => new { x.OwnerId, x.CardRecordId, x.Id });
                e.HasIndex(x => x.ImageAssetId).IsUnique();
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.CardRecord).WithMany(x => x.Specimens).HasForeignKey(x => x.CardRecordId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.ImageAsset).WithOne().HasForeignKey<CardSpecimen>(x => x.ImageAssetId).OnDelete(DeleteBehavior.Restrict);
                e.ToTable(table =>
                {
                    table.HasCheckConstraint("CK_CardSpecimen_Condition", "\"Condition\" IN ('NM', 'LP', 'MP', 'HP', 'DMG')");
                    table.HasCheckConstraint("CK_CardSpecimen_Valuation", "\"ValuationAmountMinor\" IS NULL OR (\"ValuationAmountMinor\" >= 0 AND \"ValuationCurrency\" = 'EUR' AND \"ValuedAt\" IS NOT NULL AND \"MarketDataAsOf\" IS NOT NULL AND \"ValuationProvider\" IS NOT NULL AND \"ValuationMethod\" IS NOT NULL)");
                });
                e.Property(x => x.Version).IsRowVersion();
            });

            builder.Entity<SpecimenValuationHistory>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.SourceUrlsJson).HasColumnType("jsonb");
                e.HasIndex(x => new { x.OwnerId, x.CardSpecimenId, x.RecordedAt });
                e.HasIndex(x => x.ValuationRefreshJobId);
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.CardSpecimen).WithMany(x => x.ValuationHistory)
                    .HasForeignKey(x => x.CardSpecimenId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<ValuationRefreshJob>().WithMany()
                    .HasForeignKey(x => x.ValuationRefreshJobId).OnDelete(DeleteBehavior.SetNull);
                e.ToTable(table =>
                {
                    table.HasCheckConstraint("CK_SpecimenValuationHistory_Outcome",
                        "\"Outcome\" IN ('accepted', 'heldForReview', 'rejected')");
                    table.HasCheckConstraint("CK_SpecimenValuationHistory_Amount",
                        "\"AmountMinor\" >= 0 AND \"Currency\" = 'EUR'");
                });
            });

            builder.Entity<ValuationRefreshJob>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.OwnerId, x.CreatedAt });
                e.HasIndex(x => x.OwnerId)
                    .IsUnique()
                    .HasFilter("\"Status\" IN ('pending', 'running')");
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.ToTable(table =>
                {
                    table.HasCheckConstraint("CK_ValuationRefreshJob_Status",
                        "\"Status\" IN ('pending', 'running', 'completed', 'completedWithErrors', 'failed')");
                    table.HasCheckConstraint("CK_ValuationRefreshJob_Counts",
                        "\"TotalCards\" >= 0 AND \"ProcessedCards\" >= 0 AND \"UpdatedCards\" >= 0 AND \"UnavailableCards\" >= 0 AND \"FailedCards\" >= 0 AND \"HeldCards\" >= 0");
                });
            });

            builder.Entity<FinalizationRecord>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => new { x.OwnerId, x.IdempotencyKey }).IsUnique();
                e.HasIndex(x => new { x.OwnerId, x.CaptureId }).IsUnique();
                e.HasIndex(x => new { x.OwnerId, x.BatchId });
                e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<CaptureBatch>().WithMany().HasForeignKey(x => x.BatchId).OnDelete(DeleteBehavior.SetNull);
                e.HasOne<CardSpecimen>().WithMany().HasForeignKey(x => x.SpecimenId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<CardRecord>().WithMany().HasForeignKey(x => x.CardRecordId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
