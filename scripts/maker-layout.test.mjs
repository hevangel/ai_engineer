import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {isInlineMakerLink,horizontalMakerPoints} from '../assets/maker-layout.js';
test('Am9300 precedes Am2501 within the shared 1970 documentation bound',async()=>{
 const {entries}=JSON.parse(await fs.readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
 assert(entries.findIndex(e=>e.id==='amd_am9300')<entries.findIndex(e=>e.id==='amd_am2501'));
 for(const id of ['amd_am9300','amd_am2501'])assert.equal(entries.find(e=>e.id===id).year,1970);
});
test('adjacent same-row maker chips use the gap, excluding unrelated relationship types',()=>{
 const cells=new Map([['a',{grid:'1970-chips',row:0,column:0}],['b',{grid:'1970-chips',row:0,column:1}]]);
 assert(isInlineMakerLink({source:'a',target:'b',type:'maker'},cells));
 assert(!isInlineMakerLink({source:'a',target:'b',type:'required'},cells));
});
test('a skipped card, row wrap or separate year keeps the routed maker connection',()=>{
 const a={grid:'1970',row:0,column:0};
 for(const b of [{grid:'1970',row:0,column:2},{grid:'1970',row:1,column:0},{grid:'1971',row:0,column:1}])assert(!isInlineMakerLink({source:'a',target:'b',type:'maker'},new Map([['a',a],['b',b]])));
});
test('the direct wire has just one horizontal segment and no gutter detour',()=>{
 assert.deepEqual(horizontalMakerPoints(300,332,160),[[300,160],[332,160]]);
 assert.throws(()=>horizontalMakerPoints(332,300,160));
});

test('Am2505 and Am3101 are adjacent in the unfiltered 1971 chip row',async()=>{
 const {entries}=JSON.parse(await fs.readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
 const chips=entries.filter(e=>e.year===1971&&e.kind==='chip');
 assert.deepEqual(chips.slice(0,2).map(e=>e.id),['amd_am2505','amd_am3101']);
 for(const columns of [2,3]){
  const cells=new Map(chips.map((e,i)=>[e.id,{grid:'1971-chips',row:Math.floor(i/columns),column:i%columns}]));
  assert(isInlineMakerLink({source:'amd_am2505',target:'amd_am3101',type:'maker'},cells));
 }
});
