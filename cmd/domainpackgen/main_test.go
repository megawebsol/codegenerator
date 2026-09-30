package main

import "testing"

func TestParseRESOPreservesFieldsAndLookups(t *testing.T) {
	root := map[string]any{
		"resources": []any{"Property"},
		"fields": []any{
			map[string]any{"resourceName":"Property","fieldName":"PropertyType","type":"org.reso.metadata.enums.PropertyType","nullable":true,"isEnumeration":true},
		},
		"lookups": []any{
			map[string]any{"lookupName":"org.reso.metadata.enums.PropertyType","lookupValue":"Residential","type":"Edm.Int32"},
			map[string]any{"lookupName":"org.reso.metadata.enums.PropertyType","lookupValue":"Commercial","type":"Edm.Int32"},
		},
	}
	terms, rels := parseRESO(root)
	if len(terms) != 5 { t.Fatalf("terms=%d want 5", len(terms)) }
	if len(rels) != 4 { t.Fatalf("relations=%d want 4", len(rels)) }
}

func TestParsePDTFBuildsProgressiveRelations(t *testing.T) {
	root := map[string]any{
		"type":"object",
		"properties": map[string]any{
			"kind": map[string]any{"type":"string","enum":[]any{"A","B"}},
			"details": map[string]any{"type":"string"},
		},
		"required":[]any{"kind"},
		"discriminator":map[string]any{"propertyName":"kind"},
		"oneOf":[]any{
			map[string]any{"properties":map[string]any{
				"kind":map[string]any{"enum":[]any{"A"}},
				"details":map[string]any{"type":"string"},
			},"required":[]any{"details"}},
		},
	}
	terms, rels := parsePDTF(root)
	if len(terms) < 4 { t.Fatalf("terms=%d expected schema and enum nodes", len(terms)) }
	var unlock, conditional bool
	for _, r := range rels {
		if r["type"] == "unlocks" { unlock = true }
		if r["type"] == "conditionally_requires" { conditional = true }
	}
	if !unlock { t.Fatal("missing unlocks relation") }
	if !conditional { t.Fatal("missing conditionally_requires relation") }
}

func TestUIHintsArePresentationOnly(t *testing.T) {
	h := uiHint("Edm.String", true, true, "")
	if h["authority"] != "presentation_hint_only" { t.Fatalf("authority=%v", h["authority"]) }
	if h["control"] != "multi_search_select" { t.Fatalf("control=%v", h["control"]) }
}
