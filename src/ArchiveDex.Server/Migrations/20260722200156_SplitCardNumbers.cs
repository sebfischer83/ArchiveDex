using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class SplitCardNumbers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CollectorNumber",
                table: "CatalogCardReferences",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SetTotal",
                table: "CatalogCardReferences",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CollectorNumber",
                table: "CardRecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SetTotal",
                table: "CardRecords",
                type: "text",
                nullable: true);

            migrationBuilder.DropIndex(
                name: "IX_CardRecords_OwnerId_SetEditionId_NumberNormalized_VariantKey",
                table: "CardRecords");

            migrationBuilder.Sql(
                """
                UPDATE "CatalogCardReferences"
                SET "CollectorNumber" = btrim(CASE
                        WHEN strpos("PrintedNumber", '/') > 0 THEN split_part("PrintedNumber", '/', 1)
                        ELSE "PrintedNumber"
                    END),
                    "SetTotal" = CASE
                        WHEN strpos("PrintedNumber", '/') > 0
                            THEN nullif(btrim(substr("PrintedNumber", strpos("PrintedNumber", '/') + 1)), '')
                        ELSE NULL
                    END,
                    "NumberNormalized" = lower(regexp_replace(CASE
                        WHEN strpos("PrintedNumber", '/') > 0 THEN split_part("PrintedNumber", '/', 1)
                        ELSE "PrintedNumber"
                    END, '[^[:alnum:]]', '', 'g'));

                UPDATE "CardRecords"
                SET "CollectorNumber" = btrim(CASE
                        WHEN strpos("PrintedNumber", '/') > 0 THEN split_part("PrintedNumber", '/', 1)
                        ELSE "PrintedNumber"
                    END),
                    "SetTotal" = CASE
                        WHEN strpos("PrintedNumber", '/') > 0
                            THEN nullif(btrim(substr("PrintedNumber", strpos("PrintedNumber", '/') + 1)), '')
                        ELSE NULL
                    END,
                    "NumberNormalized" = lower(regexp_replace(CASE
                        WHEN strpos("PrintedNumber", '/') > 0 THEN split_part("PrintedNumber", '/', 1)
                        ELSE "PrintedNumber"
                    END, '[^[:alnum:]]', '', 'g')),
                    "NumberSortKey" = lpad(lower(regexp_replace(CASE
                        WHEN strpos("PrintedNumber", '/') > 0 THEN split_part("PrintedNumber", '/', 1)
                        ELSE "PrintedNumber"
                    END, '[^[:alnum:]]', '', 'g')), 50, '0');

                CREATE TEMP TABLE "CardRecordNumberMerge" ON COMMIT DROP AS
                SELECT "Id" AS "SourceId",
                    first_value("Id") OVER (
                        PARTITION BY "OwnerId", "SetEditionId", "NumberNormalized", "VariantKey"
                        ORDER BY "CreatedAt", "Id") AS "TargetId"
                FROM "CardRecords";

                UPDATE "CardSpecimens" AS specimen
                SET "CardRecordId" = merge."TargetId"
                FROM "CardRecordNumberMerge" AS merge
                WHERE specimen."CardRecordId" = merge."SourceId"
                    AND merge."SourceId" <> merge."TargetId";

                UPDATE "FinalizationRecords" AS finalization
                SET "CardRecordId" = merge."TargetId"
                FROM "CardRecordNumberMerge" AS merge
                WHERE finalization."CardRecordId" = merge."SourceId"
                    AND merge."SourceId" <> merge."TargetId";

                DELETE FROM "CardRecords" AS card
                USING "CardRecordNumberMerge" AS merge
                WHERE card."Id" = merge."SourceId"
                    AND merge."SourceId" <> merge."TargetId";
                """);

            migrationBuilder.AlterColumn<string>(
                name: "CollectorNumber",
                table: "CatalogCardReferences",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CollectorNumber",
                table: "CardRecords",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardRecords_OwnerId_SetEditionId_NumberNormalized_VariantKey",
                table: "CardRecords",
                columns: new[] { "OwnerId", "SetEditionId", "NumberNormalized", "VariantKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CardRecords_OwnerId_SetEditionId_NumberNormalized_VariantKey",
                table: "CardRecords");

            migrationBuilder.Sql(
                """
                UPDATE "CatalogCardReferences"
                SET "NumberNormalized" = lower(regexp_replace("PrintedNumber", '[^[:alnum:]]', '', 'g'));

                UPDATE "CardRecords"
                SET "NumberNormalized" = lower(regexp_replace("PrintedNumber", '[^[:alnum:]]', '', 'g')),
                    "NumberSortKey" = lpad(lower(regexp_replace("PrintedNumber", '[^[:alnum:]]', '', 'g')), 50, '0');
                """);

            migrationBuilder.CreateIndex(
                name: "IX_CardRecords_OwnerId_SetEditionId_NumberNormalized_VariantKey",
                table: "CardRecords",
                columns: new[] { "OwnerId", "SetEditionId", "NumberNormalized", "VariantKey" },
                unique: true);

            migrationBuilder.DropColumn(
                name: "CollectorNumber",
                table: "CatalogCardReferences");

            migrationBuilder.DropColumn(
                name: "SetTotal",
                table: "CatalogCardReferences");

            migrationBuilder.DropColumn(
                name: "CollectorNumber",
                table: "CardRecords");

            migrationBuilder.DropColumn(
                name: "SetTotal",
                table: "CardRecords");
        }
    }
}
