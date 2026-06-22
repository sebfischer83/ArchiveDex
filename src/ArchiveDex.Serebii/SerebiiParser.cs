using System.Net;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using ArchiveDex.Serebii.Models;

namespace ArchiveDex.Serebii
{
    public static class SerebiiParser
    {
        private const string BaseUrl = "https://www.serebii.net";

        private static string? AbsoluteUrl(string? relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
            {
                return null;
            }

            if (Uri.TryCreate(relativeUrl, UriKind.Absolute, out Uri? absolute)
                && (absolute.Scheme == Uri.UriSchemeHttp || absolute.Scheme == Uri.UriSchemeHttps))
            {
                return absolute.ToString();
            }

            return new Uri(new Uri(BaseUrl), relativeUrl).ToString();
        }

        public static List<SerebiiSet> ParseSets(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var sets = new List<SerebiiSet>();
            HtmlNodeCollection? rows = doc.DocumentNode.SelectNodes("//table//tr");
            if (rows is null)
            {
                return sets;
            }

            foreach (HtmlNode row in rows)
            {
                HtmlNodeCollection? tds = row.SelectNodes("./td");
                if (tds is null || tds.Count < 4)
                {
                    continue;
                }

                // English layout has 5 columns (Logo, Icon, Name, Count, Date);
                // Japanese layout has 4 columns (Logo, Name, Count, Date) with no icon cell.
                var hasIconColumn = tds.Count >= 5;
                var nameIndex = hasIconColumn ? 2 : 1;
                var countIndex = nameIndex + 1;
                var dateIndex = nameIndex + 2;

                HtmlNode? nameLink = tds[nameIndex].SelectSingleNode(".//a");
                if (nameLink is null)
                {
                    continue;
                }

                var href = nameLink.GetAttributeValue("href", "");
                var slug = href.Trim('/').Split('/').Last();
                var name = WebUtility.HtmlDecode(nameLink.InnerText.Trim());

                HtmlNode logoImg = tds[0].SelectSingleNode(".//img");
                var logoUrl = logoImg?.GetAttributeValue("src", "");

                var thumbUrl = hasIconColumn
                    ? tds[1].SelectSingleNode(".//img")?.GetAttributeValue("src", "")
                    : null;

                var cardCountText = WebUtility.HtmlDecode(tds[countIndex].InnerText.Trim());
                _ = int.TryParse(cardCountText, out var cardCount);

                HtmlNode dateLink = tds[dateIndex].SelectSingleNode(".//a");
                var releaseDate = WebUtility.HtmlDecode(dateLink?.InnerText.Trim() ?? tds[dateIndex].InnerText.Trim());

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
            HtmlNode? table = doc.DocumentNode.SelectSingleNode("//table[contains(@class,'dextable')]");
            if (table is null)
            {
                return cards;
            }

            IEnumerable<HtmlNode> rows = table.SelectNodes(".//tr") ?? Enumerable.Empty<HtmlNode>();

            foreach (HtmlNode row in rows)
            {
                HtmlNodeCollection? tds = row.SelectNodes("./td");
                if (tds is null || tds.Count < 4)
                {
                    continue;
                }

                HtmlNode setCell = tds[0];
                HtmlNode? setLink = setCell.SelectSingleNode(".//a");
                if (setLink is null)
                {
                    continue;
                }

                var setName = WebUtility.HtmlDecode(setLink.InnerText.Trim());
                var setHref = setLink.GetAttributeValue("href", "");
                var setSlug = setHref.Trim('/').Split('/').Last().Split('.').First();

                var cellText = WebUtility.HtmlDecode(setCell.InnerText.Trim());
                Match numberMatch = Regex.Match(cellText, @"(\d+)\s*/\s*(\d+)");
                if (!numberMatch.Success)
                {
                    continue;
                }

                var number = numberMatch.Groups[1].Value;
                var totalCards = int.Parse(numberMatch.Groups[2].Value);

                HtmlNode rarityImg = setCell.SelectSingleNode(".//img");
                var raritySrc = rarityImg?.GetAttributeValue("src", "");
                var rarity = string.IsNullOrEmpty(raritySrc)
                    ? null
                    : Path.GetFileNameWithoutExtension(raritySrc);

                HtmlNode nameCell = tds[2];
                HtmlNode? nameLink = nameCell.SelectSingleNode(".//a");
                var cardName = WebUtility.HtmlDecode(nameLink?.InnerText.Trim() ?? nameCell.InnerText.Trim());

                var detailHref = nameLink?.GetAttributeValue("href", "") ?? "";

                HtmlNode thumbCell = tds[1];
                HtmlNode thumbImg = thumbCell.SelectSingleNode(".//img");
                var thumbUrl = thumbImg?.GetAttributeValue("src", "");

                HtmlNode detailsCell = tds[3];
                HtmlNode? detailsTable = detailsCell.SelectSingleNode(".//table");
                int? hp = null;
                string? type = null;
                string? weakness = null;
                string? resistance = null;
                int? retreatCost = null;

                if (detailsTable is not null)
                {
                    IEnumerable<HtmlNode> detailChildren = detailsTable.SelectNodes("./tr|./td") ?? Enumerable.Empty<HtmlNode>();
                    var allDetailTds = new List<HtmlNode>();

                    foreach (HtmlNode child in detailChildren)
                    {
                        if (child.Name.Equals("tr", StringComparison.OrdinalIgnoreCase))
                        {
                            HtmlNodeCollection? innerTds = child.SelectNodes("./td");
                            if (innerTds is not null)
                            {
                                allDetailTds.AddRange(innerTds);
                            }
                        }
                        else if (child.Name.Equals("td", StringComparison.OrdinalIgnoreCase))
                        {
                            allDetailTds.Add(child);
                        }
                    }

                    var statTds = new List<(string? text, List<string> imgs)>();
                    foreach (HtmlNode dTd in allDetailTds)
                    {
                        var text = WebUtility.HtmlDecode(dTd.InnerText).Trim();
                        var colspan = dTd.GetAttributeValue("colspan", "");

                        if (colspan == "3")
                        {
                            Match hpMatch = Regex.Match(text, @"(\d+)\s*HP", RegexOptions.IgnoreCase);
                            if (hpMatch.Success)
                            {
                                hp = int.Parse(hpMatch.Groups[1].Value);
                            }

                            HtmlNode? typeImg = dTd.SelectSingleNode(".//img");
                            if (typeImg is not null)
                            {
                                type = Path.GetFileNameWithoutExtension(typeImg.GetAttributeValue("src", ""));
                            }

                            continue;
                        }

                        if (text is "Weakness" or "Resistance" or "Retreat Cost")
                        {
                            statTds.Clear();
                            continue;
                        }

                        HtmlNodeCollection? imgNodes = dTd.SelectNodes("./img");
                        List<string> imgNames = imgNodes is not null
                            ? [.. imgNodes.Select(i => Path.GetFileNameWithoutExtension(i.GetAttributeValue("src", "")))]
                            : [];

                        statTds.Add((string.IsNullOrEmpty(text) ? null : text, imgNames));
                    }

                    if (statTds.Count >= 1)
                    {
                        weakness = statTds[0].imgs.FirstOrDefault() ?? statTds[0].text;
                    }

                    if (statTds.Count >= 2)
                    {
                        resistance = statTds[1].imgs.FirstOrDefault() ?? statTds[1].text;
                    }

                    if (statTds.Count >= 3)
                    {
                        List<string> retreatImgs = statTds[2].imgs;
                        retreatCost = retreatImgs.Count > 0 ? retreatImgs.Count : null;
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

        public static string? ParseCardDetailImage(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            HtmlNode? ogImage = doc.DocumentNode.SelectSingleNode("//meta[@property='og:image']");
            var imageUrl = ogImage?.GetAttributeValue("content", "");
            if (!string.IsNullOrWhiteSpace(imageUrl))
            {
                return imageUrl;
            }

            HtmlNode? cardImg = doc.DocumentNode.SelectSingleNode("//td[contains(@class,'foocard')]//img[contains(@class,'card')]");
            return AbsoluteUrl(cardImg?.GetAttributeValue("src", ""));
        }

        public static string? ParseCardDetailIllustrator(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Layout: <td ...>Illustration: <a href="...">Susumu Maeya</a></td>
            HtmlNode? cell = doc.DocumentNode.SelectSingleNode("//td[starts-with(normalize-space(.),'Illustration:')]");
            if (cell is null)
            {
                return null;
            }

            HtmlNode? link = cell.SelectSingleNode(".//a");
            var raw = link is not null ? link.InnerText : cell.InnerText.Replace("Illustration:", "", StringComparison.OrdinalIgnoreCase);
            var illustrator = WebUtility.HtmlDecode(raw).Trim();
            return string.IsNullOrWhiteSpace(illustrator) ? null : illustrator;
        }
    }
}
