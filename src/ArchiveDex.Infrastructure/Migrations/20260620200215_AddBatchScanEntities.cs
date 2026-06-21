using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBatchScanEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BatchScanJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BatchScanJobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BatchScanItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BatchScanJobId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: true),
                    OcrResultId = table.Column<Guid>(type: "uuid", nullable: true),
                    MatchedCardPrintId = table.Column<Guid>(type: "uuid", nullable: true),
                    MatchStatus = table.Column<string>(type: "text", nullable: false),
                    IsReviewed = table.Column<bool>(type: "boolean", nullable: false),
                    CollectionEntryId = table.Column<Guid>(type: "uuid", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    FailureReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BatchScanItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BatchScanItems_BatchScanJobs_BatchScanJobId",
                        column: x => x.BatchScanJobId,
                        principalTable: "BatchScanJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BatchScanItems_CardPrints_MatchedCardPrintId",
                        column: x => x.MatchedCardPrintId,
                        principalTable: "CardPrints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_BatchScanItems_CollectionEntries_CollectionEntryId",
                        column: x => x.CollectionEntryId,
                        principalTable: "CollectionEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_BatchScanItems_ImageAssets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalTable: "ImageAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BatchScanResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BatchScanItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    DetectedNumber = table.Column<string>(type: "text", nullable: true),
                    DetectedName = table.Column<string>(type: "text", nullable: true),
                    DetectedCardLanguage = table.Column<string>(type: "text", nullable: true),
                    DetectedSetHint = table.Column<string>(type: "text", nullable: true),
                    Confidence = table.Column<float>(type: "real", nullable: true),
                    RawText = table.Column<string>(type: "text", nullable: true),
                    CandidateMatches = table.Column<string>(type: "text", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BatchScanResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BatchScanResults_BatchScanItems_BatchScanItemId",
                        column: x => x.BatchScanItemId,
                        principalTable: "BatchScanItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BatchScanItems_BatchScanJobId",
                table: "BatchScanItems",
                column: "BatchScanJobId");

            migrationBuilder.CreateIndex(
                name: "IX_BatchScanItems_CollectionEntryId",
                table: "BatchScanItems",
                column: "CollectionEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_BatchScanItems_ImageAssetId",
                table: "BatchScanItems",
                column: "ImageAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_BatchScanItems_MatchedCardPrintId",
                table: "BatchScanItems",
                column: "MatchedCardPrintId");

            migrationBuilder.CreateIndex(
                name: "IX_BatchScanItems_MatchStatus",
                table: "BatchScanItems",
                column: "MatchStatus");

            migrationBuilder.CreateIndex(
                name: "IX_BatchScanResults_BatchScanItemId",
                table: "BatchScanResults",
                column: "BatchScanItemId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BatchScanResults");

            migrationBuilder.DropTable(
                name: "BatchScanItems");

            migrationBuilder.DropTable(
                name: "BatchScanJobs");
        }
    }
}
