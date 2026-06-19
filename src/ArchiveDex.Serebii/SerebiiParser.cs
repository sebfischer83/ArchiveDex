using System.Net;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using ArchiveDex.Serebii.Models;

namespace ArchiveDex.Serebii;

public static class SerebiiParser
{
    private const string BaseUrl = "https://www.serebii.net";

    private static string? AbsoluteUrl(string? relativeUrl)
    {
        if (string.IsNullOrWhiteSpace(relativeUrl)) return null;
        if (Uri.TryCreate(relativeUrl, UriKind.Absolute, out var absolute)) return absolute.ToString();
        return new Uri(new Uri(BaseUrl), relativeUrl).ToString();
    }

    public static List<SerebiiSet> ParseSets(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var sets = new List<SerebiiSet>();
        var rows = doc.DocumentNode.SelectNodes("//table//tr");
        if (rows is null) return sets;

        foreach (var row in rows)
        {
            var tds = row.SelectNodes("./td");
            if (tds is null || tds.Count < 5) continue;

            var nameLink = tds[2].SelectSingleNode(".//a");
            if (nameLink is null) continue;

            var href = nameLink.GetAttributeValue("href", "");
            var slug = href.Trim('/').Split('/').Last();
            var name = WebUtility.HtmlDecode(nameLink.InnerText.Trim());

            var logoImg = tds[0].SelectSingleNode(".//img");
            var logoUrl = logoImg?.GetAttributeValue("src", "");

            var thumbImg = tds[1].SelectSingleNode(".//img");
            var thumbUrl = thumbImg?.GetAttributeValue("src", "");

            var cardCountText = WebUtility.HtmlDecode(tds[3].InnerText.Trim());
            int.TryParse(cardCountText, out var cardCount);

            var dateLink = tds[4].SelectSingleNode(".//a");
            var releaseDate = WebUtility.HtmlDecode(dateLink?.InnerText.Trim() ?? tds[4].InnerText.Trim());

            sets.Add(new SerebiiSet(
                Slug: slug,
                Name: name,
                CardCount: cardCount,
                ReleaseDate: string.IsNullOrWhiteSpace(releaseDate) ? null : releaseDate,
                LogoUrl: AbsoluteUrl(logoUrl),
                ThumbUrl: AbsoluteUrl(thumbUrl),
                Url: AbsoluteUrl(href) ?? BaseUrl
            ));
        }

        return sets;
    }

    public static List<SerebiiCard> ParseCards(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var cards = new List<SerebiiCard>();
        var table = doc.DocumentNode.SelectSingleNode("//table[contains(@class,'dextable')]");
        if (table is null) return cards;

        var rows = table.SelectNodes(".//tr") ?? Enumerable.Empty<HtmlNode>();

        foreach (var row in rows)
        {
            var tds = row.SelectNodes("./td");
            if (tds is null || tds.Count < 4) continue;

            var setCell = tds[0];
            var setLink = setCell.SelectSingleNode(".//a");
            if (setLink is null) continue;

            var setName = WebUtility.HtmlDecode(setLink.InnerText.Trim());
            var setHref = setLink.GetAttributeValue("href", "");
            var setSlug = setHref.Trim('/').Split('/').Last().Split('.').First();

            var cellText = WebUtility.HtmlDecode(setCell.InnerText.Trim());
            var numberMatch = Regex.Match(cellText, @"(\d+)\s*/\s*(\d+)");
            if (!numberMatch.Success) continue;

            var number = numberMatch.Groups[1].Value;
            var totalCards = int.Parse(numberMatch.Groups[2].Value);

            var rarityImg = setCell.SelectSingleNode(".//img");
            var raritySrc = rarityImg?.GetAttributeValue("src", "");
            var rarity = string.IsNullOrEmpty(raritySrc)
                ? null
                : Path.GetFileNameWithoutExtension(raritySrc);

            var nameCell = tds[2];
            var nameLink = nameCell.SelectSingleNode(".//a");
            var cardName = WebUtility.HtmlDecode(nameLink?.InnerText.Trim() ?? nameCell.InnerText.Trim());

            var detailHref = nameLink?.GetAttributeValue("href", "") ?? "";

            var thumbCell = tds[1];
            var thumbImg = thumbCell.SelectSingleNode(".//img");
            var thumbUrl = thumbImg?.GetAttributeValue("src", "");

            var detailsCell = tds[3];
            var detailsTable = detailsCell.SelectSingleNode(".//table");
            int? hp = null;
            string? type = null;
            string? weakness = null;
            string? resistance = null;
            int? retreatCost = null;

            if (detailsTable is not null)
            {
                var detailChildren = detailsTable.SelectNodes("./tr|./td") ?? Enumerable.Empty<HtmlNode>();
                var allDetailTds = new List<HtmlNode>();

                foreach (var child in detailChildren)
                {
                    if (child.Name.Equals("tr", StringComparison.OrdinalIgnoreCase))
                    {
                        var innerTds = child.SelectNodes("./td");
                        if (innerTds is not null)
                            allDetailTds.AddRange(innerTds);
                    }
                    else if (child.Name.Equals("td", StringComparison.OrdinalIgnoreCase))
                    {
                        allDetailTds.Add(child);
                    }
                }

                var statTds = new List<(string? text, List<string> imgs)>();
                foreach (var dTd in allDetailTds)
                {
                    var text = WebUtility.HtmlDecode(dTd.InnerText).Trim();
                    var colspan = dTd.GetAttributeValue("colspan", "");

                    if (colspan == "3")
                    {
                        var hpMatch = Regex.Match(text, @"(\d+)\s*HP", RegexOptions.IgnoreCase);
                        if (hpMatch.Success)
                            hp = int.Parse(hpMatch.Groups[1].Value);

                        var typeImg = dTd.SelectSingleNode(".//img");
                        if (typeImg is not null)
                            type = Path.GetFileNameWithoutExtension(typeImg.GetAttributeValue("src", ""));
                        continue;
                    }

                    if (text is "Weakness" or "Resistance" or "Retreat Cost")
                    {
                        statTds.Clear();
                        continue;
                    }

                    var imgNodes = dTd.SelectNodes("./img");
                    var imgNames = imgNodes is not null
                        ? imgNodes.Select(i => Path.GetFileNameWithoutExtension(i.GetAttributeValue("src", ""))).ToList()
                        : new List<string>();

                    statTds.Add((string.IsNullOrEmpty(text) ? null : text, imgNames));
                }

                if (statTds.Count >= 1)
                    weakness = statTds[0].imgs.FirstOrDefault() ?? statTds[0].text;

                if (statTds.Count >= 2)
                    resistance = statTds[1].imgs.FirstOrDefault() ?? statTds[1].text;

                if (statTds.Count >= 3)
                {
                    var retreatImgs = statTds[2].imgs;
                    retreatCost = retreatImgs.Count > 0 ? retreatImgs.Count : (int?)null;
                }
            }

            cards.Add(new SerebiiCard(
                SetSlug: setSlug,
                Number: number,
                TotalCards: totalCards,
                Name: cardName,
                Rarity: rarity,
                Hp: hp,
                Type: type,
                Weakness: weakness,
                Resistance: resistance,
                RetreatCost: retreatCost,
                ThumbUrl: AbsoluteUrl(thumbUrl),
                DetailUrl: AbsoluteUrl(detailHref),
                SetName: setName
            ));
        }

        return cards;
    }
}
