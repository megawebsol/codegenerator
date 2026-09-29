# ObjectUI JSON-to-HTML Generator

ObjectUI is a domain-agnostic renderer. It receives JSON and generates a complete standalone HTML application. The renderer does not know about real estate, laboratories, or any other domain; labels, sections, relationships and values come only from the input JSON.

## Generate

```bash
node objectui/generate.mjs data/real-estate-property-hierarchy.json objectui/demo.html
```

The output is a self-contained HTML file with:

- recursive object and array rendering;
- generated labels from input keys;
- collapsible nested structures;
- search across generated fields;
- no runtime dependency or backend;
- no domain-specific renderer branches.

The included `demo.html` is generated from `data/real-estate-property-hierarchy.json`; the JSON remains the source of truth.
