using System.Net;
using HtmlAgilityPack;
using ArchiveDex.Limitless.Models;
using System.Text.RegularExpressions;

namespace ArchiveDex.Limitless
{
    public static class LimitlessParser
    {
        public static List<LimitlessSet> ParseSets(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var sets = new List<LimitlessSet>();
            HtmlNode? table = doc.DocumentNode.SelectSingleNode("//table[contains(@class,'sets-table')]");
            if (table is null)
            {
                return sets;
            }

            string? currentEra = null;

            foreach (HtmlNode row in table.SelectNodes(".//tr") ?? Enumerable.Empty<HtmlNode>())
            {
                HtmlNode? subHeading = row.SelectSingleNode(".//th[contains(@class,'sub-heading')]");
                if (subHeading is not null)
                {
                    currentEra = WebUtility.HtmlDecode(subHeading.InnerText.Trim());
                    continue;
                }

                HtmlNode? link = row.SelectSingleNode(".//td[1]//a");
                if (link is null)
                {
                    continue;
                }

                var href = link.GetAttributeValue("href", "");
                Match codeMatch = System.Text.RegularExpressions.Regex.Match(href, @"/cards/(?:en|de|jp)/(\S+?)(?:\?|$)");
                var code = codeMatch.Success ? codeMatch.Groups[1].Value : href.Split('/').Last().Split('?')[0];

                HtmlNode img = link.SelectSingleNode(".//img");
                var imageUrl = img?.GetAttributeValue("src", "");

                HtmlNode? codeAnnotation = link.SelectSingleNode(".//span[contains(@class,'code')]");
                var name = link.InnerText.Trim();
                if (codeAnnotation is not null)
                {
                    name = name.Replace(codeAnnotation.InnerText, "").Trim();
                }

                HtmlNodeCollection tds = row.SelectNodes(".//td");
                HtmlNode? dateLink = tds.Count > 1 ? tds[1].SelectSingleNode(".//a") : null;
                var releaseDate = dateLink?.InnerText.Trim();

                HtmlNode? cardsLink = tds.Count > 2 ? tds[2].SelectSingleNode(".//a") : null;
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

        public static LimitlessCardDetail? ParseCardDetail(string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Image: prefer data-src (full res) over src (LG thumbnail)
            HtmlNode? img = doc.DocumentNode.SelectSingleNode("//div[contains(@class,'card-image')]//img");
            var imageUrl = img?.GetAttributeValue("data-src", null) ?? img?.GetAttributeValue("src", null);

            // Name
            HtmlNode? nameNode = doc.DocumentNode.SelectSingleNode("//span[contains(@class,'card-text-name')]//a");
            var name = nameNode is not null ? WebUtility.HtmlDecode(nameNode.InnerText.Trim()) : null;

            // Types + HP from title line (e.g. "- Grass - 50 HP" after name)
            HtmlNode? titleNode = doc.DocumentNode.SelectSingleNode("//p[contains(@class,'card-text-title')]");
            List<string>? types = null;
            int? hp = null;
            if (titleNode is not null)
            {
                var titleClone = (HtmlNode)titleNode.CloneNode(true);
                titleClone.SelectNodes(".//span[contains(@class,'card-text-name')]")
                    ?.ToList().ForEach(n => n.Remove());
                var remainder = WebUtility.HtmlDecode(titleClone.InnerText).Trim();
                var titleParts = remainder
                    .Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                types = [];
                foreach (var part in titleParts)
                {
                    if (part.EndsWith(" HP", StringComparison.OrdinalIgnoreCase)
                        && int.TryParse(part[..^3].Trim(), out var h))
                        hp = h;
                    else
                        types.Add(part);
                }
                if (types.Count == 0) types = null;
            }

            // Category + Stage from type line (e.g. "Pokémon - Basic")
            HtmlNode? typeNode = doc.DocumentNode.SelectSingleNode("//p[contains(@class,'card-text-type')]");
            string? category = null, stage = null;
            if (typeNode is not null)
            {
                var typeParts = WebUtility.HtmlDecode(typeNode.InnerText)
                    .Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                category = typeParts.Length > 0 ? typeParts[0] : null;
                stage = typeParts.Length > 1 ? typeParts[1] : null;
            }

            // Attacks
            HtmlNodeCollection? attackNodes = doc.DocumentNode.SelectNodes("//div[contains(@class,'card-text-attack')]");
            List<LimitlessAttack>? attacks = null;
            if (attackNodes is not null)
            {
                attacks = [];
                foreach (HtmlNode attackNode in attackNodes)
                {
                    HtmlNode? infoNode = attackNode.SelectSingleNode(".//p[contains(@class,'card-text-attack-info')]");
                    HtmlNode? effectNode = attackNode.SelectSingleNode(".//p[contains(@class,'card-text-attack-effect')]");
                    if (infoNode is null) continue;

                    var costList = infoNode
                        .SelectNodes(".//span[contains(@class,'ptcg-symbol')]")
                        ?.Select(n => WebUtility.HtmlDecode(n.InnerText.Trim()))
                        .Where(s => !string.IsNullOrEmpty(s))
                        .ToList() ?? [];

                    var infoClone = (HtmlNode)infoNode.CloneNode(true);
                    foreach (HtmlNode sym in infoClone.SelectNodes(".//span") ?? Enumerable.Empty<HtmlNode>())
                        sym.Remove();
                    var infoText = WebUtility.HtmlDecode(infoClone.InnerText.Trim());

                    int? damage = null;
                    string attackName;
                    var lastSpace = infoText.LastIndexOf(' ');
                    if (lastSpace > 0 && int.TryParse(infoText[(lastSpace + 1)..], out var d))
                    {
                        damage = d;
                        attackName = infoText[..lastSpace].Trim();
                    }
                    else
                    {
                        attackName = infoText;
                    }

                    var effect = effectNode is not null
                        ? WebUtility.HtmlDecode(effectNode.InnerText.Trim())
                        : null;
                    attacks.Add(new LimitlessAttack(costList, attackName, string.IsNullOrWhiteSpace(effect) ? null : effect, damage));
                }
                if (attacks.Count == 0) attacks = null;
            }

            // WRR: Weakness, Resistance, Retreat (text nodes between <br> tags)
            HtmlNode? wrrNode = doc.DocumentNode.SelectSingleNode("//p[contains(@class,'card-text-wrr')]");
            List<LimitlessTypeValue>? weaknesses = null;
            List<LimitlessTypeValue>? resistances = null;
            int? retreat = null;
            if (wrrNode is not null)
            {
                foreach (HtmlNode child in wrrNode.ChildNodes)
                {
                    if (child.NodeType != HtmlNodeType.Text) continue;
                    var text = WebUtility.HtmlDecode(child.InnerText).Trim();
                    if (string.IsNullOrEmpty(text)) continue;
                    var colonIdx = text.IndexOf(':');
                    if (colonIdx < 0) continue;
                    var key = text[..colonIdx].Trim();
                    var value = text[(colonIdx + 1)..].Trim();
                    if (key.Equals("Weakness", StringComparison.OrdinalIgnoreCase)
                        && !value.Equals("none", StringComparison.OrdinalIgnoreCase))
                        weaknesses = [new LimitlessTypeValue(value, "")];
                    else if (key.Equals("Resistance", StringComparison.OrdinalIgnoreCase)
                             && !value.Equals("none", StringComparison.OrdinalIgnoreCase))
                        resistances = [new LimitlessTypeValue(value, "")];
                    else if (key.Equals("Retreat", StringComparison.OrdinalIgnoreCase)
                             && int.TryParse(value, out var r))
                        retreat = r;
                }
            }

            // Illustrator
            HtmlNode? artistNode = doc.DocumentNode.SelectSingleNode("//div[contains(@class,'card-text-artist')]//a");
            var illustrator = artistNode is not null
                ? WebUtility.HtmlDecode(artistNode.InnerText.Trim())
                : null;

            // Regulation mark (first word before " Regulation Mark")
            HtmlNode? regNode = doc.DocumentNode.SelectSingleNode("//div[contains(@class,'regulation-mark')]");
            string? regulationMark = null;
            if (regNode is not null)
            {
                var regText = WebUtility.HtmlDecode(regNode.InnerText).Split('•')[0].Trim();
                var spaceIdx = regText.IndexOf(' ');
                regulationMark = spaceIdx > 0 ? regText[..spaceIdx] : (regText.Length > 0 ? regText : null);
            }

            // Legality (Standard + Expanded, non-JP)
            bool? legalStandard = null, legalExpanded = null;
            HtmlNodeCollection? legalityItems = doc.DocumentNode.SelectNodes("//div[contains(@class,'card-legality-item')]");
            if (legalityItems is not null)
            {
                foreach (HtmlNode item in legalityItems)
                {
                    var directDivs = item.ChildNodes.Where(n => n.Name == "div").ToList();
                    if (directDivs.Count < 2) continue;
                    HtmlNode? formatLink = directDivs[0].SelectSingleNode(".//a[@href]");
                    var href = formatLink?.GetAttributeValue("href", "") ?? "";
                    var statusText = WebUtility.HtmlDecode(directDivs[1].InnerText.Trim()).ToLowerInvariant();
                    var isLegal = statusText == "legal";
                    if (href.Contains("format:standard") && !href.Contains("standard-jp"))
                        legalStandard = isLegal;
                    else if (href.Contains("format:expanded") && !href.Contains("expanded-jp"))
                        legalExpanded = isLegal;
                }
            }

            return new LimitlessCardDetail(
                ImageUrl: imageUrl,
                Name: name,
                Category: category,
                Stage: stage,
                Types: types is { Count: > 0 } ? types : null,
                Hp: hp,
                Illustrator: illustrator,
                RegulationMark: regulationMark,
                LegalStandard: legalStandard,
                LegalExpanded: legalExpanded,
                Attacks: attacks,
                Weaknesses: weaknesses is { Count: > 0 } ? weaknesses : null,
                Resistances: resistances is { Count: > 0 } ? resistances : null,
                Retreat: retreat
            );
        }

        public static List<LimitlessCard> ParseCards(string html, string setCode, LimitlessLanguage language)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var cards = new List<LimitlessCard>();
            HtmlNodeCollection? links = doc.DocumentNode.SelectNodes("//div[contains(@class,'card-search-grid')]//a[contains(@href,'/cards/')]");
            if (links is null)
            {
                return cards;
            }

            foreach (HtmlNode link in links)
            {
                var href = link.GetAttributeValue("href", "");
                var number = href.Split('/').Last();

                HtmlNode? img = link.SelectSingleNode(".//img");
                var imageUrl = img?.GetAttributeValue("data-src", null) ?? img?.GetAttributeValue("src", null) ?? "";
                var name = WebUtility.HtmlDecode(img?.GetAttributeValue("alt", "").Trim() ?? "");

                if (!string.IsNullOrEmpty(number) && !string.IsNullOrEmpty(imageUrl))
                {
                    cards.Add(new LimitlessCard(
                        Number: number,
                        ImageUrl: imageUrl,
                        SetCode: setCode,
                        Language: language,
                        Name: string.IsNullOrEmpty(name) ? null : name
                    ));
                }
            }

            return cards;
        }
    }
}
