import {issueKey,issueKeyFromUrl} from './issue-refs.mjs';
import {expandCompatibleConnections} from '../assets/compatible-layout.js';

export function dependencyTargets({catalog,software,options}) {
 return [...new Set([...catalog.entries.filter(e=>e.kind==='system').map(e=>e.issue.url),...software.entries.map(e=>e.issue.url),...options.trackers.map(t=>t.issue.url)])];
}
export function loadLiveBlockers(targets,request) {
 return Object.fromEntries(targets.map(url=>{
  issueKeyFromUrl(url);
  const pages=request('repos/'+new URL(url).pathname.slice(1)+'/dependencies/blocked_by?per_page=100');
  if(!Array.isArray(pages)||!pages.length||pages.some(p=>!Array.isArray(p)))throw Error('Expected complete paginated blockers for '+url);
  return [url,pages.flat()];
 }));
}

export function checkTimelineDependencies({catalog,software,registry,options,plannedOptions,profiles,compatible,connections,blockedBy,config={exclusions:[]}}) {
 const findings=[],omitted=[];
 const fail=(code,message,issue)=>findings.push({code,message,...(issue?{issue}:{})});
 const entries=new Map(catalog.entries.map(e=>[e.id,e]));
 const sw=new Map(software.entries.map(e=>[e.id,e]));
 const key=ref=>issueKey(ref,registry.repository);
 const excluded=new Set(config.exclusions.map(r=>issueKeyFromUrl(r.issue)));
 const hardwareIssues=new Map(),softwareIssues=new Map();
 for(const entry of catalog.entries.filter(e=>['chip','card'].includes(e.kind))) {
  const id=key(entry.issue),list=hardwareIssues.get(id)||[];list.push(entry);hardwareIssues.set(id,list);
 }
 for(const family of registry.series)for(const member of family.members) {
  const id=key(member.issue),parent=typeof family.issue==='number'?{repo:registry.repository,number:family.issue}:family.issue;
  if(!hardwareIssues.has(id))hardwareIssues.set(id,hardwareIssues.get(key(parent))||[]);
 }
 for(const entry of software.entries) {
  const id=key(entry.issue),list=softwareIssues.get(id)||[];list.push(entry);softwareIssues.set(id,list);
 }
 for(const url of dependencyTargets({catalog,software,options}))if(!Object.hasOwn(blockedBy,url)||!Array.isArray(blockedBy[url]))throw Error('Incomplete blocker snapshot: '+url);
 const blockers=url=>blockedBy[url].map(b=>({record:b,key:issueKeyFromUrl(b.html_url)}));
 const selected=new Map(),used=new Set();
 for(const profile of profiles.links) {
  const pair=profile.source+'>'+profile.target;
  if(selected.has(pair)||!['chip','card'].includes(entries.get(profile.source)?.kind)||entries.get(profile.target)?.kind!=='system'||!['original','reconstruction'].includes(profile.basis)||!profile.note?.trim()||!profile.evidence?.startsWith('https://'))throw Error('Invalid/duplicate component profile '+pair);
  selected.set(pair,profile);
 }
 const expected=[];
 for(const target of catalog.entries.filter(e=>e.kind==='system'))for(const blocker of blockers(target.issue.url)) {
  const candidates=hardwareIssues.get(blocker.key)||[];
  if(!candidates.length) {
   if(!excluded.has(blocker.key)&&/^\[(Chip|Card|System)\]/.test(blocker.record.title||''))fail('unmapped-hardware-blocker','Native hardware blocker has no timeline representation: '+blocker.record.html_url,target.issue.url);
   else omitted.push({target:target.issue.url,blocker:blocker.record.html_url});
   continue;
  }
  const choices=candidates.filter(e=>selected.has(e.id+'>'+target.id));
  if(choices.length>1||(!choices.length&&candidates.length>1)) {fail('ambiguous-profile','Select one hardware profile for '+target.id+' and '+blocker.record.html_url,target.issue.url);continue;}
  const source=choices[0]||candidates[0],pair=source.id+'>'+target.id,profile=selected.get(pair);
  if(profile)used.add(pair);
  expected.push({source:source.id,target:target.id,type:'required',...(profile?{basis:profile.basis}:{})});
 }
 for(const pair of selected.keys())if(!used.has(pair))fail('stale-profile','Component profile lacks a matching native blocker: '+pair);
 for(const option of plannedOptions.links) {
  if(!['chip','card'].includes(entries.get(option.source)?.kind)||entries.get(option.target)?.kind!=='system')throw Error('Invalid planned option endpoints');
  if(!expected.some(l=>l.source===option.source&&l.target===option.target))expected.push({...option,type:'optional'});
 }
 let expanded;
 try{expanded=expandCompatibleConnections(expected,compatible,entries);}
 catch(error){fail('invalid-compatible-gate',error.message);expanded=expected;}
 const wireKey=l=>l.source+'>'+l.target+':'+l.type;
 const wanted=new Map(expanded.map(l=>[wireKey(l),l])),actual=new Map();
 for(const link of connections.links) {
  const id=wireKey(link);
  if(actual.has(id))fail('duplicate-wire','Duplicate timeline wire '+id);
  actual.set(id,link);
  if(!wanted.has(id))fail('extra-wire','Timeline wire has no matching native or curated prerequisite: '+id);
  else if(['basis','compatibilityGroup','originalSource'].some(k=>link[k]!==wanted.get(id)[k]))fail('stale-wire','Timeline wire has stale profile/compatibility metadata: '+id);
 }
 for(const [id,link] of wanted)if(!actual.has(id))fail('missing-wire','Native or curated prerequisite is missing from the timeline: '+id,entries.get(link.target)?.issue.url);
 let softwareGates=0;
 for(const target of software.entries) {
  const declared=new Set();
  for(const sourceId of target.dependsOn||[]) {
   const source=sw.get(sourceId);
   if(!source){fail('invalid-software-endpoint','Unknown dependsOn title '+sourceId,target.issue.url);continue;}
   const id=key(source.issue);
   if(declared.has(id))fail('duplicate-software-dependency','Duplicate software dependsOn '+sourceId,target.issue.url);
   declared.add(id);
  }
  const native=new Set();
  for(const blocker of blockers(target.issue.url)) {
   if(softwareIssues.has(blocker.key))native.add(blocker.key);
   else if(!excluded.has(blocker.key)&&/^\[Software\]/.test(blocker.record.title||''))fail('unmapped-software-blocker','Native software blocker has no title card: '+blocker.record.html_url,target.issue.url);
   else omitted.push({target:target.issue.url,blocker:blocker.record.html_url});
  }
  softwareGates+=native.size;
  for(const id of native)if(!declared.has(id))fail('missing-software-dependency','Native software blocker is absent from dependsOn: '+id,target.issue.url);
  for(const id of declared)if(!native.has(id))fail('extra-software-dependency','dependsOn has no matching native blocked-by edge: '+id,target.issue.url);
  // derivedFrom records history/lineage, not an execution prerequisite.
 }
 for(const tracker of options.trackers) {
  const target=entries.get(tracker.target);
  if(!target||(tracker.kind==='cpu'?target.kind!=='chip':target.kind!=='system'))throw Error('Invalid qualification target '+tracker.target);
  for(const extra of blockers(tracker.issue.url).filter(b=>b.key!==key(target.issue)))omitted.push({target:tracker.issue.url,blocker:extra.record.html_url});
  if(!blockers(tracker.issue.url).some(b=>b.key===key(target.issue)))fail('missing-qualification-blocker','Qualification issue must be blocked by its '+(tracker.kind==='cpu'?'original CPU':'host computer'),tracker.issue.url);
 }
 return {ok:findings.length===0,summary:{targets:dependencyTargets({catalog,software,options}).length,hardwareWires:wanted.size,softwareGates,qualificationGates:options.trackers.length,omittedWorkflowBlockers:omitted.length,findings:findings.length},findings,omitted};
}
