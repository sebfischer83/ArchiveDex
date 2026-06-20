namespace ArchiveDex.Tcgdex.Endpoints
{
    public class Endpoint<TItem, TList> where TItem : class where TList : class
    {
        private readonly TcgdexClient _client;
        private readonly string _resource;

        internal Endpoint(TcgdexClient client, string resource)
        {
            _client = client;
            _resource = resource;
        }

        public Task<TItem?> GetAsync(string id, CancellationToken ct = default) => _client.FetchAsync<TItem>([_resource, id], null, ct);

        public async Task<List<TList>> ListAsync(Query? query = null, CancellationToken ct = default) => await _client.FetchWithQueryAsync<TList>([_resource], query, ct).ConfigureAwait(false) ?? [];
    }

    public class SimpleEndpoint<TItem> where TItem : class
    {
        private readonly TcgdexClient _client;
        private readonly string _resource;

        internal SimpleEndpoint(TcgdexClient client, string resource)
        {
            _client = client;
            _resource = resource;
        }

        public Task<TItem?> GetAsync(string id, CancellationToken ct = default) => _client.FetchAsync<TItem>([_resource, id], null, ct);

        public async Task<List<string>> ListAsync(Query? query = null, CancellationToken ct = default)
        {
            List<string>? result = await _client.FetchValueListAsync([_resource], query, ct).ConfigureAwait(false);
            return result ?? [];
        }
    }
}
