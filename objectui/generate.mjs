#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [, , inputArg, outputArg = "objectui.html"] = process.argv;
if (!inputArg) throw new Error("Usage: node objectui/generate.mjs <data.json> [output.html]");
const data = JSON.parse(await readFile(resolve(inputArg), "utf8"));
const output = resolve(outputArg);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}

const CSS = `:root{font-family:system-ui,sans-serif;color:#17211b;background:#f5f7f5}*{box-sizing:border-box}body{margin:0}header{background:#123f35;color:#fff;padding:28px 5vw}header h1{margin:0 0 5px;font-size:clamp(1.4rem,3vw,2.4rem)}header p{margin:0;color:#b9d8ca}main{max-width:1400px;margin:auto;padding:28px 5vw 60px}.toolbar{display:flex;gap:12px;margin-bottom:20px}.toolbar input{flex:1;padding:11px 13px;border:1px solid #ccd9d1;border-radius:9px}.count{color:#63756b}.tree{display:grid;gap:14px}.node{background:#fff;border:1px solid #dce6df;border-radius:12px;padding:16px;box-shadow:0 8px 24px #20382b0b}.node>summary{cursor:pointer;font-weight:750;list-style:none}.node>summary::-webkit-details-marker{display:none}.node>summary:before{content:'▸';display:inline-block;margin-right:8px;color:#278166}.node[open]>summary:before{transform:rotate(90deg)}.meta{color:#6b7e73;font-size:.8rem;margin-left:12px}.primitive{display:grid;grid-template-columns:minmax(150px,.4fr) 1fr;gap:10px;padding:9px 0;border-bottom:1px solid #edf1ee}.key{font-weight:650;color:#406256;overflow-wrap:anywhere}.value{white-space:pre-wrap;overflow-wrap:anywhere}.array{display:grid;gap:9px;margin:10px 0 0 20px}.array-item{border-left:3px solid #d5e9df;padding-left:12px}.hidden{display:none}`;

const RUNTIME = `(()=>{const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const l=k=>String(k).replace(/[_-]+/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase());const r=(k,v)=>{if(v===null||typeof v!=='object')return '<div class="primitive"><div class="key">'+e(l(k))+'</div><div class="value">'+e(typeof v==='string'?v:JSON.stringify(v))+'</div></div>';if(Array.isArray(v))return '<details class="node" open><summary>'+e(l(k))+' <span class="meta">'+v.length+' items</span></summary><div class="array">'+v.map((x,i)=>'<div class="array-item">'+r(i+1,x)+'</div>').join('')+'</div></details>';return '<details class="node" open><summary>'+e(l(k))+' <span class="meta">'+Object.keys(v).length+' fields</span></summary>'+Object.entries(v).map(([x,y])=>r(x,y)).join('')+'</details>'};const d=window.OBJECTUI_DATA||{};document.getElementById('app').innerHTML='<header><h1>'+e(d.title||d.schema||'ObjectUI')+'</h1><p>Generated from JSON · '+e(d.version||'unversioned')+'</p></header><main><div class="toolbar"><input id="filter" type="search" placeholder="Filter generated fields"><span class="count" id="count"></span></div><section class="tree" id="tree">'+r('Application',d)+'</section></main>';filter.addEventListener('input',x=>{const q=x.target.value.toLowerCase();let n=0;tree.querySelectorAll('.node,.primitive').forEach(x=>{const show=!q||x.textContent.toLowerCase().includes(q);x.classList.toggle('hidden',!show);if(show)n++});count.textContent=q?n+' matching nodes':''})})();`;

const title = data.title || data.schema || "ObjectUI Application";
const safeData = JSON.stringify(data).replace(/</g, "\\u003c");
await writeFile(output, `<!doctype html><html lang="${data.language || "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>${CSS}</style></head><body><div id="app"></div><script>window.OBJECTUI_DATA=${safeData}</script><script>${RUNTIME}</script></body></html>`);
console.log(`ObjectUI generated: ${output}`);
