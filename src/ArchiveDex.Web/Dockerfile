# Unter https://aka.ms/customizecontainer erfahren Sie, wie Sie Ihren Debugcontainer anpassen und wie Visual Studio dieses Dockerfile verwendet, um Ihre Images für ein schnelleres Debuggen zu erstellen.

# Diese Stufe wird verwendet, wenn sie von VS im Schnellmodus ausgeführt wird (Standardeinstellung für Debugkonfiguration).
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER root
WORKDIR /app
EXPOSE 8080


# Diese Stufe wird zum Erstellen des Dienstprojekts verwendet.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/ArchiveDex.Web/ArchiveDex.Web.csproj", "src/ArchiveDex.Web/"]
COPY ["src/ArchiveDex.Infrastructure/ArchiveDex.Infrastructure.csproj", "src/ArchiveDex.Infrastructure/"]
COPY ["src/ArchiveDex.Application/ArchiveDex.Application.csproj", "src/ArchiveDex.Application/"]
COPY ["src/ArchiveDex.Domain/ArchiveDex.Domain.csproj", "src/ArchiveDex.Domain/"]
COPY ["src/ArchiveDex.Api/ArchiveDex.Api.csproj", "src/ArchiveDex.Api/"]
RUN dotnet restore "./src/ArchiveDex.Web/ArchiveDex.Web.csproj"
COPY . .
WORKDIR "/src/src/ArchiveDex.Web"
RUN dotnet build "./ArchiveDex.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Diese Stufe wird verwendet, um das Dienstprojekt zu veröffentlichen, das in die letzte Phase kopiert werden soll.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ArchiveDex.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Diese Stufe wird in der Produktion oder bei Ausführung von VS im regulären Modus verwendet (Standard, wenn die Debugkonfiguration nicht verwendet wird).
FROM base AS final

WORKDIR /app
COPY --from=publish /app/publish .
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-deu \
        tesseract-ocr-jpn \
        tesseract-ocr-kor \
        tesseract-ocr-chi-sim \
        tesseract-ocr-chi-tra \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app/images
ENTRYPOINT ["dotnet", "ArchiveDex.Web.dll"]
