import test from 'node:test';
import assert from 'node:assert/strict';
import {isLocalComponentLink,localComponentPoints} from '../assets/component-layout.js';
const entries=new Map([['mcs4',{kind:'chip'}],['busicom',{kind:'system'}],['card',{kind:'card'}]]);
const edge={source:'mcs4',target:'busicom',type:'required'};
test('a chip can connect locally to the immediately following computer row',()=>{
 const rows=new Map([['mcs4',4],['busicom',5]]);
 assert(isLocalComponentLink(edge,rows,entries));
 assert(isLocalComponentLink({...edge,type:'optional'},rows,entries));
});
test('intervening rows, reversed chronology and missing endpoints keep gutter routing',()=>{
 for(const target of [3,4,6,undefined])assert(!isLocalComponentLink(edge,new Map([['mcs4',4],['busicom',target]]),entries));
 assert(!isLocalComponentLink(edge,new Map([['busicom',1]]),entries));
});
test('maker links, expansion cards and later reconstruction parts keep their own routing',()=>{
 const rows=new Map([['mcs4',0],['card',0],['busicom',1]]);
 for(const other of [{...edge,type:'maker'},{...edge,source:'card'},{...edge,basis:'reconstruction'},{...edge,compatibilityGroup:'cpu',type:'compatible'},{...edge,compatibilityGroup:'cpu'}])assert(!isLocalComponentLink(other,rows,entries));
});
test('a cross-column local bridge stays in the row gap with 45-degree bends',()=>{
 for(const [x1,x2] of [[800,100],[100,800],[100,104]]){
  const points=localComponentPoints({x:x1,y:400},{x:x2,y:550},430);
  assert.deepEqual(points[0],[x1,400]);assert.deepEqual(points.at(-1),[x2,550]);
  for(const [x,y]of points){assert(x>=Math.min(x1,x2)&&x<=Math.max(x1,x2));assert(y>=400&&y<=550);}
  for(let i=1;i<points.length;i++){const dx=Math.abs(points[i][0]-points[i-1][0]),dy=Math.abs(points[i][1]-points[i-1][1]);assert(!dx||!dy||dx===dy);}
  assert(points.slice(1,-1).every(([,y])=>y>=424&&y<=436));
 }
});
test('aligned ports use a vertical segment and invalid gaps fail explicitly',()=>{
 assert.deepEqual(localComponentPoints({x:100,y:400},{x:100,y:550},430),[[100,400],[100,550]]);
 for(const y of [350,400,550,600])assert.throws(()=>localComponentPoints({x:100,y:400},{x:800,y:550},y));
});
