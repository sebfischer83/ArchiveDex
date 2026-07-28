FROM --platform=$BUILDPLATFORM node:24.18.0-bookworm-slim AS client-builder
WORKDIR /client
COPY src/ArchiveDex.Server/ClientApp/package.json src/ArchiveDex.Server/ClientApp/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY src/ArchiveDex.Server/ClientApp/ ./
RUN npm run build -- --configuration production

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0.302-noble AS builder
ARG TARGETARCH
WORKDIR /app
COPY Directory.Build.props Directory.Packages.props global.json ./
COPY ArchiveDex.slnx ./
COPY src/ArchiveDex.Server/ArchiveDex.Server.csproj src/ArchiveDex.Server/
COPY tests/ArchiveDex.Server.UnitTests/ArchiveDex.Server.UnitTests.csproj tests/ArchiveDex.Server.UnitTests/
COPY tests/ArchiveDex.Server.IntegrationTests/ArchiveDex.Server.IntegrationTests.csproj tests/ArchiveDex.Server.IntegrationTests/
COPY tests/ArchiveDex.Server.ContractTests/ArchiveDex.Server.ContractTests.csproj tests/ArchiveDex.Server.ContractTests/
COPY tests/ArchiveDex.E2E/ArchiveDex.E2E.csproj tests/ArchiveDex.E2E/
RUN dotnet restore src/ArchiveDex.Server/ArchiveDex.Server.csproj -a $TARGETARCH
COPY . .
COPY --from=client-builder /client/dist/archive-dex-client src/ArchiveDex.Server/obj/angular
RUN dotnet publish src/ArchiveDex.Server/ArchiveDex.Server.csproj -c Release -o /out -a $TARGETARCH --self-contained false --no-restore -p:BuildAngularClient=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0.10-noble
# OpenCvSharpExtern links against the GTK stack because the shipped build includes OpenCV's highgui
# module. Nothing here ever opens a window, but the loader still needs every dependency present, so
# the whole set has to be installed. Determined with `ldd` against the shipped .so, not guessed;
# leaving any of them out fails the load with a DllNotFoundException naming the next one.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
       libfreetype6 libharfbuzz0b libgtk-3-0 libdrm2 libatomic1 libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/dataprotection \
    && chown "$APP_UID:$APP_UID" /app/dataprotection
WORKDIR /app
COPY --from=builder /out .
USER $APP_UID
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD curl -f http://localhost:8080/health/live || exit 1
ENTRYPOINT ["dotnet", "ArchiveDex.Server.dll"]
