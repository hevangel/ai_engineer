import {createRouter,roundedPath,portsFor} from './software-routing.js';
import {layoutRows,softwareLinks,chainIds,softwareMoves,softwareDestination} from './software-layout.js';
// The software view: computers on the left of each row, then operating systems, drivers, firmware and software,
// all linked by dependency and lineage. Content is in data/software.json; wording in data/ui.json (software.*).
const SVG='http://www.w3.org/2000/svg';
export function createSoftwareView({data,catalog,snapshot,vocabulary,ui,text,element,link,badge,iconNode,openHardwareInfo,photoCredit,appendPhoto,$}){
 const categories=new Map(data.categories.map(category=>[category.id,category]));
 const layers=new Map(data.layers.map(layer=>[layer.id,layer]));
 const entries=new Map(data.entries.map(entry=>[entry.id,entry]));
 const systems=new Map(data.systems.map(system=>[system.id,system]));
 const links=softwareLinks(data.entries);
 const state={category:'all',search:'',stage:'all',systems:new Set(),selected:null};
 let navRows=[],drawFrame=0,built=false;

 // A system either reuses its hardware catalog card or carries its own title, photo and colour.
 function machine(system){
  const entry=system.catalog?catalog.entries.find(item=>item.id===system.catalog):null;
  if(system.catalog&&!entry)throw Error('Unknown catalog system '+system.catalog);
  return entry?{system,entry,title:entry.title,summary:entry.summary,year:entry.year,image:entry.image,creditId:entry.id,color:catalog.companies[entry.company].color,issue:entry.issue}
   :{system,entry:null,title:system.title,summary:system.summary,year:system.year,image:system.image,creditId:'software_system_'+system.id,color:system.color,issue:null};
 }
 function statusOf(id){
  const status=snapshot.statuses[id];
  return {status,stage:vocabulary.stages.find(stage=>stage.id===status?.stage),build:vocabulary.builds.find(build=>build.id===status?.build?.status)||vocabulary.builds[0]};
 }
 function statusBadges(id){
  const {stage,build}=statusOf(id),badges=element('div','status-badges');
  const buildBadge=badge(build.icon,build.label,'build-badge build-'+build.id);buildBadge.style.setProperty('--stage',build.color);
  const stageBadge=badge(stage?.icon||ui.card.statusFallback.icon,stage?.label||text('card.statusFallback.label'));stageBadge.style.setProperty('--stage',stage?.color||ui.card.statusFallback.color);
  badges.append(buildBadge,stageBadge);return badges;
 }
 function visible(entry){
  const category=categories.get(entry.category),layer=layers.get(entry.layer),system=machine(systems.get(entry.system));
  if(state.category!=='all'&&entry.category!==state.category)return false;
  if(state.stage!=='all'&&statusOf(entry.id).status?.stage!==state.stage)return false;
  if(state.systems.size&&!state.systems.has(entry.system))return false;
  if(!state.search)return true;
  return [entry.title,entry.summary,system.title,category.label,layer.label,entry.sourceMaterial].join(' ').toLowerCase().includes(state.search);
 }

 function softwareCard(entry){
  const category=categories.get(entry.category),layer=layers.get(entry.layer);
  const article=element('article','software-card');article.id='software-'+entry.id;article.tabIndex=0;article.dataset.id=entry.id;article.dataset.category=entry.category;article.dataset.layer=entry.layer;
  article.style.setProperty('--category',category.color);article.title=text('software.wires.hint',{title:entry.title});
  const photo=element('div','photo-wrap');if(entry.image)appendPhoto(photo,{title:entry.title,image:entry.image});
  const head=element('div','software-card-head'),icon=element('span','category-icon');icon.append(iconNode(category.icon));
  head.append(icon,element('span','software-tag',(layer.label===category.label?category.label:text('software.layerBadge',{layer:layer.label,category:category.label}))));
  const info=element('button','info-button',text('info.symbol'));info.setAttribute('aria-label',text('info.button',{title:entry.title}));info.addEventListener('click',()=>openInfo(entry));head.append(info);
  const title=element('h3');title.append(link(entry.title,entry.issue.url));
  const meta=element('p','software-meta',text('software.yearDifficulty',{year:entry.year,difficulty:entry.difficulty}));
  const footer=element('div','entry-footer');footer.append(statusBadges(entry.id),link(text('card.issueLink',{number:entry.issue.number}),entry.issue.url));
  article.append(...(entry.image?[photo]:[]),head,title,element('p','summary',entry.summary),meta,footer);
  return article;
 }
 function systemCard(system,count){
  const item=machine(system),article=element('article','software-card software-system');article.id='software-system-'+system.id;article.tabIndex=0;article.dataset.id='sys:'+system.id;article.style.setProperty('--category',item.color);
  article.title=text('software.wires.hint',{title:item.title});
  const photo=element('div','photo-wrap');
  if(item.image)appendPhoto(photo,{title:item.title,image:item.image});
  const info=element('button','info-button',text('info.symbol'));info.setAttribute('aria-label',text('info.button',{title:item.title}));info.addEventListener('click',()=>item.entry?openHardwareInfo(item.entry):openSystemInfo(item));photo.append(info);
  const meta=element('div','entry-meta');meta.append(element('span','maker',text('software.machineBadge')),element('span','',String(item.year)));
  const title=element('h3');title.append(item.issue?link(item.title,item.issue.url):document.createTextNode(item.title));
  article.append(photo,meta,title,element('p','summary',item.summary),element('p','software-meta',system.cpu+' · '+text('software.machineTitles',{count})));
  return article;
 }

 function infoSection(heading,...nodes){const section=element('section','info-date');section.append(element('h3','',heading),...nodes);return section;}
 function jumpList(ids){
  const list=element('p','software-jumps');
  if(!ids.length)return element('p','',text('software.info.none'));
  for(const id of ids){const target=entries.get(id),button=element('button','software-jump',target.title);button.addEventListener('click',()=>{$('info-dialog').close();focusCard(id);});list.append(button);}
  return list;
 }
 function openInfo(entry){
  const category=categories.get(entry.category),layer=layers.get(entry.layer),system=machine(systems.get(entry.system)),body=$('info-body');
  body.replaceChildren();$('info-dialog').style.setProperty('--company',category.color);
  const kind=element('p','info-kind');kind.append(element('span','maker',category.label));if(layer.label!==category.label)kind.append(element('span','',layer.label));
  const title=element('h2','',entry.title);title.id='info-title';
  const facts=element('dl','software-facts');
  for(const [key,value] of [['system',system.title],['cpu',systems.get(entry.system).cpu],['year',String(entry.year)],['layer',layer.label],['category',category.label],['difficulty',entry.difficulty],['source',entry.sourceMaterial],...(entry.alsoOn?.length?[['alsoOn',entry.alsoOn.map(id=>machine(systems.get(id)).title).join(', ')]]:[])])facts.append(element('dt','',text('software.info.'+key)),element('dd','',value));
  const needs=entry.dependsOn||[],requiredBy=links.filter(item=>item.from===entry.id&&item.kind==='dependency').map(item=>item.to);
  const derived=entry.derivedFrom||[],ledTo=links.filter(item=>item.from===entry.id&&item.kind==='lineage').map(item=>item.to);
  const steps=element('ol','software-steps');for(const step of ui.software.steps)steps.append(element('li','',step));
  const sources=(entry.sources||[]).map(source=>link(source.note,source.url));
  const issue=element('p','info-issue');issue.append(link(text('software.info.issue',{number:entry.issue.number}),entry.issue.url));
  body.append(kind,title,element('p','info-summary',entry.summary),infoSection(text('software.info.facts'),facts),
   infoSection(text('software.info.needs'),jumpList(needs)),infoSection(text('software.info.requiredBy'),jumpList(requiredBy)),
   infoSection(text('software.info.derivedFrom'),jumpList(derived)),infoSection(text('software.info.ledTo'),jumpList(ledTo)));
  if(sources.length)body.append(infoSection(text('software.info.sources'),...sources));
  if(entry.image?.src)body.append(photoCredit({id:entry.id,image:entry.image}));
  body.append(infoSection(text('software.info.stepsHeading'),steps),issue);
  $('info-dialog').showModal();
 }
 function openSystemInfo(item){
  const body=$('info-body');body.replaceChildren();$('info-dialog').style.setProperty('--company',item.color);
  const kind=element('p','info-kind');kind.append(element('span','maker',text('software.machineBadge')),element('span','',String(item.year)));
  const title=element('h2','',item.title);title.id='info-title';
  const facts=element('dl','software-facts');facts.append(element('dt','',text('software.info.cpu')),element('dd','',item.system.cpu),element('dt','',text('software.info.year')),element('dd','',String(item.year)));
  const owned=data.entries.filter(entry=>entry.system===item.system.id).map(entry=>entry.id);
  body.append(kind,title,element('p','info-summary',item.summary),infoSection(text('software.info.facts'),facts),infoSection(text('software.info.titlesHeading'),jumpList(owned)));
  if(item.image?.src)body.append(photoCredit({id:item.creditId,image:item.image}));
  $('info-dialog').showModal();
 }

 function render(){
  const shownEntries=data.entries.filter(visible),shownIds=new Set(shownEntries.map(entry=>entry.id));
  const rows=layoutRows({systems:data.systems,entries:shownEntries,layers:data.layers,categories:data.categories});
  navRows=rows.map(row=>({...row,order:['sys:'+row.system,...row.order]}));
  const host=$('software-rows');host.replaceChildren();
  let shownYear=null;
  for(const row of rows){
   const year=systems.get(row.system).year;
   if(year!==shownYear){shownYear=year;const heading=element('div','year-heading software-year');heading.dataset.year=String(year);heading.append(element('span','',String(year)),element('i'));host.append(heading);}
   const section=element('section','software-row');section.dataset.system=row.system;
   const strip=element('div','software-columns');
   for(const column of row.columns){
    const group=element('div','software-layer');group.dataset.layer=column.layer;group.append(element('h4','',layers.get(column.layer).label));
    const cards=element('div','software-cards');for(const id of column.items)cards.append(softwareCard(entries.get(id)));group.append(cards);strip.append(group);
   }
   section.append(systemCard(systems.get(row.system),data.entries.filter(entry=>entry.system===row.system).length),strip);host.append(section);
  }
  $('software-count').textContent=text('software.count',{shown:shownIds.size,total:data.entries.length});
  $('software-empty').hidden=rows.length>0;
  if(state.selected&&!document.getElementById(cardDomId(state.selected)))state.selected=null;
  updateYear();applyHighlight();scheduleDraw();
 }
 const cardDomId=id=>id.startsWith('sys:')?'software-system-'+id.slice(4):'software-'+id;

 const connected=id=>id?chainIds(links,id):null;
 function applyHighlight(){
  const active=connected(state.selected);
  for(const card of document.querySelectorAll('.software-card')){
   const id=card.dataset.id;card.classList.toggle('dim',!!active&&!active.has(id));card.classList.toggle('selected',id===state.selected);
  }
  for(const path of document.querySelectorAll('#software-wires .software-wire,#software-pads .software-pad')){
   const on=!active||(active.has(path.dataset.from)&&active.has(path.dataset.to));
   path.classList.toggle('dim',!on);path.classList.toggle('hot',!!active&&on);
  }
 }

 function scheduleDraw(){cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(draw);}
 function draw(){
  const board=$('software-board'),svg=$('software-wires'),padSvg=$('software-pads');svg.replaceChildren();padSvg.replaceChildren();
  const box=board.getBoundingClientRect();if(!box.width)return;
  for(const layer of [svg,padSvg]){layer.setAttribute('width',String(board.clientWidth));layer.setAttribute('height',String(board.offsetHeight));layer.setAttribute('viewBox','0 0 '+board.clientWidth+' '+board.offsetHeight);}
  const place=id=>{const node=document.getElementById(cardDomId(id));if(!node)return null;const r=node.getBoundingClientRect();return {left:r.left-box.left,right:r.right-box.left,top:r.top-box.top,bottom:r.bottom-box.top,cx:(r.left+r.right)/2-box.left,cy:(r.top+r.bottom)/2-box.top};};
  // Wires run orthogonally through the gaps between cards; a link with no clear route falls back to a curve.
  const cards=[...board.querySelectorAll('.software-card')].map(node=>{const r=node.getBoundingClientRect();return {left:r.left-box.left,right:r.right-box.left,top:r.top-box.top,bottom:r.bottom-box.top};});
  const router=createRouter({width:board.clientWidth,height:board.offsetHeight,rects:cards});
  const placed=links.map(item=>({item,a:place(item.from),b:place(item.to)})).filter(link=>link.a&&link.b);
  placed.sort((p,q)=>(Math.abs(p.a.cx-p.b.cx)+Math.abs(p.a.cy-p.b.cy))-(Math.abs(q.a.cx-q.b.cx)+Math.abs(q.a.cy-q.b.cy)));
  for(const {item,a,b} of placed){
   const points=router.route(a,b);let d;
   if(points)d=roundedPath(points);
   else{
   if(b.left>a.right+6){const x1=a.right,y1=a.cy,x2=b.left,y2=b.cy,dx=Math.max(24,(x2-x1)/2);d=`M${x1} ${y1} C${x1+dx} ${y1} ${x2-dx} ${y2} ${x2} ${y2}`;}
   else if(a.left>b.right+6){const x1=a.left,y1=a.cy,x2=b.right,y2=b.cy,dx=Math.max(24,(x1-x2)/2);d=`M${x1} ${y1} C${x1-dx} ${y1} ${x2+dx} ${y2} ${x2} ${y2}`;}
   else if(b.top>=a.bottom){const x1=a.cx,y1=a.bottom,x2=b.cx,y2=b.top,dy=Math.max(24,(y2-y1)/2);d=`M${x1} ${y1} C${x1} ${y1+dy} ${x2} ${y2-dy} ${x2} ${y2}`;}
   else{const x1=a.cx,y1=a.top,x2=b.cx,y2=b.bottom,dy=Math.max(24,(y1-y2)/2);d=`M${x1} ${y1} C${x1} ${y1-dy} ${x2} ${y2+dy} ${x2} ${y2}`;}
   }
   const path=document.createElementNS(SVG,'path');path.setAttribute('d',d);path.setAttribute('class','software-wire '+item.kind);path.dataset.from=item.from;path.dataset.to=item.to;
   svg.append(path);
   // Hollow pads mark both ends, like the hardware cards.
   const {start,end}=portsFor(a,b);
   for(const port of [start,end]){const pad=document.createElementNS(SVG,'circle');pad.setAttribute('cx',String(points?(port===start?points[0].x:points.at(-1).x):port.x));pad.setAttribute('cy',String(points?(port===start?points[0].y:points.at(-1).y):port.y));pad.setAttribute('r','4.5');pad.setAttribute('class','software-pad '+item.kind);pad.dataset.from=item.from;pad.dataset.to=item.to;padSvg.append(pad);}
  }
  applyHighlight();
 }

 function focusCard(id){
  const hidden=!document.getElementById(cardDomId(id));
  if(hidden){reset();}
  const node=document.getElementById(cardDomId(id));if(!node)return;
  state.selected=id;applyHighlight();node.scrollIntoView({block:'nearest',inline:'nearest'});node.focus({preventScroll:true});
 }
 function reset(){
  state.category='all';state.search='';state.stage='all';state.systems.clear();syncSystems();$('software-search').value='';$('software-stage').value='all';syncTabs();render();
 }
 // The computer filter is a multi-select: no box ticked means every computer.
 function syncSystems(){
  for(const box of $('software-systems-list').querySelectorAll('input[type=checkbox]'))box.checked=state.systems.has(box.value);
  const chosen=[...state.systems];
  $('software-systems-label').textContent=!chosen.length?text('software.systemAll'):chosen.length===1?machine(systems.get(chosen[0])).title:text('software.systemCount',{count:chosen.length});
  $('software-systems').classList.toggle('active',chosen.length>0);
 }
 function buildSystemFilter(){
  const list=$('software-systems-list'),ordered=[...data.systems].sort((a,b)=>a.year-b.year||(a.month||0)-(b.month||0)||a.title.localeCompare(b.title));
  for(const system of ordered){
   const label=element('label','multi-select-option'),box=element('input');box.type='checkbox';box.value=system.id;
   box.addEventListener('change',()=>{if(box.checked)state.systems.add(system.id);else state.systems.delete(system.id);syncSystems();render();});
   label.append(box,element('span','',machine(system).title),element('small','',String(system.year)));list.append(label);
  }
  const clear=element('button','multi-select-clear',text('software.systemClear'));clear.type='button';clear.addEventListener('click',()=>{state.systems.clear();syncSystems();render();});list.append(clear);
  const details=$('software-systems');
  document.addEventListener('click',event=>{if(details.open&&!details.contains(event.target))details.open=false;});
  details.addEventListener('keydown',event=>{if(event.key==='Escape'&&details.open){details.open=false;details.querySelector('summary').focus();}});
 }
 function syncTabs(){for(const button of $('software-categories').children){const on=button.dataset.category===state.category;button.classList.toggle('selected',on);button.setAttribute('aria-pressed',String(on));}}

 function navigate(event){
  if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  const card=event.target.closest?.('.software-card');if(!card||event.target!==card)return;
  const move=softwareMoves[event.key];if(!move)return;
  const destination=softwareDestination({rows:navRows,id:card.dataset.id,move});if(!destination)return;
  event.preventDefault();focusCard(destination);
 }

 // The left rail mirrors the hardware timeline: a scrubber and 5-year markers that jump between the year headings.
 function yearHeadings(){return [...document.querySelectorAll('#software-rows .software-year')];}
 function goYear(year){const headings=yearHeadings(),target=headings.find(heading=>Number(heading.dataset.year)>=year)||headings.at(-1);target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
 function updateYear(){
  if($('software-view').hidden)return;
  let selected=null;for(const heading of yearHeadings()){if(heading.getBoundingClientRect().top<220||selected===null)selected=heading.dataset.year;else break;}
  if(selected){$('software-year').textContent=selected;$('software-scrubber').value=selected;}
 }
 function buildRail(){
  const years=data.systems.map(system=>system.year),min=Math.min(...years),max=Math.max(...years),scrubber=$('software-scrubber');
  scrubber.min=min;scrubber.max=max;$('software-year').textContent=String(min);
  for(let year=Math.ceil(min/5)*5;year<=max;year+=5){const button=element('button','year-marker',String(year));button.style.top=((year-min)/(max-min)*100)+'%';button.addEventListener('click',()=>goYear(year));$('software-markers').append(button);}
  scrubber.addEventListener('input',event=>goYear(Number(event.target.value)));
  addEventListener('scroll',updateYear,{passive:true});
 }
 function build(){
  buildRail();
  const tabs=$('software-categories');
  const all=element('button','selected',text('software.allCategories'));all.dataset.category='all';all.setAttribute('aria-pressed','true');tabs.append(all);
  for(const category of data.categories){const button=element('button','',category.label);button.dataset.category=category.id;button.setAttribute('aria-pressed','false');button.style.setProperty('--category',category.color);tabs.append(button);}
  tabs.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;state.category=button.dataset.category;syncTabs();render();});
  for(const stage of vocabulary.stages){const option=element('option','',stage.label);option.value=stage.id;$('software-stage').append(option);}
  $('software-stage').addEventListener('change',event=>{state.stage=event.target.value;render();});
  $('software-search').addEventListener('input',event=>{state.search=event.target.value.toLowerCase().trim();render();});
  buildSystemFilter();
  $('software-reset').addEventListener('click',reset);
  for(const kind of ['dependency','lineage']){const item=element('span');item.dataset.softwareWire=kind;item.append(element('i','software-key-'+kind),document.createTextNode(text('software.wires.'+kind)));$('software-key').append(item);}
  $('software-help').textContent=text('software.wires.help');
  const board=$('software-board');
  board.addEventListener('keydown',navigate);
  board.addEventListener('focusin',event=>{const card=event.target.closest?.('.software-card');if(card){state.selected=card.dataset.id;applyHighlight();}});
  // A card is selected by clicking (or focusing) it and stays selected until focus leaves the board; hovering changes nothing.
  board.addEventListener('click',event=>{const card=event.target.closest?.('.software-card');if(card&&state.selected!==card.dataset.id){state.selected=card.dataset.id;applyHighlight();}});
  board.addEventListener('focusout',event=>{if(!board.contains(event.relatedTarget)){state.selected=null;applyHighlight();}});
  if(typeof ResizeObserver==='function')new ResizeObserver(scheduleDraw).observe(board);
  window.addEventListener('resize',scheduleDraw);
  built=true;
 }
 return {
  show(){if(!built)build();render();},
  redraw:scheduleDraw,
  focusCard
 };
}
