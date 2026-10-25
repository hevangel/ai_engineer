import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {groupExpansionBuses,allocateBusLanes,groupBusRowRuns,busTapPoints} from '../assets/bus-layout.js';
const catalog=JSON.parse(await fs.readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
const connections=JSON.parse(await fs.readFile(new URL('../data/connections.json',import.meta.url),'utf8'));
const entries=new Map(catalog.entries.map(entry=>[entry.id,entry]));

test('all visible cards use one rail per family and preserve every recorded relationship',()=>{
 const before=JSON.stringify(connections),buses=groupExpansionBuses(connections.links,entries,new Set(entries.keys()),catalog.buses);
 assert.equal(buses.length,4);assert.equal(buses.filter(b=>b.family==='isa').length,1);assert.equal(buses.filter(b=>b.family==='nubus').length,1);
 const original=connections.links.filter(link=>entries.get(link.source).kind==='card');
 assert.equal(buses.flatMap(bus=>bus.links).length,original.length);
 for(const link of original)assert(buses.some(bus=>bus.links.includes(link)&&bus.cards.includes(link.source)&&bus.systems.includes(link.target)));
 for(const bus of buses){assert.equal(new Set(bus.cards).size,bus.cards.length);assert.equal(new Set(bus.systems).size,bus.systems.length);}
 for(const card of catalog.entries.filter(e=>e.kind==='card'&&e.bus==='isa'))assert(original.some(link=>link.source===card.id),'Orphan ISA card '+card.id);
 assert.equal(JSON.stringify(connections),before);
});

test('two SX audio profiles share one ISA rail with one tap per card',()=>{
 const ids=new Set(['system_pc_386sx','system_ps2_model35sx','card_adlib','card_sb','card_roland_lapc_i','card_vga']);
 const buses=groupExpansionBuses(connections.links,entries,ids,catalog.buses);
 assert.equal(buses.length,1);assert.equal(buses[0].links.length,6);
 assert.deepEqual([...buses[0].cards].sort(),['card_adlib','card_roland_lapc_i','card_sb']);assert.equal(buses[0].systems.length,2);
 assert(buses[0].links.every(link=>link.type==='optional'));
});

test('a shared rail does not invent cross-product compatibility or hidden-machine taps',()=>{
 const visible=new Set(['system_ibm_pc','system_ps2_model35sx','card_cga','card_adlib']);
 const [bus]=groupExpansionBuses(connections.links,entries,visible,catalog.buses);
 assert.deepEqual(bus.links.map(l=>l.source+'>'+l.target).sort(),['card_adlib>system_ps2_model35sx','card_cga>system_ibm_pc']);
 assert.equal(groupExpansionBuses(connections.links,entries,new Set(['card_cga','card_adlib']),catalog.buses).length,0);
});

test('a row has one horizontal run per family, with rightmost stubs stopping first',()=>{
 const isa={id:'isa'},nubus={id:'nubus'};
 for(const role of ['card','system']){
  const runs=groupBusRowRuns([{bus:isa,role,column:0},{bus:isa,role,column:1},{bus:nubus,role,column:2}]);
  assert.equal(runs.length,2);assert.equal(runs.find(r=>r.bus===isa).branches.length,2);
  assert.equal(runs.find(r=>r.bus===nubus).track,0);assert.equal(runs.find(r=>r.bus===isa).track,1);
 }
});

test('expansion taps leave the bottom and computer taps enter the top with 45-degree turns',()=>{
 const card=busTapPoints({x:100,y:200},240,'card'),system=busTapPoints({x:100,y:400},360,'system');
 assert.deepEqual(card[0],[100,200]);assert.deepEqual(card.at(-1),[106,240]);
 assert.deepEqual(system[0],[106,360]);assert.deepEqual(system.at(-1),[100,400]);
 for(const points of [card,system])for(let i=1;i<points.length;i++){const dx=Math.abs(points[i][0]-points[i-1][0]),dy=Math.abs(points[i][1]-points[i-1][1]);assert(dx===0||dy===0||dx===dy);}
 assert.throws(()=>busTapPoints({x:0,y:200},150,'card'));assert.throws(()=>busTapPoints({x:0,y:200},250,'system'));
});

test('overlapping CPU-choice nets retain separate lanes and disjoint nets can reuse space',()=>{
 const nets=[{id:'a',system:'h1',links:[{source:'c1'}]},{id:'b',system:'h2',links:[{source:'c2'}]},{id:'c',system:'h3',links:[{source:'c3'}]}];
 const rows=new Map([['c1',0],['h1',3],['c2',2],['h2',5],['c3',6],['h3',7]]);
 assert.equal(allocateBusLanes(nets,rows),2);assert.notEqual(nets[0].lane,nets[1].lane);assert([nets[0].lane,nets[1].lane].includes(nets[2].lane));
});
