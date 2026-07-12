# Research: Modern Angular UI Rebuild

**Feature**: 008-angular-ui-rebuild | **Date**: 2026-07-11

## Decision 1: Client Location and Server Delivery

**Decision**: Create the Angular workspace at `src/ArchiveDex.Web/ClientApp`; build its browser distribution before the Web host builds/publishes and serve it from the Web host's static-assets directory.

**Rationale**: This preserves one deployable server application and lets same-origin UI requests use the existing Identity cookie. It also satisfies production and Visual Studio Docker Compose debug delivery without a separately started development server.

**Alternatives considered**:
- Separate frontend deployment: rejected because it contradicts server delivery and adds CORS/session deployment complexity.
- Angular hosted in a new .NET project: rejected because it adds a second server artifact without user value.
- Retain Blazor and apply a component library: rejected because the user explicitly requested an Angular rebuild.

## Decision 2: Component and Design System

**Decision**: Use Taiga UI as the primary component system, Angular CDK for accessibility/layout primitives, and a small ArchiveDex theme layer for tokenized brand, density, responsive spacing, and standardized state components.

**Rationale**: Taiga UI provides accessible forms, overlays, dialogs, data presentation, and mobile-capable controls. A thin local theme layer prevents page-specific visual drift while avoiding a second component library.

**Alternatives considered**:
- Hand-built component library: rejected because it delays workflow parity and duplicates mature accessibility work.
- Multiple UI frameworks: rejected because it undermines the required consistent visual system.

## Decision 3: Routing, Deep Links, and Setup Gate

**Decision**: Angular owns browser routes. Before cutover, `ArchiveDex.Web` serves generated assets only through a non-production preview route; after screen-inventory parity, it maps root and approved legacy routes to the Angular entry document. The setup gate explicitly allows required client assets and returns setup routing decisions without intercepting APIs, Hangfire, or static assets.

**Rationale**: Direct links and refreshes must work under server delivery. A scoped fallback avoids turning API 404s into HTML responses.

**Alternatives considered**:
- Hash-based routing: rejected because it weakens shareable/deep-link URLs.
- Global fallback before API routing: rejected because it masks API and operational endpoints.
- Replacing the Blazor root during early migration: rejected because it prevents legacy workflow parity validation before the one-time cutover.

## Decision 4: Authentication and Authorization

**Decision**: Retain ASP.NET Core Identity cookie sessions. Add same-origin session, sign-in, sign-out, account, and authorization-status HTTP contracts. Apply authorization consistently to protected API operations before the client cutover.

**Rationale**: Blazor currently relies on server process context and direct service injection; Angular requires explicit browser contracts. Same-origin cookies avoid exposing bearer tokens to the client while preserving existing identity data.

**Alternatives considered**:
- Browser token storage: rejected because it adds avoidable security risk and a new identity model.
- Retain server-rendered sign-in/account pages: rejected by the complete-cutover clarification.

## Decision 5: Backend Operations Previously Invoked Through Blazor DI

**Decision**: Expose typed APIs for catalog transfer and full-import administrative actions that the current Blazor pages perform through direct repositories/orchestrators. Preserve existing job status polling, cancellation, resume, upload, validation, and error semantics.

**Rationale**: Browser code must never receive direct database/repository access. Explicit contracts make the migration testable and maintainable.

**Alternatives considered**:
- Keep Blazor for admin/import pages: rejected because it leaves a parallel legacy UI.
- Duplicate orchestration logic in Angular: rejected because business rules remain server-authoritative.

## Decision 6: Build and Docker Compose Debugging

**Decision**: Add a Node LTS runtime to the Web Dockerfile's Visual Studio Fast Mode base stage and to all build stages that execute the Angular build. Add an MSBuild client-build target that runs during normal Debug/Release builds and publish. Docker Compose debugging therefore produces browser assets before `ArchiveDex.Web` starts and serves them from the host process.

**Rationale**: Visual Studio Fast Mode does not run the final publish image, so a production-only multi-stage client build would not satisfy FR-024. An MSBuild target keeps the client build tied to the server lifecycle.

**Alternatives considered**:
- Require `ng serve` on the developer workstation: rejected because the UI would not be served by the debugged server.
- Run an Angular dev-server container: rejected because it violates the single server-delivery requirement.

## Decision 7: Testing and Cutover Proof

**Decision**: Replace bUnit page coverage with Angular component tests and browser end-to-end journeys. Keep WebApplicationFactory tests for host/static delivery and API contract tests. Maintain a screen inventory mapping every current route/page to its Angular replacement before legacy removal.

**Rationale**: The new client needs browser-level verification for responsive navigation, deep links, keyboard operation, localization, and error/loading states; server tests remain appropriate for APIs and static-host configuration.

**Alternatives considered**:
- API tests only: rejected because UI parity and accessibility requirements would not be proven.
- Keep bUnit tests as primary UI proof: rejected because they test the retired rendering technology.

## Decision 8: Authorization Matrix and Legacy-Route Migration

**Decision**: Define an endpoint authorization matrix in the Angular UI API contract before exposing browser access. Each current route is assigned a replacement route and one migration behavior: redirect, guided replacement, or intentionally retired with a user-safe explanation.

**Rationale**: The current server-side UI can rely on process-local authorization and direct service calls, while the Angular client cannot. A matrix prevents accidental privilege escalation. A route mapping makes FR-020 verifiable during the one-time cutover.

**Alternatives considered**:
- Infer access from client navigation visibility: rejected because hidden links do not secure APIs.
- Redirect every legacy route blindly: rejected because some routes require a different replacement or a clear retirement explanation.
