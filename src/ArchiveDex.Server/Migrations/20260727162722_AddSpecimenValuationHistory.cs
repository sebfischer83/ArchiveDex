using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSpecimenValuationHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ValuationRefreshJob_Counts",
                table: "ValuationRefreshJobs");

            migrationBuilder.AddColumn<int>(
                name: "HeldCards",
                table: "ValuationRefreshJobs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValuationReviewPendingAt",
                table: "CardSpecimens",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SpecimenValuationHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CardSpecimenId = table.Column<Guid>(type: "uuid", nullable: false),
                    AmountMinor = table.Column<long>(type: "bigint", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    ValuedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MarketDataAsOf = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Provider = table.Column<string>(type: "text", nullable: false),
                    Method = table.Column<string>(type: "text", nullable: false),
                    Confidence = table.Column<string>(type: "text", nullable: true),
                    ConditionApplied = table.Column<bool>(type: "boolean", nullable: true),
                    SourceUrlsJson = table.Column<string>(type: "jsonb", nullable: true),
                    Outcome = table.Column<string>(type: "text", nullable: false),
                    HoldReason = table.Column<string>(type: "text", nullable: true),
                    PreviousAmountMinor = table.Column<long>(type: "bigint", nullable: true),
                    ValuationRefreshJobId = table.Column<Guid>(type: "uuid", nullable: true),
                    RecordedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecimenValuationHistories", x => x.Id);
                    table.CheckConstraint("CK_SpecimenValuationHistory_Amount", "\"AmountMinor\" >= 0 AND \"Currency\" = 'EUR'");
                    table.CheckConstraint("CK_SpecimenValuationHistory_Outcome", "\"Outcome\" IN ('accepted', 'heldForReview', 'rejected')");
                    table.ForeignKey(
                        name: "FK_SpecimenValuationHistories_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecimenValuationHistories_CardSpecimens_CardSpecimenId",
                        column: x => x.CardSpecimenId,
                        principalTable: "CardSpecimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecimenValuationHistories_ValuationRefreshJobs_ValuationRe~",
                        column: x => x.ValuationRefreshJobId,
                        principalTable: "ValuationRefreshJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_ValuationRefreshJob_Counts",
                table: "ValuationRefreshJobs",
                sql: "\"TotalCards\" >= 0 AND \"ProcessedCards\" >= 0 AND \"UpdatedCards\" >= 0 AND \"UnavailableCards\" >= 0 AND \"FailedCards\" >= 0 AND \"HeldCards\" >= 0");

            migrationBuilder.CreateIndex(
                name: "IX_SpecimenValuationHistories_CardSpecimenId",
                table: "SpecimenValuationHistories",
                column: "CardSpecimenId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecimenValuationHistories_OwnerId_CardSpecimenId_RecordedAt",
                table: "SpecimenValuationHistories",
                columns: new[] { "OwnerId", "CardSpecimenId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_SpecimenValuationHistories_ValuationRefreshJobId",
                table: "SpecimenValuationHistories",
                column: "ValuationRefreshJobId");

            // Seed one accepted entry per already-valued specimen. Without it the guard has nothing
            // to compare against on the first refresh after deployment and would wave everything
            // through. CK_CardSpecimen_Valuation already guarantees that currency, timestamps,
            // provider and method are populated whenever an amount is present.
            migrationBuilder.Sql("""
                INSERT INTO "SpecimenValuationHistories" (
                    "Id", "OwnerId", "CardSpecimenId", "AmountMinor", "Currency", "ValuedAt",
                    "MarketDataAsOf", "Provider", "Method", "Confidence", "ConditionApplied",
                    "SourceUrlsJson", "Outcome", "HoldReason", "PreviousAmountMinor",
                    "ValuationRefreshJobId", "RecordedAt")
                SELECT
                    gen_random_uuid(), s."OwnerId", s."Id", s."ValuationAmountMinor",
                    s."ValuationCurrency", s."ValuedAt", s."MarketDataAsOf", s."ValuationProvider",
                    s."ValuationMethod", s."ValuationConfidence", s."ConditionAppliedToValuation",
                    s."ValuationSourceUrlsJson", 'accepted', NULL, NULL, NULL, s."ValuedAt"
                FROM "CardSpecimens" s
                WHERE s."ValuationAmountMinor" IS NOT NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpecimenValuationHistories");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ValuationRefreshJob_Counts",
                table: "ValuationRefreshJobs");

            migrationBuilder.DropColumn(
                name: "HeldCards",
                table: "ValuationRefreshJobs");

            migrationBuilder.DropColumn(
                name: "ValuationReviewPendingAt",
                table: "CardSpecimens");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ValuationRefreshJob_Counts",
                table: "ValuationRefreshJobs",
                sql: "\"TotalCards\" >= 0 AND \"ProcessedCards\" >= 0 AND \"UpdatedCards\" >= 0 AND \"UnavailableCards\" >= 0 AND \"FailedCards\" >= 0");
        }
    }
}
