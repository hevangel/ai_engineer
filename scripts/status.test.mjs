import {test} from 'node:test';import assert from 'node:assert/strict';import {normalizeIssue} from './sync-timeline.mjs';
const issue=(meta={},extra={})=>({body:'```timeline-status\n'+JSON.stringify(meta)+'\n```',state:'open',labels:[],...extra});
test('closed or project Done never implies human verification',()=>{assert.equal(normalizeIssue(issue({}, {state:'closed'}),'Done').stage,'planned');});
test('active project item maps to building',()=>assert.equal(normalizeIssue(issue({}),'In progress').stage,'building'));
test('coverage measures explicitly cleaned sources, not checkboxes',()=>{const status=normalizeIssue(issue({sources:{collected:8,cleaned:3,total:10}}));assert.equal(status.coverage.percent,30);assert.equal(normalizeIssue({...issue(),body:'- [x] unrelated task'}).coverage.percent,null);});
test('invalid counts fail instead of inflating coverage',()=>assert.throws(()=>normalizeIssue(issue({sources:{collected:3,cleaned:8,total:10}}))));
test('AI verification requires evidence and date',()=>{assert.throws(()=>normalizeIssue(issue({stage:'ai_verified'})));assert.equal(normalizeIssue(issue({stage:'ai_verified',verification:{ai:{evidence:'https://example.org/report',at:'2026-10-23'}}})).stage,'ai_verified');});
test('human verification requires named reviewer',()=>assert.throws(()=>normalizeIssue(issue({stage:'human_verified',verification:{human:{evidence:'https://example.org/report',at:'2026-10-23'}}}))));
test('source-ready and build-passing claims require evidence',()=>{assert.throws(()=>normalizeIssue(issue({stage:'sources_ready'})));assert.throws(()=>normalizeIssue(issue({build:{status:'passing'}})));});
test('ambiguous metadata and unknown stages fail',()=>{assert.throws(()=>normalizeIssue({...issue({stage:'building'}),labels:[{name:'timeline:planned'}]}));assert.throws(()=>normalizeIssue(issue({stage:'magic'})))});

test('rounded coverage cannot falsely complete source preparation',()=>assert.throws(()=>normalizeIssue(issue({stage:'sources_ready',sources:{collected:1000,cleaned:999,total:1000}}))));
test('verification export excludes unrecognized metadata',()=>{const status=normalizeIssue(issue({stage:'ai_verified',verification:{ai:{evidence:'https://example.org/report',at:'2026-10-23',privateNotes:'not public'}}}));assert.deepEqual(Object.keys(status.verification.ai).sort(),['at','evidence']);});
