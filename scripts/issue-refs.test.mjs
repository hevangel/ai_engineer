import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeIssueRef,issueKey,itemKey,validateActiveFields} from './issue-refs.mjs';
test('issue identities remain distinct across repository-local number collisions',()=>{
 assert.notEqual(issueKey({repo:'hevangel/ai_engineer',number:68}),issueKey({repo:'hevangel/ai_hw_engineer',number:68}));
 assert.equal(itemKey({content:{type:'Issue',repository:'hevangel/ai_hw_engineer',number:68}}),'hevangel/ai_hw_engineer#68');
 assert.equal(normalizeIssueRef(68,'hevangel/ai_engineer').repo,'hevangel/ai_engineer');
 assert.throws(()=>normalizeIssueRef({repo:'hevangel/ai_hw_engineer',number:68,url:'https://github.com/hevangel/ai_engineer/issues/68'}));
});
test('active ownership requires status, owner-relative path and a retained first-start date',()=>{
 const agents=new Set(['Codex']),statuses=new Set(['Planned','Researching','AI verified']);
 const item={agent:'Codex',status:'Researching',path:'ai_hw_engineer/docs/eqy','start date':'2026-10-25'};
 assert.doesNotThrow(()=>validateActiveFields(item,'hevangel/ai_hw_engineer',agents,statuses));
 for(const patch of [{status:'Planned'},{path:'B:/work/eqy'},{path:'ai_engineer/docs/eqy'},{path:'ai_hw_engineer/../docs'}, {'start date':''}])assert.throws(()=>validateActiveFields({...item,...patch},'hevangel/ai_hw_engineer',agents,statuses));
 assert.doesNotThrow(()=>validateActiveFields({status:'Planned'},'hevangel/ai_hw_engineer',agents,statuses));
 assert.doesNotThrow(()=>validateActiveFields({...item,agent:undefined,status:'AI verified'},'hevangel/ai_hw_engineer',agents,statuses));
});

import {issueKeyFromUrl} from './issue-refs.mjs';
test('dependency keys retain the prerequisite repository across transfers',()=>{
 assert.equal(issueKeyFromUrl('https://github.com/hevangel/ai_engineer/issues/18'),'hevangel/ai_engineer#18');
 assert.equal(issueKeyFromUrl('https://github.com/hevangel/ai_hw_engineer/issues/80'),'hevangel/ai_hw_engineer#80');
 assert.notEqual(issueKeyFromUrl('https://github.com/hevangel/ai_hw_engineer/issues/18'),issueKeyFromUrl('https://github.com/hevangel/ai_engineer/issues/18'));
 assert.throws(()=>issueKeyFromUrl('https://example.com/hevangel/ai_engineer/issues/18'));
});
