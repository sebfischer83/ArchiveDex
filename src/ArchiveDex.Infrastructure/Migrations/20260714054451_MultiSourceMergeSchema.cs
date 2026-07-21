using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MultiSourceMergeSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DO $$
                DECLARE collision RECORD;
                BEGIN
                    FOR collision IN
                        SELECT "CardSetId", "CardLanguage",
                               CASE WHEN REPLACE(TRIM("Number"), ' ', '') ~ '^[0-9]+$'
                                    THEN LPAD(COALESCE(NULLIF(LTRIM(REPLACE(TRIM("Number"), ' ', ''), '0'), ''), '0'), 3, '0')
                                    ELSE REPLACE(TRIM("Number"), ' ', '') END AS normalized_number,
                               COUNT(*) AS collision_count
                        FROM "CardPrints"
                        GROUP BY "CardSetId", "CardLanguage", normalized_number
                        HAVING COUNT(*) > 1
                    LOOP
                        RAISE NOTICE 'Card-number normalization collision: set=%, language=%, number=%, count=%',
                            collision."CardSetId", collision."CardLanguage", collision.normalized_number, collision.collision_count;
                    END LOOP;
                END $$;

                UPDATE "CardPrints"
                SET "Number" = CASE WHEN REPLACE(TRIM("Number"), ' ', '') ~ '^[0-9]+$'
                                    THEN LPAD(COALESCE(NULLIF(LTRIM(REPLACE(TRIM("Number"), ' ', ''), '0'), ''), '0'), 3, '0')
                                    ELSE REPLACE(TRIM("Number"), ' ', '') END;

                UPDATE "CardExternalIds"
                SET "ExternalId" = REGEXP_REPLACE(
                    "ExternalId",
                    '-([0-9]+)$',
                    '-' || LPAD(COALESCE(NULLIF(LTRIM(SUBSTRING("ExternalId" FROM '([0-9]+)$'), '0'), ''), '0'), 3, '0'))
                WHERE "ExternalId" ~ '-[0-9]+$';
                """);

            migrationBuilder.AddColumn<int>(
                name: "ConflictCount",
                table: "CatalogImportRuns",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PendingCount",
                table: "CatalogImportRuns",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PerSourceStatsJson",
                table: "CatalogImportRuns",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FieldSourcesJson",
                table: "CardSets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FieldSourcesJson",
                table: "CardPrints",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PendingCardMappings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportRunId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ExternalSetId = table.Column<string>(type: "text", nullable: false),
                    ExternalCardId = table.Column<string>(type: "text", nullable: false),
                    CardSetId = table.Column<Guid>(type: "uuid", nullable: false),
                    IncomingNumber = table.Column<string>(type: "text", nullable: false),
                    IncomingName = table.Column<string>(type: "text", nullable: false),
                    CandidatesJson = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PendingCardMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PendingCardMappings_CardSets_CardSetId",
                        column: x => x.CardSetId,
                        principalTable: "CardSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PendingCardMappings_CatalogImportRuns_ImportRunId",
                        column: x => x.ImportRunId,
                        principalTable: "CatalogImportRuns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalSet~",
                table: "SourceCardSnapshots",
                columns: new[] { "ImportRunId", "Source", "Language", "ExternalSetId" });

            migrationBuilder.CreateIndex(
                name: "IX_PendingCardMappings_CardSetId",
                table: "PendingCardMappings",
                column: "CardSetId");

            migrationBuilder.CreateIndex(
                name: "IX_PendingCardMappings_ImportRunId",
                table: "PendingCardMappings",
                column: "ImportRunId");

            migrationBuilder.CreateIndex(
                name: "IX_PendingCardMappings_Source_Language_ExternalCardId",
                table: "PendingCardMappings",
                columns: new[] { "Source", "Language", "ExternalCardId" });

            migrationBuilder.CreateIndex(
                name: "IX_PendingCardMappings_Status",
                table: "PendingCardMappings",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PendingCardMappings");

            migrationBuilder.DropIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalSet~",
                table: "SourceCardSnapshots");

            migrationBuilder.DropColumn(
                name: "ConflictCount",
                table: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "PendingCount",
                table: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "PerSourceStatsJson",
                table: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "FieldSourcesJson",
                table: "CardSets");

            migrationBuilder.DropColumn(
                name: "FieldSourcesJson",
                table: "CardPrints");

        }
    }
}
