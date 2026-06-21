namespace ArchiveDex.Api.Models;

public sealed record ImportJobRequest(string Source, List<string> SetIds, List<string> CardLanguages);
