import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(await fs.readFile(path.join(root,'data/github-issues.json'),'utf8'));
const gh=(...args)=>JSON.parse(execFileSync('gh',args,{encoding:'utf8',maxBuffer:32*1024*1024}));
const api=endpoint=>gh('api',endpoint,'--paginate','--slurp').flat();
const fields=gh('project','field-list',String(config.project.number),'--owner',config.project.owner,'--format','json').fields;
for(const name of ['Status','Agent','Sprint','Workstream'])if(!fields.some(f=>f.name===name))throw Error('Missing project field '+name);
const statuses=new Set(fields.find(f=>f.name==='Status').options.map(o=>o.name));
const agents=new Set(fields.find(f=>f.name==='Agent').options.map(o=>o.name));
const project=gh('project','item-list',String(config.project.number),'--owner',config.project.owner,'--limit','1000','--format','json');
if(project.items.length<project.totalCount)throw Error('Project inventory truncated; raise the limit/paginate before checking.');
const items=new Map(project.items.filter(i=>i.content?.repository===config.repository).map(i=>[i.content.number,i]));
const seen=new Set();
const checkItem=(number,workstream)=>{const item=items.get(number);if(!item||item.workstream!==workstream||!statuses.has(item.status)||item.agent&&!agents.has(item.agent))throw Error('Missing or invalid project item #'+number);};
for(const family of config.series){
 checkItem(family.issue,'Chips');
 const children=api(`repos/${config.repository}/issues/${family.issue}/sub_issues?per_page=100`);
 for(const member of family.members){
  if(seen.has(member.issue.number)||member.issue.number===family.issue)throw Error('Duplicate/circular chip issue #'+member.issue.number);
  seen.add(member.issue.number);
  if(!children.some(child=>child.number===member.issue.number))throw Error('Missing native parent for #'+member.issue.number);
  checkItem(member.issue.number,'Chips');
 }
}
for(const tool of config.tools)checkItem(tool.issue.number,'Tooling');
checkItem(config.docker.issue.number,'Tooling');
const blockers=api(`repos/${config.repository}/issues/${config.docker.issue.number}/dependencies/blocked_by?per_page=100`);
for(const number of config.docker.toolIssues)if(!blockers.some(i=>i.number===number))throw Error('Missing Docker blocker #'+number);
console.log(`Verified ${seen.size} chip members in ${config.series.length} families, ${config.tools.length} tool trackers, Docker's ${config.docker.toolIssues.length} blockers and live project fields.`);
