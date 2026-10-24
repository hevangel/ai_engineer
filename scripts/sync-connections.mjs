import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8'));
const catalog=await read('data/catalog.json');
const options=await read('data/system-options.json');
const entries=new Map(catalog.entries.map(e=>[e.id,e]));
const issueEntries=new Map(catalog.entries.map(e=>[e.issue.repo+'#'+e.issue.number,e]));
const links=[];
for(const target of catalog.entries.filter(e=>e.kind==='system')){
 const endpoint=`repos/${target.issue.repo}/issues/${target.issue.number}/dependencies/blocked_by?per_page=100`;
 const pages=JSON.parse(execFileSync('gh',['api',endpoint,'--paginate','--slurp'],{encoding:'utf8',maxBuffer:16*1024*1024}));
 for(const prerequisite of pages.flat()){
  const source=issueEntries.get(target.issue.repo+'#'+prerequisite.number);
  if(!source||!['chip','card'].includes(source.kind))continue;
  links.push({source:source.id,target:target.id,type:'required',evidence:target.issue.url,note:'Recorded native completion dependency; exact board inventory remains subject to source qualification.'});
 }
}
for(const option of options.links){
 const source=entries.get(option.source),target=entries.get(option.target);
 if(source?.kind!=='card'||target?.kind!=='system'||!option.evidence?.startsWith('https://'))throw Error('Invalid planned option '+JSON.stringify(option));
 if(!links.some(link=>link.source===option.source&&link.target===option.target))links.push({...option,type:'optional'});
}
const result={schemaVersion:1,syncedAt:new Date().toISOString(),source:'Native GitHub system completion dependencies plus separately curated planned card options',links};
const dest=path.join(root,'data/connections.json'),temp=dest+'.tmp';
try{await fs.writeFile(temp,JSON.stringify(result,null,2)+'\n');await fs.rename(temp,dest);}catch(error){await fs.rm(temp,{force:true});throw error;}
console.log(`Synced ${links.filter(l=>l.type==='required').length} recorded component dependencies and ${links.filter(l=>l.type==='optional').length} planned card options.`);
