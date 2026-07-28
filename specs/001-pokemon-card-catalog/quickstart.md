# Quickstart Validation: KI-gestützter Pokémon-Kartenkatalog

## Purpose

This guide validates the planned feature end to end without prescribing implementation internals. The authoritative domain constraints are in [data-model.md](./data-model.md), and HTTP behavior is defined by [contracts/openapi.yaml](./contracts/openapi.yaml).

## Prerequisites

- Docker Engine and Docker Compose
- At least 2 CPU cores, 2 GiB free memory, and sufficient storage for PostgreSQL images
- One configured multimodal provider API key
- One approved market-data provider credential when the selected source requires it
- Owner username and password supplied through local Docker secrets or protected environment files

The production runtime must require only Docker. Local .NET or Node installations are optional conveniences, not prerequisites.

## Initial Setup

1. Copy the documented environment example and provide non-committed secrets.
2. Build all pinned images:

   ```bash
   docker compose build
   ```

3. Apply committed migrations and provision the owner account using the transient migration command:

   ```bash
   docker compose run --rm web migrate
   ```

4. Start PostgreSQL and the server-hosted Angular application:

   ```bash
   docker compose up -d
   docker compose ps
   ```

5. Confirm `db` and `web` are healthy, then open `http://localhost:8080/`.

Expected: the ASP.NET Core server returns the Angular application at `/`; no separately started frontend service is required. `/health/live` and `/health/ready` report healthy after migrations are current.

## Automated Validation

### Server, Client, and Contract Tests

Run the reproducible test target from Docker:

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm test
```

Expected:

- Formatter and linter checks pass.
- Server unit tests satisfy the configured coverage gates.
- OpenAPI contract tests pass against the server.
- PostgreSQL integration tests apply all migrations to a clean PostgreSQL 18 database.
- Angular unit and component tests pass.
- Normal tests use deterministic fake AI and market providers and require no live credentials.

### Browser Journeys

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm e2e
```

Expected: desktop and mobile Playwright journeys pass against the built server image and PostgreSQL, including deep-link refresh.

### Performance Gates

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm benchmark
```

Expected with the committed seeded dataset:

- Set/card list p95 ≤250 ms and p99 ≤750 ms.
- Ordinary mutations p95 ≤500 ms.
- Set overview is usable within two seconds in at least 95% of runs.
- No critical benchmark median regresses more than 10% from baseline.
- Bundle, payload, and memory budgets from [plan.md](./plan.md) pass.

## Acceptance Journeys

### 1. Sign In

1. Open the root URL.
2. Sign in with the provisioned owner account.
3. Refresh a protected deep link.

Expected: the session survives container restart when Data Protection and database volumes remain; anonymous access cannot retrieve collection metadata or images.

### 2. Capture and Review a Card

1. Upload one clear card-front image under the configured size/pixel limits.
2. Observe upload and analysis progress.
3. Review printed/original name, official German name or explicit unavailability, card number, set identifier/name, language, printing variant, condition proposal, uncertainty, and EUR estimate.
4. Confirm or correct all required values and one of NM, LP, MP, HP, or DMG.
5. Finalize the specimen.

Expected: analysis reaches `needsReview`, `needsNewImage`, or `failed` within 30 seconds. Finalization stores one specimen with its own private full image and thumbnail beneath the correct grouped card record.

### 3. Duplicate Image as Another Specimen

1. Upload the exact same image again.
2. Finalize the capture normally.

Expected: finalization stores another physical specimen under the same grouped card record without an additional duplicate confirmation.

### 4. Browse by Set and Language

1. Store specimens from at least two sets and two languages, including two specimens of one card.
2. Open the set overview.
3. Select one set-language edition and then one card.

Expected: set entries show distinct-card and physical-specimen counts; the card detail lists every specimen with its own image, condition, and valuation.

### 5. Edit and Merge Identity

1. Correct a card's set, language, collector number, or variant so it matches an existing grouped card.
2. Submit with the current ETag.

Expected: specimens move to the existing target group atomically; counts update. A stale ETag returns an actionable conflict without overwriting newer data.

### 6. Refresh Valuation

1. Trigger a manual valuation refresh for one specimen.
2. Repeat with the market provider configured to fail.

Expected: a successful refresh records a new EUR estimate and timestamp without another vision request. A failed refresh reports recovery guidance and preserves the last successful value.

### 7. Delete a Specimen

1. Delete one specimen after confirmation.
2. Delete the final specimen under a grouped card.

Expected: each specimen and image become inaccessible immediately after commit; the grouped card is removed only when its last specimen is deleted.

### 8. Failure and Privacy Cases

Validate multiple cards in one image, unreadable/cropped image, unsupported content, missing German catalog name, ambiguous catalog candidates, AI timeout/rate limit, and unavailable market data.

Expected: every case returns a stable problem code and next action. Recognition remains saveable when only valuation is unavailable. Logs contain traceable operation outcomes but no image bytes, credentials, cookies, or raw provider payloads.

## Backup and Restore Check

1. Create an encrypted off-host PostgreSQL backup containing metadata and image bytes.
2. Restore it into a clean PostgreSQL container at least monthly.
3. Start the same web image against the restored database.

Expected: migrations are current; all specimen images, groupings, conditions, and last successful valuations are available. Docker volume retention alone does not count as a backup.

## Shutdown

```bash
docker compose down
```

Do not add `-v` unless permanent deletion of the local PostgreSQL and Data Protection volumes is intended.
