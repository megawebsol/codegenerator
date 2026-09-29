import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const [databasePath, templatePath, layoutPath, outputPath = 'src/generated/application.json'] = process.argv.slice(2);
if (!databasePath || !templatePath || !layoutPath) {
  throw new Error('Usage: node scripts/generate-app.mjs <database.json> <template.json> <layout.json> [output.json]');
}

const [database, template, layout] = await Promise.all([databasePath, templatePath, layoutPath].map(async (path) => JSON.parse(await readFile(resolve(path), 'utf8'))));
const asset = database.assets?.[0];
if (!asset) throw new Error('database.assets must contain one selected asset');

const get = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
const titleize = (value) => String(value).replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
const control = (value, definition = {}) => definition.values?.length ? 'select' : definition.type === 'structured' ? 'textarea' : definition.type === 'enum' ? 'select' : typeof value === 'number' ? 'number' : 'text';

function field(path) {
  const value = get(asset, path);
  const definition = template.fields?.[path.split('.').at(-1)] || {};
  return { id: path, label: titleize(path.split('.').at(-1)), value, control: control(value, definition), options: definition.values || [], required: Boolean(definition.required), layout: path === 'address' || definition.type === 'structured' ? 'full' : 'half' };
}

function collection(name, section) {
  const definition = template.collections?.[name] || {};
  const value = asset[name];
  const rows = Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : [];
  return { type: section.component || 'collection', name, title: section.title, description: section.description || '', itemFields: definition.item_fields || [], rows, fields: rows.length ? Object.keys(rows[0]).map((key) => ({ id: key, label: titleize(key), value: rows[0][key], control: control(rows[0][key]) })) : [] };
}

const sections = Object.entries(layout.sections || {}).map(([id, section]) => ({
  id,
  title: section.title,
  layout: section.layout || 'card',
  component: section.component || 'fields',
  fields: (section.fields || []).map(field),
  collection: section.collection ? collection(section.collection, section) : null,
  relations: section.relations || [],
}));

const application = {
  application: layout.application,
  shell: layout.shell,
  navigation: layout.navigation,
  pages: (layout.pages || []).map((page) => ({ ...page, sections: page.sections.map((id) => sections.find((section) => section.id === id)).filter(Boolean) })),
  actions: layout.actions,
  asset: { id: asset.asset_id, displayName: asset.display_name, status: asset.status },
  template: { id: template.template_id, version: template.version, entity: template.entity, rules: template.rules },
};

const output = resolve(outputPath);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(application, null, 2) + '\n');
console.log(`React Admin application generated: ${output}`);
