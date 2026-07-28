using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCardCropVariant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "CropConfidence",
                table: "ImageAssets",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "CroppedContent",
                table: "ImageAssets",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "CroppedSha256",
                table: "ImageAssets",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "CroppedThumbnail",
                table: "ImageAssets",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_ImageAsset_Crop",
                table: "ImageAssets",
                sql: "(\"CroppedContent\" IS NULL AND \"CroppedThumbnail\" IS NULL AND \"CroppedSha256\" IS NULL) OR (\"CroppedContent\" IS NOT NULL AND \"CroppedThumbnail\" IS NOT NULL AND octet_length(\"CroppedSha256\") = 32)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ImageAsset_Crop",
                table: "ImageAssets");

            migrationBuilder.DropColumn(
                name: "CropConfidence",
                table: "ImageAssets");

            migrationBuilder.DropColumn(
                name: "CroppedContent",
                table: "ImageAssets");

            migrationBuilder.DropColumn(
                name: "CroppedSha256",
                table: "ImageAssets");

            migrationBuilder.DropColumn(
                name: "CroppedThumbnail",
                table: "ImageAssets");
        }
    }
}
