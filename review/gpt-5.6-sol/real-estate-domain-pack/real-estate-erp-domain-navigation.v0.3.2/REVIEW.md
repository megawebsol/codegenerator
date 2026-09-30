# Real Estate ERP Domain Navigation v0.3.2 Review

## Result

v0.3.2 replaces the unsafe binding assumptions of v0.3.0/v0.3.1.

## Preserved operational usability

- 1,338 operational form fields from v0.2.1 are preserved as `form_fields`.
- Form-field identity is explicitly independent from `LexiconTerm.symbol`.
- A source field remains usable in CRUD/forms even when semantic adjudication is pending.

## Lexicon review

- 1034 external source-field occurrences reviewed.
- 33 exact-name mappings accepted only after semantic review.
- 41 contextual crosswalks accepted and typed by relation.
- 9 exact-name collisions retained as candidates rather than auto-promoted.
- 48 definition mentions retained only as evidence.
- 903 remain for semantic adjudication.

## False positives removed

The prior algorithm could map by wording alone. Confirmed unsafe examples included:

- `valuationComparisonData.propertyPricing.yield` -> `base0001.yield@1` (wrong semantic meaning)
- verification `result` -> generic action `result` (insufficiently specific)
- `Media.Order` -> generic `order` (ambiguous)
- `Member.Office` -> `application_suite` from incidental wording (wrong)

These are no longer automatically mapped.

## Important semantic correction

`candidate_*` means the binding is unresolved or needs adjudication. It does **not** mean that the concept is absent from Universal Lexicon v2.

## Property Identity

The 42 form-oriented fields from v0.2.1 are preserved. Lexicon bindings are attached independently where justified; unresolved fields remain usable.

## Authority

Universal Lexicon v2:
`megawebsol/quipu-knowledge-hub/semantic-space/lexicon/bases/base0001/lexicon.json`
blob: `a90dee2dbf6aa60aa894a7e442dfc4af3e62c4f5`
