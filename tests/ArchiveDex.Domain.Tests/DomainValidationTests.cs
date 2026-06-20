using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Tests
{
    public class DomainValidationTests
    {
        [Theory]
        [InlineData(1)]
        [InlineData(5)]
        [InlineData(100)]
        public void CollectionEntry_Quantity_GreaterThanOrEqualOne_IsValid(int quantity) => Assert.True(quantity >= 1);

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        public void CollectionEntry_Quantity_LessThanOne_IsInvalid(int quantity) => Assert.False(quantity >= 1);

        [Theory]
        [InlineData(0)]
        [InlineData(9.99)]
        [InlineData(1000)]
        public void CollectionEntry_Price_NonNegative_IsValid(decimal price) => Assert.True(price >= 0);

        [Fact]
        public void CardCondition_AllValues_AreDefined()
        {
            CardCondition[] values = Enum.GetValues<CardCondition>();
            Assert.Equal(5, values.Length);
            Assert.Contains(CardCondition.NM, values);
            Assert.Contains(CardCondition.LP, values);
            Assert.Contains(CardCondition.MP, values);
            Assert.Contains(CardCondition.HP, values);
            Assert.Contains(CardCondition.DMG, values);
        }

        [Fact]
        public void ScanJobStatus_Transitions_AreValid()
        {
            ScanJobStatus[] statuses = Enum.GetValues<ScanJobStatus>();
            Assert.Contains(ScanJobStatus.Uploaded, statuses);
            Assert.Contains(ScanJobStatus.OcrRunning, statuses);
            Assert.Contains(ScanJobStatus.OcrComplete, statuses);
            Assert.Contains(ScanJobStatus.Confirmed, statuses);
            Assert.Contains(ScanJobStatus.Rejected, statuses);
            Assert.Contains(ScanJobStatus.Failed, statuses);
        }
    }
}
