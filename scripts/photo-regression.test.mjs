import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const read=async path=>JSON.parse(await fs.readFile(new URL(path,root),'utf8'));
const [catalog,credits,imports]=await Promise.all(['data/catalog.json','data/photo-credits.json','data/image-import.json'].map(read));
test('AMD entries cannot silently repeat the same photograph for different chips',async()=>{
 const hashes=new Map();
 for(const entry of catalog.entries.filter(e=>e.company==='amd'&&e.image.status!=='needed')){
  const bytes=await fs.readFile(new URL(entry.image.src,root)),hash=createHash('sha256').update(bytes).digest('hex');
  assert(!hashes.has(hash),'Duplicate AMD photo for '+entry.id+' and '+hashes.get(hash));hashes.set(hash,entry.id);
 }
});
test('unresolved AMD photographs stay explicit and cannot fall back to a generic brand photo',()=>{
 assert(!Object.hasOwn(imports.brandFallbacks,'amd'));
 for(const entry of catalog.entries.filter(e=>e.company==='amd'&&e.image.status==='needed')){
  assert(!entry.image.src);assert(!credits[entry.id]);assert(imports.requireExact.includes(entry.id));
  for(const lead of entry.image.sourceLeads)assert.equal(new URL(lead.url).protocol,'https:');
 }
});
