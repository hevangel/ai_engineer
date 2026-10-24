import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {groupExpansionBuses,allocateBusLanes,busBranchPoints} from '../assets/bus-layout.js';
const catalog=JSON.parse(await fs.readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
const connections=JSON.parse(await fs.readFile(new URL('../data/connections.json',import.meta.url),'utf8'));
const entries=new Map(catalog.entries.map(entry=>[entry.id,entry]));

test('real ISA audio cards share one host bus without adding VGA or joining other hosts',()=>{
 const ids=new Set(['system_pc_386sx','system_ps2_model35sx','card_adlib','card_sb','card_vga']);
 const buses=groupExpansionBuses(connections.links,entries,ids,catalog.buses);
 assert.equal(buses.length,2);
 for(const bus of buses){assert.equal(bus.family,'isa');assert.deepEqual(bus.links.map(link=>link.source).sort(),['card_adlib','card_sb']);assert(bus.links.every(link=>link.type==='optional'&&link.target===bus.system));}
 assert.notEqual(buses[0].system,buses[1].system);
});

test('all recorded card evidence survives grouping and hidden hosts never acquire taps',()=>{
 const buses=groupExpansionBuses(connections.links,entries,new Set(entries.keys()),catalog.buses);
 const original=connections.links.filter(link=>entries.get(link.source).kind==='card');
 assert.equal(buses.flatMap(bus=>bus.links).length,original.length);
 for(const link of original)assert(buses.some(bus=>bus.links.includes(link)&&bus.system===link.target));
 const visible=new Set(['card_cga','card_xtdisk']);
 assert.equal(groupExpansionBuses(connections.links,entries,visible,catalog.buses).length,0);
});

test('overlapping physical buses have separate lanes; disjoint buses reuse space',()=>{
 const buses=[{id:'a',system:'h1',links:[{source:'c1'}]},{id:'b',system:'h2',links:[{source:'c2'}]},{id:'c',system:'h3',links:[{source:'c3'}]}];
 const rows=new Map([['c1',0],['h1',3],['c2',2],['h2',5],['c3',6],['h3',7]]);
 assert.equal(allocateBusLanes(buses,rows),2);
 assert.notEqual(buses[0].lane,buses[1].lane);
 assert([buses[0].lane,buses[1].lane].includes(buses[2].lane));
});

test('inner-card stub exits horizontally, turns in the gap and crosses only below the row',()=>{
 const points=busBranchPoints({x:100,y:60},400,220,112,3);
 assert.deepEqual(points[0],[100,60]);assert.equal(points[1][1],60);
 assert.equal(points.at(-1)[0],400);assert.equal(points.at(-1)[1],220);
 assert(points.filter(([x])=>x>115).every(([,y])=>y>=220));
 for(let i=1;i<points.length;i++){const dx=Math.abs(points[i][0]-points[i-1][0]),dy=Math.abs(points[i][1]-points[i-1][1]);assert(dx===0||dy===0||dx===dy,'Only straight and 45-degree segments');}
 assert.deepEqual(busBranchPoints({x:300,y:60},400),[[300,60],[400,60]]);
});
