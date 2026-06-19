# Scan / OCR / Match Requirements Quality Checklist: ArchiveDex

**Purpose**: Validate that requirements for the scan → OCR → match → confirm flow (US3) are
complete, clear, consistent, and measurable before task generation.
**Created**: 2026-06-16
**Feature**: [spec.md](../spec.md)
**Depth**: Standard | **Audience**: Author (pre-/speckit-tasks)

## Requirement Completeness

- [ ] CHK001 Are requirements defined for what happens to a ScanJob when OCR fails entirely (no text)? [Completeness, Spec §FR-018/Edge Cases]
- [ ] CHK002 Are requirements specified for the card-language hint source (scanner default vs per-scan selection) feeding OCR language selection? [Gap, Spec §FR-019]
- [ ] CHK003 Are requirements defined for how candidate match ranking is produced from OCR fields (number/name/language/set)? [Gap, Spec §FR-020]
- [ ] CHK004 Are requirements documented for the "no catalog card matches" path beyond manual search? [Completeness, Spec §FR-021]
- [ ] CHK005 Are requirements defined for retaining or discarding the stored image when a scan is rejected? [Gap, Spec §FR-017/FR-023]

## Requirement Clarity

- [ ] CHK006 Is "ranked list / best match first" defined with explicit ordering/scoring criteria? [Clarity, Spec §FR-020]
- [ ] CHK007 Is "low-confidence" quantified with a threshold that drives UI behavior? [Ambiguity, Spec §FR-006 scenario/Edge Cases]
- [ ] CHK008 Is "possible set information" defined precisely (what constitutes a set hint)? [Clarity, Spec §FR-019]
- [ ] CHK009 Are the supported card languages for OCR enumerated consistently with the catalog languages? [Clarity, Spec §FR-012/FR-019]

## Acceptance Criteria Quality

- [ ] CHK010 Is the ≥80% top-match target (SC-004) tied to a defined "clearly photographed" precondition that is itself specified? [Measurability, Spec §SC-004]
- [ ] CHK011 Is the <60s end-to-end flow target (SC-005) decomposed so OCR latency vs user time are separately bounded? [Measurability, Spec §SC-005]
- [ ] CHK012 Is the "0% automatic additions" guarantee (SC-006) expressed as a testable invariant on every confirmation path? [Measurability, Spec §SC-006/FR-022]

## Scenario & Edge Case Coverage

- [ ] CHK013 Are requirements defined for an unsupported image format or >10 MB upload leaving no dangling scan record? [Edge Case, Spec §FR-023]
- [ ] CHK014 Are requirements defined for a duplicate scan of a card already owned (increment quantity vs new entry)? [Coverage, Spec §FR-028/Edge Cases]
- [ ] CHK015 Are requirements defined for a card whose printed language is absent from the imported catalog? [Coverage, Edge Cases]
- [ ] CHK016 Are recovery requirements defined when image storage becomes unwritable mid-upload? [Recovery, Spec §FR-033/Edge Cases]

## Consistency

- [ ] CHK017 Do the ScanJob status states (spec entity) align with the confirm/reject transitions described in US3 acceptance scenarios? [Consistency, Spec §FR-021/Key Entities]
- [ ] CHK018 Are condition values used at confirmation (NM/LP/MP/HP/DMG) consistent with the collection condition requirement? [Consistency, Spec §FR-025a]

## Notes

- Items are requirement-quality checks, not implementation tests.
- Resolve `[Gap]`/`[Ambiguity]` items before `/speckit-tasks` to avoid rework.
