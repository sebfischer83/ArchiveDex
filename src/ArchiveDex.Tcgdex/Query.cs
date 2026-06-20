namespace ArchiveDex.Tcgdex
{
    public class Query
    {
        public List<QueryParam> Params { get; } = [];

        public Query Contains(string key, string value)
        {
            Params.Add(new QueryParam(key, value));
            return this;
        }

        public Query Includes(string key, string value) => Contains(key, value);

        public Query Like(string key, string value) => Contains(key, value);

        public Query Equal(string key, string value)
        {
            Params.Add(new QueryParam(key, $"eq:{value}"));
            return this;
        }

        public Query Sort(string key, SortOrder order)
        {
            Params.Add(new QueryParam("sort:field", key));
            Params.Add(new QueryParam("sort:order", order == SortOrder.ASC ? "ASC" : "DESC"));
            return this;
        }

        public Query GreaterOrEqualThan(string key, int value)
        {
            Params.Add(new QueryParam(key, $"gte:{value}"));
            return this;
        }

        public Query LesserOrEqualThan(string key, int value)
        {
            Params.Add(new QueryParam(key, $"lte:{value}"));
            return this;
        }

        public Query GreaterThan(string key, int value)
        {
            Params.Add(new QueryParam(key, $"gt:{value}"));
            return this;
        }

        public Query LesserThan(string key, int value)
        {
            Params.Add(new QueryParam(key, $"lt:{value}"));
            return this;
        }

        public Query IsNull(string key)
        {
            Params.Add(new QueryParam(key, "null:"));
            return this;
        }

        public Query Paginate(int page, int itemsPerPage)
        {
            Params.Add(new QueryParam("pagination:page", page.ToString()));
            Params.Add(new QueryParam("pagination:itemsPerPage", itemsPerPage.ToString()));
            return this;
        }

        public NotOperators Not =>
            new(this);

        public class NotOperators
        {
            private readonly Query _query;

            internal NotOperators(Query query) { _query = query; }

            public Query Equal(string key, string value)
            {
                _query.Params.Add(new QueryParam(key, $"neq:{value}"));
                return _query;
            }

            public Query Contains(string key, string value)
            {
                _query.Params.Add(new QueryParam(key, $"not:{value}"));
                return _query;
            }

            public Query IsNull(string key)
            {
                _query.Params.Add(new QueryParam(key, "notnull:"));
                return _query;
            }
        }
    }

    public enum SortOrder { ASC, DESC }

    public record QueryParam(string Key, string Value);
}
