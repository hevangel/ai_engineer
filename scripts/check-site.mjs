import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8'));
const [catalog,snapshot,vocabulary,credits]=await Promise.all(['data/catalog.json','data/status.json','data/stages.json','images/credits.json'].map(json));
const ids=new Set(),stages=new Set(vocabulary.stages.map(s=>s.id)),eras=new Set(catalog.eras.map(e=>e.id));
let representative=0;
for(const entry of catalog.entries){
 assert(!ids.has(entry.id),'Duplicate entry '+entry.id);ids.add(entry.id);
 assert(catalog.companies[entry.company],'Missing company '+entry.id);
 assert(eras.has(entry.era),'Missing era '+entry.id);
 assert(['chip','system','card'].includes(entry.kind),'Invalid type '+entry.id);
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
assert.equal(Object.keys(snapshot.statuses).length,ids.size,'Stale snapshot entries');
console.log(`Checked ${ids.size} entries, local photos, credits and statuses (${representative} explicitly labeled representative photos).`);
