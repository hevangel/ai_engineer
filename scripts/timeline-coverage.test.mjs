import test from 'node:test';
import assert from 'node:assert/strict';
import {checkTimelineCoverage,loadLiveIssues} from './timeline-coverage.mjs';

const repo='owner/hardware',url=n=>`https://github.com/${repo}/issues/${n}`;
const ref=n=>({repo,number:n,url:url(n)});
const issue=(n,title,state='open')=>({number:n,html_url:url(n),title,state,labels:[]});
function fixture() {
 return {config:{repositories:[repo],typeRules:[{kind:'chip',titlePattern:'^\\[Chip\\]',labels:['chip']},{kind:'system',titlePattern:'^\\[System\\]',labels:['system']},{kind:'software',titlePattern:'^\\[Software\\]',labels:['software']}],exclusions:[]},catalog:{entries:[{id:'cpu',kind:'chip',issue:ref(1)}]},software:{entries:[]},registry:{repository:repo,series:[]},options:{trackers:[]},connections:{links:[]},snapshot:{statuses:{cpu:{issueUrl:url(1),issueState:'open'}}},issues:[issue(1,'[Chip] CPU')]};
}
const codes=x=>checkTimelineCoverage(x).findings.map(f=>f.code);

test('new typed issues fail coverage even when all existing cards are valid',()=>{
 const x=fixture();x.issues.push(issue(2,'[System] Newly tracked computer'));
 assert.deepEqual(codes(x),['missing-card']);
});
test('repository-local number collisions cannot satisfy a missing card',()=>{
 const x=fixture();x.issues=[{...issue(1,'[Chip] Different CPU'),html_url:'https://github.com/owner/other/issues/1'}];
 assert(codes(x).includes('missing-issue'));assert(codes(x).includes('missing-card'));
});
test('transferred canonical URLs require updating stale card and status references',()=>{
 const x=fixture();x.issues=[{...issue(1,'[Chip] CPU'),html_url:'https://github.com/owner/other/issues/80'}];
 assert(codes(x).includes('missing-issue'));
 x.catalog.entries[0].issue={repo:'owner/other',number:80,url:x.issues[0].html_url};
 assert.deepEqual(codes(x),['stale-status-reference']);
});
test('chip members are covered only while their family has a chip card',()=>{
 const x=fixture();x.registry.series=[{issue:1,members:[{issue:ref(2)}]}];x.issues.push(issue(2,'[Chip] Member'));
 assert.equal(checkTimelineCoverage(x).summary.groupedMembers,1);assert.equal(checkTimelineCoverage(x).ok,true);
 x.catalog.entries=[];assert(codes(x).includes('missing-family-card'));
});
test('configuration coverage needs both endpoints and its actual connection',()=>{
 const x=fixture();x.catalog.entries.push({id:'system',kind:'system',issue:ref(3)});x.snapshot.statuses.system={issueUrl:url(3),issueState:'open'};x.issues.push(issue(2,'Optional configuration'),issue(3,'[System] Computer'));x.options.trackers=[{key:'opt',kind:'coprocessor',source:'cpu',target:'system',issue:ref(2)}];
 assert(codes(x).includes('missing-configuration'));
 x.connections.links.push({source:'cpu',target:'system',type:'optional'});assert.equal(checkTimelineCoverage(x).ok,true);
});
test('software labels discover new title issues without a title prefix',()=>{
 const x=fixture();x.issues.push({...issue(2,'New software title'),labels:[{name:'software'}]});
 assert(codes(x).includes('missing-card'));
});
test('software cards participate in status and type checks',()=>{
 const x=fixture();x.software.entries=[{id:'basic',issue:ref(2)}];x.issues.push(issue(2,'[Software] BASIC'));x.snapshot.statuses.basic={issueUrl:url(2),issueState:'open'};
 assert.equal(checkTimelineCoverage(x).ok,true);
 x.issues[1].state='closed';assert.deepEqual(codes(x),['stale-issue-state']);
 x.issues[1].title='[Chip] BASIC';assert(codes(x).includes('wrong-card-type'));
});
test('exclusions require reasons, cannot mask cards and become stale after transfers',()=>{
 const x=fixture();x.config.exclusions=[{issue:url(2),reason:'Program coordination'}];assert(codes(x).includes('stale-exclusion'));
 x.issues.push(issue(2,'[Software] Program catalog'));assert.equal(checkTimelineCoverage(x).ok,true);
 x.config.exclusions.push({issue:url(1),reason:'Cannot mask a card'});assert(codes(x).includes('excluded-card'));
 x.config.exclusions[0].reason='';assert.throws(()=>checkTimelineCoverage(x));
});
test('shared canonical issue profiles are allowed but duplicate entry IDs are not',()=>{
 const x=fixture();x.catalog.entries.push({id:'cpu_variant',kind:'chip',issue:ref(1)});x.snapshot.statuses.cpu_variant={issueUrl:url(1),issueState:'open'};assert.equal(checkTimelineCoverage(x).ok,true);
 x.catalog.entries[1].id='cpu';assert(codes(x).includes('duplicate-entry'));
});
test('all paginated pages and closed issues are checked; pull requests are ignored',()=>{
 const calls=[];const issues=loadLiveIssues([repo],endpoint=>{calls.push(endpoint);return [[issue(1,'[Chip] CPU')],[issue(2,'[Chip] Finished chip','closed'),{...issue(3,'[Chip] PR'),pull_request:{}}]];});
 assert.equal(issues.length,2);assert.equal(calls[0],`repos/${repo}/issues?state=all&per_page=100`);
 const x=fixture();x.issues=issues;assert(codes(x).includes('missing-card'));
 assert.throws(()=>loadLiveIssues([repo],()=>({items:[]})));
});
