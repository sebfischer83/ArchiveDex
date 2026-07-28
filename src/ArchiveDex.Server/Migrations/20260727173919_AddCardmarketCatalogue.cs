using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCardmarketCatalogue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CardmarketExpansionId",
                table: "SetEditions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardmarketMatchState",
                table: "CardRecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CardmarketMatchedAt",
                table: "CardRecords",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CardmarketProductId",
                table: "CardRecords",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CardmarketImports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Kind = table.Column<string>(type: "text", nullable: false),
                    SourceCreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RecordCount = table.Column<int>(type: "integer", nullable: false),
                    ImportedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardmarketImports", x => x.Id);
                    table.CheckConstraint("CK_CardmarketImport_Kind", "\"Kind\" IN ('products', 'prices')");
                });

            migrationBuilder.CreateTable(
                name: "CardmarketPrices",
                columns: table => new
                {
                    IdProduct = table.Column<int>(type: "integer", nullable: false),
                    Avg30 = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Avg30Holo = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Avg7 = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Avg7Holo = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Trend = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    TrendHolo = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Avg = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Low = table.Column<decimal>(type: "numeric(12,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardmarketPrices", x => x.IdProduct);
                });

            migrationBuilder.CreateTable(
                name: "CardmarketProducts",
                columns: table => new
                {
                    IdProduct = table.Column<int>(type: "integer", nullable: false),
                    IdExpansion = table.Column<int>(type: "integer", nullable: false),
                    IdMetacard = table.Column<int>(type: "integer", nullable: false),
                    IdCategory = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardmarketProducts", x => x.IdProduct);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_CardRecord_CardmarketMatchState",
                table: "CardRecords",
                sql: "\"CardmarketMatchState\" IS NULL OR \"CardmarketMatchState\" IN ('unique', 'narrowSpread', 'aiResolved', 'manual', 'unresolved', 'noCandidate')");

            migrationBuilder.CreateIndex(
                name: "IX_CardmarketImports_Kind_ImportedAt",
                table: "CardmarketImports",
                columns: new[] { "Kind", "ImportedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_CardmarketProducts_IdExpansion_IdMetacard",
                table: "CardmarketProducts",
                columns: new[] { "IdExpansion", "IdMetacard" });

            migrationBuilder.CreateIndex(
                name: "IX_CardmarketProducts_IdExpansion_Name",
                table: "CardmarketProducts",
                columns: new[] { "IdExpansion", "Name" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CardmarketImports");

            migrationBuilder.DropTable(
                name: "CardmarketPrices");

            migrationBuilder.DropTable(
                name: "CardmarketProducts");

            migrationBuilder.DropCheckConstraint(
                name: "CK_CardRecord_CardmarketMatchState",
                table: "CardRecords");

            migrationBuilder.DropColumn(
                name: "CardmarketExpansionId",
                table: "SetEditions");

            migrationBuilder.DropColumn(
                name: "CardmarketMatchState",
                table: "CardRecords");

            migrationBuilder.DropColumn(
                name: "CardmarketMatchedAt",
                table: "CardRecords");

            migrationBuilder.DropColumn(
                name: "CardmarketProductId",
                table: "CardRecords");
        }
    }
}
