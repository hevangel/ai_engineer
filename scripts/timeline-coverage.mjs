import {issueKey,issueKeyFromUrl} from './issue-refs.mjs';

// This module has no network or filesystem side effects, so coverage rules can
// be tested independently of GitHub and the command-line wrapper.
export function checkTimelineCoverage({config,catalog,software,registry,options,connections,snapshot,issues}) {
 const findings=[],represented=[],excluded=[];
 const fail=(code,message,issue=null)=>findings.push({code,message,...(issue?{issue}: {})});
 const key=ref=>typeof ref==='string'?issueKeyFromUrl(ref):issueKey(ref,registry.repository);
 const live=new Map();
 for(const issue of issues) {
  if(issue.pull_request)continue;
  const id=issueKeyFromUrl(issue.html_url);
  if(live.has(id))throw Error('Duplicate live issue '+id);
  live.set(id,issue);
 }
 const entries=[...catalog.entries,...software.entries.map(e=>({...e,kind:'software'}))];
 const cards=new Map(),ids=new Map();
 for(const entry of entries) {
  if(ids.has(entry.id))fail('duplicate-entry','Duplicate timeline ID '+entry.id);
  ids.set(entry.id,entry);
  const id=key(entry.issue),list=cards.get(id)||[];list.push(entry);cards.set(id,list);
  const issue=live.get(id),state=snapshot.statuses[entry.id];
  if(!issue)fail('missing-issue','Timeline card '+entry.id+' has no live issue in the scanned repositories',entry.issue.url);
  if(!state)fail('missing-status','Timeline card '+entry.id+' has no status snapshot',entry.issue.url);
  else {
   if(state.issueUrl!==entry.issue.url)fail('stale-status-reference','Status issue URL differs from card '+entry.id,entry.issue.url);
   if(issue&&state.issueState!==issue.state)fail('stale-issue-state','Open/closed state differs for '+entry.id,entry.issue.url);
  }
 }
 const exclusions=new Map();
 for(const record of config.exclusions) {
  const id=key(record.issue);
  if(!record.reason?.trim()||exclusions.has(id))throw Error('Invalid/duplicate exclusion '+id);
  exclusions.set(id,record);
  if(!live.has(id))fail('stale-exclusion','Excluded issue is missing or transferred',record.issue);
  if(cards.has(id))fail('excluded-card','An issue cannot have both a card and an exclusion',record.issue);
 }
 const grouped=new Map();
 for(const family of registry.series) {
  const parent=key(family.issue),parentCards=cards.get(parent)||[];
  for(const member of family.members) {
   const id=key(member.issue);
   if(grouped.has(id)||id===parent)fail('invalid-group','Duplicate/circular chip-member mapping',member.issue.url);
   grouped.set(id,parent);
   if(!live.has(id))fail('missing-member','Registered chip-member issue is missing or transferred',member.issue.url);
   if(!parentCards.some(e=>e.kind==='chip'))fail('missing-family-card','Registered chip member has no chip-family timeline card',member.issue.url);
  }
 }
 const configurations=new Map();
 for(const tracker of options.trackers) {
  const id=key(tracker.issue);
  if(configurations.has(id))fail('duplicate-configuration','Duplicate qualification tracker',tracker.issue.url);
  configurations.set(id,tracker);
  if(!live.has(id))fail('missing-qualification','Configuration issue is missing or transferred',tracker.issue.url);
  const source=ids.get(tracker.source),target=ids.get(tracker.target);
  const validTarget=tracker.kind==='cpu'?target?.kind==='chip':target?.kind==='system';
  const wired=connections.links.some(link=>link.source===tracker.source&&(tracker.kind==='cpu'?link.type==='compatible':link.target===tracker.target));
  if(!['chip','card'].includes(source?.kind)||!validTarget||!wired)fail('missing-configuration','Qualification lacks catalog endpoints or a corresponding wire',tracker.issue.url);
 }
 const rules=config.typeRules.map(rule=>({...rule,pattern:new RegExp(rule.titlePattern)}));
 for(const [id,issue] of live) {
  const labels=(issue.labels||[]).map(l=>typeof l==='string'?l:l.name);
  const rule=rules.find(r=>r.pattern.test(issue.title))||rules.find(r=>r.labels.some(l=>labels.includes(l)));
  const matching=cards.get(id);
  if(matching) {
   if(rule&&matching.some(e=>e.kind!==rule.kind))fail('wrong-card-type','Issue type '+rule.kind+' disagrees with its timeline card',issue.html_url);
   represented.push({issue:issue.html_url,representation:'card',entries:matching.map(e=>e.id)});
  } else if(grouped.has(id))represented.push({issue:issue.html_url,representation:'grouped-member',parent:grouped.get(id)});
  else if(configurations.has(id))represented.push({issue:issue.html_url,representation:'configuration',key:configurations.get(id).key});
  else if(exclusions.has(id))excluded.push(exclusions.get(id));
  else if(rule)fail('missing-card','Unrepresented '+rule.kind+' issue: '+issue.title,issue.html_url);
 }
 return {ok:findings.length===0,summary:{scannedIssues:live.size,cards:entries.length,representedIssues:represented.length,groupedMembers:represented.filter(i=>i.representation==='grouped-member').length,configurations:represented.filter(i=>i.representation==='configuration').length,excludedIssues:excluded.length,findings:findings.length},findings,represented,excluded};
}

export function loadLiveIssues(repositories,request) {
 return repositories.flatMap(repo=>{
  const pages=request(`repos/${repo}/issues?state=all&per_page=100`);
  if(!Array.isArray(pages)||pages.some(page=>!Array.isArray(page)))throw Error('Expected complete paginated issue pages for '+repo);
  return pages.flat().filter(issue=>!issue.pull_request);
 });
}
