using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Api.Models;

public sealed record CreateRelationRequest(Guid TargetCardSetId, SetRelationType RelationType);
