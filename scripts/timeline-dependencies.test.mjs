import test from 'node:test';
import assert from 'node:assert/strict';
import {dependencyTargets,loadLiveBlockers,checkTimelineDependencies} from './timeline-dependencies.mjs';
const repo='owner/repo',url=n=>`https://github.com/${repo}/issues/${n}`;
const ref=n=>({repo,number:n,url:url(n)});
const native=(n,title='[Chip] CPU')=>({number:n,html_url:url(n),title});
function fixture() {
 return {catalog:{entries:[{id:'cpu',kind:'chip',issue:ref(1)},{id:'machine',kind:'system',issue:ref(2)}]},software:{entries:[]},registry:{repository:repo,series:[]},options:{trackers:[]},plannedOptions:{links:[]},profiles:{links:[]},compatible:{groups:[]},connections:{links:[{source:'cpu',target:'machine',type:'required'}]},blockedBy:{[url(2)]:[native(1)]}};
}
const codes=x=>checkTimelineDependencies(x).findings.map(f=>f.code);
function softwareFixture() {
 const x=fixture();x.software.entries=[{id:'os',issue:ref(3)},{id:'app',issue:ref(4),dependsOn:['os']}];x.blockedBy[url(3)]=[];x.blockedBy[url(4)]=[native(3,'[Software] OS')];return x;
}

test('native hardware gates need timeline wires and removed gates leave extra wires',()=>{
 const x=fixture();assert.equal(checkTimelineDependencies(x).ok,true);
 x.connections.links=[];assert.deepEqual(codes(x),['missing-wire']);
 x.connections.links=[{source:'cpu',target:'machine',type:'required'}];x.blockedBy[url(2)]=[];assert.deepEqual(codes(x),['extra-wire']);
});
test('blocker repository is authoritative when local issue numbers collide',()=>{
 const x=fixture();x.blockedBy[url(2)]=[{...native(1),html_url:'https://github.com/owner/other/issues/1'}];
 assert(codes(x).includes('unmapped-hardware-blocker'));assert(codes(x).includes('extra-wire'));
});
test('ambiguous issue profiles and stale profile selection fail explicitly',()=>{
 const x=fixture();x.catalog.entries.push({id:'variant',kind:'chip',issue:ref(1)});assert(codes(x).includes('ambiguous-profile'));
 x.profiles.links=[{source:'variant',target:'machine',basis:'original',evidence:'https://example.com/manual',note:'Selected variant'}];x.connections.links=[{source:'variant',target:'machine',type:'required',basis:'original'}];assert.equal(checkTimelineDependencies(x).ok,true);
 x.blockedBy[url(2)]=[];assert(codes(x).includes('stale-profile'));
});
test('reconstruction metadata cannot silently change to an original-BOM claim',()=>{
 const x=fixture();x.profiles.links=[{source:'cpu',target:'machine',basis:'reconstruction',evidence:'https://example.com/manual',note:'Later reconstruction part'}];x.connections.links[0].basis='original';assert.deepEqual(codes(x),['stale-wire']);
});
test('grouped physical-chip members resolve to the canonical family card',()=>{
 const x=fixture();x.registry.series=[{issue:1,members:[{issue:ref(7)}]}];x.blockedBy[url(2)]=[native(7,'[Chip] Member')];assert.equal(checkTimelineDependencies(x).ok,true);
});
test('optional cards are curated choices, not mandatory native host blockers',()=>{
 const x=fixture();x.catalog.entries.push({id:'card',kind:'card',issue:ref(6)});x.plannedOptions.links=[{source:'card',target:'machine',note:'Planned optional card',evidence:'https://example.com/manual'}];x.connections.links.push({source:'card',target:'machine',type:'optional'});assert.equal(checkTimelineDependencies(x).ok,true);
 x.connections.links[1].type='required';assert(codes(x).includes('extra-wire'));assert(codes(x).includes('missing-wire'));
});
test('compatible CPU wires derive from the original gate without an extra native blocker',()=>{
 const x=fixture();x.catalog.entries.push({id:'alt',kind:'chip',issue:ref(6)});x.compatible.groups=[{id:'cpu-choice',primary:'cpu',members:['cpu','alt'],color:'#112233',wireLabel:'CPU',qualification:'Matching package',evidence:[{url:'https://example.com/manual'}],note:'Alternative'}];x.connections.links[0].compatibilityGroup='cpu-choice';x.connections.links.push({source:'alt',target:'machine',type:'compatible',compatibilityGroup:'cpu-choice',originalSource:'cpu'});assert.equal(checkTimelineDependencies(x).ok,true);
 delete x.connections.links[1].originalSource;assert.deepEqual(codes(x),['stale-wire']);
});
test('software dependsOn is compared in both directions with native blocked-by edges',()=>{
 const x=softwareFixture();assert.equal(checkTimelineDependencies(x).ok,true);
 x.software.entries[1].dependsOn=[];assert.deepEqual(codes(x),['missing-software-dependency']);
 x.software.entries[1].dependsOn=['os'];x.blockedBy[url(4)]=[];assert.deepEqual(codes(x),['extra-software-dependency']);
});
test('derivedFrom is lineage and does not create a native runtime prerequisite',()=>{
 const x=softwareFixture();delete x.software.entries[1].dependsOn;x.software.entries[1].derivedFrom=['os'];x.blockedBy[url(4)]=[];assert.equal(checkTimelineDependencies(x).ok,true);
 x.blockedBy[url(4)]=[native(3,'[Software] OS')];assert.deepEqual(codes(x),['missing-software-dependency']);
});
test('workflow gates are listed separately and do not become invented wires',()=>{
 const x=fixture();x.blockedBy[url(2)].push(native(99,'[Toolchain] Compiler'));const r=checkTimelineDependencies(x);assert.equal(r.ok,true);assert.equal(r.omitted.length,1);assert.equal(r.summary.hardwareWires,1);
});
test('qualification must be blocked by the correct host or original CPU',()=>{
 const x=fixture();x.options.trackers=[{kind:'coprocessor',source:'cpu',target:'machine',issue:ref(5)}];x.blockedBy[url(5)]=[];assert.deepEqual(codes(x),['missing-qualification-blocker']);
 x.blockedBy[url(5)]=[native(2,'[System] Host')];assert.equal(checkTimelineDependencies(x).ok,true);
 x.options.trackers[0].kind='cpu';x.options.trackers[0].target='cpu';assert.deepEqual(codes(x),['missing-qualification-blocker']);
 x.blockedBy[url(5)]=[native(1)];assert.equal(checkTimelineDependencies(x).ok,true);
});
test('incomplete native snapshots fail rather than treating omitted targets as unblocked',()=>{
 const x=softwareFixture();delete x.blockedBy[url(3)];assert.throws(()=>checkTimelineDependencies(x),/Incomplete blocker snapshot/);
});
test('duplicate wires and nonexistent software endpoints cannot pass',()=>{
 const x=fixture();x.connections.links.push({...x.connections.links[0]});assert.deepEqual(codes(x),['duplicate-wire']);
 const s=softwareFixture();s.software.entries[1].dependsOn=['missing'];assert(codes(s).includes('invalid-software-endpoint'));
});
test('blocker loading checks every page and deduplicates target issue profiles',()=>{
 const x=fixture();x.catalog.entries.push({...x.catalog.entries[1],id:'other-profile'});assert.deepEqual(dependencyTargets(x),[url(2)]);
 const calls=[];const data=loadLiveBlockers([url(2)],endpoint=>{calls.push(endpoint);return [[native(1)],[native(6)]];});assert.equal(data[url(2)].length,2);assert.match(calls[0],/blocked_by\?per_page=100$/);
 assert.throws(()=>loadLiveBlockers([url(2)],()=>({items:[]})));
 assert.throws(()=>loadLiveBlockers([url(2)],()=>[]));
});
