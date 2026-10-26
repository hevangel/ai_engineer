import {issueKeyFromUrl} from './issue-refs.mjs';
import {expandCompatibleConnections} from '../assets/compatible-layout.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8'));
const catalog=await read('data/catalog.json');
const syncConfig=await read('data/sync.json');
const options=await read('data/system-options.json');
const profiles=await read('data/component-profiles.json');
const compatible=await read('data/compatible-chips.json');
const entries=new Map(catalog.entries.map(e=>[e.id,e]));
const issueEntries=new Map();
for(const entry of catalog.entries){const key=entry.issue.repo+'#'+entry.issue.number;const members=issueEntries.get(key)||[];members.push(entry);issueEntries.set(key,members);}
const selected=new Map(),used=new Set();
for(const profile of profiles.links){const source=entries.get(profile.source),target=entries.get(profile.target),key=profile.source+'>'+profile.target;if(!['chip','card'].includes(source?.kind)||target?.kind!=='system'||!['original','reconstruction'].includes(profile.basis)||!profile.note||!profile.evidence?.startsWith('https://')||selected.has(key))throw Error('Invalid component profile '+key);selected.set(key,profile);}
const links=[];
for(const target of catalog.entries.filter(e=>e.kind==='system')){
 const endpoint=`repos/${target.issue.repo}/issues/${target.issue.number}/dependencies/blocked_by?per_page=100`;
 const pages=JSON.parse(execFileSync('gh',['api',endpoint,'--paginate','--slurp'],{encoding:'utf8',maxBuffer:16*1024*1024}));
 for(const prerequisite of pages.flat()){
  const candidates=(issueEntries.get(issueKeyFromUrl(prerequisite.html_url))||[]).filter(entry=>['chip','card'].includes(entry.kind));
  if(!candidates.length)continue;
  const choices=candidates.filter(entry=>selected.has(entry.id+'>'+target.id));
  if(choices.length>1||(!choices.length&&candidates.length>1))throw Error('Select one component variant for '+target.id+' prerequisite #'+prerequisite.number);
  const source=choices[0]||candidates[0],key=source.id+'>'+target.id,profile=selected.get(key);
  if(profile)used.add(key);
  links.push({source:source.id,target:target.id,type:'required',evidence:profile?.evidence||target.issue.url,note:profile?.note||syncConfig.nativeDependencyNote,...(profile?{basis:profile.basis}:{})});
 }
}
for(const key of selected.keys())if(!used.has(key))throw Error('Component profile has no matching native dependency: '+key);
for(const option of options.links){
 const source=entries.get(option.source),target=entries.get(option.target);
 if(!['chip','card'].includes(source?.kind)||target?.kind!=='system'||!option.note?.trim()||!option.evidence?.startsWith('https://'))throw Error('Invalid planned option '+JSON.stringify(option));
 if(!links.some(link=>link.source===option.source&&link.target===option.target))links.push({...option,type:'optional'});
}
const expanded=expandCompatibleConnections(links,compatible,entries);
const result={schemaVersion:1,syncedAt:new Date().toISOString(),source:syncConfig.connectionsSource,links:expanded};
const dest=path.join(root,'data/connections.json'),temp=dest+'.tmp';
try{await fs.writeFile(temp,JSON.stringify(result,null,2)+'\n');await fs.rename(temp,dest);}catch(error){await fs.rm(temp,{force:true});throw error;}
console.log(`Synced ${links.filter(l=>l.type==='required').length} recorded component dependencies and ${links.filter(l=>l.type==='optional').length} planned chip/card options.`);

console.log(`Added ${expanded.filter(link=>link.type==='compatible').length} compatible CPU alternatives; native blocked-by gates unchanged.`);
