import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutRows,softwareLinks,chainIds,findCycle,softwareDestination} from '../assets/software-layout.js';
const layers=[{id:'os'},{id:'driver'},{id:'firmware'},{id:'software'}],categories=[{id:'language'},{id:'game'}];
const systems=[{id:'b',year:1980,title:'B'},{id:'a',year:1975,title:'A'},{id:'empty',year:1970,title:'E'}];
const entries=[
 {id:'g',system:'a',layer:'software',category:'game',year:1976,title:'G'},
 {id:'l',system:'a',layer:'software',category:'language',year:1979,title:'L'},
 {id:'fw',system:'a',layer:'firmware',category:'firmware',year:1975,title:'FW'},
 {id:'os',system:'a',layer:'os',category:'operating-system',year:1979,title:'OS',dependsOn:['fw']},
 {id:'x',system:'b',layer:'software',category:'game',year:1981,title:'X',dependsOn:['os'],derivedFrom:['g']}];
test('rows run by system year; columns follow OS, drivers, firmware, then software sorted by category',()=>{
 const rows=layoutRows({systems,entries,layers,categories});
 assert.deepEqual(rows.map(row=>row.system),['a','b']);
 assert.deepEqual(rows[0].order,['os','fw','l','g']);
 assert.deepEqual(rows[0].columns.map(column=>column.layer),['os','firmware','software']);
});
test('links point from prerequisite or predecessor to dependent',()=>{
 const links=softwareLinks(entries);
 assert.deepEqual(links,[{from:'fw',to:'os',kind:'dependency'},{from:'os',to:'x',kind:'dependency'},{from:'g',to:'x',kind:'lineage'}]);
 assert.deepEqual([...chainIds(links,'os')].sort(),['fw','os','x']);
 assert.deepEqual([...chainIds(links,'fw')].sort(),['fw','os','x']);
 assert.deepEqual([...chainIds(links,'g')].sort(),['g','x']);
});
test('cycles in prerequisites or lineage are detected',()=>{
 assert.equal(findCycle(entries),null);
 assert.ok(findCycle([{id:'p',dependsOn:['q']},{id:'q',derivedFrom:['p']}]));
});
test('keyboard moves stay inside rows and hop between rows',()=>{
 const rows=layoutRows({systems,entries,layers,categories});
 assert.equal(softwareDestination({rows,id:'os',move:'next'}),'fw');
 assert.equal(softwareDestination({rows,id:'os',move:'previous'}),null);
 assert.equal(softwareDestination({rows,id:'g',move:'down'}),'x');
 assert.equal(softwareDestination({rows,id:'x',move:'up'}),'os');
 assert.equal(softwareDestination({rows,id:'x',move:'down'}),null);
});
test('computers from the same year run by release month, then title',()=>{
 const same=[{id:'late',year:1977,month:9,title:'A'},{id:'early',year:1977,month:6,title:'Z'},{id:'none',year:1977,title:'M'},{id:'next',year:1978,month:1,title:'B'}];
 const owned=same.map(system=>({id:'e_'+system.id,system:system.id,layer:'software',category:'game',year:system.year,title:system.title}));
 assert.deepEqual(layoutRows({systems:same,entries:owned,layers,categories}).map(row=>row.system),['none','early','late','next']);
});
