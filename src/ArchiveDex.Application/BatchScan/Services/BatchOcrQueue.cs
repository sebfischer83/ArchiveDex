using System.Collections.Concurrent;
using System.Threading.Channels;

namespace ArchiveDex.Application.BatchScan.Services
{
    public static class BatchOcrQueue
    {
        private static readonly ConcurrentQueue<Guid> Queue = new();
        private static readonly SemaphoreSlim Signal = new(0);
        private static readonly object Lock = new();

        public static void Enqueue(Guid batchId)
        {
            lock (Lock)
            {
                Queue.Enqueue(batchId);
            }

            Signal.Release();
        }

        public static async Task<Guid> DequeueAsync(CancellationToken ct)
        {
            await Signal.WaitAsync(ct);
            lock (Lock)
            {
                if (Queue.TryDequeue(out Guid batchId))
                {
                    return batchId;
                }
            }

            throw new InvalidOperationException("Queue was empty after signal.");
        }
    }
}
