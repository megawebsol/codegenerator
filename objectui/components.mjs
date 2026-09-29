export function applicationFromJSON(data) {
  const excluded = new Set(["title", "description", "language", "version", "schema"]);
  const sections = Object.entries(data)
    .filter(([key]) => !excluded.has(key))
    .map(([key, value]) => ({
      type: "surface",
      id: key,
      title: titleize(key),
      content: componentForValue(key, value),
    }));

  return {
    type: "application",
    title: data.title || data.schema || "ObjectUI Application",
    subtitle: data.description || "Application generated from a JSON artifact",
    version: data.version || "unversioned",
    sections,
  };
}

function componentForValue(key, value) {
  if (Array.isArray(value)) {
    return {
      type: "collection",
      label: titleize(key),
      items: value.map((item, index) => ({
        type: "item",
        label: String(index + 1),
        content: componentForValue(String(index + 1), item),
      })),
    };
  }

  if (value && typeof value === "object") {
    return {
      type: "form",
      fields: Object.entries(value).map(([field, fieldValue]) => ({
        type: "field",
        name: field,
        label: titleize(field),
        value: fieldValue,
        editor: editorFor(fieldValue),
      })),
    };
  }

  return {
    type: "form",
    fields: [{ type: "field", name: key, label: titleize(key), value, editor: editorFor(value) }],
  };
}

function editorFor(value) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (value && typeof value === "object") return Array.isArray(value) ? "json-array" : "json-object";
  return "text";
}

function titleize(value) {
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, character => character.toUpperCase());
}
