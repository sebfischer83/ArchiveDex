namespace ArchiveDex.Server.Features.Capture
{
    public sealed record CardNumberParts(string CollectorNumber, string? SetTotal)
    {
        public string PrintedNumber => string.IsNullOrWhiteSpace(SetTotal)
            ? CollectorNumber
            : $"{CollectorNumber}/{SetTotal}";
    }

    public static class CardNumberParser
    {
        public static CardNumberParts Parse(
            string? printedNumber,
            string? collectorNumber = null,
            string? setTotal = null)
        {
            if (!string.IsNullOrWhiteSpace(collectorNumber))
                return new CardNumberParts(CleanPart(collectorNumber), CleanNullablePart(setTotal));

            var value = printedNumber?.Trim() ?? string.Empty;
            var slash = value.IndexOf('/');
            return slash < 0
                ? new CardNumberParts(CleanPart(value), null)
                : new CardNumberParts(
                    CleanPart(value[..slash]),
                    CleanNullablePart(value[(slash + 1)..]));
        }

        public static bool IsValid(CardNumberParts number) =>
            !string.IsNullOrWhiteSpace(number.CollectorNumber)
            && number.CollectorNumber.Length <= 25
            && !number.CollectorNumber.Contains('/')
            && (number.SetTotal is null || number.SetTotal.Length <= 25 && !number.SetTotal.Contains('/'));

        private static string CleanPart(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return string.Empty;
            return new string(value.Trim().TakeWhile(character =>
                char.IsLetterOrDigit(character) || character is '-' or '.').ToArray());
        }

        private static string? CleanNullablePart(string? value)
        {
            if (value?.Contains('/') == true) return value.Trim();
            var cleaned = CleanPart(value);
            return cleaned.Length == 0 ? null : cleaned;
        }
    }
}
