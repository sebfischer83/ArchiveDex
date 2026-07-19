using System.Text.Json;

namespace ArchiveDex.Server.Features.Capture;

public static class CaptureJson
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);
}

public record ProposedText(string? Value, string Confidence, string? Reason = null);
public record ConditionProposal(string? Grade, string Confidence, string[] ObservedDefects, string[] Limitations);
public record CatalogCandidateResponse(
    string CatalogReferenceId,
    string PrintedName,
    string? OfficialGermanName,
    string PrintedNumber,
    string SetIdentifier,
    string SetName,
    string Language,
    string VariantKey,
    string Confidence);
public record ValuationResponse(
    string Status,
    long? AmountMinor,
    string? Currency,
    DateTime? EstimatedAt,
    DateTime? MarketDataAsOf,
    string? Provider,
    string? Method,
    string? Confidence,
    bool? ConditionApplied,
    string Disclaimer);
public record AnalysisProposalResponse(
    ProposedText PrintedName,
    ProposedText OfficialGermanName,
    ProposedText PrintedNumber,
    ProposedText SetIdentifier,
    ProposedText SetName,
    ProposedText Language,
    ProposedText VariantKey,
    ConditionProposal Condition,
    ValuationResponse? Valuation,
    IReadOnlyList<CatalogCandidateResponse> Candidates);

public record ReviewCaptureRequest(
    Guid? CatalogReferenceId,
    string OriginalName,
    string? GermanName,
    string? GermanNameUnavailableReason,
    string PrintedNumber,
    string SetIdentifier,
    string SetName,
    string Language,
    string VariantKey,
    string Condition);

public record FinalizeCaptureRequest(bool AllowDuplicate = false);

public static class CaptureValidation
{
    private static readonly HashSet<string> Conditions = ["NM", "LP", "MP", "HP", "DMG"];

    public static Dictionary<string, string[]> Validate(ReviewCaptureRequest request)
    {
        var errors = new Dictionary<string, string[]>();
        Required(request.OriginalName, nameof(request.OriginalName), 200, errors);
        Required(request.PrintedNumber, nameof(request.PrintedNumber), 50, errors);
        Required(request.SetIdentifier, nameof(request.SetIdentifier), 100, errors);
        Required(request.SetName, nameof(request.SetName), 200, errors);
        Required(request.Language, nameof(request.Language), 10, errors);
        Required(request.VariantKey, nameof(request.VariantKey), 50, errors);

        if (request.Language?.Trim().Length is < 2)
            errors[nameof(request.Language)] = ["Language must contain at least two characters."];
        if (!Conditions.Contains(request.Condition ?? string.Empty))
            errors[nameof(request.Condition)] = ["Condition must be NM, LP, MP, HP, or DMG."];

        var hasGermanName = !string.IsNullOrWhiteSpace(request.GermanName);
        var hasUnavailableReason = !string.IsNullOrWhiteSpace(request.GermanNameUnavailableReason);
        if (hasGermanName == hasUnavailableReason)
            errors[nameof(request.GermanName)] = ["Provide either a German name or an unavailable reason."];

        return errors;
    }

    private static void Required(string? value, string name, int maxLength, Dictionary<string, string[]> errors)
    {
        if (string.IsNullOrWhiteSpace(value))
            errors[name] = ["The field is required."];
        else if (value.Trim().Length > maxLength)
            errors[name] = [$"The field must not exceed {maxLength} characters."];
    }
}
