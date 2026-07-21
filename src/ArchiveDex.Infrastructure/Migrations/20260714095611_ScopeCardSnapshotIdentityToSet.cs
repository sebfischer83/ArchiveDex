using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ScopeCardSnapshotIdentityToSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalCar~",
                table: "SourceCardSnapshots");

            migrationBuilder.CreateIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalSe~1",
                table: "SourceCardSnapshots",
                columns: new[] { "ImportRunId", "Source", "Language", "ExternalSetId", "ExternalCardId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalSe~1",
                table: "SourceCardSnapshots");

            migrationBuilder.CreateIndex(
                name: "IX_SourceCardSnapshots_ImportRunId_Source_Language_ExternalCar~",
                table: "SourceCardSnapshots",
                columns: new[] { "ImportRunId", "Source", "Language", "ExternalCardId" },
                unique: true);
        }
    }
}
