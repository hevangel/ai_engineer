import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {checkTimelineCoverage,loadLiveIssues} from './timeline-coverage.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
let json=false,input=null;
for(let i=0;i<args.length;i++) {
 if(args[i]==='--json')json=true;
 else if(args[i]==='--issues'&&args[i+1]&&!args[i+1].startsWith('--'))input=args[++i];
 else throw Error('Usage: node scripts/check-timeline-issues.mjs [--json] [--issues COMPLETE_SNAPSHOT.json]');
}
const read=async name=>JSON.parse(await fs.readFile(path.join(root,'data',name+'.json'),'utf8'));
const [config,catalog,software,registry,options,connections,snapshot]=await Promise.all(['timeline-coverage','catalog','software','github-issues','option-issues','connections','status'].map(read));
let issues;
if(input) {
 const saved=JSON.parse(await fs.readFile(input,'utf8'));
 if(saved.complete!==true||!Array.isArray(saved.issues)||!Array.isArray(saved.repositories)||saved.repositories.length!==config.repositories.length||config.repositories.some(repo=>!saved.repositories.includes(repo)))throw Error('Snapshot must declare complete:true and include all configured repositories');
 issues=saved.issues;
} else issues=loadLiveIssues(config.repositories,endpoint=>JSON.parse(execFileSync('gh',['api',endpoint,'--paginate','--slurp'],{encoding:'utf8',maxBuffer:64*1024*1024})));
const report=checkTimelineCoverage({config,catalog,software,registry,options,connections,snapshot,issues});
if(json)console.log(JSON.stringify(report,null,2));
else {
 console.log(`Checked ${report.summary.cards} timeline cards against ${report.summary.scannedIssues} issues; ${report.summary.groupedMembers} grouped members, ${report.summary.configurations} configurations, ${report.summary.excludedIssues} documented exclusions.`);
 for(const finding of report.findings)console.log(`${finding.code}: ${finding.message}${finding.issue?' — '+finding.issue:''}`);
 console.log(report.ok?'Timeline issue coverage is in sync.':`${report.findings.length} coverage problem(s).`);
}
if(!report.ok)process.exitCode=1;
