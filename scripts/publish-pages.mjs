import {execFileSync, spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git=(args, input)=>execFileSync('git',args,{cwd:root,input,encoding:'utf8',maxBuffer:16*1024*1024}).trim();
const args=process.argv.slice(2);
let ref='HEAD',publish=false;
for(let i=0;i<args.length;i++){
  if(args[i]==='--publish')publish=true;
  else if(args[i]==='--ref'&&args[i+1]&&!args[i+1].startsWith('-'))ref=args[++i];
  else throw Error('Usage: node scripts/publish-pages.mjs [--ref <commit>] [--publish]');
}
const source=git(['rev-parse','--verify',ref+'^{commit}']);
const allowed=['index.html','assets','data','images'];
const records=git(['ls-tree','-r','-z',source,'--',...allowed]).split('\0').filter(Boolean);
for(const record of records){
  const match=record.match(/^(100644|100755) blob [a-f0-9]+\t(.+)$/);
  if(!match||!allowed.some(name=>match[2]===name||match[2].startsWith(name+'/')))throw Error('Unsupported publishing entry: '+record);
}
const roots=git(['ls-tree',source,'--',...allowed]).split('\n');
if(roots.length!==4||!roots.some(line=>line.endsWith('\tindex.html')))throw Error('Missing required static site paths');
console.log(`Source: ${source} (${records.length} committed static files)`);
console.log('Publish paths: index.html, assets/, data/, images/, .nojekyll');
if(!publish){console.log('Preview only. Add --publish when publication is authorized.');process.exit(0);}

// Publish committed objects directly: no checkout, index or submodule changes.
const remote=spawnSync('git',['ls-remote','--exit-code','origin','refs/heads/gh-pages'],{cwd:root,encoding:'utf8'});
if(remote.status!==0&&remote.status!==2)throw Error(remote.stderr||'Cannot inspect gh-pages');
let parent=null;
if(remote.status===0){
  git(['fetch','--no-tags','origin','refs/heads/gh-pages']);
  parent=git(['rev-parse','FETCH_HEAD']);
}
const empty=git(['hash-object','-w','--stdin'],'');
const tree=git(['mktree'],[...roots,`100644 blob ${empty}\t.nojekyll`].join('\n')+'\n');
if(parent&&git(['rev-parse',parent+'^{tree}'])===tree){console.log(`Already published: ${parent}`);process.exit(0);}
const commitArgs=['commit-tree',tree];
if(parent)commitArgs.push('-p',parent);
const commit=git(commitArgs,`website: publish static snapshot from ${source.slice(0,12)}\n\nSource-Commit: ${source}\n`);
git(['push','origin',commit+':refs/heads/gh-pages']);
console.log(`Published snapshot: ${commit}`);
