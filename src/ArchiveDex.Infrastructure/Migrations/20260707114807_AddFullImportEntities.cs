using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFullImportEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMissingFromSource",
                table: "CardSetExternalIds",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastSeenAt",
                table: "CardSetExternalIds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "MissingDetectedAt",
                table: "CardSetExternalIds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMissingFromSource",
                table: "CardExternalIds",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastSeenAt",
                table: "CardExternalIds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "MissingDetectedAt",
                table: "CardExternalIds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CatalogImageAssets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EntityType = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    SourceUrl = table.Column<string>(type: "text", nullable: false),
                    LocalPath = table.Column<string>(type: "text", nullable: false),
                    Width = table.Column<int>(type: "integer", nullable: false),
                    Height = table.Column<int>(type: "integer", nullable: false),
                    Format = table.Column<string>(type: "text", nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    Sha256 = table.Column<string>(type: "text", nullable: false),
                    QualityScore = table.Column<decimal>(type: "numeric", nullable: false),
                    IsManuallySelected = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogImageAssets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogImportRuns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    SelectedSourcesJson = table.Column<string>(type: "text", nullable: false),
                    SelectedLanguagesJson = table.Column<string>(type: "text", nullable: false),
                    IsDryRun = table.Column<bool>(type: "boolean", nullable: false),
                    DownloadImages = table.Column<bool>(type: "boolean", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FinishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ImportedCount = table.Column<int>(type: "integer", nullable: false),
                    UpdatedCount = table.Column<int>(type: "integer", nullable: false),
                    MergedCount = table.Column<int>(type: "integer", nullable: false),
                    SkippedCount = table.Column<int>(type: "integer", nullable: false),
                    ErrorCount = table.Column<int>(type: "integer", nullable: false),
                    WarningCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogImportRuns", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogImportCheckpoints",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportRunId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    SetExternalId = table.Column<string>(type: "text", nullable: true),
                    Phase = table.Column<string>(type: "text", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    ProcessedCount = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogImportCheckpoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CatalogImportCheckpoints_CatalogImportRuns_ImportRunId",
                        column: x => x.ImportRunId,
                        principalTable: "CatalogImportRuns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImageCandidateMetadata",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportRunId = table.Column<Guid>(type: "uuid", nullable: false),
                    EntityType = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    Source = table.Column<string>(type: "text", nullable: false),
                    SourceUrl = table.Column<string>(type: "text", nullable: false),
                    Width = table.Column<int>(type: "integer", nullable: true),
                    Height = table.Column<int>(type: "integer", nullable: true),
                    Format = table.Column<string>(type: "text", nullable: true),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: true),
                    Sha256 = table.Column<string>(type: "text", nullable: true),
                    QualityScore = table.Column<decimal>(type: "numeric", nullable: true),
                    IsSelected = table.Column<bool>(type: "boolean", nullable: false),
                    Error = table.Column<string>(type: "text", nullable: true),
                    AnalyzedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageCandidateMetadata", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImageCandidateMetadata_CatalogImportRuns_ImportRunId",
                        column: x => x.ImportRunId,
                        principalTable: "CatalogImportRuns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SourceCardSnapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportRunId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ExternalSetId = table.Column<string>(type: "text", nullable: false),
                    ExternalCardId = table.Column<string>(type: "text", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    NormalizedNumber = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    NormalizedName = table.Column<string>(type: "text", nullable: false),
                    Rarity = table.Column<string>(type: "text", nullable: true),
                    PayloadJson = table.Column<string>(type: "text", nullable: true),
                    PayloadHash = table.Column<string>(type: "text", nullable: true),
                    FetchedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SourceCardSnapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SourceCardSnapshots_CatalogImportRuns_ImportRunId",
                        column: x => x.ImportRunId,
                        principalTable: "CatalogImportRuns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SourceImportErrors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportRunId = table.Column<Guid>(type: "uuid", nullable: false),
                    Severity = table.Column<string>(type: "text", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    Language = table.Column<string>(type: "text", nullable: true),
                    SetExternalId = table.Column<string>(type: "text", nullable: true),
                    CardExternalId = table.Column<string>(type: "text", nullable: true),
                    Phase = table.Column<string>(type: "text", nullable: true),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SourceImportErrors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SourceImportErrors_CatalogImportRuns_ImportRunId",
                        column: x => x.ImportRunId,
                        principalTable: "CatalogImportRuns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SourceSetSnapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportRunId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ExternalSetId = table.Column<string>(type: "text", nullable: false),
                    NormalizedName = table.Column<string>(type: "text", nullable: false),
                    RawName = table.Column<string>(type: "text", nullable: false),
                    Series = table.Column<string>(type: "text", nullable: true),
                    ReleaseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PrintedTotal = table.Column<int>(type: "integer", nullable: true),
                    OfficialTotal = table.Column<int>(type: "integer", nullable: true),
                    PayloadJson = table.Column<string>(type: "text", nullable: true),
                    PayloadHash = table.Column<string>(type: "text", nullable: true),
                    FetchedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SourceSetSnapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SourceSetSnapshots_CatalogImportRuns_ImportRunId",
                        column: x => x.ImportRunId,
                        principalTable: "CatalogImportRuns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CatalogImageAssets_EntityType_EntityId",
                table: "CatalogImageAssets",
                columns: new[] { "EntityType", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_CatalogImportCheckpoints_ImportRunId_Source_Language_SetExt~",
                table: "CatalogImportCheckpoints",
                columns: new[] { "ImportRunId", "Source", "Language", "SetExternalId", "Phase" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ImageCandidateMetadata_ImportRunId",
                table: "ImageCandidateMetadata",
                column: "ImportRunId");

            migrationBuilder.CreateIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalCar~",
                table: "SourceCardSnapshots",
                columns: new[] { "ImportRunId", "Source", "Language", "ExternalCardId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SourceImportErrors_ImportRunId",
                table: "SourceImportErrors",
                column: "ImportRunId");

            migrationBuilder.CreateIndex(
                name: "IX_SourceImportErrors_ImportRunId_Severity",
                table: "SourceImportErrors",
                columns: new[] { "ImportRunId", "Severity" });

            migrationBuilder.CreateIndex(
                name: "IX_SourceSetSnapshots_ImportRunId_Source_Language_ExternalSetId",
                table: "SourceSetSnapshots",
                columns: new[] { "ImportRunId", "Source", "Language", "ExternalSetId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CatalogImageAssets");

            migrationBuilder.DropTable(
                name: "CatalogImportCheckpoints");

            migrationBuilder.DropTable(
                name: "ImageCandidateMetadata");

            migrationBuilder.DropTable(
                name: "SourceCardSnapshots");

            migrationBuilder.DropTable(
                name: "SourceImportErrors");

            migrationBuilder.DropTable(
                name: "SourceSetSnapshots");

            migrationBuilder.DropTable(
                name: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "IsMissingFromSource",
                table: "CardSetExternalIds");

            migrationBuilder.DropColumn(
                name: "LastSeenAt",
                table: "CardSetExternalIds");

            migrationBuilder.DropColumn(
                name: "MissingDetectedAt",
                table: "CardSetExternalIds");

            migrationBuilder.DropColumn(
                name: "IsMissingFromSource",
                table: "CardExternalIds");

            migrationBuilder.DropColumn(
                name: "LastSeenAt",
                table: "CardExternalIds");

            migrationBuilder.DropColumn(
                name: "MissingDetectedAt",
                table: "CardExternalIds");
        }
    }
}
