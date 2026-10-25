import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {contentValue,formatText} from '../assets/ui-content.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function renderSite(template,ui,catalog){
 const years=catalog.entries.map(entry=>entry.year).filter(Number.isInteger);
 if(!years.length)throw Error('Catalog needs at least one dated entry');
 const firstYear=Math.min(...years),lastYear=Math.max(...years);
 const data={...ui,firstYear,lastYear,heroEyebrow:formatText(ui,'page.heroEyebrow',{firstYear})};
 const result=template.replaceAll('\r\n','\n').replace(/\{\{([A-Za-z0-9_.]+)\}\}/g,(_,key)=>{
  const value=contentValue(data,key);
  if(typeof value!=='string'&&typeof value!=='number')throw Error('Missing shell value: '+key);
  return escape(value);
 });
 if(result.includes('{{'))throw Error('Unresolved shell placeholder');
 return result.replace('<!doctype html>','<!doctype html>\n<!-- Generated from templates/index.html and data/ui.json; run node scripts/render-site.mjs. -->');
}
export async function main(args=process.argv.slice(2)){
 if(args.some(arg=>arg!=='--check'))throw Error('Usage: node scripts/render-site.mjs [--check]');
 const [template,ui,catalog]=await Promise.all([fs.readFile(path.join(root,'templates/index.html'),'utf8'),...['data/ui.json','data/catalog.json'].map(async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8')))]);
 const output=renderSite(template,ui,catalog),target=path.join(root,'index.html');
 if(args.includes('--check')){
  if((await fs.readFile(target,'utf8')).replaceAll('\r\n','\n')!==output)throw Error('index.html is stale; run node scripts/render-site.mjs');
  console.log('Validated JSON-generated page shell');
 }else{await fs.writeFile(target,output);console.log('Rendered index.html from data/ui.json');}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
