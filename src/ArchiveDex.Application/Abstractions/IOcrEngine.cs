using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions;

public interface IOcrEngine
{
    Task<OcrResult> ProcessAsync(Guid scanJobId, string imagePath, string? cardLanguageHint, CancellationToken ct = default);
}
