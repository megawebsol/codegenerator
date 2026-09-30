# Real Estate Domain Facets and ERP Navigation Model

## Status

- Review artifact
- Non-canonical
- Non-normative until adjudicated
- Language: English
- Regional terminology and jurisdiction-specific adaptations must be applied later as extensions or mappings

This document defines the organizational model for a large real-estate ERP and for a future generated Real Estate Domain Virtual Pack candidate.

It distinguishes:

1. Domain facets, used by the generator to organize terms, relations, constraints, field metadata and progressive disclosure.
2. ERP navigation macro-areas, used to organize human-facing CRUD workflows without forcing the domain into a rigid menu or tree.

The model is intentionally not a fixed ontology hierarchy.

---

## 1. Core Principles

### 1.1 Facets are not tables

The categories defined here must not be interpreted as relational tables, physical storage structures, or QuipuDB stores.

They are classification and interaction facets used to organize a large reusable vocabulary.

### 1.2 Facets are not packages

A facet does not determine package ownership.

Package ownership remains independently adjudicated and may be:

- core
- extension
- jurisdiction
- application
- operational
- unassigned

### 1.3 Facets are not a semantic tree

A term may participate in multiple facets simultaneously.

Example:

~~~text
Registry Certificate
→ Property Identity
→ Documentary Evidence
→ Ownership
→ Due Diligence
~~~

This must not create duplicated semantic concepts.

### 1.4 Relations drive context

Progressive CRUD behavior must be driven by relations and conditions rather than a fixed parent-child tree.

Example:

~~~text
Apartment
  can_specialize_as → Penthouse
  can_specialize_as → Duplex
  may_expose → Balcony
  may_expose → Shared Amenities
~~~

~~~text
Smallholding
  compatible_with → Rural Context
  compatible_with → Urban Context
~~~

The same term may participate in several contextual relationships.

### 1.5 Regionalisms are applied later

The base vocabulary must use neutral English terminology wherever possible.

Brazilian, British, North American, European, or other jurisdiction-specific concepts must be preserved through jurisdiction metadata, aliases, mappings, extension packages, source observations, and regional UI labels.

Regional wording must not redefine the base concept.

---

# 2. Domain Facets

The following 24 facets organize the Real Estate vocabulary. They are intended for generator logic, CRUD metadata, field discovery, filtering, progressive disclosure and relation traversal.

## 1. Property Identity and Real Estate Unit

Covers the identity of the governed real-estate object.

Typical concepts:

- legal property unit
- property identifier
- registry reference
- cadastral reference
- asset type
- asset subtype
- component units
- accessory units
- property composition
- marketable components

Property identity must remain distinct from listings, bundles, documents and commercial representations.

## 2. Location and Territorial Context

Typical concepts:

- address
- geographic coordinates
- country
- region
- municipality
- district
- neighborhood
- postal code
- urban context
- rural context
- zoning
- cadastral geography
- georeferencing
- territorial restrictions

Location data may be structured values, references or observations.

## 3. Land, Building and Physical Structure

Typical concepts:

- parcel
- lot
- land area
- building
- structure
- unit
- floor
- room
- gross area
- net area
- private area
- built area
- construction date
- renovation
- construction materials
- physical condition

Land, building, legal unit and physical structure remain distinct.

## 4. Features, Equipment and Infrastructure

Typical concepts:

- internal features
- external features
- common facilities
- parking
- accessibility
- security
- utilities
- water
- drainage
- electricity
- gas
- heating
- cooling
- connectivity
- broadband
- telecommunications
- building systems

This facet may expose both enumerated terms and measurable values.

## 5. Nearby Places and Surroundings

Typical concepts:

- schools
- universities
- hospitals
- clinics
- pharmacies
- public transport
- subway
- railway
- airports
- retail
- supermarkets
- shopping centers
- parks
- public services

A proximity observation may contain place type, named place, distance, travel time, travel mode, coordinates and source.

## 6. Ownership, Possession and Occupancy

Typical concepts:

- owner
- co-owner
- ownership share
- possessor
- occupant
- tenant
- beneficial interest
- occupancy basis
- validity period
- supporting evidence

Mandatory distinction:

~~~text
Owner != Possessor != Occupant
~~~

## 7. Rights, Encumbrances, Restrictions and Tenure

Typical concepts:

- mortgage
- fiduciary security
- lien
- attachment
- easement
- usufruct
- right of way
- environmental restriction
- planning restriction
- urban restriction
- leasehold
- shared ownership
- restrictive covenant
- title restriction

Jurisdiction-specific concepts must preserve jurisdiction metadata.

## 8. Condominium and Property Administration

Typical concepts:

- condominium
- association
- shared ownership structure
- common areas
- unit share
- condominium fee
- service charge
- reserve fund
- property manager
- syndic or equivalent contextual role
- board
- council
- meetings
- resolutions
- bylaws
- internal rules

Regional governance structures must be mapped rather than collapsed into one terminology.

## 9. Parties, Organizations and Contextual Roles

Party types may include person, organization, agency, bank, insurer, public authority and professional service provider.

Typical roles:

- owner
- seller
- buyer
- broker
- agent
- advertiser
- publisher
- tenant
- landlord
- surveyor
- valuer
- conveyancer
- lawyer
- lender
- administrator

A role is contextual and temporal.

~~~text
Person != RoleAssignment
~~~

## 10. Documents, Evidence and Compliance Records

Typical concepts:

- registry certificate
- deed
- title document
- purchase agreement
- lease agreement
- brokerage mandate
- power of attorney
- identity document
- professional license
- tax document
- permit
- occupancy permit
- fire certificate
- environmental license
- floor plan
- technical report
- valuation report
- insurance policy
- energy certificate

Documents must preserve issuer, issue date, validity, identifier, source, verification status, file reference and evidence relationships.

## 11. Acquisition, Brokerage Mandate and Intermediation

Typical concepts:

- property acquisition
- brokerage mandate
- exclusive mandate
- non-exclusive mandate
- agent authorization
- agency
- responsible broker
- partner agency
- mandate validity
- minimum price
- commission
- commission split
- permitted channels

The mandate remains distinct from the listing.

## 12. Commercial Offering, Listing and Publication

Typical concepts:

- sale
- rent
- asking price
- availability
- listing
- listing content
- publication
- publication channel
- portal
- external listing identifier
- media
- photographs
- video
- floor plans
- virtual tours
- publication status

Mandatory distinctions:

~~~text
Asset != Listing
Asset != MarketableBundle
Listing != Publication
~~~

## 13. CRM, Demand and Commercial Relationship

Typical concepts:

- lead
- contact
- inquiry
- demand
- search criteria
- qualification
- matching
- opportunity
- source channel
- contact history
- broker follow-up
- customer preferences

CRM may reference the property domain but must not redefine it.

## 14. Showings, Appointments and Access Operations

Typical concepts:

- showing
- appointment
- open house
- schedule
- visitor
- broker attendance
- access instructions
- lockbox
- key custody
- key movement
- access code
- attendance status

These concepts are operational and must not inflate property core semantics.

## 15. Offer and Negotiation

Typical concepts:

- offer
- counteroffer
- offered price
- offer validity
- financing condition
- contingency
- acceptance
- rejection
- negotiation status
- negotiation history

Mandatory distinction:

~~~text
Offer != Agreement
~~~

## 16. Agreement, Due Diligence and Closing

Typical concepts:

- agreement
- contract
- conditions precedent
- due diligence
- financing approval
- deed
- registration
- closing case
- closing milestone
- title transfer
- possession transfer

Mandatory distinction:

~~~text
Agreement != Closing
~~~

## 17. Obligations, Payments, Allocation and Settlement

Typical concepts:

- obligation
- deposit
- installment
- commission
- payment
- allocation
- tax payment
- fee
- settlement
- distribution
- reconciliation

Mandatory distinction:

~~~text
Closing != Settlement
~~~

## 18. Leasing and Occupancy Management

Typical concepts:

- lease
- landlord
- tenant
- rent
- rent period
- indexation
- deposit
- guarantee
- service charge
- lease restriction
- arrears
- renewal
- break clause
- occupancy
- vacancy

Jurisdiction-specific concepts must preserve source and jurisdiction.

## 19. Valuation, Finance and Investment

Typical concepts:

- market value
- valuation date
- valuation method
- assessor
- valuation observation
- valuation report
- rental income
- net operating income
- occupancy rate
- vacancy
- capex
- operating expenditure
- asset performance
- portfolio metrics
- investment metrics

Mandatory distinction:

~~~text
ValuationObservation != ValuationReport
~~~

## 20. ESG, Sustainability and Environmental Risk

Typical concepts:

- energy consumption
- renewable energy
- greenhouse gas emissions
- water consumption
- waste
- recycling
- green certification
- energy performance
- climate risk
- flood risk
- biodiversity
- environmental exposure

External standards remain external evidence until adjudicated.

## 21. Insurance, Warranty, Maintenance and Condition

Typical concepts:

- insurance
- insured value
- coverage
- warranty
- defect
- inspection
- planned maintenance
- corrective maintenance
- refurbishment
- building condition
- asset conservation
- maintenance responsibility

## 22. Operational Compliance

Typical concepts:

- identity verification
- KYC
- AML
- source of funds
- sanctions screening
- compliance checks
- verification report
- consent
- authorization

These concepts remain operational or jurisdictional unless explicitly adjudicated.

## 23. Provenance, Conflict and Temporal Semantics

Every normalized observation must be able to distinguish:

~~~text
raw_value
normalized_value
resolved_value
~~~

Typical concepts:

- source
- source version
- artifact
- source path
- source record
- observed time
- effective time
- valid from
- valid to
- jurisdiction
- mapping status
- authority
- conflict
- adjudication
- historical assertion

A conflict must not be erased by resolution.

## 24. Review and Data Quality

Typical concepts:

- completeness
- missing information
- invalid value
- unresolved relation
- inconsistent observation
- duplicate
- pending verification
- review status
- approval
- rejection
- adjudication
- quality rule
- validation result

This facet supports automated and human data-quality workflows.

---

# 3. ERP Navigation Macro-Areas

The 24 facets must not become 24 independent top-level menus.

They are grouped into eight macro-areas for human-facing CRUD.

## 1. Property

Includes facets 1 through 5:

- Property Identity and Real Estate Unit
- Location and Territorial Context
- Land, Building and Physical Structure
- Features, Equipment and Infrastructure
- Nearby Places and Surroundings

Purpose: describe what the property is, where it is and how it is physically composed.

## 2. Legal

Includes:

- Ownership, Possession and Occupancy
- Rights, Encumbrances, Restrictions and Tenure
- Condominium and Property Administration
- Documents, Evidence and Compliance Records

Purpose: describe legal position, evidence and rights associated with the property.

## 3. Commercial

Includes:

- Acquisition, Brokerage Mandate and Intermediation
- Commercial Offering, Listing and Publication

Purpose: describe authority to market the property and its commercial representation.

## 4. Relationships

Includes:

- Parties, Organizations and Contextual Roles
- CRM, Demand and Commercial Relationship
- Showings, Appointments and Access Operations

Purpose: manage people, organizations, prospects, visits and operational interactions.

## 5. Negotiation

Includes:

- Offer and Negotiation
- Agreement, Due Diligence and Closing

Purpose: manage progression from interest to legally effective transaction completion.

## 6. Financial

Includes:

- Obligations, Payments, Allocation and Settlement
- Leasing and Occupancy Management
- Valuation, Finance and Investment

Purpose: manage money, lease economics, payments, value and investment performance.

## 7. Asset Management

Includes:

- ESG, Sustainability and Environmental Risk
- Insurance, Warranty, Maintenance and Condition

Purpose: manage the property through its operational and physical lifecycle.

## 8. Governance

Includes:

- Operational Compliance
- Provenance, Conflict and Temporal Semantics
- Review and Data Quality

Purpose: control trust, traceability, compliance, temporal validity and data quality.

---

# 4. Multi-Facet Membership

A term may belong to more than one facet without duplication.

Example:

~~~json
{
  "term": "RegistryCertificate",
  "facets": [
    "property_identity",
    "documents_evidence",
    "ownership",
    "due_diligence"
  ]
}
~~~

The generator must maintain one term identity and attach multiple contextual memberships.

---

# 5. Relationship-Driven Progressive CRUD

Forms progressively expose relevant fields from selected values and relations.

Example:

~~~text
Asset Type = Apartment
    ↓
may expose
    Penthouse
    Duplex
    Studio
    Floor
    Private Area
    Common Areas
    Parking
    Condominium
~~~

Example:

~~~text
Transaction Mode = Rent
    ↓
may expose
    Lease
    Tenant
    Deposit
    Guarantee
    Rent
    Indexation
    Service Charge
    Occupancy
~~~

Candidate relation types include:

~~~text
can_specialize_as
compatible_with
requires
suggests
unlocks
supported_by
evidenced_by
applicable_to
available_for
related_to
conflicts_with
derived_from
~~~

No relation type is a universal hierarchy.

---

# 6. UI Metadata

UI hints are presentation metadata, not semantic authority.

Typical mappings:

~~~text
small single-value enum → dropdown
large single-value enum → searchable select
small multi-value enum → checkbox group
large multi-value enum → multi-select with search
boolean → checkbox or toggle
reference → searchable entity picker
money → currency-aware input
measurement → number + unit
document → document selector/upload
geographic value → address/geospatial control
~~~

The renderer may override presentation while preserving the underlying domain contract.

---

# 7. Required Invariants

Mandatory preservation rules:

~~~text
UNKNOWN FIELD != DROP
UNKNOWN JURISDICTION != DROP
OPERATIONAL DATA != DROP
SOURCE-SPECIFIC DATA != DROP
UNMAPPED != INVALID
~~~

Mandatory conceptual distinctions:

~~~text
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
~~~

These distinctions must survive generation, persistence and UI composition.

---

# 8. Intended Use

This facet model supports:

- generated HTML forms
- CRUD generators
- ERP back-office applications
- searchable field catalogs
- progressive property intake
- data import
- external-standard mapping
- validation
- integration
- persistence
- future Domain Virtual Pack generation

It is not:

- a physical schema
- a relational database design
- a fixed ontology tree
- a finished canonical Domain Pack
- a source of semantic authority by itself

---

# 9. Promotion Path

~~~text
external dictionaries + golden corpus
    ↓
lossless extraction
    ↓
terms + values + relationships + constraints
    ↓
domain facets
    ↓
ERP presentation metadata
    ↓
normalized asset projection
    ↓
Domain Pack adjudication
    ↓
canonical semantics
    ↓
candidate Domain Virtual Pack
~~~

Regional and jurisdictional layers are applied only after the neutral base vocabulary is generated and reviewed.
