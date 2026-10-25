import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {expandCompatibleConnections,groupCompatibleConnections} from '../assets/compatible-layout.js';
const read=async name=>JSON.parse(await fs.readFile(new URL('../data/'+name,import.meta.url),'utf8'));
const [catalog,snapshot,definitions]=await Promise.all(['catalog.json','connections.json','compatible-chips.json'].map(read));
const entries=new Map(catalog.entries.map(entry=>[entry.id,entry]));

test('8086 PS/2 choices and 8088 PC choices remain distinct',()=>{
 const nets=groupCompatibleConnections(snapshot.links,new Set(entries.keys()),definitions);
 const ps2=nets.find(n=>n.system==='system_ibm_ps2_model30'),pc=nets.find(n=>n.system==='system_ibm_pc');
 assert.deepEqual(ps2.links.map(l=>l.source).sort(),['amd_8086','intel_8086']);
 assert.deepEqual(pc.links.map(l=>l.source).sort(),['amd_8088','intel_8088']);
 assert.equal(nets.length,9);assert(!nets.some(n=>n.system==='system_ps2_model56slc'));
});

test('alternatives do not turn into required completion gates',()=>{
 const original=[{source:'intel_8086',target:'system_ibm_ps2_model30',type:'required',evidence:'https://github.com/hevangel/ai_engineer/issues/86'}];
 const expanded=expandCompatibleConnections(original,definitions,entries);
 assert.equal(expanded.filter(l=>l.type==='required').length,1);
 assert.equal(expanded.find(l=>l.source==='amd_8086').type,'compatible');
 assert.equal(expanded[0].evidence,original[0].evidence);assert(!original[0].compatibilityGroup);
});

test('AMD-only filtering retains its role without inventing hidden chips or joining hosts',()=>{
 const visible=new Set(['amd_8088','system_ibm_pc','system_ibm_pc_xt_5160']);
 const nets=groupCompatibleConnections(snapshot.links,visible,definitions);
 assert.equal(nets.length,2);assert(nets.every(n=>n.links.length===1&&n.links[0].source==='amd_8088'));
 assert.notEqual(nets[0].system,nets[1].system);
});

test('ungrouped processors and independent gates cannot be silently treated as alternatives',()=>{
 const links=[{source:'ibm_386slc',target:'system_ps2_model56slc',type:'required'}];
 assert.deepEqual(expandCompatibleConnections(links,definitions,entries),links);
 assert.throws(()=>expandCompatibleConnections([{source:'intel_8086',target:'system_ibm_ps2_model30',type:'required'},{source:'amd_8086',target:'system_ibm_ps2_model30',type:'required'}],definitions,entries),/independent gate/);
 const bad={groups:[{...definitions.groups[0],members:['intel_8086','not-a-chip']}]};
 assert.throws(()=>expandCompatibleConnections([],bad,entries),/Invalid compatibility/);
});
