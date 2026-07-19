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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ImageAsset>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).HasColumnType("bytea");
            e.Property(x => x.Thumbnail).HasColumnType("bytea");
            e.HasIndex(x => new { x.OwnerId, x.UploadSha256 }).HasFilter("state = 'attached'");
            e.HasIndex(x => new { x.OwnerId, x.NormalizedSha256 }).HasFilter("state = 'attached'");
        });

        builder.Entity<CaptureDraft>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.OwnerId, x.Status, x.ExpiresAt });
            e.Property(x => x.AnalysisProposal).HasColumnType("jsonb");
            e.Property(x => x.ConfirmedFields).HasColumnType("jsonb");
            e.Property(x => x.CandidateReferences).HasColumnType("jsonb");
            e.HasOne<ImageAsset>().WithMany().HasForeignKey(x => x.ImageAssetId);
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
        });

        builder.Entity<SetEdition>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.OwnerId, x.SetIdentifierNormalized, x.LanguageCode }).IsUnique();
            e.Property(x => x.Version).IsRowVersion();
        });

        builder.Entity<CardRecord>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.OwnerId, x.SetEditionId, x.NumberNormalized, x.VariantKey }).IsUnique();
            e.HasIndex(x => new { x.OwnerId, x.SetEditionId, x.NumberSortKey });
            e.Property(x => x.Version).IsRowVersion();
        });

        builder.Entity<CardSpecimen>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.OwnerId, x.CardRecordId });
            e.HasIndex(x => x.ImageAssetId).IsUnique();
            e.HasOne<ImageAsset>().WithMany().HasForeignKey(x => x.ImageAssetId);
            e.Property(x => x.Version).IsRowVersion();
        });
    }
}
