import fs from 'node:fs/promises';
import {normalizeIssueRef,issueKey,itemKey,validateActiveFields} from './issue-refs.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(await fs.readFile(path.join(root,'data/github-issues.json'),'utf8'));
const gh=(...args)=>JSON.parse(execFileSync('gh',args,{encoding:'utf8',maxBuffer:32*1024*1024}));
const api=endpoint=>gh('api',endpoint,'--paginate','--slurp').flat();
const fields=gh('project','field-list',String(config.project.number),'--owner',config.project.owner,'--format','json').fields;
for(const name of ['Status','Agent','Sprint','Workstream','Path','Start date'])if(!fields.some(f=>f.name===name))throw Error('Missing project field '+name);
const statuses=new Set(fields.find(f=>f.name==='Status').options.map(o=>o.name));
const agents=new Set(fields.find(f=>f.name==='Agent').options.map(o=>o.name));
const project=gh('project','item-list',String(config.project.number),'--owner',config.project.owner,'--limit','1000','--format','json');
if(project.items.length<project.totalCount)throw Error('Project inventory truncated; raise the limit/paginate before checking.');
const items=new Map(project.items.filter(i=>i.content?.type==='Issue').map(i=>[itemKey(i),i]));
const seen=new Set();
const checkItem=(value,workstream,expectedPath)=>{
 const ref=normalizeIssueRef(value,config.repository),item=items.get(issueKey(ref));
 if(!item||item.workstream!==workstream)throw Error('Missing or invalid project item '+issueKey(ref));
 validateActiveFields(item,ref.repo,agents,statuses);
 if(expectedPath&&item.path!==expectedPath)throw Error('Path disagrees with work location '+issueKey(ref));
};
for(const family of config.series){
 checkItem(family.issue,'Chips');
 const children=api(`repos/${config.repository}/issues/${family.issue}/sub_issues?per_page=100`);
 for(const member of family.members){
  if(seen.has(issueKey(member.issue))||issueKey(member.issue)===issueKey(family.issue,config.repository))throw Error('Duplicate/circular chip issue #'+member.issue.number);
  seen.add(issueKey(member.issue));
  if(!children.some(child=>child.html_url===normalizeIssueRef(member.issue).url))throw Error('Missing native parent for #'+member.issue.number);
  checkItem(member.issue,'Chips');
 }
}
for(const tool of config.tools)checkItem(tool.issue,'Tooling',tool.projectPath);
checkItem(config.docker.issue,'Tooling',config.docker.projectPath);
const blockers=api(`repos/${config.docker.issue.repo}/issues/${config.docker.issue.number}/dependencies/blocked_by?per_page=100`);
for(const value of config.docker.toolIssues){const ref=normalizeIssueRef(value,config.repository);if(!blockers.some(i=>i.html_url===ref.url))throw Error('Missing Docker blocker '+issueKey(ref));}
console.log(`Verified ${seen.size} chip members in ${config.series.length} families, ${config.tools.length} tool trackers, Docker's ${config.docker.toolIssues.length} blockers and live project fields.`);
