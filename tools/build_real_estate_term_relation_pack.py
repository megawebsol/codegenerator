#!/usr/bin/env python3
"""Build a source-indexed, relational real-estate term pack for CRUD generators."""

import json
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT.parent / "basicquipudb"
OUT = ROOT / "data/real-estate-term-relation-pack.json"


def read_json(path):
    return json.loads(path.read_text())


def source(source_id, name, path, version, authority, license_name=None):
    item = {"id": source_id, "name": name, "path": str(path), "version": version, "authority": authority}
    if license_name:
        item["license"] = license_name
    return item


def control_for(value_type, enum=False):
    if enum:
        return {"control": "choice", "selection": "single", "searchable": True}
    value_type = (value_type or "").lower()
    if "bool" in value_type:
        return {"control": "checkbox"}
    if "date" in value_type or "time" in value_type:
        return {"control": "date-or-datetime"}
    if any(x in value_type for x in ("int", "decimal", "double", "float", "money", "number")):
        return {"control": "numeric-input", "filter_operators": ["equals", "greater_than", "greater_or_equal", "less_than", "less_or_equal", "between"]}
    if "geo" in value_type or "point" in value_type:
        return {"control": "map-or-coordinate"}
    if "url" in value_type or "uri" in value_type:
        return {"control": "url"}
    return {"control": "text-input", "searchable": True, "filter_operators": ["equals", "contains", "starts_with"]}


def walk_schema(node, path=""):
    if isinstance(node, dict):
        for key, value in node.items():
            current = f"{path}.{key}" if path else key
            yield current, value
            yield from walk_schema(value, current)
    elif isinstance(node, list):
        for index, value in enumerate(node):
            yield from walk_schema(value, f"{path}[{index}]")


def main():
    reso_path = DB / "dictionaries/reso-dd-2.1.0/dd-2.1.json"
    pdtf_path = DB / "dictionaries/opda-pdtf-3.5.0/combined.json"
    transaction_path = DB / "dictionaries/opda-pdtf-3.5.0/pdtf-transaction.json"
    inrev_path = DB / "dictionaries/inrev-sdds-4.0.0/sdds-indicators.json"
    lexicon_path = DB / "apps/imobitools/lexicon.yaml"
    manifest_path = DB / "domainpacks/real_estate/generated/real-estate-manifests.yaml"

    reso = read_json(reso_path)
    pdtf = read_json(pdtf_path)
    transaction = read_json(transaction_path)
    inrev = read_json(inrev_path)
    lexicon_text = lexicon_path.read_text()
    manifest = read_json(manifest_path)

    sources = [
        source("quipu-real-estate", "Quipu Real Estate Domain Pack", "domainpacks/real_estate", "1.1.0", "candidate semantic authority"),
        source("imobitools-lexicon", "ImobiTools legacy/reference lexicon", "apps/imobitools/lexicon.yaml", "1.0.0", "reference evidence"),
        source("reso-dd-2.1", "RESO Data Dictionary", "dictionaries/reso-dd-2.1.0/dd-2.1.json", "2.1", "external operational vocabulary", "RESO EULA"),
        source("opda-pdtf-3.5", "OPDA/PDTF", "dictionaries/opda-pdtf-3.5.0/combined.json", "3.5.0", "external transaction/property vocabulary", "MIT"),
        source("opda-pdtf-transaction", "PDTF Transaction", "dictionaries/opda-pdtf-3.5.0/pdtf-transaction.json", "3.5.0", "external transaction vocabulary", "MIT"),
        source("inrev-sdds", "INREV SDDS", "dictionaries/inrev-sdds-4.0.0/sdds-indicators.json", "4.0.0", "external investment/valuation vocabulary"),
        source("lkif-core", "LKIF Core", "dictionaries/lkif-core-1.1-2026-02-23", "1.1", "external legal-role/process vocabulary", "CC BY 4.0"),
        source("ucum", "UCUM", "dictionaries/ucum-2.2/ucum-essence.xml", "2.2", "external unit vocabulary"),
    ]

    categories = [
        {"id": "asset_identity", "label": "Identidade e topologia do ativo", "terms": ["LegalPropertyUnit", "RegistryEvidence", "LandParcel", "PhysicalStructure", "Building", "Condominium", "Place", "MarketableBundle"]},
        {"id": "rights_and_roles", "label": "Direitos, papéis e titularidade", "terms": ["Owner", "Possessor", "Occupant", "Seller", "Buyer", "Realtor", "Syndic", "Administrator", "BrokerageMandate"]},
        {"id": "market_cycle", "label": "Mercado, publicação e negociação", "terms": ["Listing", "Publication", "Demand", "Visit", "Opportunity", "Offer", "AcceptanceAct", "Agreement"]},
        {"id": "legal_documents", "label": "Documentos, regularidade e diligência", "terms": ["RegistryEvidence", "Permit", "License", "ContractDocument", "DeedClearance", "Certificate", "TechnicalEvidence"]},
        {"id": "transaction_finance", "label": "Obrigação, pagamento e fechamento", "terms": ["Obligation", "Payment", "Allocation", "Settlement", "ClosingCase", "Sale"]},
        {"id": "property_details", "label": "Características, instalações e proximidades", "terms": ["room", "area", "parking", "utility", "energy", "media", "school", "transport", "healthcare", "amenity"]},
        {"id": "investment_esg", "label": "Investimento, ESG e sustentabilidade", "terms": ["valuation", "investment", "ESG", "energy", "emission", "risk", "performance"]},
    ]

    terms = []
    seen = set()

    def add(item):
        key = (item["term"], item.get("source_id"), item.get("source_path"))
        if key not in seen:
            seen.add(key)
            terms.append(item)

    for definition in manifest.get("manifests", []):
        for term in definition.get("symbols", []):
            add({"term": term, "kind": "domain_symbol", "category": "asset_identity", "source_id": "quipu-real-estate", "source_path": f"manifests.{definition['name']}", "package_ownership": "core", "mapping_status": "candidate"})

    for match in re.finditer(r"^\s*name:\s+(.+)$", lexicon_text, re.MULTILINE):
        term = match.group(1).strip().strip("'")
        category = "rights_and_roles" if term in {"Person", "Enterprise", "Realtor", "Seller", "Buyer", "Syndic", "Mandate", "Property"} else "asset_identity"
        add({"term": term, "kind": "reference_lexicon_term", "category": category, "source_id": "imobitools-lexicon", "source_path": "definitions.name", "package_ownership": "application", "mapping_status": "candidate"})

    for field in reso.get("fields", []):
        name = field.get("fieldName")
        resource = field.get("resourceName")
        description = next((a.get("value") for a in field.get("annotations", []) if a.get("term") == "Core.Description"), None)
        item = {"term": name, "kind": "external_field", "category": "property_details" if resource == "Property" else "market_cycle", "resource": resource, "source_id": "reso-dd-2.1", "source_path": f"fields[{resource}.{name}]", "value_type": field.get("type"), "nullable": field.get("nullable", True), "enum": field.get("isEnumeration", False), "description": description, "mapping_status": "external_observation", "package_ownership": "operational"}
        item.update(control_for(field.get("type"), field.get("isEnumeration", False)))
        add(item)

    for root_name, schema in (("pdtf", pdtf), ("pdtf_transaction", transaction)):
        for path, value in walk_schema(schema):
            if path in {"$schema"} or path.endswith(".properties"):
                continue
            if isinstance(value, dict) and any(k in value for k in ("type", "enum", "description", "title")):
                item = {"term": path.split(".")[-1], "kind": "external_schema_property", "category": "legal_documents" if any(x in path.lower() for x in ("document", "title", "contract", "deed")) else "market_cycle", "source_id": "opda-pdtf-transaction" if root_name == "pdtf_transaction" else "opda-pdtf-3.5", "source_path": path, "schema": value, "mapping_status": "external_observation", "package_ownership": "jurisdiction"}
                item.update(control_for(value.get("type"), bool(value.get("enum"))))
                add(item)

    for indicator in inrev.get("indicators", []):
        add({"term": indicator.get("label"), "kind": "external_indicator", "category": "investment_esg", "source_id": "inrev-sdds", "source_path": f"indicators[{indicator.get('sdds_id')}]", "value_type": indicator.get("data_type"), "description": indicator.get("definition__instruction"), "mapping_status": "external_observation", "package_ownership": "extension", "control": "text-or-numeric"})

    relations = [
        {"type": "evidenced_by", "from": "LegalPropertyUnit", "to": "RegistryEvidence"},
        {"type": "situated_on", "from": "LegalPropertyUnit", "to": "LandParcel"},
        {"type": "embodied_in", "from": "LegalPropertyUnit", "to": "PhysicalStructure"},
        {"type": "located_at", "from": "LegalPropertyUnit", "to": "Place"},
        {"type": "part_of", "from": "LegalPropertyUnit", "to": ["Building", "Condominium"]},
        {"type": "included_in", "from": "LegalPropertyUnit", "to": "MarketableBundle"},
        {"type": "owned_by", "from": "LegalPropertyUnit", "to": ["Person", "Enterprise"]},
        {"type": "possessed_by", "from": "LegalPropertyUnit", "to": ["Person", "Enterprise"]},
        {"type": "occupied_by", "from": "LegalPropertyUnit", "to": ["Person", "Enterprise"]},
        {"type": "administered_by", "from": "Condominium", "to": ["Syndic", "Enterprise"]},
        {"type": "represented_by", "from": "MarketableBundle", "to": "BrokerageMandate"},
        {"type": "handled_by", "from": "BrokerageMandate", "to": ["Realtor", "Enterprise"]},
        {"type": "advertised_as", "from": "MarketableBundle", "to": "Listing"},
        {"type": "published_by", "from": "Listing", "to": ["Realtor", "Enterprise"]},
        {"type": "receives", "from": "Listing", "to": "Offer"},
        {"type": "offer_on", "from": "Offer", "to": "Listing"},
        {"type": "offer_by", "from": "Offer", "to": "Buyer"},
        {"type": "results_in", "from": "Offer", "to": "Agreement"},
        {"type": "sale_of", "from": "Sale", "to": "LegalPropertyUnit"},
        {"type": "sale_from", "from": "Sale", "to": "Seller"},
        {"type": "sale_to", "from": "Sale", "to": "Buyer"},
        {"type": "employs", "from": "Enterprise", "to": "Person"},
        {"type": "occupies", "from": "PersonOrOrganization", "to": "PlaceOrUnit"},
        {"type": "manages", "from": "PersonOrOrganization", "to": "Condominium"},
        {"type": "unit_of", "from": "LegalPropertyUnit", "to": "Building"},
    ]

    generated_at = datetime.now(ZoneInfo("America/Sao_Paulo")).isoformat(timespec="seconds")
    pack = {
        "pack_id": "real-estate-term-relation-pack",
        "version": "1.0.0",
        "generated_at": generated_at,
        "timezone": "America/Sao_Paulo",
        "purpose": "Catálogo relacional reutilizável de termos, relações e metadados de preenchimento para fichas imobiliárias complexas.",
        "authority": "External dictionaries are reference evidence; semantic/package placement requires adjudication.",
        "sources": sources,
        "categories": categories,
        "terms": terms,
        "relations": relations,
        "progressive_contexts": [
            {"id": "location", "label": "Localização", "suggests": ["Place", "Address", "coordinates", "municipality", "zone", "nearby facilities"]},
            {"id": "asset_type", "label": "Tipo e subtipo do ativo", "suggests": ["LegalPropertyUnit", "LandParcel", "PhysicalStructure", "Building", "Condominium", "Property fields"]},
            {"id": "rights", "label": "Titularidade, posse e papéis", "suggests": ["Owner", "Possessor", "Occupant", "Seller", "Buyer", "Realtor", "Syndic", "Mandate"]},
            {"id": "commercial", "label": "Negócio", "suggests": ["Listing", "Publication", "Demand", "Visit", "Offer", "Sale", "Lease"]},
            {"id": "documents", "label": "Documentos e regularidade", "suggests": ["RegistryEvidence", "Permit", "ContractDocument", "DeedClearance", "TechnicalEvidence", "CPF", "CNPJ", "CNH", "Deed"]},
            {"id": "finance", "label": "Financeiro e fechamento", "suggests": ["Obligation", "Payment", "Allocation", "Settlement", "ClosingCase", "commission"]},
            {"id": "operations", "label": "Operação do imóvel", "suggests": ["access", "keys", "lockbox", "showings", "appointments", "utilities", "insurance", "maintenance"]},
            {"id": "investment_esg", "label": "Investimento e ESG", "suggests": ["valuation", "INREV indicators", "energy", "emissions", "risk", "sustainability"]}
        ],
        "crud_metadata": {
            "field_selection": "choose control from term value_type, enum status, cardinality, source volume and searchable flag",
            "controls": ["text-input", "numeric-input", "date-or-datetime", "choice", "checkbox", "multi-select", "lookup", "structured-editor", "file-reference", "map-or-coordinate", "repeatable-table"],
            "progressive_rule": "selecting a term suggests related terms through relations; it never imposes a single tree or changes authority",
            "unknown_handling": "preserve unknown source terms and mark mapping_status instead of dropping them"
        },
        "package_ownership": {"allowed_packages": ["core", "extension", "jurisdiction", "application", "operational", "unassigned"], "statuses": ["candidate", "adjudicated", "rejected"]},
        "statistics": {"term_count": len(terms), "relation_count": len(relations), "source_count": len(sources)}
    }
    OUT.write_text(json.dumps(pack, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(pack["statistics"]))


if __name__ == "__main__":
    main()
