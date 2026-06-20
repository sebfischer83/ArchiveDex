using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Collection;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Tests.Collection
{
    public class CreateCollectionEntryHandlerTests
    {
        [Fact]
        public async Task Handle_DuplicateWithoutMerge_ReturnsDuplicateResponse()
        {
            var card = NewCard();
            var existing = NewEntry(card.Id, quantity: 2);

            CreateCollectionResult result = await CreateCollectionEntryHandler.Handle(
                new CreateCollectionEntry(card.Id, CardCondition.NM, 1, null, null, null),
                new FakeCatalogRepository(card),
                new FakeCollectionRepository(existing),
                CancellationToken.None);

            Assert.True(result.IsDuplicate);
            Assert.Equal(2, result.Duplicate!.ExistingQuantity);
            Assert.Equal(3, result.Duplicate.ProposedQuantity);
        }

        [Fact]
        public async Task Handle_MergeDuplicate_IncrementsExistingEntry()
        {
            var card = NewCard();
            var existing = NewEntry(card.Id, quantity: 2);
            var collection = new FakeCollectionRepository(existing);

            CreateCollectionResult result = await CreateCollectionEntryHandler.Handle(
                new CreateCollectionEntry(card.Id, CardCondition.NM, 3, null, null, null, MergeDuplicate: true),
                new FakeCatalogRepository(card),
                collection,
                CancellationToken.None);

            Assert.False(result.IsDuplicate);
            Assert.Equal(existing.Id, result.Entry!.Id);
            Assert.Equal(5, result.Entry.Quantity);
            Assert.Equal(5, existing.Quantity);
            Assert.True(collection.Updated);
            Assert.False(collection.Added);
        }

        [Fact]
        public async Task Handle_ForceCreate_CreatesSeparateEntryDespiteDuplicate()
        {
            var card = NewCard();
            var existing = NewEntry(card.Id, quantity: 2);
            var collection = new FakeCollectionRepository(existing);

            CreateCollectionResult result = await CreateCollectionEntryHandler.Handle(
                new CreateCollectionEntry(card.Id, CardCondition.NM, 1, null, null, null, ForceCreate: true),
                new FakeCatalogRepository(card),
                collection,
                CancellationToken.None);

            Assert.False(result.IsDuplicate);
            Assert.NotEqual(existing.Id, result.Entry!.Id);
            Assert.Equal(1, result.Entry.Quantity);
            Assert.True(collection.Added);
            Assert.False(collection.Updated);
        }

        private static CardPrint NewCard() => new()
        {
            Id = Guid.NewGuid(),
            CardLanguage = CardLanguage.en,
            Number = "001",
            Name = "Test Card",
            Origin = Origin.Imported,
            CardSet = new CardSet { Id = Guid.NewGuid(), CanonicalName = "Test Set" }
        };

        private static CollectionEntry NewEntry(Guid cardId, int quantity) => new()
        {
            Id = Guid.NewGuid(),
            CardPrintId = cardId,
            Condition = CardCondition.NM,
            Quantity = quantity,
            DateAdded = DateTime.UtcNow
        };

        private sealed class FakeCatalogRepository(CardPrint card) : ICatalogRepository
        {
            public Task<CardPrint?> GetByIdAsync(Guid id, CancellationToken ct = default)
                => Task.FromResult(id == card.Id ? card : null);

            public Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesAsync(CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesByLanguageAsync(string cardLanguage, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<IReadOnlyList<CardPrint>> SearchAsync(string? query, string? number, Guid? setId, string? cardLanguage, int page, int pageSize = 20, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<CardPrint?> FindByExternalIdAsync(string source, string externalId, string language, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<CardPrint?> FindBySetLanguageNumberAsync(Guid cardSetId, string language, string number, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<CardPrint> AddAsync(CardPrint card, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task UpdateAsync(CardPrint card, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<IReadOnlyDictionary<(Guid SetId, string CardLanguage), int>> GetOwnedCountsBySetIdAsync(CancellationToken ct = default)
                => throw new NotImplementedException();
        }

        private sealed class FakeCollectionRepository(CollectionEntry? duplicate) : ICollectionRepository
        {
            public bool Added { get; private set; }
            public bool Updated { get; private set; }

            public Task<CollectionEntry?> FindByCardAndConditionAsync(Guid cardPrintId, CardCondition condition, CancellationToken ct = default)
                => Task.FromResult(duplicate is not null && duplicate.CardPrintId == cardPrintId && duplicate.Condition == condition ? duplicate : null);

            public Task AddAsync(CollectionEntry entry, CancellationToken ct = default)
            {
                Added = true;
                return Task.CompletedTask;
            }

            public Task UpdateAsync(CollectionEntry entry, CancellationToken ct = default)
            {
                Updated = true;
                return Task.CompletedTask;
            }

            public Task<CollectionEntry?> GetByIdAsync(Guid id, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<IReadOnlyList<CollectionSetSummary>> GetSetSummariesAsync(CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<IReadOnlyList<CollectionEntry>> SearchAsync(string? query, Guid? setId, string? cardLanguage, string? condition, int page, int pageSize = 20, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task DeleteAsync(Guid id, CancellationToken ct = default)
                => throw new NotImplementedException();
        }
    }
}
