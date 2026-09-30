# Lossless Real Estate Normalization Standard v1

## Status

Normative. This document governs every transformation of the real-estate
golden corpus into a normalized projection or a future Domain Virtual Pack.

## Immutable Source

```text
data/master_data_sample_20260929231422.json
```

This file is the immutable golden corpus of origin. It must never be edited,
rewritten, normalized in place, or overwritten by a later pipeline.

Current source hash:

```text
SHA-256 189fe1c6d8d1847b9a1fb4d69397e88f896d12a09ef33e8a64a55db560c8c2bf
```

Any new source revision creates a new golden corpus filename and a new hash. A
normalization artifact must retain its exact source filename and hash.

## Normative Chain

```text
golden corpus
    ↓
lossless normalization
    ↓
normalized_asset_projection
    ↓
Domain Pack adjudication
    ↓
canonical_asset
    ↓
candidate Domain Virtual Pack
```

`canonical_asset` is not permitted before explicit Domain Pack adjudication.
`normalized_asset_projection` is the only approved name for the intermediate
projection before that adjudication.

## Losslessness Invariants

Every implementation must enforce:

```text
UNKNOWN FIELD != DROP
UNKNOWN JURISDICTION != DROP
OPERATIONAL DATA != DROP
SOURCE-SPECIFIC DATA != DROP
UNMAPPED != INVALID
```

If an implementation cannot map a value, it must preserve the value and mark
the mapping as unresolved. It must never silently discard, coerce, or replace
the value.

The pipeline must fail when:

- a source field has no preserved destination;
- a source array item has no preserved destination;
- a source relationship loses an endpoint;
- a source timestamp loses precision or timezone;
- a source monetary value loses currency or precision;
- a source jurisdiction is silently mapped to the local jurisdiction;
- a conflict is overwritten without an adjudication record.

## Required Normalization Artifact Areas

Every normalized artifact must contain these seven areas:

```text
normalized_asset_projection
external_source_observations
operational_context
relationship_edges
source_registry
conflict_registry
temporal_validation
```

The areas may contain nested structures, but they cannot be omitted because a
candidate renderer or Domain Pack does not currently use them.

## Value Lifecycle

All values that pass through normalization must preserve these states where
applicable:

```text
raw_value
normalized_value
resolved_value
```

### `raw_value`

The value exactly as supplied by the source, including source naming and source
representation where preservation is required.

### `normalized_value`

A lossless structural representation used for comparison and processing. It
may add a type, unit, identifier, or normalized timestamp, but must retain the
raw value and its source path.

### `resolved_value`

An optional value selected by an explicit authority rule or Domain Pack
adjudication. It does not replace either prior value and must include the rule,
authority, evidence, and resolution timestamp.

Example:

```json
{
  "field_ref": "asset.bathroom_count",
  "raw_value": 3,
  "normalized_value": {"value": 3, "unit": "count"},
  "resolved_value": null,
  "source_ref": "source-operational-01",
  "source_path": "propertyPack.residentialPropertyFeatures.bathrooms",
  "mapping_status": "unresolved"
}
```

## Source Registry

Every source must be registered with enough information for reproducibility:

```json
{
  "source_id": "source-pdtf-ta6",
  "name": "PDTF TA6",
  "version": "5",
  "artifact": "TA6",
  "repository": "...",
  "commit": "...",
  "source_hash": "...",
  "jurisdiction": "GB",
  "observed_at": "2026-09-29T22:00:00-03:00"
}
```

Generic source names such as `external`, `real_estate_domain_pack`, or
`PDTF/RICS` are insufficient as the only source identity.

Each observation must also contain:

```text
source_id
source_path
source_record_id
raw_value
normalized_value
normalization_rule
mapping_status
observed_at
effective_at, when known
jurisdiction
```

## Package Ownership

Every normalized type, relation, observation or extension may declare package
ownership using only these package classes:

```text
core
extension
jurisdiction
application
operational
unassigned
```

Ownership status is one of:

```text
candidate
adjudicated
rejected
```

Example:

```json
{
  "package_ownership": {
    "package": "extension",
    "package_id": "real-estate-transaction",
    "status": "candidate"
  }
}
```

No operational or jurisdiction-specific field may be promoted to `core`
without explicit adjudication.

## Conflict Registry

Conflicting observations are historical data and must remain preserved even
when one value is selected for current use.

```json
{
  "conflict_id": "conflict-001",
  "subject_ref": "asset-481",
  "field_ref": "asset.bathroom_count",
  "observations": [
    {"observation_ref": "obs-a", "value": 3},
    {"observation_ref": "obs-b", "value": 4}
  ],
  "resolution_status": "unresolved",
  "resolved_value": null,
  "authority_rule": null,
  "adjudication_ref": null
}
```

When an authority rule resolves a conflict:

```text
conflicting observations
        ↓
preserve all
        ↓
authority rule selects preferred assertion
        ↓
resolved_value
```

Resolution does not delete or mutate the historical observations.

## Temporal Validation

Temporal validation must preserve, when available:

```text
occurred_at
valid_from
valid_to
issued_at
effective_at
observed_at
recorded_at
knowledge_at
external_timestamp
```

An event after the artifact generation timestamp cannot be marked as completed,
verified, settled, or historically observed. It must be represented as planned,
scheduled, pending, or future unless an explicit source timestamp establishes
otherwise.

Temporal checks must report contradictions instead of silently changing dates.

## Canonical Projection Boundaries

The normalized projection must preserve distinctions including:

```text
Person != RoleAssignment
Asset != Listing
Asset != MarketableBundle
ValuationObservation != ValuationReport
SourceObservation != CanonicalFact
Owner != Possessor
Possessor != Occupant
Realtor != Advertiser
Offer != Agreement
Agreement != Closing
Closing != Settlement
ExternalSource != QuipuAuthority
```

Roles are assignments with scope, validity and evidence. Roles must not be
embedded as permanent identity properties of a person or organization.

## Jurisdiction Handling

External jurisdiction data remains valuable and must not be removed. Examples
include leasehold, Council Tax, Building Safety Act, FENSA, ULEZ, Ofsted, BNG,
EPC and RICS/PDTF-specific fields.

They must remain under `external_source_observations` or an explicitly owned
jurisdiction/operational extension. They must not silently contaminate the
Brazilian Quipu core.

## Money And Precision

Canonical monetary values use integer minor units and explicit currency. Source
values remain available under their original observation when conversion occurs.

```json
{
  "raw_value": 1410000.0,
  "normalized_value": {
    "amount_minor": 141000000,
    "currency": "BRL"
  }
}
```

Conversion must record its normalization rule and source precision. Floating
point values must not be used as canonical monetary values.

## Promotion Gate

A normalized projection may be proposed for Domain Pack adjudication only when:

1. All source fields and array items have a preserved destination.
2. All source relationships retain their endpoints.
3. All source and effective timestamps are retained.
4. All source jurisdictions are explicit.
5. All conflicts are registered.
6. All unmapped values are retained and marked.
7. Package ownership is declared or explicitly `unassigned`.
8. Roles are represented as assignments, not fixed identity attributes.
9. Future events are not marked as completed without authority.
10. Canonical monetary values use integer minor units.
11. The source corpus hash is recorded.
12. The transformation is reproducible and lossless.

Only after this gate and explicit adjudication may an element be promoted to
`canonical_asset` or a candidate Domain Virtual Pack.
