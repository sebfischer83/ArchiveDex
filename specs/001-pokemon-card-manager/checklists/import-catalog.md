# Import & Catalog Requirements Quality Checklist: ArchiveDex

**Purpose**: Validate that requirements for TCGdex import and catalog data (US2/US6) are
complete, clear, consistent, and measurable before task generation.
**Created**: 2026-06-16
**Feature**: [spec.md](../spec.md)
**Depth**: Standard | **Audience**: Author (pre-/speckit-tasks)

## Requirement Completeness

- [ ] CHK001 Are requirements defined for how sets and card languages are presented for selection at import scope time? [Completeness, Spec §FR-009a]
- [ ] CHK002 Are requirements defined for the upsert key that prevents duplicates across re-imports? [Gap, Spec §FR-011]
- [ ] CHK003 Are requirements specified for which card fields are correctable locally vs fixed? [Gap, Spec §FR-013]
- [ ] CHK004 Are requirements defined for mandatory fields when manually adding a card? [Completeness, Spec §FR-014]
- [ ] CHK005 Are requirements defined for catalog behavior when the external source is offline (browse imported data)? [Completeness, Spec §Assumptions]

## Requirement Clarity

- [ ] CHK006 Is "import progress" defined with the specific counts/states to be reported (imported/updated/skipped/errors)? [Clarity, Spec §FR-010]
- [ ] CHK007 Is "preserve local corrections" defined precisely (override-wins semantics) rather than narratively? [Clarity, Spec §FR-013]
- [ ] CHK008 Are the searchable/filterable catalog fields (name, number, set, card language) enumerated unambiguously? [Clarity, Spec §FR-015]
- [ ] CHK009 Is "additional sources can be added later" scoped clearly as design-only (TCGdex only in v1)? [Ambiguity, Spec §FR-009]

## Acceptance Criteria Quality

- [ ] CHK010 Is the <2s catalog search target (SC-003) tied to a defined "typical catalog" size that is itself specified? [Measurability, Spec §SC-003]
- [ ] CHK011 Is the "corrections/manual cards survive re-import in 100% of cases" criterion (SC-009) expressed testably against the upsert path? [Measurability, Spec §SC-009]

## Scenario & Edge Case Coverage

- [ ] CHK012 Are requirements defined for partial import failure (source rate-limit/timeout mid-run) leaving the catalog consistent? [Exception Flow, Spec §Edge Cases]
- [ ] CHK013 Are requirements defined for re-import updating existing records without orphaning local corrections? [Recovery, Spec §FR-011/FR-013]
- [ ] CHK014 Are requirements defined for a manual card later appearing in the external source (conflict resolution)? [Conflict, Gap]
- [ ] CHK015 Are requirements defined for selecting zero sets or zero languages (empty import scope)? [Edge Case, Gap, Spec §FR-009a]

## Consistency

- [ ] CHK016 Are card-language codes used in import consistent with those in scan/OCR and collection filtering? [Consistency, Spec §FR-012/FR-015/FR-019]
- [ ] CHK017 Is the relationship between Set and Card per card language consistent between spec entities and the import scope model? [Consistency, Spec §Key Entities/FR-009a]
- [ ] CHK018 Does the requirement that catalog cards display in their own card language hold consistently across import and search results? [Consistency, Spec §FR-031/SC-008]

## Notes

- Items test requirement quality, not importer behavior.
- CHK014 surfaces an undefined conflict path (manual card vs later upstream record).
