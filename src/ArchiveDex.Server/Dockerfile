# Unter https://aka.ms/customizecontainer erfahren Sie, wie Sie Ihren Debugcontainer anpassen und wie Visual Studio dieses Dockerfile verwendet, um Ihre Images für ein schnelleres Debuggen zu erstellen.

# Diese Stufe wird verwendet, wenn sie von VS im Schnellmodus ausgeführt wird (Standardeinstellung für Debugkonfiguration).
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
# Pre-create the DataProtection key directory owned by the non-root app user so a
# freshly created named volume mounted here inherits writable ownership.
RUN mkdir -p /app/dataprotection && chown "$APP_UID:$APP_UID" /app/dataprotection
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Build the Angular client so the container serves the SPA at :8080, identical to
# production. Kept as its own stage so a backend-only change reuses the cached npm layer.
FROM node:24.18.0-bookworm-slim AS client-builder
WORKDIR /client
COPY src/ArchiveDex.Server/ClientApp/package.json src/ArchiveDex.Server/ClientApp/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY src/ArchiveDex.Server/ClientApp/ ./
RUN npm run build -- --configuration production

# Diese Stufe wird zum Erstellen des Dienstprojekts verwendet.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["Directory.Build.props", "."]
COPY ["nuget.config", "."]
COPY ["src/ArchiveDex.Server/ArchiveDex.Server.csproj", "src/ArchiveDex.Server/"]
RUN dotnet restore "./src/ArchiveDex.Server/ArchiveDex.Server.csproj"
COPY . .
# Inject the prebuilt Angular output; PublishAngularClient (csproj) copies it to wwwroot.
COPY --from=client-builder /client/dist/archive-dex-client src/ArchiveDex.Server/obj/angular
WORKDIR "/src/src/ArchiveDex.Server"
RUN dotnet build "./ArchiveDex.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build -p:BuildAngularClient=false

# Diese Stufe wird verwendet, um das Dienstprojekt zu veröffentlichen, das in die letzte Phase kopiert werden soll.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ArchiveDex.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false -p:BuildAngularClient=false

# Diese Stufe wird in der Produktion oder bei Ausführung von VS im regulären Modus verwendet (Standard, wenn die Debugkonfiguration nicht verwendet wird).
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ArchiveDex.Server.dll"]