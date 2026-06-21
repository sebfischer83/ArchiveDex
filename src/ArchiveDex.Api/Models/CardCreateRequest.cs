namespace ArchiveDex.Api.Models;

public sealed record CardCreateRequest(Guid SetId, string Number, string Name, string CardLanguage, string? Rarity);
