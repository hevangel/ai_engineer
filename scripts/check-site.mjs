import {renderSite} from './render-site.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8'));
const [catalog,snapshot,vocabulary,credits]=await Promise.all(['data/catalog.json','data/status.json','data/stages.json','data/photo-credits.json'].map(json));
const connections=await json('data/connections.json');
const imageImports=await json('data/image-import.json');
const ids=new Set(),stages=new Set(vocabulary.stages.map(s=>s.id)),eras=new Set(catalog.eras.map(e=>e.id));
let representative=0,photosNeeded=0;
for(const entry of catalog.entries){
 assert(!ids.has(entry.id),'Duplicate entry '+entry.id);ids.add(entry.id);
 assert(catalog.companies[entry.company],'Missing company '+entry.id);
 assert(eras.has(entry.era),'Missing era '+entry.id);
 assert(['chip','system','card'].includes(entry.kind),'Invalid type '+entry.id);
 if(entry.chipset){assert.equal(entry.kind,'chip','Chipset must use chip routing '+entry.id);assert(entry.chipset.members.length>1,'Chipset needs multiple members '+entry.id);const parts=new Set();for(const member of entry.chipset.members){assert(member.part?.trim()&&member.role?.trim(),'Incomplete chipset member '+entry.id);const part=member.part.trim().toLowerCase();assert(!parts.has(part),'Duplicate chipset member '+entry.id);parts.add(part);}assert.equal(new URL(entry.chipset.evidence).protocol,'https:');}
 if(entry.series){assert(!entry.chipset,'A chip series is not a motherboard chipset '+entry.id);assert.equal(entry.kind,'chip','Series must be a chip family '+entry.id);assert(entry.series.members.length>1,'Series needs multiple members '+entry.id);const parts=new Set();for(const member of entry.series.members){assert(member.part&&member.role&&Number.isInteger(member.year),'Incomplete series member '+entry.id);assert(!parts.has(member.part),'Duplicate series member '+entry.id);parts.add(member.part);assert.equal(new URL(member.source).protocol,'https:');}}
 if(entry.kind==='card'){const bus=catalog.buses?.[entry.bus];assert(bus?.label&&/^#[0-9a-f]{6}$/i.test(bus.color),'Missing bus profile '+entry.id);}
 if(entry.year!==null){assert(Number.isInteger(entry.year)&&entry.year>1900,'Invalid year '+entry.id);assert(new URL(entry.dateSource).protocol==='https:','Missing historical source '+entry.id);}
 const status=snapshot.statuses[entry.id];assert(status&&stages.has(status.stage),'Missing stage '+entry.id);
 assert.equal(new URL(entry.issue.url).hostname,'github.com');
 assert(typeof entry.summary==='string'&&entry.summary.trim()&&entry.summary.length<=100&&!/[\r\n]/.test(entry.summary),'Missing one-line summary (100 characters or fewer) '+entry.id);
 if(entry.image?.status==='needed'){
  assert.equal(entry.image.representative,false,'Missing photo is not a representative photograph '+entry.id);
  assert(!entry.image.src&&!credits[entry.id],'Missing photo must not retain a substituted image/credit '+entry.id);
  assert(Array.isArray(entry.image.sourceLeads),'Missing photo research leads '+entry.id);
  for(const lead of entry.image.sourceLeads){assert(lead.label&&lead.note,'Unqualified photo lead '+entry.id);assert.equal(new URL(lead.url).protocol,'https:');}
  photosNeeded++;continue;
 }
 assert(entry.image?.alt?.trim(),'Missing image alt '+entry.id);
 assert(/^images\/[a-z0-9_-]+\.(jpg|png)$/i.test(entry.image.src),'Invalid image path '+entry.id);
 const bytes=await fs.readFile(path.join(root,entry.image.src));
 assert(bytes.length>1000,'Empty image '+entry.id);
 assert(bytes[0]===0xff&&bytes[1]===0xd8||bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Not JPEG/PNG '+entry.id);
 const credit=credits[entry.id];assert(credit?.creator&&credit.license&&credit.source&&credit.changes,'Missing attribution '+entry.id);
 assert.equal(credit.representative,entry.image.representative,'Representative label mismatch '+entry.id);
 if(credit.provenance==='user-supplied'){
  const approved=imageImports.userSupplied?.[entry.id];assert(approved,'Unregistered user-supplied photo '+entry.id);
  assert.equal(credit.source,approved.source);assert.equal(credit.downloadedFrom,approved.url);assert.equal(credit.rightsStatus,approved.rightsStatus);
  assert.equal(new URL(credit.source).protocol,'https:');assert.equal(new URL(credit.downloadedFrom).protocol,'https:');
 }else assert.equal(new URL(credit.source).hostname,'commons.wikimedia.org');
 if(entry.image.representative)representative++;
}
for(const entry of catalog.entries.filter(entry=>entry.kind==='card'&&entry.bus==='isa'))assert(connections.links.some(link=>link.source===entry.id&&catalog.entries.some(target=>target.id===link.target&&target.kind==='system')),'ISA card has no computer bus connection: '+entry.id);
const software=await json('data/software.json');
assert.equal(Object.keys(snapshot.statuses).length,ids.size+software.entries.length,'Stale snapshot entries');
const iconShapes={path:['d'],rect:['x','y','width','height','rx'],circle:['cx','cy','r'],line:['x1','y1','x2','y2'],polyline:['points']};
const checkIcon=(icon,name)=>{assert(/^0 0 \d+ \d+$/.test(icon?.viewBox),'Missing icon viewBox: '+name);assert(icon.shapes?.length,'Empty icon: '+name);for(const {tag,...attributes}of icon.shapes){assert(iconShapes[tag],'Unsupported icon shape in '+name+': '+tag);assert.deepEqual(Object.keys(attributes).filter(key=>!iconShapes[tag].includes(key)&&key!=='stroke-dasharray'),[],'Unexpected icon attribute in '+name+': '+tag);for(const key of iconShapes[tag])assert(attributes[key]!==undefined,'Missing icon attribute in '+name+': '+tag+' '+key);}};
for(const stage of vocabulary.stages)checkIcon(stage.icon,'stage '+stage.id);
for(const build of vocabulary.builds){checkIcon(build.icon,'build '+build.id);assert(/^#[0-9a-f]{6}$/i.test(build.color),'Missing build color: '+build.id);}
const ui=await json('data/ui.json'),source=(await Promise.all(['assets/timeline.js','assets/software-view.js'].map(file=>fs.readFile(path.join(root,file),'utf8')))).join('\n');
const lookup=key=>key.split('.').reduce((node,part)=>node?.[part],ui);
const keys=new Set([...source.matchAll(/\btext\('([A-Za-z0-9_.]+)'[,)]/g)].map(match=>match[1]));
for(const key of keys)assert.equal(typeof lookup(key),'string','Missing interface text in data/ui.json: '+key);
checkIcon(ui.card.statusFallback.icon,'status fallback');
for(const kind of ui.viewTabs)assert.equal(typeof lookup('kinds.'+kind+'.tab'),'string','Missing tab text: '+kind);
for(const kind of ['chip','card','system'])for(const field of ['heading','badge','noun'])assert.equal(typeof lookup('kinds.'+kind+'.'+field),'string','Missing kind text: '+kind+'.'+field);
for(const key of ['maker','required','optionalChip','reconstruction','bus','compatible'])assert.equal(typeof lookup('wires.count.'+key),'string','Missing count text: '+key);
for(const key of ['maker','reconstruction','optional','required'])assert.equal(typeof lookup('wires.relation.'+key),'string','Missing relation text: '+key);
for(const key of ['previous','next'])assert.equal(typeof lookup('wires.'+key),'string','Missing direction text: '+key);
for(const layer of ui.wireLayers)assert(layer.id&&layer.label,'Incomplete wire layer');
console.log(`Checked ${ids.size} entries, local photos, credits and statuses (${representative} representative photos, ${photosNeeded} photos needed).`);

const template=await fs.readFile(path.join(root,'templates/index.html'),'utf8');
assert.equal((await fs.readFile(path.join(root,'index.html'),'utf8')).replaceAll('\r\n','\n'),renderSite(template,ui,catalog),'Stale index.html; run node scripts/render-site.mjs');
console.log('Validated JSON-generated page shell');

const imports=await json('data/image-import.json'),syncConfig=await json('data/sync.json');
for(const [id,selection]of Object.entries(imports.selections)){assert(selection.query?.trim(),'Missing photo query '+id);new RegExp(selection.titlePattern.source,selection.titlePattern.flags);}
for(const pattern of [...Object.values(imports.excludeTitles),imports.search.excludedTitlePattern])new RegExp(pattern.source,pattern.flags);
assert(imports.defaults.creator&&imports.defaults.changes,'Missing photo import metadata');
for(const stage of Object.values(syncConfig.projectStages))assert(stages.has(stage),'Unknown configured project stage '+stage);
assert(syncConfig.nativeDependencyNote&&syncConfig.connectionsSource&&syncConfig.githubOwner,'Missing sync configuration');

assert.equal(new URL(ui.links.source).protocol,'https:','Source link must use HTTPS');
assert(/^#[0-9a-f]{6}$/i.test(ui.themeColor),'Invalid page theme color');

assert.equal(new URL(imports.service.apiUrl).protocol,'https:','Photo service must use HTTPS');

for(const [,resource]of source.matchAll(/\bread\('([^']+)'\)/g))assert(/^data\/[a-z0-9-]+\.json$/.test(resource),'Runtime data must live under data/: '+resource);

for(const name of ['index.html','assets/timeline.css']){const body=await fs.readFile(path.join(root,name),'utf8');assert(!/url\(\s*[\"']?(?:https?:)?\/\//i.test(body),'Remote CSS asset in '+name);assert(!/<img\b[^>]*\bsrc\s*=\s*[\"'](?:https?:)?\/\//i.test(body),'Remote image in '+name);}

// Software view data: systems, layers, categories and the 42 rewrite titles.
{
 const {findCycle}=await import('../assets/software-layout.js');
 const layerIds=new Set(software.layers.map(layer=>layer.id)),categoryIds=new Set(software.categories.map(category=>category.id));
 const systemIds=new Set(),catalogSystems=new Set(catalog.entries.filter(entry=>entry.kind==='system').map(entry=>entry.id));
 for(const category of software.categories){assert(category.label&&/^#[0-9a-f]{6}$/i.test(category.color),'Incomplete software category '+category.id);checkIcon(category.icon,'category '+category.id);}
 for(const layer of software.layers)assert(layer.id&&layer.label,'Incomplete software layer');
 for(const system of software.systems){
  assert(!systemIds.has(system.id),'Duplicate software system '+system.id);systemIds.add(system.id);
  assert(system.title&&system.cpu&&Number.isInteger(system.year),'Incomplete software system '+system.id);assert(system.month===undefined||Number.isInteger(system.month)&&system.month>=1&&system.month<=12,'Invalid software system month '+system.id);
  if(system.catalog)assert(catalogSystems.has(system.catalog),'Unknown catalog system '+system.id);
  else{
   assert(/^#[0-9a-f]{6}$/i.test(system.color)&&system.summary?.trim()&&system.summary.length<=100,'Software-only system needs colour and one-line summary '+system.id);
   assert(system.image?.src&&system.image.alt,'Software-only system needs a photo '+system.id);await fs.access(path.join(root,system.image.src));
   const credit=credits['software_system_'+system.id];assert(credit?.creator&&credit.license&&credit.source&&credit.changes,'Missing attribution for software system '+system.id);
   assert.equal(new URL(credit.source).hostname,'commons.wikimedia.org');assert.equal(credit.representative,system.image.representative);
  }
 }
 const softwareIds=new Set(software.entries.map(entry=>entry.id));
 assert.equal(softwareIds.size,software.entries.length,'Duplicate software entry');
 for(const entry of software.entries){
  assert(/^sw_[a-z0-9_]+$/.test(entry.id)&&!ids.has(entry.id),'Invalid software id '+entry.id);
  assert(systemIds.has(entry.system),'Unknown software system '+entry.id);assert(layerIds.has(entry.layer),'Unknown layer '+entry.id);assert(categoryIds.has(entry.category),'Unknown category '+entry.id);
  assert(Number.isInteger(entry.year)&&entry.difficulty&&entry.sourceMaterial,'Incomplete software entry '+entry.id);
  assert(typeof entry.summary==='string'&&entry.summary.trim()&&entry.summary.length<=100&&!/[\r\n]/.test(entry.summary),'Missing one-line summary (100 characters or fewer) '+entry.id);
  assert.equal(entry.issue.repo,software.repository);assert.equal(entry.issue.url,`https://github.com/${entry.issue.repo}/issues/${entry.issue.number}`);
  for(const ref of [...(entry.dependsOn||[]),...(entry.derivedFrom||[])])assert(softwareIds.has(ref)&&ref!==entry.id,'Unknown software reference '+entry.id+' -> '+ref);
  for(const other of entry.alsoOn||[])assert(systemIds.has(other),'Unknown alsoOn system '+entry.id);
  for(const source of entry.sources||[])assert(new URL(source.url).protocol==='https:'&&source.note,'Invalid software source '+entry.id);
  assert(snapshot.statuses[entry.id]&&stages.has(snapshot.statuses[entry.id].stage),'Missing software stage '+entry.id);
  {const image=entry.image,credit=credits[entry.id];assert(image?.src&&image.alt&&image.source,'Missing software photo '+entry.id);await fs.access(path.join(root,image.src));assert(credit?.creator&&credit.license&&credit.source&&credit.changes,'Missing attribution for software photo '+entry.id);}
 }
 assert.equal(findCycle(software.entries),null,'Software dependency cycle');
 for(const system of systemIds)assert(software.entries.some(entry=>entry.system===system),'Software system without titles '+system);
 assert.equal(ui.software.steps.length,8,'The rewrite lifecycle has eight steps');
 for(const key of ['dependency','lineage'])assert.equal(typeof lookup('software.wires.'+key),'string','Missing software wire text: '+key);
 for(const key of ['system','cpu','year','layer','category','difficulty','source','alsoOn'])assert.equal(typeof lookup('software.info.'+key),'string','Missing software info text: '+key);
 console.log(`Checked ${software.entries.length} software titles on ${systemIds.size} computers.`);
}
