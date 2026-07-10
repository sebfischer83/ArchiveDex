# Phase 0 Research: Catalog Export and Import

All decisions below resolve the implementation choices needed by the specification. No `NEEDS CLARIFICATION` markers remain.

## D1. Portable Package Format

- **Decision**: Use one ZIP64 package with extension `.archivedex-catalog`, containing `manifest.json`, `data/catalog.json`, and de-duplicated image entries under `images/sha256/`.
- **Rationale**: ZIP64 and streaming archive support are available in the .NET standard library, work for the 25 GB target, and make transfer a single-file operation without another dependency. Explicit DTO documents avoid coupling the package to EF Core or database-provider schemas.
- **Alternatives considered**: Database dump plus image directory was rejected because it leaks excluded tables and is not portable across supported providers. TAR with external compression was rejected because it adds tooling/dependencies without a feature need.

## D2. Catalog Identity and Images

- **Decision**: Preserve canonical catalog GUIDs in an empty target and export only explicit catalog entities: sets, IDs, mappings, relations, prints, translations, local corrections, catalog-image metadata/associations, and referenced files. Store each unique file by SHA-256 and reference its hash from DTOs, never a source path.
- **Rationale**: Empty-target import means no identifier remapping or merge rules are necessary. Hash-addressed image entries preserve shared references without redundant copies and decouple the target from source filesystem locations.
- **Alternatives considered**: Reassigning IDs complicates every relationship and validation. Serializing EF entities or absolute paths would couple the package to runtime implementation and potentially write outside target storage.

## D3. Integrity and Compatibility

- **Decision**: The manifest records a package UUID, format version, source application version, required content categories, category counts, uncompressed bytes, and SHA-256 plus byte length for every data/image entry. Readers reject an unknown major format, unknown required category, missing/duplicate/unexpected entry, mismatched hash/size, invalid relationship, or unsafe archive path.
- **Rationale**: The manifest provides deterministic validation before mutation and a post-import comparison basis. Hashes detect corruption and accidental alteration; the feature does not claim to authenticate a malicious package author.
- **Alternatives considered**: Relying on ZIP CRC is insufficient for declared package completeness. Digital signatures were deferred because trusted key distribution and operator workflow are not in scope.

## D4. Export Consistency and Completion

- **Decision**: Acquire a durable global catalog-operation lease before snapshotting. Read catalog rows from a repeatable snapshot, stream files into a temporary archive while hashing, close and verify the completed temporary archive, then atomically publish it. Delete temporary output on cancellation/failure.
- **Rationale**: This prevents mixed catalog states and ensures only verified output becomes downloadable. Streaming keeps memory bounded by IO buffer size.
- **Alternatives considered**: Reading rows/files without coordination can create a mixed snapshot. Writing directly to a download path makes partial artifacts observable.

## D5. Import Atomicity and Crash Recovery

- **Decision**: Fully validate and extract into a transfer-specific staging root before target mutation. In the final phase, insert all catalog rows in one database transaction, promote staged images by same-volume atomic rename, and record a durable transfer journal; startup recovery removes uncommitted staging/promoted roots and marks interrupted operations.
- **Rationale**: Filesystem and database cannot share one transaction. Staging plus a journal avoids partial visible catalog content while keeping long-running archive validation outside a database transaction.
- **Alternatives considered**: A transaction only covers database rows, not files. Copying directly into active image storage risks partial content on error or restart.

## D6. Operation Coordination and Background Work

- **Decision**: Introduce one persistent `CatalogTransferOperation` lease shared by catalog transfer and catalog-changing workflows. Start endpoints persist a pending operation then enqueue a Hangfire worker; status is polled through the existing Web/API pattern.
- **Rationale**: Existing catalog-import conflict checks only cover running imports and do not coordinate exports or ordinary catalog mutations. A database-backed lease works across browser sessions and process instances.
- **Alternatives considered**: In-memory locks do not survive restarts or multiple server processes. Separate locks per feature allow conflicting snapshot/mutation operations.

## D7. Access, Errors, and UI

- **Decision**: Protect the transfer controller and page with the existing administrator identity; add the currently missing authentication/authorization middleware before enabling the feature. Use a transfer error DTO with stable code, message, impact, recommended action, and optional failed check/item path; keep unexpected failures as RFC 7807 responses.
- **Rationale**: Packages expose the entire catalog and must not be disclosed or modified anonymously. Structured expected errors satisfy the actionable-error constitution requirement and support localized UI messaging.
- **Alternatives considered**: Reusing anonymous error objects gives clients insufficient remediation detail. Endpoint-only access without UI protection permits accidental data disclosure.

## D8. Test Strategy

- **Decision**: Add unit tests for package canonicalization, archive safety, validation, states, and lease rules; PostgreSQL/filesystem integration tests for complete round trips and cleanup; HTTP contract tests for authorization and operation lifecycle; and bUnit tests for transfer UI states/localization.
- **Rationale**: The highest risks are data loss, partial restore, archive safety, concurrency, and operator comprehension. These span all project layers and require more than unit testing.
- **Alternatives considered**: Live-source tests are irrelevant because transfer is offline. Unit-only tests cannot prove transaction/filesystem recovery or HTTP authorization.
