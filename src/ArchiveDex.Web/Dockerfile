FROM node:24-bookworm-slim AS node-runtime

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER root
WORKDIR /app
EXPOSE 8080
COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=node-runtime /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx


FROM node:24-bookworm-slim AS client-builder
WORKDIR /client
COPY src/ArchiveDex.Web/ClientApp/package.json src/ArchiveDex.Web/ClientApp/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY src/ArchiveDex.Web/ClientApp/ ./
RUN npx ng build --configuration production


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
COPY --from=client-builder /client/dist/archive-dex-client src/ArchiveDex.Web/obj/angular
WORKDIR "/src/src/ArchiveDex.Web"
RUN dotnet build "./ArchiveDex.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build /p:BuildAngularClient=false

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ArchiveDex.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false /p:BuildAngularClient=false

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
