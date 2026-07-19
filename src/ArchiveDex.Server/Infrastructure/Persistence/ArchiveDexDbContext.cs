using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Infrastructure.Persistence;

public class ArchiveDexDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ArchiveDexDbContext(DbContextOptions<ArchiveDexDbContext> options) : base(options) { }

    public DbSet<ImageAsset> ImageAssets => Set<ImageAsset>();
    public DbSet<CaptureDraft> CaptureDrafts => Set<CaptureDraft>();
    public DbSet<CatalogSetReference> CatalogSetReferences => Set<CatalogSetReference>();
    public DbSet<CatalogCardReference> CatalogCardReferences => Set<CatalogCardReference>();
    public DbSet<SetEdition> SetEditions => Set<SetEdition>();
    public DbSet<CardRecord> CardRecords => Set<CardRecord>();
    public DbSet<CardSpecimen> CardSpecimens => Set<CardSpecimen>();
    public DbSet<FinalizationRecord> FinalizationRecords => Set<FinalizationRecord>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ImageAsset>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).HasColumnType("bytea");
            e.Property(x => x.Thumbnail).HasColumnType("bytea");
            e.HasIndex(x => new { x.OwnerId, x.UploadSha256 }).HasFilter("\"State\" = 'attached'");
            e.HasIndex(x => new { x.OwnerId, x.NormalizedSha256 }).HasFilter("\"State\" = 'attached'");
            e.ToTable(table =>
            {
                table.HasCheckConstraint("CK_ImageAsset_State", "\"State\" IN ('draft', 'attached')");
                table.HasCheckConstraint("CK_ImageAsset_UploadSha256", "octet_length(\"UploadSha256\") = 32");
                table.HasCheckConstraint("CK_ImageAsset_NormalizedSha256", "octet_length(\"NormalizedSha256\") = 32");
                table.HasCheckConstraint("CK_ImageAsset_Dimensions", "\"Width\" > 0 AND \"Height\" > 0 AND \"Width\"::bigint * \"Height\" <= 30000000");
                table.HasCheckConstraint("CK_ImageAsset_Expiry", "(\"State\" = 'draft' AND \"ExpiresAt\" IS NOT NULL) OR (\"State\" = 'attached' AND \"ExpiresAt\" IS NULL)");
            });
            e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne<ImageAsset>().WithMany().HasForeignKey(x => x.DuplicateMatchImageId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CaptureDraft>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.OwnerId, x.Status, x.ExpiresAt });
            e.HasIndex(x => new { x.Status, x.UpdatedAt })
                .HasFilter("\"ProviderCorrelationId\" IS NOT NULL");
            e.HasIndex(x => new { x.OwnerId, x.IdempotencyKey }).IsUnique();
            e.HasIndex(x => x.ImageAssetId).IsUnique();
            e.Property(x => x.AnalysisProposal).HasColumnType("jsonb");
            e.Property(x => x.ConfirmedFields).HasColumnType("jsonb");
            e.Property(x => x.CandidateReferences).HasColumnType("jsonb");
            e.HasOne(x => x.ImageAsset).WithOne().HasForeignKey<CaptureDraft>(x => x.ImageAssetId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
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

        builder.Entity<CardSpecimen>(e =>
        {
            e.HasKey(x => x.Id);
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

        builder.Entity<FinalizationRecord>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.OwnerId, x.IdempotencyKey }).IsUnique();
            e.HasIndex(x => new { x.OwnerId, x.CaptureId }).IsUnique();
            e.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne<CardSpecimen>().WithMany().HasForeignKey(x => x.SpecimenId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne<CardRecord>().WithMany().HasForeignKey(x => x.CardRecordId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
