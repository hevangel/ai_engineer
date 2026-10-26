import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8'));
const apply=process.argv.includes('--apply');
if(process.argv.slice(2).some(a=>a!=='--apply'))throw Error('Usage: node scripts/sync-option-issues.mjs [--apply]');
const gh=(...args)=>execFileSync('gh',args,{encoding:'utf8',maxBuffer:16*1024*1024}).trim();
const api=(endpoint,...args)=>JSON.parse(gh('api',endpoint,...args));
const catalog=read('catalog.json'),entries=new Map(catalog.entries.map(e=>[e.id,e]));
const config=read('option-issues.json');
const tasks=[];
for(const group of read('compatible-chips.json').groups)for(const member of group.members.filter(id=>id!==group.primary))tasks.push({key:`cpu:${group.id}:${member}`,kind:'cpu',source:member,target:group.primary,note:group.qualification+' '+group.note,evidence:group.evidence.map(e=>e.url)});
for(const link of read('system-options.json').links)tasks.push({key:`option:${link.source}:${link.target}`,kind:entries.get(link.source)?.kind==='card'?'card':'coprocessor',...link,evidence:[link.evidence]});
const issues=JSON.parse(gh('issue','list','--repo',config.repository,'--state','all','--limit','1000','--json','number,title,body,url'));
const fields=JSON.parse(gh('project','field-list',String(config.project.number),'--owner',config.project.owner,'--format','json')).fields;
const project=JSON.parse(gh('project','view',String(config.project.number),'--owner',config.project.owner,'--format','json'));
const statusField=fields.find(f=>f.name==='Status'),workField=fields.find(f=>f.name==='Workstream');
let failures=0;
const prerequisites=new Map();
const save=()=>fs.writeFileSync(path.join(root,'data/option-issues.json'),JSON.stringify(config,null,2)+'\n');
for(const task of tasks){
 const source=entries.get(task.source),target=entries.get(task.target);
 if(!source||!target)throw Error('Unknown catalog endpoint '+task.key);
 const marker=`<!-- ai-engineer-option:${task.key} -->`;
 let record=config.trackers.find(r=>r.key===task.key);
 let issue=record?issues.find(i=>i.number===record.issue.number):issues.find(i=>i.body.includes(marker));
 if(issue&&!issue.body?.includes(marker))throw Error('Issue lacks qualification marker: '+task.key);
 if(!issue&&apply){
  const title=`[${task.kind==='cpu'?'CPU alternative':'Optional configuration'}] ${source.title} ${task.kind==='cpu'?'compatible with':'on'} ${target.title}`;
  const body=[marker,'',`## Scope`,'',`Qualify ${source.title} ${task.kind==='cpu'?'as an alternative to':'on'} ${target.title}.`,'',task.note,'',`Canonical implementation: ${source.issue.url}`,`Completion prerequisite: ${target.issue.url}`,'','This is a qualification task; it does not create another hardware-family catalog card or a base-machine requirement.','',`## Acceptance`,'','- [ ] Select exact hardware revision, package/slot, clock, voltage and firmware profile.','- [ ] Record sourced interface requirements and compatibility limits.','- [ ] Integrate with the accepted prerequisite and exercise independent historical software/regressions.','- [ ] Link verification reports and document unsupported configurations.','','## Sources','',...task.evidence.map(url=>`- ${url}`)].join('\n');
  const url=gh('issue','create','--repo',config.repository,'--title',title,'--body',body);
  issue={number:Number(url.split('/').pop()),url};
 }
 if(!issue){console.error('MISSING tracker '+task.key);failures++;continue;}
 if(!record){record={key:task.key,kind:task.kind,source:task.source,target:task.target,issue:{repo:config.repository,number:issue.number,url:issue.url}};config.trackers.push(record);if(apply)save();}
 if(record.source!==task.source||record.target!==task.target||record.kind!==task.kind)throw Error('Tracker endpoints disagree: '+task.key);
 const prerequisiteKey=`${target.issue.repo}#${target.issue.number}`;
 if(!prerequisites.has(prerequisiteKey))prerequisites.set(prerequisiteKey,api(`repos/${target.issue.repo}/issues/${target.issue.number}`));
 const prerequisite=prerequisites.get(prerequisiteKey);
 const endpoint=`repos/${config.repository}/issues/${issue.number}/dependencies/blocked_by`;
 let blockers=api(endpoint+'?per_page=100','--paginate','--slurp').flat();
 if(!blockers.some(b=>b.id===prerequisite.id)&&apply){api(endpoint,'--method','POST','-F',`issue_id=${prerequisite.id}`);blockers=api(endpoint+'?per_page=100','--paginate','--slurp').flat();}
 if(!blockers.some(b=>b.id===prerequisite.id)){console.error(`MISSING blocker #${issue.number} -> #${target.issue.number}`);failures++;}
 if(apply){
  const previouslyTracked=Boolean(record.projectItemId);
  const item=JSON.parse(gh('project','item-add',String(config.project.number),'--owner',config.project.owner,'--url',issue.url,'--format','json'));
  record.projectItemId=item.id;save();
  for(const [field,value] of (previouslyTracked?[]:[[workField,task.kind==='card'?'Cards':'Chips'],[statusField,config.initialStatus]])){
   const option=field.options.find(o=>o.name===value);if(!option)throw Error('Missing project option '+value);
   gh('project','item-edit','--id',item.id,'--project-id',project.id,'--field-id',field.id,'--single-select-option-id',option.id);
  }
 }
 console.log(`#${issue.number}: ${task.key} blocked by #${target.issue.number}`);
}
const items=JSON.parse(gh('project','item-list',String(config.project.number),'--owner',config.project.owner,'--limit','1000','--format','json')).items;
for(const task of tasks){const record=config.trackers.find(r=>r.key===task.key);if(record&&!items.some(i=>i.content?.url===record.issue.url)){console.error('MISSING project item '+task.key);failures++;}}
for(const record of config.trackers)if(!tasks.some(t=>t.key===record.key)){console.error('STALE tracker '+record.key);failures++;}
if(failures)throw Error(`${failures} option tracking mismatches`);
console.log(`Verified ${tasks.length} qualification trackers, native blockers and project membership.`);
