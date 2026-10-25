import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8'));
const [catalog,snapshot,vocabulary,credits]=await Promise.all(['data/catalog.json','data/status.json','data/stages.json','images/credits.json'].map(json));
const connections=await json('data/connections.json');
const ids=new Set(),stages=new Set(vocabulary.stages.map(s=>s.id)),eras=new Set(catalog.eras.map(e=>e.id));
let representative=0;
for(const entry of catalog.entries){
 assert(!ids.has(entry.id),'Duplicate entry '+entry.id);ids.add(entry.id);
 assert(catalog.companies[entry.company],'Missing company '+entry.id);
 assert(eras.has(entry.era),'Missing era '+entry.id);
 assert(['chip','system','card'].includes(entry.kind),'Invalid type '+entry.id);
 if(entry.chipset){assert.equal(entry.kind,'chip','Chipset must use chip routing '+entry.id);assert(entry.chipset.members.length>1,'Chipset needs multiple members '+entry.id);const parts=new Set();for(const member of entry.chipset.members){assert(member.part?.trim()&&member.role?.trim(),'Incomplete chipset member '+entry.id);const part=member.part.trim().toLowerCase();assert(!parts.has(part),'Duplicate chipset member '+entry.id);parts.add(part);}assert.equal(new URL(entry.chipset.evidence).protocol,'https:');}
 if(entry.kind==='card'){const bus=catalog.buses?.[entry.bus];assert(bus?.label&&/^#[0-9a-f]{6}$/i.test(bus.color),'Missing bus profile '+entry.id);}
 if(entry.year!==null){assert(Number.isInteger(entry.year)&&entry.year>1900,'Invalid year '+entry.id);assert(new URL(entry.dateSource).protocol==='https:','Missing historical source '+entry.id);}
 const status=snapshot.statuses[entry.id];assert(status&&stages.has(status.stage),'Missing stage '+entry.id);
 assert.equal(new URL(entry.issue.url).hostname,'github.com');
 assert(entry.image?.alt?.trim(),'Missing image alt '+entry.id);
 assert(/^images\/[a-z0-9_-]+\.(jpg|png)$/i.test(entry.image.src),'Invalid image path '+entry.id);
 const bytes=await fs.readFile(path.join(root,entry.image.src));
 assert(bytes.length>1000,'Empty image '+entry.id);
 assert(bytes[0]===0xff&&bytes[1]===0xd8||bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Not JPEG/PNG '+entry.id);
 const credit=credits[entry.id];assert(credit?.creator&&credit.license&&credit.source&&credit.changes,'Missing attribution '+entry.id);
 assert.equal(credit.representative,entry.image.representative,'Representative label mismatch '+entry.id);
 assert.equal(new URL(credit.source).hostname,'commons.wikimedia.org');
 if(entry.image.representative)representative++;
}
for(const entry of catalog.entries.filter(entry=>entry.kind==='card'&&entry.bus==='isa'))assert(connections.links.some(link=>link.source===entry.id&&catalog.entries.some(target=>target.id===link.target&&target.kind==='system')),'ISA card has no computer bus connection: '+entry.id);
assert.equal(Object.keys(snapshot.statuses).length,ids.size,'Stale snapshot entries');
const ui=await json('data/ui.json'),source=await fs.readFile(path.join(root,'assets/timeline.js'),'utf8');
const lookup=key=>key.split('.').reduce((node,part)=>node?.[part],ui);
const keys=new Set([...source.matchAll(/\btext\('([A-Za-z0-9_.]+)'[,)]/g)].map(match=>match[1]));
for(const key of keys)assert.equal(typeof lookup(key),'string','Missing interface text in data/ui.json: '+key);
for(const kind of ui.viewTabs)assert.equal(typeof lookup('kinds.'+kind+'.tab'),'string','Missing tab text: '+kind);
for(const kind of ['chip','card','system'])for(const field of ['heading','badge','noun'])assert.equal(typeof lookup('kinds.'+kind+'.'+field),'string','Missing kind text: '+kind+'.'+field);
for(const key of ['maker','required','optionalChip','reconstruction','bus','compatible'])assert.equal(typeof lookup('wires.count.'+key),'string','Missing count text: '+key);
for(const key of ['maker','reconstruction','optional','required'])assert.equal(typeof lookup('wires.relation.'+key),'string','Missing relation text: '+key);
for(const key of ['previous','next'])assert.equal(typeof lookup('wires.'+key),'string','Missing direction text: '+key);
for(const layer of ui.wireLayers)assert(layer.id&&layer.label,'Incomplete wire layer');
console.log(`Checked ${ids.size} entries, local photos, credits and statuses (${representative} explicitly labeled representative photos).`);
