# Generated Real Estate Term/Relation Pack

Large-ERP vocabulary layer generated from pinned dictionaries. It is not a hand-maintained list and it is not the canonical Domain Virtual Pack.

## Current generated coverage

- 14,278 terms/nodes
- 15,764 structural/conditional relations
- RESO 2.1: 2,140 fields plus 4,129 lookup values
- PDTF 3.5: schema nodes, enum values, required constraints and discriminator/oneOf progressive rules
- INREV SDDS 4.0: 475 indicators
- INREV ESG SDDS 1.1: 388 indicators
- Quipu Real Estate Core 1.1: 186 governed terms

## Generate

```bash
go run ./cmd/domainpackgen -basicquipudb ../basicquipudb -out data/generated/real-estate-domain-pack
```

## Normative rules

UNKNOWN FIELD != DROP
UNKNOWN JURISDICTION != DROP
OPERATIONAL DATA != DROP
SOURCE-SPECIFIC DATA != DROP
UNMAPPED != INVALID

The generated UI control is only a presentation hint. Semantic equivalence and package promotion require explicit adjudication.
