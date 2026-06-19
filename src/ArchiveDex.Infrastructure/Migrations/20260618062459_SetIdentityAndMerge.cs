using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SetIdentityAndMerge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardPrints_Sets_SetId",
                table: "CardPrints");

            migrationBuilder.DropTable(
                name: "SetExternalIds");

            migrationBuilder.DropTable(
                name: "Sets");

            migrationBuilder.RenameColumn(
                name: "SetId",
                table: "CardPrints",
                newName: "CardSetId");

            migrationBuilder.RenameIndex(
                name: "IX_CardPrints_SetId",
                table: "CardPrints",
                newName: "IX_CardPrints_CardSetId");

            migrationBuilder.CreateTable(
                name: "CardSets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CanonicalName = table.Column<string>(type: "text", nullable: false),
                    Series = table.Column<string>(type: "text", nullable: true),
                    ReleaseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PrintedTotal = table.Column<int>(type: "integer", nullable: true),
                    OfficialTotal = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardSets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CardSetExternalIds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardSetId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    ExternalName = table.Column<string>(type: "text", nullable: true),
                    Url = table.Column<string>(type: "text", nullable: true),
                    SourceReleaseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    SourcePrintedTotal = table.Column<int>(type: "integer", nullable: true),
                    SourceOfficialTotal = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardSetExternalIds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CardSetExternalIds_CardSets_CardSetId",
                        column: x => x.CardSetId,
                        principalTable: "CardSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PendingSetMappings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IncomingSource = table.Column<string>(type: "text", nullable: false),
                    IncomingLanguage = table.Column<string>(type: "text", nullable: false),
                    IncomingExternalId = table.Column<string>(type: "text", nullable: false),
                    IncomingName = table.Column<string>(type: "text", nullable: false),
                    IncomingReleaseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IncomingPrintedTotal = table.Column<int>(type: "integer", nullable: true),
                    IncomingOfficialTotal = table.Column<int>(type: "integer", nullable: true),
                    SuggestedCardSetId = table.Column<Guid>(type: "uuid", nullable: true),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    ReasonsJson = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PendingSetMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PendingSetMappings_CardSets_SuggestedCardSetId",
                        column: x => x.SuggestedCardSetId,
                        principalTable: "CardSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SetMappings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardSetId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    Confidence = table.Column<string>(type: "text", nullable: false),
                    IsManual = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SetMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SetMappings_CardSets_CardSetId",
                        column: x => x.CardSetId,
                        principalTable: "CardSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SetRelations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceSetId = table.Column<Guid>(type: "uuid", nullable: false),
                    TargetSetId = table.Column<Guid>(type: "uuid", nullable: false),
                    RelationType = table.Column<string>(type: "text", nullable: false),
                    Confidence = table.Column<string>(type: "text", nullable: false),
                    IsManual = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SetRelations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SetRelations_CardSets_SourceSetId",
                        column: x => x.SourceSetId,
                        principalTable: "CardSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SetRelations_CardSets_TargetSetId",
                        column: x => x.TargetSetId,
                        principalTable: "CardSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CardSetExternalIds_CardSetId",
                table: "CardSetExternalIds",
                column: "CardSetId");

            migrationBuilder.CreateIndex(
                name: "IX_CardSetExternalIds_Source_Language_ExternalId",
                table: "CardSetExternalIds",
                columns: new[] { "Source", "Language", "ExternalId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardSets_CanonicalName",
                table: "CardSets",
                column: "CanonicalName");

            migrationBuilder.CreateIndex(
                name: "IX_CardSets_ReleaseDate",
                table: "CardSets",
                column: "ReleaseDate");

            migrationBuilder.CreateIndex(
                name: "IX_PendingSetMappings_IncomingSource_IncomingLanguage_Incoming~",
                table: "PendingSetMappings",
                columns: new[] { "IncomingSource", "IncomingLanguage", "IncomingExternalId" });

            migrationBuilder.CreateIndex(
                name: "IX_PendingSetMappings_Status",
                table: "PendingSetMappings",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PendingSetMappings_SuggestedCardSetId",
                table: "PendingSetMappings",
                column: "SuggestedCardSetId");

            migrationBuilder.CreateIndex(
                name: "IX_SetMappings_CardSetId",
                table: "SetMappings",
                column: "CardSetId");

            migrationBuilder.CreateIndex(
                name: "IX_SetMappings_Source_Language_ExternalId",
                table: "SetMappings",
                columns: new[] { "Source", "Language", "ExternalId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SetRelations_SourceSetId_TargetSetId_RelationType",
                table: "SetRelations",
                columns: new[] { "SourceSetId", "TargetSetId", "RelationType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SetRelations_TargetSetId",
                table: "SetRelations",
                column: "TargetSetId");

            migrationBuilder.AddForeignKey(
                name: "FK_CardPrints_CardSets_CardSetId",
                table: "CardPrints",
                column: "CardSetId",
                principalTable: "CardSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardPrints_CardSets_CardSetId",
                table: "CardPrints");

            migrationBuilder.DropTable(
                name: "CardSetExternalIds");

            migrationBuilder.DropTable(
                name: "PendingSetMappings");

            migrationBuilder.DropTable(
                name: "SetMappings");

            migrationBuilder.DropTable(
                name: "SetRelations");

            migrationBuilder.DropTable(
                name: "CardSets");

            migrationBuilder.RenameColumn(
                name: "CardSetId",
                table: "CardPrints",
                newName: "SetId");

            migrationBuilder.RenameIndex(
                name: "IX_CardPrints_CardSetId",
                table: "CardPrints",
                newName: "IX_CardPrints_SetId");

            migrationBuilder.CreateTable(
                name: "Sets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardCount = table.Column<int>(type: "integer", nullable: true),
                    CardLanguage = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Series = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SetExternalIds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SetId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SetExternalIds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SetExternalIds_Sets_SetId",
                        column: x => x.SetId,
                        principalTable: "Sets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SetExternalIds_SetId",
                table: "SetExternalIds",
                column: "SetId");

            migrationBuilder.CreateIndex(
                name: "IX_SetExternalIds_Source_ExternalId_Language",
                table: "SetExternalIds",
                columns: new[] { "Source", "ExternalId", "Language" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CardPrints_Sets_SetId",
                table: "CardPrints",
                column: "SetId",
                principalTable: "Sets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
