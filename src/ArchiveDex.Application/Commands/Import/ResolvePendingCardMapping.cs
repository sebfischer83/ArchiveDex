using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Commands.Import;

public enum PendingCardResolutionAction { Assign, CreateNew, Reject }

public sealed record ResolvePendingCardMapping(
    Guid Id, PendingCardResolutionAction Action, Guid? CardPrintId = null);

public static class ResolvePendingCardMappingHandler
{
    public static Task Handle(ResolvePendingCardMapping command, IPendingCardMappingService service, CancellationToken ct) =>
        command.Action switch
        {
            PendingCardResolutionAction.Assign when command.CardPrintId is { } cardPrintId => service.AssignAsync(command.Id, cardPrintId, ct),
            PendingCardResolutionAction.CreateNew => service.CreateNewAsync(command.Id, ct),
            PendingCardResolutionAction.Reject => service.RejectAsync(command.Id, ct),
            _ => throw new ArgumentException("Assign requires cardPrintId.", nameof(command))
        };
}
