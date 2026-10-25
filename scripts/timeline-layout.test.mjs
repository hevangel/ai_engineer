import test from 'node:test';
import assert from 'node:assert/strict';
import {minimumBoardWidth,preferredColumns} from '../assets/timeline-layout.js';
test('three cards reserve chapter padding and real gaps, avoiding the former 710px underestimate',()=>{
 assert.equal(minimumBoardWidth(3,{cardMin:200,gap:32,padding:56}),720);
});
test('a wide window fits the complete diagram including both wire gutters',()=>{
 const metrics={cardMin:200,gap:32,padding:56},available=2048-128-110,left=456,right=318;
 const columns=preferredColumns(available-left-right,metrics);
 assert.equal(columns,3);assert(minimumBoardWidth(columns,metrics)+left+right<=available);
});
test('routing space reduces columns before forcing a desktop scrollbar',()=>{
 const metrics={cardMin:200,gap:25,padding:56},available=1093,left=456,right=325;
 assert.equal(preferredColumns(available-left-right,metrics),1);
 assert(minimumBoardWidth(1,metrics)+left+right<=available);
 assert.equal(preferredColumns(481,metrics),2);assert.equal(preferredColumns(480,metrics),1);
});
test('a narrow circuit keeps one readable card and scrolls when wires cannot fit',()=>{
 const metrics={cardMin:190,gap:22,padding:22};
 assert.equal(preferredColumns(160,metrics),1);assert.equal(minimumBoardWidth(1,metrics),212);
});
