import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {checkTimelineCoverage,loadLiveIssues} from './timeline-coverage.mjs';
import {dependencyTargets,loadLiveBlockers,checkTimelineDependencies} from './timeline-dependencies.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
let json=false,input=null,dependencies=false,blockerFile=null;
for(let i=0;i<args.length;i++) {
 if(args[i]==='--json')json=true;
 else if(args[i]==='--dependencies')dependencies=true;
 else if(args[i]==='--blocked-by'&&args[i+1]&&!args[i+1].startsWith('--'))blockerFile=args[++i];
 else if(args[i]==='--issues'&&args[i+1]&&!args[i+1].startsWith('--'))input=args[++i];
 else throw Error('Usage: node scripts/check-timeline-issues.mjs [--json] [--issues COMPLETE_SNAPSHOT.json] [--dependencies [--blocked-by COMPLETE_BLOCKERS.json]]');
}
if(blockerFile&&!dependencies)throw Error('--blocked-by requires --dependencies');
const read=async name=>JSON.parse(await fs.readFile(path.join(root,'data',name+'.json'),'utf8'));
const [config,catalog,software,registry,options,connections,snapshot]=await Promise.all(['timeline-coverage','catalog','software','github-issues','option-issues','connections','status'].map(read));
let issues;
if(input) {
 const saved=JSON.parse(await fs.readFile(input,'utf8'));
 if(saved.complete!==true||!Array.isArray(saved.issues)||!Array.isArray(saved.repositories)||saved.repositories.length!==config.repositories.length||config.repositories.some(repo=>!saved.repositories.includes(repo)))throw Error('Snapshot must declare complete:true and include all configured repositories');
 issues=saved.issues;
} else issues=loadLiveIssues(config.repositories,endpoint=>JSON.parse(execFileSync('gh',['api',endpoint,'--paginate','--slurp'],{encoding:'utf8',maxBuffer:64*1024*1024})));
const report=checkTimelineCoverage({config,catalog,software,registry,options,connections,snapshot,issues});
if(dependencies) {
 const [plannedOptions,profiles,compatible]=await Promise.all(['system-options','component-profiles','compatible-chips'].map(read));
 let blockedBy;
 if(blockerFile) {
  const saved=JSON.parse(await fs.readFile(blockerFile,'utf8'));
  if(saved.complete!==true||!saved.blockedBy||Array.isArray(saved.blockedBy))throw Error('Invalid complete blocker snapshot');
  blockedBy=saved.blockedBy;
 } else blockedBy=loadLiveBlockers(dependencyTargets({catalog,software,options}),endpoint=>JSON.parse(execFileSync('gh',['api',endpoint,'--paginate','--slurp'],{encoding:'utf8',maxBuffer:32*1024*1024})));
 report.dependencies=checkTimelineDependencies({catalog,software,registry,options,plannedOptions,profiles,compatible,connections,blockedBy,config});
 report.ok=report.ok&&report.dependencies.ok;
 report.findings.push(...report.dependencies.findings);
 report.summary.findings=report.findings.length;
}
if(json)console.log(JSON.stringify(report,null,2));
else {
 console.log(`Checked ${report.summary.cards} timeline cards against ${report.summary.scannedIssues} issues; ${report.summary.groupedMembers} grouped members, ${report.summary.configurations} configurations, ${report.summary.excludedIssues} documented exclusions.`);
 for(const finding of report.findings)console.log(`${finding.code}: ${finding.message}${finding.issue?' — '+finding.issue:''}`);
 if(dependencies)console.log(`Dependency comparison: ${report.dependencies.summary.hardwareWires} hardware wires, ${report.dependencies.summary.softwareGates} software gates, ${report.dependencies.summary.qualificationGates} qualification gates.`);
 console.log(report.ok?'Timeline issue checks passed.':`${report.findings.length} timeline issue problem(s).`);
}
if(!report.ok)process.exitCode=1;
