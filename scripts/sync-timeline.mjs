import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const vocabulary=JSON.parse(await fs.readFile(path.join(root,'data/stages.json'),'utf8'));
const syncConfig=JSON.parse(await fs.readFile(path.join(root,'data/sync.json'),'utf8'));
const validStages=vocabulary.stages.map(stage=>stage.id),validBuilds=vocabulary.builds.map(build=>build.id);
const http=value=>{try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}};
function verifyRecord(record,human=false){return record&&http(record.evidence)&&Number.isFinite(Date.parse(record.at))&&(!human||typeof record.reviewer==='string'&&record.reviewer.trim().length>0);}
export function normalizeIssue(issue,projectStatus=null){
 const matches=[...(issue.body||'').matchAll(/```timeline-status\s*\n([\s\S]*?)\n```/g)];
 if(matches.length>1)throw Error('Only one timeline-status block is allowed');
 let meta={};if(matches.length){try{meta=JSON.parse(matches[0][1]);}catch{throw Error('Invalid timeline-status JSON');}}
 const labels=(issue.labels||[]).map(l=>typeof l==='string'?l:l.name);
 const marked=labels.filter(l=>l.startsWith('timeline:')).map(l=>l.slice(9));
 if(marked.length>1)throw Error('Multiple timeline stage labels');
 const stage=meta.stage||marked[0]||(syncConfig.projectStages[projectStatus]||'planned');
 if(!validStages.includes(stage))throw Error('Unknown timeline stage: '+stage);
 if(meta.stage&&marked.length&&meta.stage!==marked[0])throw Error('Stage block and label disagree');
 let coverage={collected:null,cleaned:null,total:null,percent:null};
 if(meta.sources){const {collected,cleaned,total}=meta.sources;if(![collected,cleaned,total].every(Number.isSafeInteger)||total<=0||cleaned<0||collected<cleaned||collected>total)throw Error('Source counts must satisfy 0 <= cleaned <= collected <= total, total > 0');coverage={collected,cleaned,total,percent:Math.round(cleaned/total*100)};}
 if(stage==='sources_ready'&&(coverage.total===null||coverage.cleaned!==coverage.total))throw Error('Sources ready requires explicit 100% cleaned source coverage');
 if(stage==='ai_verified'&&!verifyRecord(meta.verification?.ai))throw Error('AI verification needs evidence URL and timestamp');
 if(stage==='human_verified'&&!verifyRecord(meta.verification?.human,true))throw Error('Human verification needs reviewer, evidence URL and timestamp');
 const build=meta.build||{status:'unknown'};if(!validBuilds.includes(build.status))throw Error('Unknown build status');
 if(build.status!=='unknown'&&!http(build.evidence))throw Error('Reported build health needs an evidence URL');
 return {stage,coverage,build:{status:build.status,evidence:build.evidence||null},verification:{ai:verifyRecord(meta.verification?.ai)?{evidence:meta.verification.ai.evidence,at:meta.verification.ai.at}:null,human:verifyRecord(meta.verification?.human,true)?{evidence:meta.verification.human.evidence,at:meta.verification.human.at,reviewer:meta.verification.human.reviewer}:null},issueState:issue.state,projectStatus,updatedAt:issue.updated_at,issueUrl:issue.html_url};
}
function gh(args){return JSON.parse(execFileSync('gh',args,{encoding:'utf8',maxBuffer:32*1024*1024}));}
export async function main(args=process.argv.slice(2)){
 const catalog=JSON.parse(await fs.readFile(path.join(root,'data/catalog.json'),'utf8'));
 const seen=new Set();for(const entry of catalog.entries){if(seen.has(entry.id)||!/^[-a-z0-9_]+$/.test(entry.id))throw Error('Duplicate/invalid catalog id');seen.add(entry.id);if(!/^[\w.-]+\/[\w.-]+$/.test(entry.issue.repo)||!Number.isSafeInteger(entry.issue.number))throw Error('Invalid issue reference');}
 if(args.includes('--check')){const snapshot=JSON.parse(await fs.readFile(path.join(root,'data/status.json'),'utf8'));for(const entry of catalog.entries){const status=snapshot.statuses[entry.id];if(!status||!validStages.includes(status.stage))throw Error('Missing/invalid status for '+entry.id);if(status.stage==='ai_verified'&&!verifyRecord(status.verification?.ai))throw Error('Unsubstantiated AI status');if(status.stage==='human_verified'&&!verifyRecord(status.verification?.human,true))throw Error('Unsubstantiated human status');if(status.coverage.percent!==null&&(status.coverage.percent<0||status.coverage.percent>100))throw Error('Invalid coverage');}console.log('Validated '+seen.size+' catalog/status records');return;}
 let projectItems=[];if(args.includes('--project')){const number=args[args.indexOf('--project')+1];if(!/^\d+$/.test(number||''))throw Error('--project needs a number');const owner=args.includes('--owner')?args[args.indexOf('--owner')+1]:syncConfig.githubOwner;projectItems=gh(['project','item-list',number,'--owner',owner,'--limit','10000','--format','json']).items;}
 const issues=new Map();for(const repo of new Set(catalog.entries.map(e=>e.issue.repo))){const pages=gh(['api',`repos/${repo}/issues?state=all&per_page=100`,'--paginate','--slurp']);for(const issue of pages.flat())if(!issue.pull_request)issues.set(repo+'#'+issue.number,issue);}
 const statuses={};for(const entry of catalog.entries){const issue=issues.get(entry.issue.repo+'#'+entry.issue.number);if(!issue)throw Error('Issue not returned: '+entry.id);const project=projectItems.find(i=>i.content?.number===entry.issue.number&&i.content?.repository===entry.issue.repo);try{statuses[entry.id]=normalizeIssue(issue,project?.status||null);}catch(error){throw Error(`${entry.issue.repo}#${issue.number}: ${error.message}`);}}
 const result={schemaVersion:1,syncedAt:new Date().toISOString(),source:syncConfig.statusSource+(projectItems.length?syncConfig.projectSourceSuffix:''),statuses};
 const dest=path.join(root,'data/status.json'),temp=dest+'.tmp';try{await fs.writeFile(temp,JSON.stringify(result,null,2)+'\n');await fs.rename(temp,dest);}catch(error){await fs.rm(temp,{force:true});throw error;}console.log('Synced '+Object.keys(statuses).length+' timeline entries; no issue bodies or credentials exported');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
