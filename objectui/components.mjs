const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

export function compileApplication(database, template, layout, assetIndex = 0) {
  const asset = database.assets?.[assetIndex];
  if (!asset) throw new Error("database.assets must contain the selected asset");

  const sections = Object.entries(layout.sections || {}).map(([id, definition]) => ({
    id,
    title: definition.title,
    layout: definition.layout || "card",
    component: definition.component || "fields",
    fields: (definition.fields || []).map(path => fieldComponent(path, asset, template)),
    collection: definition.collection
      ? collectionComponent(definition.collection, asset, template)
      : null,
    relations: definition.relations || [],
  }));

  const pages = (layout.pages || []).map(page => ({
    title: (layout.navigation || []).find(item => item.id === page.id)?.label || page.id,
    ...page,
    sections: page.sections.map(id => sections.find(section => section.id === id)).filter(Boolean),
  }));

  return {
    type: "application",
    application: layout.application || {},
    shell: layout.shell || {},
    navigation: layout.navigation || [],
    pages,
    actions: layout.actions || {},
    asset: { asset_id: asset.asset_id, display_name: asset.display_name, status: asset.status },
    database_asset_index: assetIndex,
    template_id: template.template_id,
  };
}

function fieldComponent(path, asset, template) {
  const definition = template.fields?.[path.split(".").at(-1)] || {};
  const value = get(asset, path);
  if (definition.type === "structured") {
    return {
      type: "group",
      path,
      label: definition.label || titleize(path.split(".").at(-1)),
      fields: (definition.fields || []).map(child => fieldComponent(`${path}.${child}`, asset, template)),
    };
  }
  return {
    type: "field",
    path,
    label: definition.label || titleize(path.split(".").at(-1)),
    value,
    data_type: definition.type || typeof get(asset, path),
    required: Boolean(definition.required),
    options: definition.values || [],
  };
}

function collectionComponent(name, asset, template) {
  const definition = template.collections?.[name] || {};
  return {
    type: "collection",
    name,
    item_fields: definition.item_fields || [],
    fields: definition.item_fields || [],
    items: Array.isArray(asset[name]) ? asset[name] : [],
  };
}

function titleize(value) {
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, character => character.toUpperCase());
}
