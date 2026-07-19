using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Collection;

[ApiController]
[Route("api/v1")]
public class CollectionController(ArchiveDexDbContext db) : ControllerBase
{
    [HttpGet("sets")]
    public async Task<IActionResult> ListSets(CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var sets = await db.SetEditions
            .Where(x => x.OwnerId == ownerId)
            .GroupJoin(db.CardRecords.Where(c => c.OwnerId == ownerId),
                s => s.Id, c => c.SetEditionId,
                (s, cards) => new
                {
                    s.Id, s.SetIdentifier, s.Name, s.LanguageCode,
                    distinctCardCount = cards.Count(),
                    specimenCount = cards.Sum(c => c.Specimens.Count),
                })
            .ToListAsync(ct);

        return Ok(new { items = sets });
    }

    [HttpGet("sets/{setEditionId:guid}/cards")]
    public async Task<IActionResult> ListCards(Guid setEditionId, CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var cards = await db.CardRecords
            .Where(x => x.OwnerId == ownerId && x.SetEditionId == setEditionId)
            .Select(x => new
            {
                x.Id, x.OriginalName, x.GermanName,
                x.PrintedNumber, x.VariantKey,
                specimenCount = x.Specimens.Count,
                thumbnailUrl = $"/api/v1/specimens/{x.Specimens.OrderBy(s => s.Id).Select(s => s.Id).FirstOrDefault()}/image?size=thumbnail",
            })
            .ToListAsync(ct);

        return Ok(new { items = cards });
    }

    [HttpGet("cards/{cardRecordId:guid}")]
    public async Task<IActionResult> GetCard(Guid cardRecordId, CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var card = await db.CardRecords
            .Include(x => x.Specimens)
            .FirstOrDefaultAsync(x => x.Id == cardRecordId && x.OwnerId == ownerId, ct);

        if (card is null) return NotFound();

        return Ok(new
        {
            card.Id, card.OriginalName, card.GermanName, card.GermanNameUnavailableReason,
            card.PrintedNumber, card.VariantKey,
            card.SetEdition?.SetIdentifier, card.SetEdition?.Name, card.SetEdition?.LanguageCode,
            specimens = card.Specimens.Select(s => new
            {
                s.Id, s.Condition,
                imageUrl = $"/api/v1/specimens/{s.Id}/image?size=full",
                thumbnailUrl = $"/api/v1/specimens/{s.Id}/image?size=thumbnail",
                valuation = s.ValuationAmount is not null ? new
                {
                    status = "available", amountMinor = (long?)(s.ValuationAmount * 100),
                    s.ValuationCurrency, s.ValuedAt, s.MarketDataAsOf,
                    s.ValuationProvider, s.ValuationMethod, s.ValuationConfidence,
                    s.ConditionAppliedToValuation,
                    disclaimer = "Unverbindliche Schätzung.",
                } : new { status = "unavailable" } as object,
                createdAt = s.CreatedAt,
                etag = $"\"{s.Version}\"",
            }),
            etag = $"\"{card.Version}\"",
        });
    }

    [HttpDelete("specimens/{specimenId:guid}")]
    public async Task<IActionResult> DeleteSpecimen(Guid specimenId, CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var specimen = await db.CardSpecimens
            .Include(x => x.CardRecord)
            .Include(x => x.ImageAsset)
            .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);

        if (specimen is null) return NotFound();

        var cardRecordId = specimen.CardRecordId;
        db.CardSpecimens.Remove(specimen);
        if (specimen.ImageAsset != null) db.ImageAssets.Remove(specimen.ImageAsset);

        await db.SaveChangesAsync(ct);

        var remaining = await db.CardSpecimens.AnyAsync(x => x.CardRecordId == cardRecordId, ct);
        if (!remaining)
        {
            var emptyCard = await db.CardRecords.FindAsync([cardRecordId], ct);
            if (emptyCard != null) db.CardRecords.Remove(emptyCard);
            await db.SaveChangesAsync(ct);
        }

        return NoContent();
    }

    [HttpGet("specimens/{specimenId:guid}/image")]
    public async Task<IActionResult> GetImage(Guid specimenId, [FromQuery] string size = "thumbnail", CancellationToken ct = default)
    {
        var ownerId = GetOwnerId();
        var specimen = await db.CardSpecimens
            .Include(x => x.ImageAsset)
            .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);

        if (specimen?.ImageAsset is null) return NotFound();

        var imageBytes = size == "full" ? specimen.ImageAsset.Content : specimen.ImageAsset.Thumbnail;
        return File(imageBytes, specimen.ImageAsset.ContentType);
    }

    private Guid GetOwnerId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }
}
