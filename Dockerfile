FROM node:24.18.0-bookworm-slim AS client-builder
WORKDIR /client
COPY src/ArchiveDex.Server/ClientApp/package.json src/ArchiveDex.Server/ClientApp/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY src/ArchiveDex.Server/ClientApp/ ./
RUN npm run build -- --configuration production

FROM mcr.microsoft.com/dotnet/sdk:10.0.302-noble AS builder
WORKDIR /app
COPY Directory.Build.props Directory.Packages.props global.json ./
COPY ArchiveDex.slnx ./
COPY src/ArchiveDex.Server/ArchiveDex.Server.csproj src/ArchiveDex.Server/
COPY tests/ArchiveDex.Server.UnitTests/ArchiveDex.Server.UnitTests.csproj tests/ArchiveDex.Server.UnitTests/
COPY tests/ArchiveDex.Server.IntegrationTests/ArchiveDex.Server.IntegrationTests.csproj tests/ArchiveDex.Server.IntegrationTests/
COPY tests/ArchiveDex.Server.ContractTests/ArchiveDex.Server.ContractTests.csproj tests/ArchiveDex.Server.ContractTests/
COPY tests/ArchiveDex.E2E/ArchiveDex.E2E.csproj tests/ArchiveDex.E2E/
RUN dotnet restore
COPY . .
COPY --from=client-builder /client/dist/archive-dex-client src/ArchiveDex.Server/obj/angular
RUN dotnet publish src/ArchiveDex.Server/ArchiveDex.Server.csproj -c Release -o /out -p:BuildAngularClient=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0.10-noble
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/dataprotection \
    && chown "$APP_UID:$APP_UID" /app/dataprotection
WORKDIR /app
COPY --from=builder /out .
USER $APP_UID
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD curl -f http://localhost:8080/health/live || exit 1
ENTRYPOINT ["dotnet", "ArchiveDex.Server.dll"]
