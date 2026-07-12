FROM node:24-bookworm-slim AS client-builder
WORKDIR /client
COPY src/ArchiveDex.Web/ClientApp/package.json src/ArchiveDex.Web/ClientApp/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY src/ArchiveDex.Web/ClientApp/ ./
RUN npx ng build --configuration production

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
COPY --from=client-builder /client/dist/archive-dex-client src/ArchiveDex.Web/obj/angular

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
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/lib/x86_64-linux-gnu/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libtesseract.so.5 /usr/lib/x86_64-linux-gnu/libtesseract50.so

ENV ARCHIVEDEX_TESSDATA_PATH=/usr/share/tesseract-ocr/5/tessdata

RUN dotnet restore src/ArchiveDex.Web/ArchiveDex.Web.csproj
RUN dotnet restore tests/ArchiveDex.Infrastructure.Tests/ArchiveDex.Infrastructure.Tests.csproj
RUN dotnet publish src/ArchiveDex.Web/ArchiveDex.Web.csproj -c Release -o /app --no-restore /p:BuildAngularClient=false

FROM build AS test
RUN dotnet build tests/ArchiveDex.Infrastructure.Tests/ArchiveDex.Infrastructure.Tests.csproj --no-restore \
    && mkdir -p tests/ArchiveDex.Infrastructure.Tests/bin/Debug/net10.0/x64 \
    && ln -sf /usr/lib/x86_64-linux-gnu/liblept.so.5 tests/ArchiveDex.Infrastructure.Tests/bin/Debug/net10.0/x64/libleptonica-1.82.0.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libtesseract.so.5 tests/ArchiveDex.Infrastructure.Tests/bin/Debug/net10.0/x64/libtesseract50.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libdl.so.2 tests/ArchiveDex.Infrastructure.Tests/bin/Debug/net10.0/libdl.so \
    && dotnet test tests/ArchiveDex.Infrastructure.Tests/ArchiveDex.Infrastructure.Tests.csproj --no-build

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .

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
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/x64 \
    && ln -sf /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/x64/libleptonica-1.82.0.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libtesseract.so.5 /app/x64/libtesseract50.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libdl.so.2 /app/libdl.so

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV TesseractOcr__TessDataPath=/usr/share/tesseract-ocr/5/tessdata
ENTRYPOINT ["dotnet", "ArchiveDex.Web.dll"]
