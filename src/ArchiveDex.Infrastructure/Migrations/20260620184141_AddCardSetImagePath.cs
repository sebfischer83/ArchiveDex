using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCardSetImagePath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) => migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "CardSets",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true);

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) => migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "CardSets");
    }
}
