package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

type Term map[string]any
type Relation map[string]any

var idRe = regexp.MustCompile(`[^A-Za-z0-9_.:@/-]+`)
var requiredKeys = []string{"required","baspi4Required","baspi5Required","ta6Required","ntsRequired","nts2Required","ntslRequired","ntsl2Required"}

func id(s string) string { return idRe.ReplaceAllString(s, "_") }
func obj(v any) map[string]any { m, _ := v.(map[string]any); return m }
func arr(v any) []any { a, _ := v.([]any); return a }
func str(v any) string { s, _ := v.(string); return s }
func boolv(v any) bool { b, _ := v.(bool); return b }

func readJSON(path string) map[string]any {
	b, err := os.ReadFile(path)
	if err != nil { panic(err) }
	var v map[string]any
	if err := json.Unmarshal(b, &v); err != nil { panic(fmt.Errorf("%s: %w", path, err)) }
	return v
}
func writeJSON(path string, v any) {
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil { panic(err) }
	b, err := json.MarshalIndent(v, "", "  "); if err != nil { panic(err) }
	if err := os.WriteFile(path, append(b, '\n'), 0644); err != nil { panic(err) }
}
func ann(m map[string]any, term string) string {
	for _, av := range arr(m["annotations"]) {
		a := obj(av); if str(a["term"]) == term { return str(a["value"]) }
	}
	return ""
}
func uiHint(t string, enum, collection bool, format string) map[string]any {
	t = strings.ToLower(t); format = strings.ToLower(format); c := "text_input"
	switch {
	case enum && collection: c = "multi_search_select"
	case enum: c = "search_select"
	case strings.Contains(t, "bool"): c = "checkbox"
	case format == "date": c = "date_input"
	case strings.Contains(format, "date-time") || strings.Contains(t, "datetime"): c = "datetime_input"
	case format == "email": c = "email_input"
	case format == "uri" || format == "url": c = "url_input"
	case regexp.MustCompile(`decimal|double|float|int|number`).MatchString(t): c = "number_input"
	case t == "array": c = "repeatable_or_multiselect"
	case t == "object": c = "structured_group"
	}
	return map[string]any{"control": c, "authority": "presentation_hint_only", "derived_from": "source_structure"}
}
func shallowRaw(m map[string]any) map[string]any {
	o := map[string]any{}
	for k,v := range m {
		switch k { case "properties","items","oneOf","allOf","anyOf": continue }
		o[k] = v
	}
	return o
}

func parseRESO(root map[string]any) ([]Term, []Relation) {
	var terms []Term; var rels []Relation
	for _, rv := range arr(root["resources"]) {
		r := str(rv)
		terms = append(terms, Term{"id":"reso.resource."+id(r),"kind":"resource","label":r,"source_id":"reso-dd-2.1","source_path":"resources[value="+r+"]","mapping_status":"unmapped","package_ownership":map[string]any{"package":"operational","status":"candidate"}})
	}
	for i, fv := range arr(root["fields"]) {
		f := obj(fv); resource, name := str(f["resourceName"]), str(f["fieldName"])
		tid := "reso.field."+id(resource)+"."+id(name); label := ann(f,"RESO.OData.Metadata.StandardName"); if label=="" { label=name }
		terms = append(terms, Term{"id":tid,"kind":"field","label":label,"description":ann(f,"Core.Description"),"source_id":"reso-dd-2.1","source_path":fmt.Sprintf("fields[%d]",i),"resource":resource,"value_type":f["type"],"nullable":f["nullable"],"is_enumeration":boolv(f["isEnumeration"]),"is_collection":boolv(f["isCollection"]),"ui_hint":uiHint(str(f["type"]),boolv(f["isEnumeration"]),boolv(f["isCollection"]),""),"mapping_status":"unmapped","package_ownership":map[string]any{"package":"operational","status":"candidate"},"raw_metadata":f})
		rels = append(rels, Relation{"type":"contains_field","from":"reso.resource."+id(resource),"to":tid,"source_id":"reso-dd-2.1"})
		if boolv(f["isEnumeration"]) && str(f["type"])!="" { rels=append(rels,Relation{"type":"uses_lookup","from":tid,"to":"reso.lookup."+id(str(f["type"])),"source_id":"reso-dd-2.1"}) }
	}
	seen := map[string]bool{}
	for i, lv := range arr(root["lookups"]) {
		l:=obj(lv); group:="reso.lookup."+id(str(l["lookupName"])); tid:=group+"."+id(str(l["lookupValue"]))
		if !seen[group] {
			seen[group]=true; p:=strings.Split(str(l["lookupName"]),".")
			terms=append(terms,Term{"id":group,"kind":"lookup","label":p[len(p)-1],"source_id":"reso-dd-2.1","source_path":"lookups[group="+str(l["lookupName"])+"]","mapping_status":"unmapped","package_ownership":map[string]any{"package":"operational","status":"candidate"}})
		}
		label:=ann(l,"RESO.OData.Metadata.StandardName"); if label=="" {label=str(l["lookupValue"])}
		terms=append(terms,Term{"id":tid,"kind":"enumeration_value","label":label,"description":ann(l,"Core.Description"),"raw_value":l["lookupValue"],"source_id":"reso-dd-2.1","source_path":fmt.Sprintf("lookups[%d]",i),"mapping_status":"unmapped","package_ownership":map[string]any{"package":"operational","status":"candidate"},"raw_metadata":l})
		rels=append(rels,Relation{"type":"enumeration_value_of","from":tid,"to":group,"source_id":"reso-dd-2.1"})
	}
	return terms,rels
}

func pdtfID(path string) string { if path=="" {path="$"}; return "pdtf."+id(path) }

func parsePDTF(root map[string]any) ([]Term, []Relation) {
	var terms []Term; var rels []Relation; seen:=map[string]bool{}
	var walk func(map[string]any,string,string)
	walk = func(n map[string]any, path, parent string) {
		tid:=pdtfID(path)
		if path!="" && !seen[tid] {
			seen[tid]=true; label:=str(n["title"]); if label=="" {p:=strings.Split(path,".");label=p[len(p)-1]}
			en:=arr(n["enum"])
			terms=append(terms,Term{"id":tid,"kind":"schema_node","label":label,"description":str(n["description"]),"source_id":"opda-pdtf-3.5","source_path":path,"value_type":n["type"],"format":n["format"],"ui_hint":uiHint(str(n["type"]),len(en)>0,str(n["type"])=="array",str(n["format"])),"mapping_status":"unmapped","package_ownership":map[string]any{"package":"jurisdiction","status":"candidate"},"jurisdiction":"England/Wales source","raw_metadata":shallowRaw(n)})
			if parent!="" { rels=append(rels,Relation{"type":"contains","from":pdtfID(parent),"to":tid,"source_id":"opda-pdtf-3.5"}) }
			for j,v:=range en {
				eid:=tid+".enum."+id(fmt.Sprint(v))
				terms=append(terms,Term{"id":eid,"kind":"enumeration_value","label":fmt.Sprint(v),"raw_value":v,"source_id":"opda-pdtf-3.5","source_path":fmt.Sprintf("%s.enum[%d]",path,j),"mapping_status":"unmapped","package_ownership":map[string]any{"package":"jurisdiction","status":"candidate"},"jurisdiction":"England/Wales source"})
				rels=append(rels,Relation{"type":"enumeration_value_of","from":eid,"to":tid,"source_id":"opda-pdtf-3.5"})
			}
		}
		props:=obj(n["properties"]); if len(props)>0 {
			keys:=make([]string,0,len(props)); for k:=range props {keys=append(keys,k)}; sort.Strings(keys)
			for _,k:=range keys {cp:=k;if path!=""{cp=path+"."+k};walk(obj(props[k]),cp,path)}
			for _,rk:=range requiredKeys { for _,rv:=range arr(n[rk]) {req:=str(rv);tp:=req;if path!=""{tp=path+"."+req};rels=append(rels,Relation{"type":"requires","from":tid,"to":pdtfID(tp),"regime":rk,"source_id":"opda-pdtf-3.5"})} }
		}
		if it:=obj(n["items"]); len(it)>0 { walk(it,path+"[]",path) }
		d:=str(obj(n["discriminator"])["propertyName"]); branches:=arr(n["oneOf"])
		if d!="" && len(branches)>0 {
			trigger:=d;if path!=""{trigger=path+"."+d}
			for bi,bv:=range branches {
				b:=obj(bv); bp:=obj(b["properties"]); trigs:=arr(obj(bp[d])["enum"])
				for k,v:=range bp { if k==d{continue}; target:=k;if path!=""{target=path+"."+k};walk(obj(v),target,path);for _,tv:=range trigs{rels=append(rels,Relation{"type":"unlocks","from":pdtfID(trigger),"to":pdtfID(target),"trigger_value":tv,"branch":bi,"source_id":"opda-pdtf-3.5"})} }
				for _,rk:=range requiredKeys {for _,rv:=range arr(b[rk]){req:=str(rv);if req==d{continue};target:=req;if path!=""{target=path+"."+req};for _,tv:=range trigs{rels=append(rels,Relation{"type":"conditionally_requires","from":pdtfID(trigger),"to":pdtfID(target),"trigger_value":tv,"regime":rk,"branch":bi,"source_id":"opda-pdtf-3.5"})}}}
			}
		}
	}
	walk(root,"",""); return terms,rels
}

func parseIndicators(root map[string]any, source, idField, pkg string) []Term {
	var out []Term
	for i,xv:=range arr(root["indicators"]) {
		x:=obj(xv); key:=str(x[idField]); if key=="" {key=str(x["label"])}
		out=append(out,Term{"id":source+".indicator."+id(key),"kind":"indicator","label":str(x["field_name"]),"description":str(x["definition__instruction"]),"source_id":source,"source_path":fmt.Sprintf("indicators[%d]",i),"topic":x["topic"],"field_level":x["field_level"],"value_type":x["data_type"],"allowed_values_raw":x["values"],"reference_field":x["reference_field"],"ui_hint":uiHint(str(x["data_type"]),false,false,""),"mapping_status":"unmapped","package_ownership":map[string]any{"package":pkg,"status":"candidate"},"raw_metadata":x})
	}
	return out
}
func parseQuipu(root map[string]any) []Term {
	var out []Term
	for i,tv:=range arr(root["terms"]) {
		t:=obj(tv); ref:=str(t["ref"]);if ref==""{ref=str(t["symbol"])};label:=str(t["symbol"]);if a:=arr(t["labels"]);len(a)>0{label=str(a[0])}
		out=append(out,Term{"id":"quipu."+id(ref),"kind":"quipu_"+str(t["kind"]),"label":label,"source_id":"quipu-real-estate-core-1.1","source_path":fmt.Sprintf("terms[%d]",i),"quipu_ref":t["ref"],"symbol":t["symbol"],"institution":t["institution"],"semantics":t["semantics"],"status":t["status"],"mapping_status":"adjudicated_existing_pack","package_ownership":map[string]any{"package":"core","status":"adjudicated"},"raw_metadata":t})
	}
	return out
}

func main() {
	basic:=flag.String("basicquipudb","../basicquipudb","basicquipudb checkout")
	out:=flag.String("out","data/generated/real-estate-domain-pack","output directory")
	flag.Parse()
	reso:=readJSON(filepath.Join(*basic,"dictionaries/reso-dd-2.1.0/dd-2.1.json"))
	pdtf:=readJSON(filepath.Join(*basic,"dictionaries/opda-pdtf-3.5.0/combined.json"))
	inrev:=readJSON(filepath.Join(*basic,"dictionaries/inrev-sdds-4.0.0/sdds-indicators.json"))
	esg:=readJSON(filepath.Join(*basic,"dictionaries/inrev-esg-sdds-1.1.0/esg-sdds-indicators.json"))
	lex:=readJSON(filepath.Join(*basic,"domainpacks/real_estate/generated/real-estate-lexicon.yaml"))
	rt,rr:=parseRESO(reso); pt,pr:=parsePDTF(pdtf); it:=parseIndicators(inrev,"inrev-sdds-4.0","sdds_id","extension"); et:=parseIndicators(esg,"inrev-esg-sdds-1.1","esg_sdds_id","extension"); qt:=parseQuipu(lex); rels:=append(rr,pr...)
	writeJSON(filepath.Join(*out,"terms/reso.json"),rt); writeJSON(filepath.Join(*out,"terms/pdtf.json"),pt); writeJSON(filepath.Join(*out,"terms/inrev.json"),it); writeJSON(filepath.Join(*out,"terms/inrev-esg.json"),et); writeJSON(filepath.Join(*out,"terms/quipu-real-estate-core.json"),qt); writeJSON(filepath.Join(*out,"relations/relations.json"),rels)
	manifest:=map[string]any{"pack_id":"imobitools.real-estate-term-relation-pack","version":"1.0.0","status":"generated_candidate","normative_rules":[]string{"UNKNOWN FIELD != DROP","UNKNOWN JURISDICTION != DROP","OPERATIONAL DATA != DROP","SOURCE-SPECIFIC DATA != DROP","UNMAPPED != INVALID"},"statistics":map[string]any{"total_terms":len(rt)+len(pt)+len(it)+len(et)+len(qt),"total_relations":len(rels),"reso_terms":len(rt),"pdtf_terms":len(pt),"inrev_indicators":len(it),"esg_indicators":len(et),"quipu_terms":len(qt)},"crud_contract":map[string]any{"progressive_disclosure_relations":[]string{"unlocks","conditionally_requires","requires","uses_lookup","enumeration_value_of","contains","contains_field"},"controls_are_hints":true,"lazy_load_shards":true}}
	writeJSON(filepath.Join(*out,"manifest.json"),manifest)
	fmt.Printf("terms=%d relations=%d\n",len(rt)+len(pt)+len(it)+len(et)+len(qt),len(rels))
}
