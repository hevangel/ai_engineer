import {cardMoves,cardDestination} from './card-navigation.js';
import {isLocalComponentLink,localComponentPoints} from './component-layout.js';
import {isInlineMakerLink,horizontalMakerPoints} from './maker-layout.js';
import {minimumBoardWidth,preferredColumns} from './timeline-layout.js';
import {groupCompatibleConnections} from './compatible-layout.js';
import {groupExpansionBuses,allocateBusLanes,groupBusRowRuns,busTapPoints} from './bus-layout.js';
const $=id=>document.getElementById(id);let catalog,snapshot,vocabulary,credits,relationships,compatible,ui;let kind='all';let visible=[];let drawFrame=0;
// Interface wording lives in data/ui.json; {name} placeholders take their values from vars.
const text=(path,vars={})=>{const value=path.split('.').reduce((node,key)=>node?.[key],ui);if(typeof value!=='string')throw Error('Missing interface text: '+path);return value.replace(/\{(\w+)\}/g,(_,name)=>vars[name]??'');};
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const link=(text,url)=>{const a=element('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
async function read(url){const r=await fetch(url);if(!r.ok)throw Error(url+' returned HTTP '+r.status);return r.json();}
function legend(){for(const stage of vocabulary.stages){const item=element('div','legend-item');const icon=element('span','stage-symbol');icon.append(iconNode(stage.icon));icon.style.setProperty('--stage',stage.color);const copy=element('div');copy.append(element('strong','',stage.label),element('p','',stage.description));item.append(icon,copy);$('stage-legend').append(item);const option=element('option','',stage.label);option.value=stage.id;$('stage').append(option);}for(const build of vocabulary.builds){const item=element('span','build-legend-item'),icon=element('span','build-legend-icon');icon.style.setProperty('--stage',build.color);icon.append(iconNode(build.icon));item.append(icon,document.createTextNode(build.label));$('build-legend').append(item);}$('coverage-explanation').textContent=vocabulary.coverageLabel+': '+vocabulary.coverageDescription;}
// The info dialog describes the hardware itself; the photo credit sits at the bottom, collapsed.
function chipsetMembers(entry){
 const section=element('section','chipset-members');section.setAttribute('aria-label',text('info.chipsetMembers'));
 const heading=element('h4','',text('info.chipsetHeading',{count:entry.chipset.members.length})),list=element('ul');
 for(const member of entry.chipset.members){const row=element('li');row.append(element('strong','',member.part),element('span','',member.role));list.append(row);}
 section.append(heading,list);return section;
}
function photoCredit(entry){
 const data=credits[entry.id],details=element('details','info-photo'),body=element('div','photo-credit-body');
 details.append(element('summary','',text(entry.image.representative?'info.photoRepresentative':'info.photoHeading')),body);
 const image=element('img');image.src=entry.image.src;image.alt=entry.image.alt;body.append(image);
 if(data){body.append(element('p','',data.title),element('p','',data.creator||text('info.creatorUnknown')),element('p','',data.license+' · '+data.changes),link(text('info.originalPhoto'),data.source));if(data.credit&&data.credit!==data.creator)body.append(element('p','',data.credit));if(data.licenseUrl)body.append(element('p',''),link(text('info.licenseTerms'),data.licenseUrl));}
 if(entry.image.caption)body.append(element('p','',entry.image.caption));
 if(entry.image.representative)body.append(element('p','representative',text('info.representative')));
 return details;
}
function openInfo(entry){
 const company=catalog.companies[entry.company],body=$('info-body');body.replaceChildren();$('info-dialog').style.setProperty('--company',company.color);
 const kind=element('p','info-kind');kind.append(element('span','maker',company.name),element('span','',text('kinds.'+(entry.chipset?'chipset':entry.kind)+'.badge')));
 const title=element('h2','',entry.title);title.id='info-title';
 const date=element('section','info-date'),when=element('p'),stamp=entry.dateSource?link(entry.dateLabel+' ↗',entry.dateSource):element('span','',entry.dateLabel);
 stamp.title=text('info.datePlacement');when.append(stamp);date.append(element('h3','',text('info.dateHeading')),when);
 if(entry.dateNote){date.append(element('h4','',text('info.dateEvidence')),element('p','',entry.dateNote));for(const [index,source]of (entry.historySources||[]).entries()){if(source.url)date.append(link((source.note||text('info.supportingSource',{number:index+1}))+' ↗',source.url));}}
 const issue=element('p','info-issue');issue.append(link(text('info.issue',{number:entry.issue.number}),entry.issue.url));
 body.append(kind,title,element('p','info-summary',entry.summary),date);if(entry.chipset)body.append(chipsetMembers(entry));body.append(issue,photoCredit(entry));
 $('info-dialog').showModal();
}
// Icons are shape lists in the JSON data; build them with DOM calls, never markup strings.
const iconTags=new Set(['path','rect','circle','line','polyline']);
function iconNode(definition){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox',definition.viewBox);svg.setAttribute('class','stage-icon');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
 for(const {tag,...attributes}of definition.shapes){
  if(!iconTags.has(tag))throw Error('Unsupported icon shape: '+tag);
  const shape=document.createElementNS(ns,tag);for(const [name,value]of Object.entries(attributes))shape.setAttribute(name,String(value));svg.append(shape);
 }
 return svg;
}
function badge(symbol,label,className=''){const b=element('span','badge '+className);b.append(typeof symbol==='string'?document.createTextNode(symbol):iconNode(symbol));b.tabIndex=0;b.setAttribute('role','img');b.setAttribute('aria-label',label);b.title=label;return b;}
function card(entry){const status=snapshot.statuses[entry.id];const stage=vocabulary.stages.find(s=>s.id===status?.stage);const company=catalog.companies[entry.company];const article=element('article','hardware');article.id='hardware-'+entry.id;article.tabIndex=-1;article.dataset.id=entry.id;article.dataset.company=entry.company;article.dataset.kind=entry.kind;article.style.setProperty('--company',company.color);const photo=element('div','photo-wrap');const image=element('img');image.loading='lazy';image.decoding='async';image.width=640;image.height=440;image.src=entry.image?.src||'';image.alt=entry.image?.alt||entry.title;photo.append(image);const infoButton=element('button','info-button','i');infoButton.setAttribute('aria-label',text('info.button',{title:entry.title}));infoButton.addEventListener('click',()=>openInfo(entry));photo.append(infoButton);const badges=element('div','status-badges');const percent=status?.coverage?.percent??null;badges.append(badge(percent===null?'—':percent+'%',percent===null?text('card.coverageUnreported'):text('card.coverage',{percent,cleaned:status.coverage.cleaned,total:status.coverage.total}),'coverage-badge'));const build=vocabulary.builds.find(b=>b.id===status?.build?.status)||vocabulary.builds[0];const buildBadge=badge(build.icon,build.label,'build-badge build-'+build.id);buildBadge.style.setProperty('--stage',build.color);badges.append(buildBadge);const stageBadge=badge(stage?.icon||ui.card.statusFallback.icon,stage?.label||text('card.statusFallback.label'));stageBadge.style.setProperty('--stage',stage?.color||ui.card.statusFallback.color);badges.append(stageBadge);photo.append(badges);const meta=element('div','entry-meta');meta.append(element('span','maker',company.name),element('span','',text('kinds.'+(entry.chipset?'chipset':entry.kind)+'.badge')));const title=element('h3');title.append(link(entry.title,entry.issue.url));const footer=element('div','entry-footer');footer.append(link('#'+entry.issue.number+' ↗',entry.issue.url));article.append(photo,meta,title,element('p','summary',entry.summary),footer);if(entry.kind==='system'){const count=relationships.links.filter(link=>link.target===entry.id).length;const tracing=$('computer').value===entry.id;const trace=element('button','trace-computer'+(tracing?' active':''),text('trace.button',{count}));trace.setAttribute('aria-pressed',String(tracing));trace.setAttribute('aria-label',text('trace.label',{title:entry.title}));trace.addEventListener('click',()=>focusComputer(tracing?'all':entry.id,entry.id));article.append(trace);}return article;}
function render(){
 const search=$('search').value.toLowerCase().trim(),company=$('company').value,stage=$('stage').value;
 const computer=$('computer').value;
 const connected=computer==='all'?null:new Set([computer,...relationships.links.filter(link=>link.target===computer).map(link=>link.source)]);
 visible=catalog.entries.filter(entry=>(!connected||connected.has(entry.id))&&(kind==='all'||kind===entry.kind)&&(company==='all'||company===entry.company)&&(stage==='all'||snapshot.statuses[entry.id]?.stage===stage)&&(!search||(entry.title+' '+entry.summary+' '+catalog.companies[entry.company].name+' '+entry.id+' '+(entry.chipset?.members||[]).map(member=>member.part+' '+member.role).join(' ')).toLowerCase().includes(search)));
 $('result-count').textContent=text('results.count',{shown:visible.length,total:catalog.entries.length});
 $('eras').replaceChildren();$('empty').hidden=visible.length>0;
 document.querySelectorAll('.maker-button').forEach(button=>button.classList.toggle('active',button.dataset.company===company));
 for(const era of catalog.eras){
  const entries=visible.filter(entry=>entry.era===era.id);if(!entries.length)continue;
  const section=element('section','era');section.dataset.era=era.id;
  const header=element('div','era-header'),heading=element('div');
  heading.append(element('span','era-label',era.range),element('h2','',era.title));
  const number=element('span','era-number',era.id==='undated'?text('era.undatedMark'):era.id);number.setAttribute('aria-hidden','true');
  number.append(element('small','',text(era.id==='undated'?'era.undatedSmall':'era.small')));header.append(heading,number);section.append(header);
  for(const year of [...new Set(entries.map(entry=>entry.year))].sort((a,b)=>(a??Infinity)-(b??Infinity))){
   const group=element('div','year-block');group.dataset.year=year??'undated';
   const yearHeading=element('div','year-heading');yearHeading.append(element('span','',year??text('era.undatedYear')),element('i'));group.append(yearHeading);
   // A computer always starts after that year's chip and expansion-card rows.
   for(const type of ['chip','card','system']){
    const members=entries.filter(entry=>entry.year===year&&entry.kind===type);if(!members.length)continue;
    const category=element('div','hardware-kind-group');category.dataset.kindGroup=type;
    category.append(element('div','kind-heading',text('kinds.'+type+'.heading')));
    const grid=element('div','year-grid');for(const entry of members)grid.append(card(entry));
    category.append(grid);group.append(category);
   }
   section.append(group);
  }
  $('eras').append(section);
 }
 scheduleDraw();updateYear();
}

function scheduleDraw(){cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(drawConnections);}
// The trace button toggles: choosing the traced computer again returns to the overview, keeping that card in view.
function focusComputer(id,anchor=id){
 $('computer').value=id;
 // Start a focused trace with computer links only; returning restores the maker overview.
 $('show-makers').checked=id==='all';$('show-systems').checked=id!=='all';
 $('company').value='all';$('stage').value='all';$('search').value='';
 document.querySelector('[data-kind="all"]').click();
 if(anchor!=='all')requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelector('.hardware[data-id="'+anchor+'"]')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:id==='all'?'center':'start'})));
}
// With a card selected, hjkl and the arrow keys walk its family line and its chip/computer links.
let cardCursor=null;
function navigateCard(event){
 const move=cardMoves[event.key],node=event.target.closest?.('.hardware');
 if(!move||!node||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
 const order=[...document.querySelectorAll('.hardware')].map(card=>card.dataset.id);
 const destination=cardDestination({id:node.dataset.id,move,order,entries:new Map(catalog.entries.map(entry=>[entry.id,entry])),links:relationships.links,cursor:cardCursor});
 if(!destination)return;
 event.preventDefault();cardCursor=destination.origin?{to:destination.id,origin:destination.origin}:null;jumpToHardware(destination.id);
}
function jumpToHardware(id){
 const node=document.getElementById('hardware-'+id);if(!node)return;
 const hash='#'+node.id;if(location.hash!==hash)history.pushState(null,'',hash);
 node.focus({preventScroll:true});
 node.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start',inline:'nearest'});
}
// Split a polyline by distance so each half follows the wire to its opposite end.
function splitRoute(points){
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
 let remaining=lengths.reduce((a,b)=>a+b,0)/2;
 for(let i=0;i<lengths.length;i++){
  if(remaining<=lengths[i]&&lengths[i]>0){
   const ratio=remaining/lengths[i],a=points[i],b=points[i+1],middle=[a[0]+(b[0]-a[0])*ratio,a[1]+(b[1]-a[1])*ratio];
   return [[...points.slice(0,i+1),middle],[middle,...points.slice(i+1)]];
  }
  remaining-=lengths[i];
 }
 return [points,points];
}
function openBus(bus,endpoint=null){
 if(bus.kind!=='compatible')return openExpansionBus(bus,endpoint);
 const dialog=$('bus-dialog'),entries=new Map(catalog.entries.map(entry=>[entry.id,entry]));
 const isCPU=bus.kind==='compatible';
 $('bus-title').textContent=text('bus.choicesTitle',{label:bus.label,title:entries.get(bus.system).title});
 $('bus-dialog').querySelector('p').textContent=isCPU?bus.spec.note+' '+bus.spec.qualification:text('bus.chooseWhere');
 const references=$('connection-evidence');references.replaceChildren();
 if(isCPU)for(const evidence of bus.spec.evidence)references.append(link(evidence.note+' ↗',evidence.url));
 const list=$('bus-members');list.replaceChildren();
 for(const [id,qualification]of [[bus.system,text('bus.computer')],...bus.links.map(link=>[link.source,isCPU?(link.source===bus.primary?text('bus.originalCpu'):text('bus.alternative')):link.type==='optional'?text('bus.planned'):text('bus.required')])]){
  const item=element('li'),anchor=element('a','',entries.get(id).title);anchor.href='#hardware-'+id;
  anchor.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();dialog.close();jumpToHardware(id);});
  item.append(anchor,element('small','',qualification));list.append(item);
 }
 dialog.showModal();
}
function openExpansionBus(bus,endpoint){
 const entries=new Map(catalog.entries.map(entry=>[entry.id,entry]));
 $('bus-title').textContent=endpoint?text('bus.endpointTitle',{label:bus.label,title:entries.get(endpoint).title}):text('bus.title',{label:bus.label});
 $('bus-dialog').querySelector('p').textContent=text('bus.chooseRecorded');
 $('connection-evidence').replaceChildren();const list=$('bus-members');list.replaceChildren();
 const destination=id=>{const anchor=element('a','',entries.get(id).title);anchor.href='#hardware-'+id;anchor.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();$('bus-dialog').close();jumpToHardware(id);});return anchor;};
 for(const connection of bus.links.filter(link=>!endpoint||link.source===endpoint||link.target===endpoint)){
  const item=element('li');
  if(!endpoint)item.append(destination(connection.source),element('span','bus-direction','→'),destination(connection.target));
  else item.append(destination(connection.source===endpoint?connection.target:connection.source));
  item.append(element('small','',connection.type==='optional'?text('bus.planned'):text('bus.required')));
  const evidence=element('details','bus-evidence');evidence.append(element('summary','',text('bus.evidenceSummary')),element('p','',connection.note),link(text('bus.evidenceLink'),connection.evidence));item.append(evidence);list.append(item);
 }
 $('bus-dialog').showModal();
}
function drawConnections(){
 const timeline=$('timeline'),grid=document.querySelector('.year-grid'),era=document.querySelector('.era');
 const availableWidth=timeline.parentElement.clientWidth;
 const style=getComputedStyle(timeline),gridStyle=grid&&getComputedStyle(grid),eraStyle=era&&getComputedStyle(era);
 const metrics={cardMin:parseFloat(style.getPropertyValue('--card-min-width'))||200,gap:parseFloat(gridStyle?.columnGap)||0,padding:(parseFloat(eraStyle?.paddingLeft)||0)+(parseFloat(eraStyle?.paddingRight)||0)};
 const columns=grid?preferredColumns(availableWidth,metrics):1;
 const layout={availableWidth,metrics,hasCards:Boolean(grid)};
 setTimelineColumns(layout,columns);drawConnectionPass(layout,columns);
}
function setTimelineColumns(layout,columns){
 $('timeline').style.setProperty('--card-columns',columns);
 $('timeline').style.setProperty('--board-width',(layout.hasCards?minimumBoardWidth(columns,layout.metrics):0)+'px');
}
function drawConnectionPass(layout,columns){
 const timeline=$('timeline'),svg=$('connections');
 const nodes=new Map([...document.querySelectorAll('.hardware')].map(node=>[node.dataset.id,node]));
 const entryById=new Map(catalog.entries.map(entry=>[entry.id,entry]));
 const ranks=new Map([...nodes.keys()].map((id,index)=>[id,index]));
 const allComputers=$('computer').value==='all';
 $('system-links-label').textContent=text(allComputers?'wires.allLinks':'wires.links');
 const context=allComputers?($('show-systems').checked?text('wires.contextAll'):''):text('wires.contextFocused');
 $('wire-context').textContent=context;$('wire-context').hidden=!context;
 const edges=[];
 if($('show-makers').checked){
  for(const [company,brand]of Object.entries(catalog.companies)){
   const members=[...nodes.values()].filter(node=>node.dataset.kind==='chip'&&node.dataset.company===company);
   for(let i=1;i<members.length;i++)edges.push({source:members[i-1].dataset.id,target:members[i].dataset.id,type:'maker',side:'right',color:brand.color});
  }
 }
 const computerLinks=$('show-systems').checked?relationships.links:[];
 const sockets=groupCompatibleConnections(computerLinks,new Set(nodes.keys()),compatible);
 for(const net of sockets){net.sourceTaps=net.links.map(link=>({...link,side:'left',net,endpoint:'source'}));net.targetTap={source:net.links[0].source,target:net.system,side:'left',net,endpoint:'target'};}
 for(const link of computerLinks)if(nodes.has(link.source)&&nodes.has(link.target)&&entryById.get(link.source).kind!=='card'&&!link.compatibilityGroup)edges.push({...link,side:'left',color:catalog.companies[entryById.get(link.source).company].color});
 const buses=groupExpansionBuses(computerLinks,entryById,new Set(nodes.keys()),catalog.buses);
 const branches=buses.flatMap(bus=>[...bus.cards.map(id=>{const links=bus.links.filter(link=>link.source===id);return {bus,id,role:'card',type:links.some(link=>link.type==='required')?'required':'optional',links};}),...bus.systems.map(id=>({bus,id,role:'system',type:'system',links:bus.links.filter(link=>link.target===id)}))]);
 const tapsById=new Map([...nodes.keys()].map(id=>[id,branches.filter(branch=>branch.id===id).sort((a,b)=>a.bus.id.localeCompare(b.bus.id))]));
 for(const taps of tapsById.values())taps.forEach((branch,index)=>{branch.port=index;branch.portCount=taps.length;});
 const makerCells=new Map();
 for(const grid of document.querySelectorAll('.year-grid')){
  const count=getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  [...grid.children].forEach((node,index)=>makerCells.set(node.dataset.id,{grid,row:Math.floor(index/count),column:index%count}));
 }
 for(const edge of edges)edge.inline=isInlineMakerLink(edge,makerCells);
 const incoming=new Map(),outgoing=new Map();
 for(const id of nodes.keys()){incoming.set(id,[]);outgoing.set(id,[]);}
 for(const edge of edges)if(!edge.inline){outgoing.get(edge.source).push(edge);incoming.get(edge.target).push(edge);}
 for(const net of sockets){for(const tap of net.sourceTaps)outgoing.get(tap.source).push(tap);incoming.get(net.system).push(net.targetTap);}
 for(const id of nodes.keys()){
  for(const [direction,map]of [['in',incoming],['out',outgoing]]){
   const ports=map.get(id).filter(edge=>edge.side==='left').sort((a,b)=>ranks.get(direction==='in'?a.source:a.target)-ranks.get(direction==='in'?b.source:b.target));
   ports.forEach((edge,index)=>{edge[direction+'Port']=index;edge[direction+'PortCount']=ports.length;});
  }
 }
 const pitch=8,safe=14,rows=[],rowById=new Map();
 const assignTracks=(row,direction,map)=>{
  const rowEdges=row.flatMap(node=>map.get(node.dataset.id)),endpoint=direction==='in'?'target':'source';
  rowEdges.sort((a,b)=>a.side.localeCompare(b.side)||(a.side==='left'?1:-1)*(ranks.get(a[endpoint])-ranks.get(b[endpoint]))||(a[direction+'Port']??0)-(b[direction+'Port']??0));
  rowEdges.forEach((edge,index)=>{edge[direction+'Track']=index;});
  return rowEdges.length?safe+rowEdges.length*pitch:0;
 };
 for(const grid of document.querySelectorAll('.year-grid')){
  const columns=getComputedStyle(grid).gridTemplateColumns.split(' ').length,cards=[...grid.children];
  for(let i=0;i<cards.length;i+=columns){
   const row={cards:cards.slice(i,i+columns)},index=rows.length;rows.push(row);
   const top=assignTracks(row.cards,'in',incoming);row.outSpace=assignTracks(row.cards,'out',outgoing);row.inSpace=top;
   for(const [column,node]of row.cards.entries()){
    rowById.set(node.dataset.id,index);
    for(const branch of tapsById.get(node.dataset.id)){branch.row=row;branch.column=column;branch.below=column<row.cards.length-1;}
   }
   row.busRuns=groupBusRowRuns(branches.filter(branch=>branch.row===row));
   const topRuns=row.busRuns.filter(run=>run.role==='system'),bottomRuns=row.busRuns.filter(run=>run.role==='card');
   const upper=top+(topRuns.length?safe+topRuns.length*pitch:0),bottom=row.outSpace+(bottomRuns.length?safe+bottomRuns.length*pitch:0);
   for(const node of row.cards){node.style.marginTop=upper+'px';node.style.marginBottom=bottom+'px';}

  }
 }
 for(const edge of edges)edge.local=isLocalComponentLink(edge,rowById,entryById);
 for(const list of incoming.values())list.filter(edge=>edge.local).forEach((edge,index)=>{edge.localInPort=index;});
 buses.forEach((bus,lane)=>{bus.lane=lane;});
 const busLanes=buses.length,socketLanes=allocateBusLanes(sockets,rowById);
 const allocateLanes=side=>{
  const laneEnds=[];
  const sorted=edges.filter(edge=>edge.side===side&&!edge.inline&&!edge.local).map(edge=>{
   const from=nodes.get(edge.source).getBoundingClientRect(),to=nodes.get(edge.target).getBoundingClientRect();
   const outY=from.bottom+safe+(edge.outTrack+1)*pitch,inY=to.top-safe-(edge.inTrack+1)*pitch;
   return {edge,start:Math.min(outY,inY)-8,end:Math.max(outY,inY)+8};
  }).sort((a,b)=>a.start-b.start||b.end-a.end);
  for(const {edge,start,end}of sorted){let lane=laneEnds.findIndex(last=>last+12<start);if(lane<0)lane=laneEnds.length;laneEnds[lane]=end;edge.lane=lane;}
  return laneEnds.length;
 };
 const leftLanes=allocateLanes('left'),rightLanes=allocateLanes('right');
 const leftPitch=4,rightPitch=7,busPitch=30,socketGutter=socketLanes?24+socketLanes*28:0,leftGutter=socketGutter+(leftLanes?24+leftLanes*leftPitch:0),makerGutter=rightLanes?24+rightLanes*rightPitch:0,busGutter=busLanes?28+busLanes*busPitch:0;
 const rightGutter=makerGutter+busGutter;
 timeline.style.setProperty('--left-gutter',leftGutter+'px');timeline.style.setProperty('--right-gutter',rightGutter+'px');
 // Reduce columns only within this pass: lane counts depend on row grouping.
 // At most three passes; do not alternate column counts across resize frames.
 if(columns>1&&minimumBoardWidth(columns,layout.metrics)+leftGutter+rightGutter>layout.availableWidth+0.5){
  setTimelineColumns(layout,columns-1);drawConnectionPass(layout,columns-1);return;
 }

 const bounds=timeline.getBoundingClientRect(),ns='http://www.w3.org/2000/svg';
 const shape=(tag,attributes)=>{const node=document.createElementNS(ns,tag);for(const [name,value]of Object.entries(attributes))node.setAttribute(name,String(value));return node;};
 const coordinate=value=>Math.round(value*2)/2;
 const pathData=points=>points.map(([x,y],index)=>(index?'L':'M')+' '+coordinate(x)+' '+coordinate(y)).join(' ');
 const port=(edge,direction)=>{
  const rect=nodes.get(direction==='in'?edge.target:edge.source).getBoundingClientRect();
  const spacing=Math.min(12,(rect.width-58)/Math.max(1,(edge[direction+'PortCount']??1)-1));
  return {x:edge.side==='right'?rect.right-bounds.left-18:rect.left-bounds.left+18+(edge[direction+'Port']??0)*spacing,y:(direction==='in'?rect.top:rect.bottom)-bounds.top};
 };
 const paths=document.createDocumentFragment(),pads=document.createDocumentFragment();
 const makeJump=(destination,origin,ordered,tabbable=true,suffix='',axis='system')=>{
  const entry=entryById.get(destination),direction=ranks.get(destination)<ranks.get(origin)?'previous':'next';
  const label=text('wires.jump',{direction:text('wires.'+direction),noun:text('kinds.'+entry.kind+'.noun'),title:entry.title})+suffix;
  const anchor=shape('a',{href:'#hardware-'+destination,class:'trace-jump','data-destination':destination,'aria-label':label,tabindex:tabbable?0:-1});
  const hint=shape('title',{});hint.textContent=text('wires.hint',{label,keys:text(axis==='family'?'keys.family':'keys.system')});anchor.append(hint);
  anchor.addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();jumpToHardware(destination);});
  // A wire's two ends in displayed order: the first key set goes to the earlier end, the second to the later.
  const ends=axis==='family'?{ArrowLeft:0,h:0,ArrowRight:1,l:1}:{ArrowUp:0,k:0,ArrowDown:1,j:1};
  anchor.addEventListener('keydown',event=>{const end=ends[event.key];if(end===undefined||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;event.preventDefault();jumpToHardware(ordered[end?ordered.length-1:0]);});
  return anchor;
 };
 for(const edge of edges){
  let from,to,points;
  if(edge.inline){
   const source=nodes.get(edge.source),target=nodes.get(edge.target),left=source.getBoundingClientRect(),right=target.getBoundingClientRect();
   const photoHeight=Math.min(source.querySelector('.photo-wrap').getBoundingClientRect().height,target.querySelector('.photo-wrap').getBoundingClientRect().height);
   const y=Math.max(left.top,right.top)-bounds.top+photoHeight/2;
   points=horizontalMakerPoints(left.right-bounds.left,right.left-bounds.left,y);
   from={x:points[0][0],y};to={x:points[1][0],y};
  }else if(edge.local){
   from=port(edge,'out');to=port(edge,'in');
   const target=nodes.get(edge.target).getBoundingClientRect();
   // Arrive beyond the left-aligned row heading, after any far-right bus pads.
   to.x=target.right-bounds.left-18-12*(tapsById.get(edge.target).length+edge.localInPort);
   points=localComponentPoints(from,to,from.y+safe+(edge.outTrack+1)*pitch);
  }else{
   const origin=port(edge,'out'),destination=port(edge,'in'),sign=edge.side==='left'?-1:1;
   const lane=edge.side==='left'?leftGutter-12-edge.lane*leftPitch:bounds.width-rightGutter+12+edge.lane*rightPitch;
   const outY=origin.y+safe+(edge.outTrack+1)*pitch,inY=destination.y-safe-(edge.inTrack+1)*pitch;
   const vertical=Math.sign(inY-outY)||1,bend=Math.min(6,Math.abs(inY-outY)/2);
   points=[[origin.x,origin.y],[origin.x,outY-6],[origin.x+sign*6,outY],[lane-sign*bend,outY],[lane,outY+vertical*bend],[lane,inY-vertical*bend],[lane-sign*bend,inY],[destination.x+sign*6,inY],[destination.x,inY+6],[destination.x,destination.y]];
   from=origin;to=destination;
  }
  const d=pathData(points),group=shape('g',{class:'connection connection-'+edge.type+(edge.basis==='reconstruction'?' connection-reconstruction':''),'data-source':edge.source,'data-target':edge.target,'data-type':edge.type,'data-side':edge.inline?'between-cards':edge.local?'between-rows':edge.side,'data-route':edge.inline?'inline':edge.local?'local':'gutter',...(edge.inline||edge.local?{}:{'data-lane':edge.lane})});
  const title=shape('title',{});title.textContent=entryById.get(edge.source).title+' → '+entryById.get(edge.target).title+' · '+text('wires.relation.'+(edge.type==='maker'?'maker':edge.basis==='reconstruction'?'reconstruction':edge.type==='optional'?'optional':'required'),{note:edge.note});
  const ordered=[edge.source,edge.target].sort((a,b)=>ranks.get(a)-ranks.get(b));
  group.append(title,shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire',stroke:edge.color,'aria-hidden':true}));
  const halves=splitRoute(points);
  for(const [route,destination,origin]of [[halves[0],edge.target,edge.source],[halves[1],edge.source,edge.target]]){
   const anchor=makeJump(destination,origin,ordered,true,'',edge.type==='maker'?'family':'system');
   const horizontal=route.every(point=>point[1]===route[0][1]),vertical=route.every(point=>point[0]===route[0][0]);
   const x=Math.min(...route.map(point=>point[0])),y=Math.min(...route.map(point=>point[1]));
   anchor.append(horizontal||vertical?shape('rect',{x:coordinate(x-(vertical?5:0)),y:coordinate(y-(horizontal?5:0)),width:Math.max(10,coordinate(Math.abs(route.at(-1)[0]-route[0][0]))),height:Math.max(10,coordinate(Math.abs(route.at(-1)[1]-route[0][1]))),class:'bus-direct-hit'}):shape('path',{d:pathData(route),class:'trace-hit','stroke-width':edge.side==='left'?4:6}));group.append(anchor);
  }
  paths.append(group);
  for(const [direction,p,destination,origin]of [['out',from,edge.target,edge.source],['in',to,edge.source,edge.target]]){
   const anchor=makeJump(destination,origin,ordered,false,'',edge.type==='maker'?'family':'system');anchor.append(shape('circle',{cx:coordinate(p.x),cy:coordinate(p.y),r:4.5,class:'trace-pad '+edge.type+'-pad','data-entry':origin,'data-direction':direction,stroke:edge.color}));pads.append(anchor);
  }
 }
 const busPaths=document.createDocumentFragment(),busPads=document.createDocumentFragment();
 const busControl=(bus,label,endpoint=null)=>{
  const control=shape('a',{href:'#bus-'+bus.id,class:'bus-control',role:'button',tabindex:0,'aria-label':label});
  const title=shape('title',{});title.textContent=label;control.append(title);
  control.addEventListener('click',event=>{event.preventDefault();openBus(bus,endpoint);});control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openBus(bus,endpoint);}});
  return control;
 };
 const socketPaths=document.createDocumentFragment(),socketPads=document.createDocumentFragment();
 for(const net of sockets){
  const lane=12+net.lane*28,joins=[],group=shape('g',{class:'compatible-net','data-group':net.spec.id,'data-system':net.system,'data-lane':net.lane,'data-side':'left'});
  for(const tap of [...net.sourceTaps,net.targetTap]){
   const source=tap.endpoint==='source',p=port(tap,source?'out':'in'),id=source?tap.source:net.system;
   const row=rows[rowById.get(id)],rowBottom=Math.max(...row.cards.map(card=>card.getBoundingClientRect().bottom))-bounds.top;
   const y=source?rowBottom+safe+(tap.outTrack+1)*pitch:p.y-safe-(tap.inTrack+1)*pitch;
   const points=source?[[p.x,p.y],[p.x,y-6],[p.x-6,y],[lane,y]]:[[lane,y],[p.x-6,y],[p.x,y+6],[p.x,p.y]],d=pathData(points);
   const branch=shape('g',{class:'compatible-branch','data-entry':id,'data-role':source?'chip':'computer'}),color=source?catalog.companies[entryById.get(id).company].color:net.color;
   branch.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire',stroke:color,'aria-hidden':true}));
   const ordered=[id,net.system].sort((a,b)=>ranks.get(a)-ranks.get(b)),control=source?makeJump(net.system,id,ordered,true,text('wires.via',{label:net.label})):busControl(net,text('wires.chooseCpu',{title:entryById.get(net.system).title}));
   control.append(shape('path',{d,class:'trace-hit','stroke-width':5}));branch.append(control);group.append(branch);
   const pad=source?makeJump(net.system,id,ordered,false,text('wires.via',{label:net.label})):busControl(net,text('wires.chooseCpu',{title:entryById.get(net.system).title}));pad.setAttribute('tabindex','-1');
   pad.append(shape('circle',{cx:coordinate(p.x),cy:coordinate(p.y),r:4.5,class:'trace-pad bus-pad','data-entry':id,stroke:color}));socketPads.append(pad);
   socketPads.append(shape('circle',{cx:coordinate(lane),cy:coordinate(y),r:3,class:'bus-junction',fill:net.color,'aria-hidden':true}));joins.push(y);
  }
  const min=Math.min(...joins),max=Math.max(...joins),d=pathData([[lane,min-8],[lane,max+8]]),rail=busControl(net,text('wires.alternatives',{label:net.label,title:entryById.get(net.system).title}));
  rail.setAttribute('class','bus-control compatible-rail');
  rail.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire compatible-trunk',stroke:net.color,'aria-hidden':true}),shape('rect',{x:coordinate(lane-5),y:coordinate(min-8),width:10,height:coordinate(max-min+16),class:'bus-rail-hit'}));group.append(rail);
  const label=shape('text',{x:coordinate(lane),y:coordinate(min-14),class:'bus-label','text-anchor':'middle',fill:net.color,'aria-hidden':true});label.textContent=net.spec.wireLabel;group.append(label);socketPaths.append(group);
 }
 for(const bus of buses){
  const lane=bounds.width-busGutter+12+bus.lane*busPitch,joins=[],group=shape('g',{class:'expansion-bus','data-bus':bus.id,'data-family':bus.family,'data-side':'far-right','data-lane':bus.lane});
  for(const [rowIndex,row]of rows.entries())for(const run of row.busRuns.filter(run=>run.bus===bus)){
   const rects=row.cards.map(card=>card.getBoundingClientRect()),cardRun=run.role==='card';
   const barY=cardRun?Math.max(...rects.map(rect=>rect.bottom))-bounds.top+row.outSpace+safe+(run.track+1)*pitch:Math.min(...rects.map(rect=>rect.top))-bounds.top-row.inSpace-safe-(run.track+1)*pitch;
   const junctions=[];
   for(const branch of run.branches){
    const rect=nodes.get(branch.id).getBoundingClientRect(),tap={x:rect.right-bounds.left-18-branch.port*12,y:(cardRun?rect.bottom:rect.top)-bounds.top};
    const points=busTapPoints(tap,barY,run.role),junction=cardRun?points.at(-1):points[0],d=pathData(points);junctions.push(junction[0]);
    const branchGroup=shape('g',{class:'bus-branch connection-'+branch.type,'data-entry':branch.id,'data-row':rowIndex,'data-role':run.role,'data-direction':cardRun?'out':'in'});
    const single=branch.links.length===1,target=cardRun?branch.links[0].target:branch.links[0].source;
    const label=text('wires.connectionsFor',{label:bus.label,title:entryById.get(branch.id).title});
    const control=single?makeJump(target,branch.id,[branch.id,target].sort((a,b)=>ranks.get(a)-ranks.get(b)),true,text('wires.viaBus',{label:bus.label})):busControl(bus,label,branch.id);
    branchGroup.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire bus-tap',stroke:bus.color,'aria-hidden':true}));
    control.append(shape('path',{d,class:'trace-hit','stroke-width':6}));branchGroup.append(control);group.append(branchGroup);
    const pad=single?makeJump(target,branch.id,[branch.id,target].sort((a,b)=>ranks.get(a)-ranks.get(b)),false,text('wires.viaBus',{label:bus.label})):busControl(bus,label,branch.id);pad.setAttribute('tabindex','-1');
    pad.append(shape('circle',{cx:coordinate(tap.x),cy:coordinate(tap.y),r:4.5,class:'trace-pad bus-pad','data-entry':branch.id,'data-direction':cardRun?'out':'in',stroke:bus.color}));busPads.append(pad);
    busPads.append(shape('circle',{cx:coordinate(junction[0]),cy:coordinate(barY),r:3,class:'bus-junction',fill:bus.color,'aria-hidden':true}));
   }
   const start=Math.min(...junctions),d=pathData([[start,barY],[lane,barY]]),bar=shape('g',{class:'bus-row-run','data-family':bus.family,'data-row':rowIndex,'data-role':run.role});
   const control=busControl(bus,text('wires.busRun',{label:bus.label}));
   bar.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire bus-row-wire',stroke:bus.color,'aria-hidden':true}));
   control.append(shape('rect',{x:coordinate(start),y:coordinate(barY-4),width:coordinate(lane-start),height:8,class:'bus-direct-hit'}));bar.append(control);group.append(bar);
   busPads.append(shape('circle',{cx:coordinate(lane),cy:coordinate(barY),r:3,class:'bus-junction',fill:bus.color,'aria-hidden':true}));joins.push(barY);
  }
  const min=Math.min(...joins),max=Math.max(...joins),d=pathData([[lane,min-8],[lane,max+8]]),rail=busControl(bus,text('wires.busRail',{label:bus.label}));
  rail.setAttribute('class','bus-control bus-rail');rail.id='bus-'+bus.id;rail.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire bus-trunk',stroke:bus.color,'aria-hidden':true}),shape('rect',{x:coordinate(lane-5),y:coordinate(min-8),width:10,height:coordinate(max-min+16),class:'bus-rail-hit'}));group.append(rail);
  const label=shape('text',{x:coordinate(lane),y:coordinate(min-14),class:'bus-label','text-anchor':'middle',fill:bus.color,'aria-hidden':true});label.textContent=bus.label;group.append(label);busPaths.append(group);
 }
 $('wire-help').hidden=!edges.length&&!buses.length&&!sockets.length;
 svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);svg.style.height=bounds.height+'px';svg.replaceChildren(paths,socketPaths,busPaths,pads,socketPads,busPads);
 const counts={maker:edges.filter(edge=>edge.type==='maker').length,required:edges.filter(edge=>edge.type==='required'&&edge.basis!=='reconstruction').length,optionalChip:edges.filter(edge=>edge.type==='optional').length,reconstruction:edges.filter(edge=>edge.basis==='reconstruction').length,bus:buses.length,compatible:sockets.length,optionalCard:buses.reduce((n,bus)=>n+bus.links.filter(link=>link.type==='optional').length,0)};
 const cards=buses.reduce((n,bus)=>n+bus.links.length,0),parts=['maker','required','optionalChip','reconstruction','bus','compatible'].filter(layer=>counts[layer]).map(layer=>text('wires.count.'+layer,{count:counts[layer],cards}));
 $('trace-summary').textContent=parts.join(' · ')||text('wires.none');
 for(const item of document.querySelectorAll('[data-wire-layer]'))item.hidden=!counts[item.dataset.wireLayer];
 $('wire-help').textContent=[computerLinks.length?text('wires.helpComputers'):'',text('wires.helpCards')].filter(Boolean).join(' ');

}

function updateYear(){let selected=null;for(const group of document.querySelectorAll('.year-block[data-year]')){if(group.getBoundingClientRect().top<220)selected=group.dataset.year;else if(selected===null)selected=group.dataset.year;else break;}if(selected&&selected!=='undated'){$('current-year').textContent=selected;$('year-scrubber').value=selected;}else if(selected==='undated')$('current-year').textContent='—';}
function goYear(year){const groups=[...document.querySelectorAll('.year-block')].filter(g=>g.dataset.year!=='undated');let group=groups.find(g=>Number(g.dataset.year)>=year)||groups.at(-1);group?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
// The filter tabs, wire legend and legend footnote are data, so they are built from data/ui.json.
function hydrate(){
 for(const id of ui.viewTabs){const button=element('button',id==='all'?'selected':'',text('kinds.'+id+'.tab'));button.dataset.kind=id;button.setAttribute('aria-pressed',String(id==='all'));document.querySelector('.view-tabs').append(button);}
 for(const layer of ui.wireLayers){const item=element('span');item.dataset.wireLayer=layer.id;item.append(element('i',layer.swatch),document.createTextNode(layer.label));$('connection-key').append(item);}
 $('legend-fineprint').textContent=text('legend.fineprint');$('info-close').setAttribute('aria-label',text('info.close'));
}
function setup(){hydrate();for(const entry of catalog.entries.filter(e=>e.kind==='system')){const option=element('option','',entry.title);option.value=entry.id;$('computer').append(option);}$('computer').addEventListener('change',event=>focusComputer(event.target.value));for(const id of ['show-makers','show-systems'])$(id).addEventListener('change',scheduleDraw);for(const [id,company]of Object.entries(catalog.companies)){if(!catalog.entries.some(e=>e.company===id))continue;const option=element('option','',company.name);option.value=id;$('company').append(option);const button=element('button','maker-button');button.dataset.company=id;button.style.setProperty('--company',company.color);button.append(element('i'),document.createTextNode(company.name));button.addEventListener('click',()=>{$('company').value=$('company').value===id?'all':id;render();});$('maker-key').append(button);}const years=catalog.entries.map(e=>e.year).filter(Number.isFinite),min=Math.min(...years),max=Math.max(...years);$('year-scrubber').min=min;$('year-scrubber').max=max;for(let year=Math.ceil(min/5)*5;year<=max;year+=5){const button=element('button','year-marker',String(year));button.style.top=((year-min)/(max-min)*100)+'%';button.addEventListener('click',()=>goYear(year));$('year-markers').append(button);}$('year-scrubber').addEventListener('input',e=>goYear(Number(e.target.value)));for(const button of document.querySelectorAll('[data-kind]')){if(button.tagName!=='BUTTON')continue;button.addEventListener('click',()=>{kind=button.dataset.kind;document.querySelectorAll('.view-tabs button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});render();});}for(const id of ['company','stage'])$(id).addEventListener('change',render);$('search').addEventListener('input',render);$('reset').addEventListener('click',()=>{$('company').value='all';$('stage').value='all';$('search').value='';$('computer').value='all';$('show-makers').checked=true;$('show-systems').checked=false;kind='all';document.querySelector('[data-kind="all"]').click();});$('entry-count').textContent=catalog.entries.length;$('company-count').textContent=new Set(catalog.entries.map(e=>e.company)).size;const stamp=new Date(snapshot.syncedAt);$('sync-label').textContent=text('load.snapshot',{when:Number.isNaN(stamp.valueOf())?text('load.notSynced'):stamp.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})});const toggle=open=>{$('legend').hidden=!open;$('legend-toggle').setAttribute('aria-expanded',String(open));};$('legend-toggle').addEventListener('click',()=>toggle($('legend').hidden));$('legend-close').addEventListener('click',()=>{toggle(false);$('legend-toggle').focus();});$('bus-close').addEventListener('click',()=>$('bus-dialog').close());$('bus-dialog').addEventListener('click',event=>{if(event.target===$('bus-dialog'))$('bus-dialog').close();});$('info-close').addEventListener('click',()=>$('info-dialog').close());$('info-dialog').addEventListener('click',e=>{if(e.target===$('info-dialog'))$('info-dialog').close();});addEventListener('scroll',updateYear,{passive:true});addEventListener('resize',scheduleDraw);document.addEventListener('keydown',navigateCard);new ResizeObserver(scheduleDraw).observe($('eras'));}
try{[catalog,snapshot,vocabulary,credits,relationships,compatible,ui]=await Promise.all([read('data/catalog.json'),read('data/status.json'),read('data/stages.json'),read('images/credits.json'),read('data/connections.json'),read('data/compatible-chips.json'),read('data/ui.json')]);legend();setup();render();}catch(error){$('error').hidden=false;$('error').textContent='The archive could not be loaded. Serve this folder over HTTP and check the JSON files. '+error.message;$('eras').replaceChildren();$('sync-label').textContent='Archive unavailable';console.error(error);}
