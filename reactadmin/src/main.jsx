import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminContext, Resource } from 'react-admin';
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import application from './generated/application.json';

const value = (input) => typeof input === 'object' && input !== null ? JSON.stringify(input) : String(input ?? '');

const dataProvider = {
  getList: async (_resource, params = {}) => {
    const query = String(params.filter?.q || '').toLowerCase();
    const records = application.pages.flatMap((page) => page.sections).map((section) => ({ id: section.id, title: section.title, layout: section.layout, fields: section.fields, collection: section.collection })).filter((record) => `${record.id} ${record.title}`.toLowerCase().includes(query));
    return { data: records, total: records.length };
  },
  getOne: async (_resource, params) => ({ data: application.pages.flatMap((page) => page.sections).map((section) => ({ id: section.id, ...section })).find((record) => record.id === params.id) }),
  getMany: async (_resource, params) => ({ data: params.ids.map((id) => ({ id })) }),
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async (_resource, params) => ({ data: { ...params.data, id: crypto.randomUUID() } }),
  update: async (_resource, params) => ({ data: params.data }),
  updateMany: async (_resource, params) => ({ data: params.ids }),
  delete: async (_resource, params) => ({ data: params.previousData }),
  deleteMany: async (_resource, params) => ({ data: params.ids }),
};

const theme = { palette: { primary: { main: '#1c765d' }, secondary: { main: '#d78645' }, background: { default: '#f6f8f5' } }, shape: { borderRadius: 12 } };

function GeneratedField({ field }) {
  return <Box sx={{ border: '1px solid #dfe7e1', borderRadius: 1, p: 1.2 }}><Typography variant="caption" color="text.secondary">{field.label}{field.required ? ' *' : ''}</Typography><Typography variant="body2">{value(field.value) || '—'}</Typography></Box>;
}

function GeneratedCard({ section }) {
  if (section.collection) return <Card><CardContent><Typography variant="h6">{section.title}</Typography><Typography variant="body2" color="text.secondary" mb={2}>{section.collection.itemFields.join(' · ')}</Typography><Stack gap={1}>{section.collection.rows.map((row, index) => <Box key={index} sx={{ border: '1px solid #dfe7e1', borderRadius: 1, p: 1.5 }}>{Object.entries(row).map(([key, item]) => <Typography variant="body2" key={key}><b>{key}:</b> {value(item)}</Typography>)}</Box>)}</Stack></CardContent></Card>;
  return <Card><CardContent><Typography variant="h6">{section.title}</Typography><Stack direction="row" flexWrap="wrap" gap={1.5} mt={2}>{section.fields.map((field) => <Box key={field.id} sx={{ flex: field.layout === 'full' ? '1 1 100%' : '1 1 220px' }}><GeneratedField field={field} /></Box>)}</Stack></CardContent></Card>;
}

function App() {
  const [page, setPage] = useState(0);
  const current = application.pages[page] || application.pages[0];
  return <AdminContext dataProvider={dataProvider} theme={theme}><Resource name="generated-sections" /><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '246px 1fr' }, minHeight: '100vh', bgcolor: 'background.default' }}><Box component="aside" sx={{ bgcolor: '#124c3e', color: '#d9eee5', p: 2.5 }}><Typography variant="h5" fontWeight={800} color="white" mb={4}>{application.shell.brand || application.application.name}</Typography><Typography variant="overline">Generated operation</Typography><Stack mt={1}>{application.navigation.map((item, index) => <Box key={item.id} onClick={() => setPage(index)} sx={{ p: 1.3, my: .3, borderRadius: 1, cursor: 'pointer', bgcolor: page === index ? 'rgba(255,255,255,.13)' : 'transparent', color: page === index ? 'white' : '#a8cabe' }}><b>{index + 1}</b> {item.label}</Box>)}</Stack><Typography variant="caption" display="block" mt={8}>Source: generated/application.json</Typography></Box><Box component="main" sx={{ p: { xs: 2, md: 4 } }}><Stack direction="row" justifyContent="space-between" alignItems="start" mb={3}><Box><Typography variant="h3" fontWeight={800}>{application.application.title}</Typography><Typography color="text.secondary">{application.application.subtitle}</Typography></Box><Chip label={`Asset: ${application.asset.displayName}`} color="primary" variant="outlined" /></Stack><Typography variant="overline" color="primary">{current.id}</Typography><Typography variant="h5" mb={2}>{current.id === 'review' ? 'Composição completa para revisão' : current.id}</Typography><Stack gap={2}>{current.sections.map((section) => <GeneratedCard key={section.id} section={section} />)}</Stack></Box></Box></AdminContext>;
}

createRoot(document.getElementById('root')).render(<App />);
