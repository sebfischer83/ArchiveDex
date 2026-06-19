using System.Net;
using HtmlAgilityPack;
using ArchiveDex.Limitless.Models;

namespace ArchiveDex.Limitless;

public static class LimitlessParser
{
    public static List<LimitlessSet> ParseSets(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var sets = new List<LimitlessSet>();
        var table = doc.DocumentNode.SelectSingleNode("//table[contains(@class,'sets-table')]");
        if (table is null) return sets;

        string? currentEra = null;

        foreach (var row in table.SelectNodes(".//tr") ?? Enumerable.Empty<HtmlNode>())
        {
            var subHeading = row.SelectSingleNode(".//th[contains(@class,'sub-heading')]");
            if (subHeading is not null)
            {
                currentEra = WebUtility.HtmlDecode(subHeading.InnerText.Trim());
                continue;
            }

            var link = row.SelectSingleNode(".//td[1]//a");
            if (link is null) continue;

            var href = link.GetAttributeValue("href", "");
            var codeMatch = System.Text.RegularExpressions.Regex.Match(href, @"/cards/(?:en|de|jp)/(\S+?)(?:\?|$)");
            var code = codeMatch.Success ? codeMatch.Groups[1].Value : href.Split('/').Last().Split('?')[0];

            var img = link.SelectSingleNode(".//img");
            var imageUrl = img?.GetAttributeValue("src", "");

            var codeAnnotation = link.SelectSingleNode(".//span[contains(@class,'code')]");
            var name = link.InnerText.Trim();
            if (codeAnnotation is not null) name = name.Replace(codeAnnotation.InnerText, "").Trim();

            var tds = row.SelectNodes(".//td");
            var dateLink = tds.Count > 1 ? tds[1].SelectSingleNode(".//a") : null;
            var releaseDate = dateLink?.InnerText.Trim();

            var cardsLink = tds.Count > 2 ? tds[2].SelectSingleNode(".//a") : null;
            var cardCountText = WebUtility.HtmlDecode(cardsLink?.InnerText.Trim() ?? "0");
            var cardCount = int.TryParse(cardCountText.Split(' ')[0], out var c) ? c : 0;

            string? usdPrice = null, eurPrice = null;
            if (tds.Count > 3)
            {
                usdPrice = WebUtility.HtmlDecode(tds[3].SelectSingleNode(".//a")?.InnerText.Trim());
            }
            if (tds.Count > 4)
            {
                eurPrice = WebUtility.HtmlDecode(tds[4].SelectSingleNode(".//a")?.InnerText.Trim());
            }

            sets.Add(new LimitlessSet(
                Code: code,
                Name: name,
                Era: currentEra ?? "",
                ReleaseDate: string.IsNullOrWhiteSpace(releaseDate) ? null : releaseDate,
                CardCount: cardCount,
                ImageUrl: imageUrl,
                UsdPrice: usdPrice,
                EurPrice: eurPrice,
                Url: $"https://limitlesstcg.com{href}"
            ));
        }

        return sets;
    }

    public static List<LimitlessCard> ParseCards(string html, string setCode, LimitlessLanguage language)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var cards = new List<LimitlessCard>();
        var links = doc.DocumentNode.SelectNodes("//div[contains(@class,'card-search-grid')]//a[contains(@href,'/cards/')]");
        if (links is null) return cards;

        foreach (var link in links)
        {
            var href = link.GetAttributeValue("href", "");
            var number = href.Split('/').Last();

            var img = link.SelectSingleNode(".//img");
            var imageUrl = img?.GetAttributeValue("src", "");
            var name = WebUtility.HtmlDecode(img?.GetAttributeValue("alt", "").Trim() ?? "");

            if (!string.IsNullOrEmpty(number) && !string.IsNullOrEmpty(imageUrl))
                cards.Add(new LimitlessCard(
                    Number: number,
                    ImageUrl: imageUrl,
                    SetCode: setCode,
                    Language: language,
                    Name: string.IsNullOrEmpty(name) ? null : name
                ));
        }

        return cards;
    }
}
