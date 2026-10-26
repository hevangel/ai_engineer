import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>JSON.parse(fs.readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const catalog=read('catalog.json'),entries=new Map(catalog.entries.map(e=>[e.id,e]));
const registry=read('option-issues.json').trackers;
test('every optional configuration and CPU alternative has exactly one qualification tracker',()=>{
 const expected=read('system-options.json').links.map(l=>`option:${l.source}:${l.target}`);
 for(const g of read('compatible-chips.json').groups)for(const member of g.members.filter(m=>m!==g.primary))expected.push(`cpu:${g.id}:${member}`);
 assert.deepEqual(registry.map(r=>r.key).sort(),expected.sort());
 assert.equal(new Set(registry.map(r=>r.issue.url)).size,registry.length);
});
test('qualification trackers are separate from canonical hardware issues and point to the correct prerequisite kind',()=>{
 const canonical=new Set(catalog.entries.map(e=>e.issue.url));
 for(const r of registry){
  assert.ok(!canonical.has(r.issue.url));
  assert.equal(entries.get(r.target).kind,r.kind==='cpu'?'chip':'system');
  assert.match(r.issue.url,new RegExp(`^https://github.com/${r.issue.repo}/issues/${r.issue.number}$`));
  assert.ok(r.projectItemId?.startsWith('PVTI_'));
 }
});
test('host-first option blockers preserve an acyclic graph with canonical system gates',()=>{
 const graph=new Map();
 const edge=(a,b)=>graph.set(a,[...(graph.get(a)||[]),b]);
 for(const l of read('connections.json').links.filter(l=>l.type==='required'))edge(entries.get(l.target).issue.url,entries.get(l.source).issue.url);
 for(const r of registry)edge(r.issue.url,entries.get(r.target).issue.url);
 const active=new Set(),done=new Set();
 const visit=node=>{assert.ok(!active.has(node),'Dependency cycle at '+node);if(done.has(node))return;active.add(node);for(const next of graph.get(node)||[])visit(next);active.delete(node);done.add(node);};
 for(const node of graph.keys())visit(node);
});
