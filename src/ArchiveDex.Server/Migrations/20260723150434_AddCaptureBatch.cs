using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCaptureBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BatchId",
                table: "FinalizationRecords",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BatchId",
                table: "CaptureDrafts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CaptureBatches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaptureBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CaptureBatches_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FinalizationRecords_BatchId",
                table: "FinalizationRecords",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_FinalizationRecords_OwnerId_BatchId",
                table: "FinalizationRecords",
                columns: new[] { "OwnerId", "BatchId" });

            migrationBuilder.CreateIndex(
                name: "IX_CaptureDrafts_BatchId",
                table: "CaptureDrafts",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_CaptureDrafts_OwnerId_BatchId_Status",
                table: "CaptureDrafts",
                columns: new[] { "OwnerId", "BatchId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_CaptureBatches_OwnerId_ExpiresAt",
                table: "CaptureBatches",
                columns: new[] { "OwnerId", "ExpiresAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_CaptureDrafts_CaptureBatches_BatchId",
                table: "CaptureDrafts",
                column: "BatchId",
                principalTable: "CaptureBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_FinalizationRecords_CaptureBatches_BatchId",
                table: "FinalizationRecords",
                column: "BatchId",
                principalTable: "CaptureBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CaptureDrafts_CaptureBatches_BatchId",
                table: "CaptureDrafts");

            migrationBuilder.DropForeignKey(
                name: "FK_FinalizationRecords_CaptureBatches_BatchId",
                table: "FinalizationRecords");

            migrationBuilder.DropTable(
                name: "CaptureBatches");

            migrationBuilder.DropIndex(
                name: "IX_FinalizationRecords_BatchId",
                table: "FinalizationRecords");

            migrationBuilder.DropIndex(
                name: "IX_FinalizationRecords_OwnerId_BatchId",
                table: "FinalizationRecords");

            migrationBuilder.DropIndex(
                name: "IX_CaptureDrafts_BatchId",
                table: "CaptureDrafts");

            migrationBuilder.DropIndex(
                name: "IX_CaptureDrafts_OwnerId_BatchId_Status",
                table: "CaptureDrafts");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "FinalizationRecords");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "CaptureDrafts");
        }
    }
}
