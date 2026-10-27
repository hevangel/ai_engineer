import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {dependencyTargets,loadLiveBlockers,checkTimelineDependencies} from './timeline-dependencies.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let json=false,input=null;
const args=process.argv.slice(2);
for(let i=0;i<args.length;i++) {
 if(args[i]==='--json')json=true;
 else if(args[i]==='--blocked-by'&&args[i+1]&&!args[i+1].startsWith('--'))input=args[++i];
 else throw Error('Usage: node scripts/check-timeline-dependencies.mjs [--json] [--blocked-by COMPLETE_SNAPSHOT.json]');
}
const names=['catalog','software','github-issues','option-issues','system-options','component-profiles','compatible-chips','connections','timeline-coverage'];
const [catalog,software,registry,options,plannedOptions,profiles,compatible,connections,config]=await Promise.all(names.map(async n=>JSON.parse(await fs.readFile(path.join(root,'data',n+'.json'),'utf8'))));
let blockedBy;
if(input) {
 const saved=JSON.parse(await fs.readFile(input,'utf8'));
 if(saved.complete!==true||!saved.blockedBy||Array.isArray(saved.blockedBy))throw Error('Snapshot must declare complete:true and a blockedBy object');
 blockedBy=saved.blockedBy;
} else blockedBy=loadLiveBlockers(dependencyTargets({catalog,software,options}),endpoint=>JSON.parse(execFileSync('gh',['api',endpoint,'--paginate','--slurp'],{encoding:'utf8',maxBuffer:32*1024*1024})));
const report=checkTimelineDependencies({catalog,software,registry,options,plannedOptions,profiles,compatible,connections,blockedBy,config});
if(json)console.log(JSON.stringify(report,null,2));
else {
 console.log(`Checked ${report.summary.hardwareWires} hardware wires, ${report.summary.softwareGates} software gates and ${report.summary.qualificationGates} qualification gates against ${report.summary.targets} native blocker lists.`);
 for(const f of report.findings)console.log(`${f.code}: ${f.message}${f.issue?' — '+f.issue:''}`);
 console.log(report.ok?'Timeline dependencies are in sync.':`${report.findings.length} dependency problem(s).`);
}
if(!report.ok)process.exitCode=1;
