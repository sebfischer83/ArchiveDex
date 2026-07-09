using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Tcgdex;
using ArchiveDex.Tcgdex.Models;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class TcgDexCatalogSourceAdapter : ICatalogSourceAdapter
    {
        private readonly TcgdexClient _client;

        public string SourceName => "TCGdex";

        public IReadOnlyList<string> SupportedLanguages { get; } = new[]
        {
            "en", "fr", "es", "it", "pt", "pt-br", "de", "nl", "pl",
            "ru", "ja", "ko", "zh-hans", "zh-hant", "zh", "id", "th"
        };

        public TcgDexCatalogSourceAdapter(TcgdexClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default)
        {
            return Task.FromResult(SupportedLanguages.Contains(language.ToLowerInvariant()));
        }

        public async Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default)
        {
            var lang = ParseLanguage(language);
            var client = _client.WithLanguage(lang);

            var seriesResumes = await client.FetchSeriesAsync(ct);
            var sets = new List<ImportedSet>();

            if (seriesResumes != null)
            {
                foreach (var serieResume in seriesResumes)
                {
                    var setResumes = await client.FetchSetsAsync(serieResume.Id, ct);
                    if (setResumes != null)
                    {
                        foreach (var sr in setResumes)
                        {
                            sets.Add(new ImportedSet(
                                ExternalId: sr.Id,
                                RawName: sr.Name,
                                Series: serieResume.Name,
                                ReleaseDate: null,
                                PrintedTotal: sr.CardCount.Total,
                                OfficialTotal: sr.CardCount.Official,
                                ImageUrl: sr.Logo,
                                PayloadJson: null));
                        }
                    }
                }
            }
            return sets;
        }

        public async Task<List<ImportedCardSummary>> GetCardSummariesAsync(string language, string externalSetId, CancellationToken ct = default)
        {
            var lang = ParseLanguage(language);
            var client = _client.WithLanguage(lang);

            var cards = await client.FetchCardsAsync(externalSetId, ct);
            if (cards == null) return [];

            return cards.Select(c => new ImportedCardSummary(
                ExternalId: c.Id,
                ExternalSetId: externalSetId,
                Number: c.LocalId,
                Name: c.Name,
                Rarity: null,
                ImageUrl: c.Image
            )).ToList();
        }

        public async Task<ImportedCardDetail?> GetCardDetailAsync(string language, string externalSetId, string number, CancellationToken ct = default)
        {
            var lang = ParseLanguage(language);
            var client = _client.WithLanguage(lang);

            var cards = await client.FetchCardsAsync(externalSetId, ct);
            var match = cards?.FirstOrDefault(c => c.LocalId == number);
            if (match == null) return null;

            var card = await client.FetchCardAsync(match.Id, externalSetId, ct);
            if (card == null)
            {
                return new ImportedCardDetail(
                    ExternalId: match.Id, ExternalSetId: externalSetId,
                    Number: match.LocalId, Name: match.Name,
                    Rarity: null, Category: null, Illustrator: null, ImageUrl: match.Image,
                    Hp: null, Types: null, Stage: null, EvolveFrom: null,
                    Description: null, RegulationMark: null, LegalStandard: null, LegalExpanded: null,
                    Retreat: null, Variants: new VariantFlags(),
                    Attacks: null, Weaknesses: null, Resistances: null, PayloadJson: null);
            }

            return new ImportedCardDetail(
                ExternalId: card.Id, ExternalSetId: externalSetId,
                Number: card.LocalId, Name: card.Name,
                Rarity: card.Rarity, Category: card.Category,
                Illustrator: card.Illustrator, ImageUrl: card.Image,
                Hp: card.Hp, Types: card.Types, Stage: card.Stage,
                EvolveFrom: card.EvolveFrom, Description: card.Description,
                RegulationMark: card.RegulationMark,
                LegalStandard: card.Legal.Standard, LegalExpanded: card.Legal.Expanded,
                Retreat: card.Retreat,
                Variants: new VariantFlags(
                    Normal: card.Variants?.Normal ?? false,
                    Holo: card.Variants?.Holo ?? false,
                    Reverse: card.Variants?.Reverse ?? false,
                    FirstEdition: card.Variants?.FirstEdition ?? false),
                Attacks: card.Attacks?.Select(a => new AttackDto(
                    a.Cost, a.Name, a.Effect, a.Damage?.ToLabel())).ToList(),
                Weaknesses: card.Weaknesses?.Select(w => new TypeValueDto(w.Type, w.Value)).ToList(),
                Resistances: card.Resistances?.Select(r => new TypeValueDto(r.Type, r.Value)).ToList(),
                PayloadJson: null);
        }

        private static SupportedLanguage ParseLanguage(string language)
        {
            return language.ToLowerInvariant() switch
            {
                "zh-hans" => SupportedLanguage.zhHans,
                "zh-hant" => SupportedLanguage.zhHant,
                "pt-br" => SupportedLanguage.ptBr,
                _ => Enum.TryParse<SupportedLanguage>(language, true, out var result) ? result : SupportedLanguage.en
            };
        }
    }
}
