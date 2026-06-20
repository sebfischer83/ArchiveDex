using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Commands.Collection
{
    public sealed record DeleteCollectionEntry(Guid EntryId);

    public static class DeleteCollectionEntryHandler
    {
        public static async Task Handle(
            DeleteCollectionEntry command,
            ICollectionRepository repo,
            CancellationToken ct) => await repo.DeleteAsync(command.EntryId, ct);
    }
}
