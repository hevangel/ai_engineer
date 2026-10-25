import test from 'node:test';
import assert from 'node:assert/strict';
import {cardMoves,cardDestination} from '../assets/card-navigation.js';
const entries=new Map([['i1',{kind:'chip',company:'intel'}],['a1',{kind:'chip',company:'amd'}],['i2',{kind:'chip',company:'intel'}],['i3',{kind:'chip',company:'intel'}],['s1',{kind:'system'}],['s2',{kind:'system'}],['s3',{kind:'system'}],['c1',{kind:'card'}]]);
const order=['i1','a1','i2','i3','c1','s1','s2','s3'];
const links=[{source:'i1',target:'s1',type:'required'},{source:'i1',target:'s2',type:'optional'},{source:'i2',target:'s3',type:'required'},{source:'a1',target:'s3',type:'optional'},{source:'i3',target:'s3',type:'required',basis:'reconstruction'},{source:'c1',target:'s1',type:'optional'}];
const go=(id,move,cursor=null,visible=order)=>cardDestination({id,move,order:visible,entries,links,cursor});
test('vim keys and arrows map to the same four moves',()=>{
 for(const [vim,arrow,move]of [['h','ArrowLeft','previous'],['l','ArrowRight','next'],['k','ArrowUp','up'],['j','ArrowDown','down']])assert.equal(cardMoves[vim],move),assert.equal(cardMoves[arrow],move);
});
test('left and right walk one maker\'s chips in displayed order and stop at the ends',()=>{
 assert.equal(go('i1','next').id,'i2');assert.equal(go('i2','next').id,'i3');assert.equal(go('i3','previous').id,'i2');
 assert.equal(go('i1','previous'),null);assert.equal(go('i3','next'),null);assert.equal(go('a1','next'),null);
 assert.equal(go('s1','next'),null);assert.equal(go('c1','previous'),null);
});
test('filtered-out cards are skipped as family destinations',()=>{
 assert.equal(go('i1','next',null,order.filter(id=>id!=='i2')).id,'i3');
});
test('down from a chip reaches its first later computer; up from that computer returns',()=>{
 const down=go('i1','down');assert.deepEqual(down,{id:'s1',origin:'i1'});
 assert.deepEqual(go('s1','up',{to:'s1',origin:'i1'}),{id:'i1',origin:null});
});
test('down from a computer continues through the same chip\'s computers',()=>{
 const cursor={to:'s1',origin:'i1'};
 assert.deepEqual(go('s1','down',cursor),{id:'s2',origin:'i1'});
 assert.equal(go('s2','down',{to:'s2',origin:'i1'}),null);
 assert.equal(go('s1','down'),null);
});
test('up from a computer prefers a required original chip and ignores a stale cursor',()=>{
 assert.equal(go('s3','up').id,'i2');
 assert.equal(go('s3','up',{to:'s3',origin:'i1'}).id,'i2');
 assert.equal(go('s3','up',{to:'s3',origin:'a1'}).id,'a1');
 assert.equal(go('s1','up').id,'i1');
});
test('chips without a visible computer, cards and hidden endpoints do not move',()=>{
 assert.equal(go('i2','up'),null);assert.equal(go('a1','up'),null);assert.equal(go('c1','down'),null);
 assert.equal(go('i1','down',null,order.filter(id=>!['s1','s2'].includes(id))),null);
 assert.equal(go('s1','up',null,order.filter(id=>id!=='i1')),null);
 assert.equal(go('missing','down'),null);
});
test('a chip placed after its reconstruction computer moves up to it',()=>{
 const later=['s1','i1'];assert.equal(go('i1','up',null,later).id,'s1');assert.equal(go('i1','down',null,later),null);
});
