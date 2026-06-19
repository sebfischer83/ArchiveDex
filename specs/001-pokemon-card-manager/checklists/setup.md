# Setup & Onboarding Requirements Quality Checklist: ArchiveDex

**Purpose**: Validate that requirements for the first-run setup wizard and access gate (US1)
are complete, clear, consistent, and measurable before task generation.
**Created**: 2026-06-16
**Feature**: [spec.md](../spec.md)
**Depth**: Standard | **Audience**: Author (pre-/speckit-tasks)

## Requirement Completeness

- [ ] CHK001 Are requirements defined for which routes/assets are exempt from the setup gate (wizard + required static assets)? [Completeness, Spec §FR-001]
- [ ] CHK002 Are requirements specified for each optional wizard step's default values (import, OCR, scanner) when left unset? [Gap, Spec §FR-003]
- [ ] CHK003 Are requirements defined for editing setup-captured settings after setup completes? [Completeness, Spec §FR-002/Key Entities ApplicationConfiguration]
- [ ] CHK004 Are password strength/validation requirements for the administrator account specified? [Gap, Spec §FR-002/FR-007]
- [ ] CHK005 Are requirements defined for selecting and validating the collection currency at setup? [Completeness, Spec §FR-002/FR-025b]

## Requirement Clarity

- [ ] CHK006 Is "setup complete" defined with explicit, observable conditions (admin + storage + DB validated)? [Clarity, Spec §FR-004/FR-005]
- [ ] CHK007 Is "must not allow normal usage before setup" defined precisely (redirect vs block, status codes)? [Clarity, Spec §FR-001]
- [ ] CHK008 Are database "embedded vs external" inputs specified with the exact fields each mode requires? [Clarity, Spec §FR-002]

## Acceptance Criteria Quality

- [ ] CHK009 Is the <5 min setup target (SC-001) tied to a defined scope of steps that is itself enumerated? [Measurability, Spec §SC-001]
- [ ] CHK010 Is the "100% of pre-setup access redirected" criterion (SC-002) expressed as a testable invariant across all non-setup routes? [Measurability, Spec §SC-002]

## Scenario & Edge Case Coverage

- [ ] CHK011 Are requirements defined for resuming the wizard after an interrupted/abandoned session? [Recovery, Spec §Edge Cases]
- [ ] CHK012 Are requirements defined for concurrent setup attempts in two tabs (only one valid completion)? [Edge Case, Spec §Edge Cases]
- [ ] CHK013 Are requirements defined for failed validation (unreachable DB / unwritable path) blocking progress with actionable messages? [Exception Flow, Spec §FR-005]
- [ ] CHK014 Are requirements defined for navigating to the wizard URL after setup is complete (redirect away)? [Coverage, Spec §FR-004]

## Security & Consistency

- [ ] CHK015 Are requirements that the admin password is one-way hashed and never displayed stated unambiguously? [Security, Spec §FR-007]
- [ ] CHK016 Is the atomicity requirement for setup completion (config + admin + flag in one transaction) documented in the spec, not only the plan? [Consistency, Spec §FR-005 vs plan]
- [ ] CHK017 Is the default UI culture chosen at setup consistent with the supported cultures (de/en/ru) and fallback rule? [Consistency, Spec §FR-029/FR-032]

## Notes

- Items test requirement quality, not wizard behavior.
- CHK016 flags a spec/plan traceability gap: atomicity currently lives in research/plan.
