import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminContext, AppBar, Layout, List, Resource, Show, SimpleShowLayout, TextField, Datagrid, FunctionField, useGetList, useRecordContext } from 'react-admin';
import { Box, Card, CardContent, Chip, Divider, Drawer, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';

import hierarchy from '../data.json';

const primary = hierarchy.root.children.find((node) => node.type === 'LegalPropertyUnit');
const directRelationships = hierarchy.direct_relationships;

const flatten = (node, result = []) => {
  result.push(node);
  (node.children || []).filter((child) => typeof child === 'object').forEach((child) => flatten(child, result));
  return result;
};

const nodes = flatten(hierarchy.root).filter((node) => node.type !== 'RealEstateAsset');
const records = nodes.map((node, index) => ({
  id: node.id,
  type: node.type,
  label: node.label,
  role: node.role || 'Domain entity',
  fieldCount: (node.items || []).length,
  relationCount: (node.direct_connections || []).length,
  status: index % 4 === 0 ? 'active' : index % 4 === 1 ? 'linked' : 'configured',
  items: node.items || [],
  children: node.children || [],
}));

const dataProvider = {
  getList: async (_resource, params = {}) => {
    const search = params.filter?.q?.toLowerCase() || '';
    const filtered = records.filter((record) => `${record.type} ${record.label}`.toLowerCase().includes(search));
    return { data: filtered, total: filtered.length };
  },
  getOne: async (_resource, params) => ({ data: records.find((record) => record.id === params.id) || records[0] }),
  getMany: async (_resource, params) => ({ data: records.filter((record) => params.ids.includes(record.id)) }),
  getManyReference: async (_resource) => ({ data: records, total: records.length }),
  create: async (_resource, params) => ({ data: { ...params.data, id: crypto.randomUUID() } }),
  update: async (_resource, params) => ({ data: params.data }),
  updateMany: async (_resource, params) => ({ data: params.ids }),
  delete: async (_resource, params) => ({ data: params.previousData }),
  deleteMany: async (_resource, params) => ({ data: params.ids }),
};

const theme = {
  palette: { mode: 'light', primary: { main: '#176b57' }, secondary: { main: '#d48545' }, background: { default: '#f5f7f4' } },
  shape: { borderRadius: 12 },
};

function SchemaLayout({ children }) {
  return <Layout appBar={SchemaAppBar}>{children}</Layout>;
}

function SchemaAppBar() {
  return <AppBar color="transparent" elevation={0} sx={{ borderBottom: '1px solid #dfe7e1' }}><Typography variant="h6" sx={{ color: '#173f35', fontWeight: 800 }}>Real Estate Schema Admin</Typography><Box sx={{ flex: 1 }} /><Chip label={`${nodes.length} schema nodes`} color="primary" variant="outlined" /></AppBar>;
}

function SchemaList() {
  return <List title="Domain hierarchy"><Datagrid rowClick="show" bulkActionButtons={false}><TextField source="type" label="Type" /><TextField source="label" label="Label" /><TextField source="role" label="Role" /><TextField source="status" label="Status" /><FunctionField label="Metadata" render={(record) => `${record.fieldCount} fields · ${record.relationCount} relations`} /></Datagrid></List>;
}

function NodeDetails() {
  const record = useRecordContext();
  if (!record) return null;
  return <Stack spacing={2} sx={{ p: 2 }}>
    <Card><CardContent><Typography variant="overline" color="primary">Generated from JSON metadata</Typography><Typography variant="h4" sx={{ fontWeight: 800 }}>{record.label}</Typography><Typography color="text.secondary">{record.type} · {record.role}</Typography></CardContent></Card>
    <Card><CardContent><Typography variant="h6">Declared fields</Typography><Stack direction="row" flexWrap="wrap" gap={1} mt={2}>{record.items.map((item) => <Chip key={item} label={item} variant="outlined" />)}</Stack></CardContent></Card>
    <Card><CardContent><Typography variant="h6">Child schema</Typography><Stack gap={1} mt={2}>{record.children.length ? record.children.map((child) => <Box key={child.id} sx={{ p: 1.5, bgcolor: '#f5f7f4', borderRadius: 2 }}><b>{child.label}</b><Typography variant="caption" display="block">{child.type}{child.role ? ` · ${child.role}` : ''}</Typography></Box>) : <Typography color="text.secondary">No nested entity metadata.</Typography>}</Stack></CardContent></Card>
  </Stack>;
}

function SchemaShow() {
  return <Show title="Schema node"><SimpleShowLayout><NodeDetails /></SimpleShowLayout></Show>;
}

function Overview() {
  const [selected, setSelected] = useState(primary?.id || nodes[0]?.id);
  const selectedNode = records.find((record) => record.id === selected) || records[0];
  const relationshipRows = useMemo(() => directRelationships.slice(0, 8), []);
  return <Box sx={{ p: 3 }}><Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3}><Card sx={{ flex: 1 }}><CardContent><Typography color="text.secondary">Root schema</Typography><Typography variant="h4" fontWeight={800}>{hierarchy.root.label}</Typography><Typography>{hierarchy.schema} · v{hierarchy.version}</Typography></CardContent></Card><Card sx={{ flex: 1 }}><CardContent><Typography color="text.secondary">Generated nodes</Typography><Typography variant="h4" fontWeight={800}>{nodes.length}</Typography><Typography>All records derive from <code>data.json</code>.</Typography></CardContent></Card></Stack><Stack direction={{ xs: 'column', lg: 'row' }} gap={2}><Card sx={{ flex: 1 }}><CardContent><Typography variant="h6" mb={2}>Schema tree</Typography><Stack gap={1}>{nodes.slice(0, 14).map((node) => <ListItemButton key={node.id} selected={node.id === selected} onClick={() => setSelected(node.id)}><AccountTreeRoundedIcon sx={{ mr: 1, color: 'primary.main' }} /><ListItemText primary={node.label} secondary={`${node.type} · ${node.fieldCount} fields`} /></ListItemButton>)}</Stack></CardContent></Card><Card sx={{ flex: 1.3 }}><CardContent><Typography variant="overline" color="primary">Selected node</Typography><Typography variant="h4" fontWeight={800}>{selectedNode.label}</Typography><Typography color="text.secondary">{selectedNode.type}</Typography><Divider sx={{ my: 2 }} /><Typography variant="h6">Fields</Typography><Stack direction="row" flexWrap="wrap" gap={1} mt={1}>{selectedNode.items.map((item) => <Chip key={item} label={item} />)}</Stack><Typography variant="h6" mt={3}>Direct relationships</Typography><Stack gap={1} mt={1}>{relationshipRows.map((row) => <Box key={row.type} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8e3', py: 1 }}><b>{row.type}</b><span>{row.from} → {row.to}</span></Box>)}</Stack></CardContent></Card></Stack></Box>;
}

function App() {
  return <AdminContext dataProvider={dataProvider} theme={theme}><Resource name="schema" list={SchemaList} show={SchemaShow} icon={HomeWorkRoundedIcon} options={{ label: 'Schema' }} /><Overview /></AdminContext>;
}

createRoot(document.getElementById('root')).render(<App />);
