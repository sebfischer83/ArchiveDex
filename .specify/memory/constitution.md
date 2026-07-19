<!--
Sync Impact Report
==================
Version change: (template) → 1.0.0
Bump rationale: Initial ratification — template placeholders replaced with concrete
                principles and governance. MAJOR baseline established.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Code Quality & Maintainability
  - [PRINCIPLE_2_NAME] → II. Test-First & Coverage Discipline (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. User Experience Consistency
  - [PRINCIPLE_4_NAME] → IV. Performance & Resource Efficiency
  - [PRINCIPLE_5_NAME] → (removed; project scoped to 4 principles per request)

Added sections:
  - Quality & Performance Standards (was [SECTION_2_NAME])
  - Development Workflow & Quality Gates (was [SECTION_3_NAME])

Removed sections:
  - Fifth template principle slot (not used)

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gate — verified compatible)
  - ✅ .specify/templates/spec-template.md (no mandatory-section changes needed)
  - ✅ .specify/templates/tasks-template.md (test-first ordering already enforced)
  - ⚠ README.md (absent — create when project gains a public surface; reference this constitution)

Follow-up TODOs:
  - None. RATIFICATION_DATE set to initial creation date.
-->

# ArchiveDex Constitution

## Core Principles

### I. Code Quality & Maintainability

Code MUST be readable before it is clever. Every change adheres to the following
non-negotiable rules:

- A single linter and formatter configuration is authoritative; CI MUST fail on any
  lint or format violation. Style is never debated in review.
- Functions and modules MUST have a single, clear responsibility. Cyclomatic complexity
  hotspots MUST be refactored, not annotated away.
- Public functions, exported types, and modules MUST carry doc comments stating purpose,
  inputs, outputs, and failure modes. Dead code and commented-out blocks MUST be deleted,
  not shipped.
- Duplication beyond two occurrences MUST be factored into a shared, tested unit (DRY),
  unless the duplication is coincidental and abstraction would couple unrelated concerns.

**Rationale**: ArchiveDex is a long-lived index/archive system; maintenance cost dominates
total cost. Enforced consistency keeps the codebase legible as it grows and as contributors
change.

### II. Test-First & Coverage Discipline (NON-NEGOTIABLE)

Tests define behavior before implementation exists.

- TDD is mandatory: write the test, see it fail, then implement to green, then refactor.
- Every bug fix MUST start with a failing regression test that reproduces the defect.
- Contract and integration tests are REQUIRED for: public API surfaces, data-schema changes,
  inter-component boundaries, and any persistence or indexing format.
- CI MUST block merges when tests fail. Coverage MUST NOT regress below the established
  baseline; new logic ships with new tests.

**Rationale**: An archive's value is its trustworthiness. Test-first is the only economical
way to guarantee data-handling correctness and prevent silent regressions over time.

### III. User Experience Consistency

The product MUST behave predictably across every entry point (CLI, API, or UI).

- Interfaces follow one documented convention for naming, flags/arguments, output shape,
  and exit/error codes. The same operation MUST look and behave the same everywhere.
- Errors MUST be actionable: state what failed, why, and the next step. Errors go to the
  error stream; primary output stays parseable.
- Every user-facing surface MUST support both a human-readable and a machine-readable
  (e.g., JSON) output mode where applicable.
- Breaking changes to any user-facing contract MUST be versioned and documented with a
  migration note before release.

**Rationale**: Consistency is what lets users build muscle memory and automation on top of
ArchiveDex. Surprises erode trust faster than missing features.

### IV. Performance & Resource Efficiency

Performance is a designed property, validated by measurement — not assumed.

- Performance-sensitive paths (indexing, search/query, bulk import/export) MUST have defined
  budgets (latency and memory) recorded in the feature's plan before implementation.
- Claims of "faster" or "more efficient" MUST be backed by a reproducible benchmark; CI MUST
  flag regressions beyond the agreed threshold on critical paths.
- Algorithmic complexity MUST be stated for operations over user data; O(n²)-or-worse on
  unbounded input is prohibited without explicit, documented justification.
- Optimization follows profiling. Premature micro-optimization that harms readability is
  rejected; YAGNI applies to speculative tuning.

**Rationale**: An index/archive is judged on how it scales. Encoding budgets and measuring
against them keeps performance from silently degrading as data volume grows.

## Quality & Performance Standards

- **Tooling**: One canonical lint/format/test toolchain, version-pinned and run identically
  in CI and locally. No green-on-my-machine merges.
- **Performance budgets**: Defined per feature in `plan.md`. Critical paths carry automated
  benchmarks; thresholds are committed alongside the code they guard.
- **Observability**: Operations that mutate or index data MUST emit structured logs
  sufficient to reconstruct what happened. Failures MUST be diagnosable from logs alone.
- **Dependencies**: New third-party dependencies MUST be justified (maintenance, license,
  size, security) in review. Prefer the standard library when the gap is small.

## Development Workflow & Quality Gates

- **Pull requests**: Every change lands via PR with at least one review. Reviewers MUST
  verify compliance with all four core principles, not just correctness.
- **Merge gates (all REQUIRED to pass)**: lint/format clean, all tests green, coverage not
  regressed, critical-path benchmarks within threshold.
- **Plan gate**: Each feature's `plan.md` includes a Constitution Check; any deviation MUST
  be recorded with explicit justification before implementation begins.
- **Documentation**: User-facing changes update their docs in the same PR. Undocumented
  behavior is treated as a defect.

## Governance

This constitution supersedes all other development practices. Where another document
conflicts with it, this constitution wins.

- **Amendments**: Proposed via PR editing this file, with a rationale and a migration/impact
  note. Approval requires the project maintainer's sign-off.
- **Versioning**: This document follows semantic versioning. MAJOR for backward-incompatible
  governance or principle removal/redefinition; MINOR for a new principle or materially
  expanded guidance; PATCH for clarifications and non-semantic refinements.
- **Compliance**: All PRs and reviews MUST verify adherence to the core principles. Any
  complexity or deviation MUST be justified in writing and approved, never assumed.
- **Runtime guidance**: Agent and contributor runtime guidance lives in `AGENTS.md` and
  `CLAUDE.md`; those files MUST stay consistent with this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
