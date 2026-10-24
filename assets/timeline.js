import {groupCompatibleConnections} from './compatible-layout.js';
import {groupExpansionBuses,allocateBusLanes,busBranchPoints} from './bus-layout.js';
const $=id=>document.getElementById(id);let catalog,snapshot,vocabulary,credits,relationships,compatible;let kind='all';let visible=[];let drawFrame=0;
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const link=(text,url)=>{const a=element('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
async function read(url){const r=await fetch(url);if(!r.ok)throw Error(url+' returned HTTP '+r.status);return r.json();}
function legend(){for(const stage of vocabulary.stages){const item=element('div','legend-item');const icon=element('span','stage-symbol',stage.icon);icon.style.setProperty('--stage',stage.color);const copy=element('div');copy.append(element('strong','',stage.label),element('p','',stage.description));item.append(icon,copy);$('stage-legend').append(item);const option=element('option','',stage.label);option.value=stage.id;$('stage').append(option);}for(const build of vocabulary.builds)$('build-legend').append(element('span','',build.icon+' '+build.label));$('coverage-explanation').textContent=vocabulary.coverageLabel+': '+vocabulary.coverageDescription;}
function credit(entry){const data=credits[entry.id];$('photo-credit').replaceChildren();const image=element('img');image.src=entry.image.src;image.alt=entry.image.alt;$('photo-credit').append(image);if(data){$('photo-credit').append(element('p','',data.title),element('p','',data.creator||'Creator listed at original source'),element('p','',data.license+' · '+data.changes),link('Original photograph and license ↗',data.source));if(data.credit&&data.credit!==data.creator)$('photo-credit').append(element('p','',data.credit));if(entry.image?.caption)$('photo-credit').append(element('p','',entry.image.caption));if(data.licenseUrl)$('photo-credit').append(element('p',''),link('License terms ↗',data.licenseUrl));}if(entry.image.representative)$('photo-credit').append(element('p','representative','Representative family photograph; not a confirmed image of this exact device or revision.'));$('photo-dialog').showModal();}
function badge(symbol,label,className=''){const b=element('span','badge '+className,symbol);b.tabIndex=0;b.setAttribute('role','img');b.setAttribute('aria-label',label);b.title=label;return b;}
function card(entry){const status=snapshot.statuses[entry.id];const stage=vocabulary.stages.find(s=>s.id===status?.stage);const company=catalog.companies[entry.company];const article=element('article','hardware');article.id='hardware-'+entry.id;article.tabIndex=-1;article.dataset.id=entry.id;article.dataset.company=entry.company;article.dataset.kind=entry.kind;article.style.setProperty('--company',company.color);const photo=element('div','photo-wrap');const image=element('img');image.loading='lazy';image.decoding='async';image.width=640;image.height=440;image.src=entry.image?.src||'';image.alt=entry.image?.alt||entry.title;photo.append(image);const creditButton=element('button','photo-credit','i');creditButton.setAttribute('aria-label','Photo attribution for '+entry.title);creditButton.addEventListener('click',()=>credit(entry));photo.append(creditButton);const badges=element('div','status-badges');const percent=status?.coverage?.percent??null;badges.append(badge(percent===null?'—':percent+'%',percent===null?'Source coverage not reported':`${percent}% source coverage: ${status.coverage.cleaned} cleaned of ${status.coverage.total} defined items`,'coverage-badge'));const build=vocabulary.builds.find(b=>b.id===status?.build?.status)||vocabulary.builds[0];badges.append(badge(build.icon,build.label,'build-badge build-'+build.id));const stageBadge=badge(stage?.icon||'?',stage?.label||'Status unavailable');stageBadge.style.setProperty('--stage',stage?.color||'#78828c');badges.append(stageBadge);photo.append(badges);const meta=element('div','entry-meta');meta.append(element('span','maker',company.name),element('span','',entry.kind==='system'?'COMPUTER SYSTEM':entry.kind==='card'?'EXPANSION CARD':'CHIP FAMILY'));const title=element('h3');title.append(link(entry.title,entry.issue.url));const footer=element('div','entry-footer');const date=entry.dateSource?link(entry.dateLabel+' ↗',entry.dateSource):element('span','',entry.dateLabel);date.title='Historical placement; follow the source for date qualifications';footer.append(date,link('#'+entry.issue.number+' ↗',entry.issue.url));article.append(photo,meta,title);if(entry.image?.representative)article.append(element('p','representative',entry.image.caption||'Representative family photograph'));else if(entry.image?.caption)article.append(element('p','photo-caption',entry.image.caption));if(entry.dateNote){const evidence=element('details','date-note');evidence.append(element('summary','','Date evidence'),element('p','',entry.dateNote));for(const [index,source]of (entry.historySources||[]).entries()){if(source.url)evidence.append(link((source.note||'Supporting source '+(index+1))+' ↗',source.url));}article.append(evidence);}article.append(footer);if(entry.kind==='system'){const count=relationships.links.filter(link=>link.target===entry.id).length;const trace=element('button','trace-computer','Trace '+count+' components');trace.setAttribute('aria-label','Trace components for '+entry.title);trace.addEventListener('click',()=>focusComputer(entry.id));article.append(trace);}return article;}
function render(){
 const search=$('search').value.toLowerCase().trim(),company=$('company').value,stage=$('stage').value;
 const computer=$('computer').value;
 const connected=computer==='all'?null:new Set([computer,...relationships.links.filter(link=>link.target===computer).map(link=>link.source)]);
 visible=catalog.entries.filter(entry=>(!connected||connected.has(entry.id))&&(kind==='all'||kind===entry.kind)&&(company==='all'||company===entry.company)&&(stage==='all'||snapshot.statuses[entry.id]?.stage===stage)&&(!search||(entry.title+' '+catalog.companies[entry.company].name+' '+entry.id).toLowerCase().includes(search)));
 $('result-count').textContent=visible.length+' OF '+catalog.entries.length+' ENTRIES';
 $('eras').replaceChildren();$('empty').hidden=visible.length>0;
 document.querySelectorAll('.maker-button').forEach(button=>button.classList.toggle('active',button.dataset.company===company));
 for(const era of catalog.eras){
  const entries=visible.filter(entry=>entry.era===era.id);if(!entries.length)continue;
  const section=element('section','era');section.dataset.era=era.id;
  const header=element('div','era-header'),heading=element('div');
  heading.append(element('span','era-label',era.range),element('h2','',era.title));
  const number=element('span','era-number',era.id==='undated'?'?':era.id);number.setAttribute('aria-hidden','true');
  number.append(element('small','',era.id==='undated'?'DATE':'BIT'));header.append(heading,number);section.append(header);
  for(const year of [...new Set(entries.map(entry=>entry.year))].sort((a,b)=>(a??Infinity)-(b??Infinity))){
   const group=element('div','year-block');group.dataset.year=year??'undated';
   const yearHeading=element('div','year-heading');yearHeading.append(element('span','',year??'UNDATED'),element('i'));group.append(yearHeading);
   // A computer always starts after that year's chip and expansion-card rows.
   for(const type of ['chip','card','system']){
    const members=entries.filter(entry=>entry.year===year&&entry.kind===type);if(!members.length)continue;
    const category=element('div','hardware-kind-group');category.dataset.kindGroup=type;
    category.append(element('div','kind-heading',type==='chip'?'CHIP FAMILIES':type==='card'?'EXPANSION CARDS':'COMPUTER SYSTEMS'));
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
function focusComputer(id){
 $('computer').value=id;
 $('company').value='all';$('stage').value='all';$('search').value='';
 document.querySelector('[data-kind="all"]').click();
 if(id!=='all')requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelector('.hardware[data-id="'+id+'"]')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})));
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
function openBus(bus){
 const dialog=$('bus-dialog'),entries=new Map(catalog.entries.map(entry=>[entry.id,entry]));
 const isCPU=bus.kind==='compatible';
 $('bus-title').textContent=bus.label+(isCPU?' choices · ':' bus · ')+entries.get(bus.system).title;
 $('bus-dialog').querySelector('p').textContent=isCPU?bus.spec.note+' '+bus.spec.qualification:'Choose where to go. Planned options still require card, slot and software compatibility checks.';
 const references=$('connection-evidence');references.replaceChildren();
 if(isCPU)for(const evidence of bus.spec.evidence)references.append(link(evidence.note+' ↗',evidence.url));
 const list=$('bus-members');list.replaceChildren();
 for(const [id,qualification]of [[bus.system,'Computer'],...bus.links.map(link=>[link.source,isCPU?(link.source===bus.primary?'Original CPU profile':'Compatible alternative'):link.type==='optional'?'Planned option':'Required card'])]){
  const item=element('li'),anchor=element('a','',entries.get(id).title);anchor.href='#hardware-'+id;
  anchor.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();dialog.close();jumpToHardware(id);});
  item.append(anchor,element('small','',qualification));list.append(item);
 }
 dialog.showModal();
}
function drawConnections(){
 const timeline=$('timeline'),svg=$('connections');
 const nodes=new Map([...document.querySelectorAll('.hardware')].map(node=>[node.dataset.id,node]));
 const entryById=new Map(catalog.entries.map(entry=>[entry.id,entry]));
 const ranks=new Map([...nodes.keys()].map((id,index)=>[id,index]));
 const wires=$('show-wires').checked;
 $('show-makers').disabled=!wires;$('show-systems').disabled=!wires;
 const edges=[];
 if(wires&&$('show-makers').checked){
  for(const [company,brand]of Object.entries(catalog.companies)){
   const members=[...nodes.values()].filter(node=>node.dataset.kind==='chip'&&node.dataset.company===company);
   for(let i=1;i<members.length;i++)edges.push({source:members[i-1].dataset.id,target:members[i].dataset.id,type:'maker',side:'right',color:brand.color});
  }
 }
 const computerLinks=wires&&$('show-systems').checked?relationships.links:[];
 const sockets=groupCompatibleConnections(computerLinks,new Set(nodes.keys()),compatible);
 for(const net of sockets){net.sourceTaps=net.links.map(link=>({...link,side:'left',net,endpoint:'source'}));net.targetTap={source:net.links[0].source,target:net.system,side:'left',net,endpoint:'target'};}
 for(const link of computerLinks)if(nodes.has(link.source)&&nodes.has(link.target)&&entryById.get(link.source).kind!=='card'&&!link.compatibilityGroup)edges.push({...link,side:'left',color:catalog.companies[entryById.get(link.source).company].color});
 const buses=groupExpansionBuses(computerLinks,entryById,new Set(nodes.keys()),catalog.buses);
 const branches=buses.flatMap(bus=>[{bus,id:bus.system,type:'system'},...bus.links.map(link=>({bus,id:link.source,type:link.type,link}))]);
 const tapsById=new Map([...nodes.keys()].map(id=>[id,branches.filter(branch=>branch.id===id).sort((a,b)=>ranks.get(a.bus.system)-ranks.get(b.bus.system)||a.bus.id.localeCompare(b.bus.id))]));
 for(const taps of tapsById.values())taps.forEach((branch,index)=>{branch.port=index;branch.portCount=taps.length;});
 const incoming=new Map(),outgoing=new Map();
 for(const id of nodes.keys()){incoming.set(id,[]);outgoing.set(id,[]);}
 for(const edge of edges){outgoing.get(edge.source).push(edge);incoming.get(edge.target).push(edge);}
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
   const top=assignTracks(row.cards,'in',incoming);row.outSpace=assignTracks(row.cards,'out',outgoing);
   for(const [column,node]of row.cards.entries()){
    rowById.set(node.dataset.id,index);
    for(const branch of tapsById.get(node.dataset.id)){branch.row=row;branch.column=column;branch.below=column<row.cards.length-1;}
   }
   // Rightmost inner card first: later lower tracks can pass below its vertical stubs.
   const under=branches.filter(branch=>branch.row===row&&branch.below).sort((a,b)=>b.column-a.column||a.port-b.port);
   under.forEach((branch,track)=>{branch.track=track;});
   const bottom=row.outSpace+(under.length?safe+under.length*pitch:0);
   for(const node of row.cards){node.style.marginTop=top+'px';node.style.marginBottom=bottom+'px';}
  }
 }
 const busLanes=allocateBusLanes(buses,rowById),socketLanes=allocateBusLanes(sockets,rowById);
 const allocateLanes=side=>{
  const laneEnds=[];
  const sorted=edges.filter(edge=>edge.side===side).map(edge=>{
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
 const makeJump=(destination,origin,ordered,tabbable=true,suffix='')=>{
  const entry=entryById.get(destination),direction=ranks.get(destination)<ranks.get(origin)?'Previous':'Next';
  const label=direction+' '+(entry.kind==='system'?'computer':entry.kind)+': '+entry.title+suffix;
  const anchor=shape('a',{href:'#hardware-'+destination,class:'trace-jump','data-destination':destination,'aria-label':label,tabindex:tabbable?0:-1});
  const hint=shape('title',{});hint.textContent=label+' · Enter to jump; ↑ previous / ↓ next';anchor.append(hint);
  anchor.addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();jumpToHardware(destination);});
  anchor.addEventListener('keydown',event=>{if(event.key!=='ArrowUp'&&event.key!=='ArrowDown')return;event.preventDefault();jumpToHardware(ordered[event.key==='ArrowUp'?0:ordered.length-1]);});
  return anchor;
 };
 for(const edge of edges){
  const from=port(edge,'out'),to=port(edge,'in'),sign=edge.side==='left'?-1:1;
  const lane=edge.side==='left'?leftGutter-12-edge.lane*leftPitch:bounds.width-rightGutter+12+edge.lane*rightPitch;
  const outY=from.y+safe+(edge.outTrack+1)*pitch,inY=to.y-safe-(edge.inTrack+1)*pitch;
  const vertical=Math.sign(inY-outY)||1,bend=Math.min(6,Math.abs(inY-outY)/2);
  const points=[[from.x,from.y],[from.x,outY-6],[from.x+sign*6,outY],[lane-sign*bend,outY],[lane,outY+vertical*bend],[lane,inY-vertical*bend],[lane-sign*bend,inY],[to.x+sign*6,inY],[to.x,inY+6],[to.x,to.y]];
  const d=pathData(points),group=shape('g',{class:'connection connection-'+edge.type+(edge.basis==='reconstruction'?' connection-reconstruction':''),'data-source':edge.source,'data-target':edge.target,'data-type':edge.type,'data-side':edge.side,'data-lane':edge.lane});
  const title=shape('title',{});title.textContent=entryById.get(edge.source).title+' → '+entryById.get(edge.target).title+' · '+(edge.type==='maker'?'maker lineage':edge.basis==='reconstruction'?'later reconstruction component · not original hardware':edge.type==='optional'?'planned optional component · '+edge.note:'recorded prerequisite');
  const ordered=[edge.source,edge.target].sort((a,b)=>ranks.get(a)-ranks.get(b));
  group.append(title,shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire',stroke:edge.color,'aria-hidden':true}));
  const halves=splitRoute(points);
  for(const [route,destination,origin]of [[halves[0],edge.target,edge.source],[halves[1],edge.source,edge.target]]){
   const anchor=makeJump(destination,origin,ordered);anchor.append(shape('path',{d:pathData(route),class:'trace-hit','stroke-width':edge.side==='left'?4:6}));group.append(anchor);
  }
  paths.append(group);
  for(const [direction,p,destination,origin]of [['out',from,edge.target,edge.source],['in',to,edge.source,edge.target]]){
   const anchor=makeJump(destination,origin,ordered,false);anchor.append(shape('circle',{cx:coordinate(p.x),cy:coordinate(p.y),r:4.5,class:'trace-pad '+edge.type+'-pad','data-entry':origin,'data-direction':direction,stroke:edge.color}));pads.append(anchor);
  }
 }
 const busPaths=document.createDocumentFragment(),busPads=document.createDocumentFragment();
 const busControl=(bus,label)=>{
  const control=shape('a',{href:'#bus-'+bus.id,class:'bus-control',role:'button',tabindex:0,'aria-label':label});
  const title=shape('title',{});title.textContent=label;control.append(title);
  control.addEventListener('click',event=>{event.preventDefault();openBus(bus);});control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openBus(bus);}});
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
   const ordered=[id,net.system].sort((a,b)=>ranks.get(a)-ranks.get(b)),control=source?makeJump(net.system,id,ordered,true,' via '+net.label):busControl(net,'Choose a compatible processor for '+entryById.get(net.system).title);
   control.append(shape('path',{d,class:'trace-hit','stroke-width':5}));branch.append(control);group.append(branch);
   const pad=source?makeJump(net.system,id,ordered,false,' via '+net.label):busControl(net,'Choose a compatible processor for '+entryById.get(net.system).title);pad.setAttribute('tabindex','-1');
   pad.append(shape('circle',{cx:coordinate(p.x),cy:coordinate(p.y),r:4.5,class:'trace-pad bus-pad','data-entry':id,stroke:color}));socketPads.append(pad);
   socketPads.append(shape('circle',{cx:coordinate(lane),cy:coordinate(y),r:3,class:'bus-junction',fill:net.color,'aria-hidden':true}));joins.push(y);
  }
  const min=Math.min(...joins),max=Math.max(...joins),d=pathData([[lane,min-8],[lane,max+8]]),rail=busControl(net,net.label+' alternatives for '+entryById.get(net.system).title);
  rail.setAttribute('class','bus-control compatible-rail');
  rail.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire compatible-trunk',stroke:net.color,'aria-hidden':true}),shape('rect',{x:coordinate(lane-5),y:coordinate(min-8),width:10,height:coordinate(max-min+16),class:'bus-rail-hit'}));group.append(rail);
  const label=shape('text',{x:coordinate(lane),y:coordinate(min-14),class:'bus-label','text-anchor':'middle',fill:net.color,'aria-hidden':true});label.textContent=net.spec.wireLabel;group.append(label);socketPaths.append(group);
 }
 for(const bus of buses){
  const lane=bounds.width-busGutter+12+bus.lane*busPitch,local=branches.filter(branch=>branch.bus===bus),joins=[];
  const host=entryById.get(bus.system),group=shape('g',{class:'expansion-bus','data-bus':bus.id,'data-family':bus.family,'data-system':bus.system,'data-side':'far-right','data-lane':bus.lane});
  for(const branch of local){
   const node=nodes.get(branch.id),rect=node.getBoundingClientRect(),offset=(branch.port-(branch.portCount-1)/2)*12;
   const tap={x:rect.right-bounds.left,y:rect.top-bounds.top+rect.height/2+offset};
   let underY=null,turnX=null,bend=3;
   if(branch.below){
    const next=branch.row.cards[branch.column+1].getBoundingClientRect(),slot=(next.left-rect.right)/(branch.portCount+1);
    turnX=tap.x+slot*(branch.portCount-branch.port);bend=Math.min(3,slot/2);
    underY=Math.max(...branch.row.cards.map(card=>card.getBoundingClientRect().bottom))-bounds.top+branch.row.outSpace+safe+(branch.track+1)*pitch;
   }
   const points=busBranchPoints(tap,lane,underY,turnX,bend),join=points.at(-1),d=pathData(points);joins.push(join[1]);
   const branchGroup=shape('g',{class:'bus-branch connection-'+branch.type,'data-entry':branch.id,'data-under-row':branch.below,'data-kind':branch.type});
   const ordered=[branch.id,bus.system].sort((a,b)=>ranks.get(a)-ranks.get(b));
   const control=branch.type==='system'?busControl(bus,'Choose cards on '+bus.label+' bus for '+host.title):makeJump(bus.system,branch.id,ordered,true,' via '+bus.label+' bus');
   branchGroup.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire bus-tap',stroke:bus.color,'aria-hidden':true}));
   control.append(branch.below?shape('path',{d,class:'trace-hit','stroke-width':5}):shape('rect',{x:coordinate(tap.x),y:coordinate(tap.y-4),width:coordinate(lane-tap.x),height:8,class:'bus-direct-hit'}));branchGroup.append(control);group.append(branchGroup);
   const padControl=branch.type==='system'?busControl(bus,'Choose cards on '+bus.label+' bus for '+host.title):makeJump(bus.system,branch.id,ordered,false,' via '+bus.label+' bus');
   padControl.setAttribute('tabindex','-1');
   padControl.append(shape('circle',{cx:coordinate(tap.x),cy:coordinate(tap.y),r:4.5,class:'trace-pad bus-pad','data-entry':branch.id,stroke:bus.color}));busPads.append(padControl);
   busPads.append(shape('circle',{cx:coordinate(lane),cy:coordinate(join[1]),r:3,class:'bus-junction',fill:bus.color,'aria-hidden':true}));
  }
  const min=Math.min(...joins),max=Math.max(...joins),d=pathData([[lane,min-8],[lane,max+8]]),rail=busControl(bus,bus.label+' bus for '+host.title+' · choose a connected card or computer');
  rail.setAttribute('class','bus-control bus-rail');rail.id='bus-'+bus.id;rail.append(shape('path',{d,class:'trace-clearance','aria-hidden':true}),shape('path',{d,class:'trace-wire bus-trunk',stroke:bus.color,'aria-hidden':true}),shape('rect',{x:coordinate(lane-5),y:coordinate(min-8),width:10,height:coordinate(max-min+16),class:'bus-rail-hit'}));group.append(rail);
  const label=shape('text',{x:coordinate(lane),y:coordinate(min-14),class:'bus-label','text-anchor':'middle',fill:bus.color,'aria-hidden':true});label.textContent=bus.label;group.append(label);busPaths.append(group);
 }
 $('wire-help').hidden=!wires||(!edges.length&&!buses.length&&!sockets.length);
 svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);svg.style.height=bounds.height+'px';svg.replaceChildren(paths,socketPaths,busPaths,pads,socketPads,busPads);
 $('trace-summary').textContent=wires?edges.filter(edge=>edge.type==='maker').length+' maker links · '+edges.filter(edge=>edge.type==='required'&&edge.basis!=='reconstruction').length+' chip links · '+edges.filter(edge=>edge.type==='optional').length+' optional chip links · '+edges.filter(edge=>edge.basis==='reconstruction').length+' reconstruction links · '+buses.length+' shared expansion buses ('+buses.reduce((n,bus)=>n+bus.links.length,0)+' card connections) · '+sockets.length+' shared CPU roles':'Wires hidden';
}

function updateYear(){let selected=null;for(const group of document.querySelectorAll('.year-block[data-year]')){if(group.getBoundingClientRect().top<220)selected=group.dataset.year;else if(selected===null)selected=group.dataset.year;else break;}if(selected&&selected!=='undated'){$('current-year').textContent=selected;$('year-scrubber').value=selected;}else if(selected==='undated')$('current-year').textContent='—';}
function goYear(year){const groups=[...document.querySelectorAll('.year-block')].filter(g=>g.dataset.year!=='undated');let group=groups.find(g=>Number(g.dataset.year)>=year)||groups.at(-1);group?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
function setup(){for(const entry of catalog.entries.filter(e=>e.kind==='system')){const option=element('option','',entry.title);option.value=entry.id;$('computer').append(option);}$('computer').addEventListener('change',event=>focusComputer(event.target.value));for(const id of ['show-wires','show-makers','show-systems'])$(id).addEventListener('change',scheduleDraw);for(const [id,company]of Object.entries(catalog.companies)){if(!catalog.entries.some(e=>e.company===id))continue;const option=element('option','',company.name);option.value=id;$('company').append(option);const button=element('button','maker-button');button.dataset.company=id;button.style.setProperty('--company',company.color);button.append(element('i'),document.createTextNode(company.name));button.addEventListener('click',()=>{$('company').value=$('company').value===id?'all':id;render();});$('maker-key').append(button);}const years=catalog.entries.map(e=>e.year).filter(Number.isFinite),min=Math.min(...years),max=Math.max(...years);$('year-scrubber').min=min;$('year-scrubber').max=max;for(let year=Math.ceil(min/5)*5;year<=max;year+=5){const button=element('button','year-marker',String(year));button.style.top=((year-min)/(max-min)*100)+'%';button.addEventListener('click',()=>goYear(year));$('year-markers').append(button);}$('year-scrubber').addEventListener('input',e=>goYear(Number(e.target.value)));for(const button of document.querySelectorAll('[data-kind]')){if(button.tagName!=='BUTTON')continue;button.addEventListener('click',()=>{kind=button.dataset.kind;document.querySelectorAll('.view-tabs button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});render();});}for(const id of ['company','stage'])$(id).addEventListener('change',render);$('search').addEventListener('input',render);$('reset').addEventListener('click',()=>{$('company').value='all';$('stage').value='all';$('search').value='';$('computer').value='all';kind='all';document.querySelector('[data-kind="all"]').click();});$('entry-count').textContent=catalog.entries.length;$('company-count').textContent=new Set(catalog.entries.map(e=>e.company)).size;const stamp=new Date(snapshot.syncedAt);$('sync-label').textContent='GITHUB SNAPSHOT · '+(Number.isNaN(stamp.valueOf())?'not synced':stamp.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}));const toggle=open=>{$('legend').hidden=!open;$('legend-toggle').setAttribute('aria-expanded',String(open));};$('legend-toggle').addEventListener('click',()=>toggle($('legend').hidden));$('legend-close').addEventListener('click',()=>{toggle(false);$('legend-toggle').focus();});$('bus-close').addEventListener('click',()=>$('bus-dialog').close());$('bus-dialog').addEventListener('click',event=>{if(event.target===$('bus-dialog'))$('bus-dialog').close();});$('photo-close').addEventListener('click',()=>$('photo-dialog').close());$('photo-dialog').addEventListener('click',e=>{if(e.target===$('photo-dialog'))$('photo-dialog').close();});addEventListener('scroll',updateYear,{passive:true});addEventListener('resize',scheduleDraw);new ResizeObserver(scheduleDraw).observe($('eras'));}
try{[catalog,snapshot,vocabulary,credits,relationships,compatible]=await Promise.all([read('data/catalog.json'),read('data/status.json'),read('data/stages.json'),read('images/credits.json'),read('data/connections.json'),read('data/compatible-chips.json')]);legend();setup();render();}catch(error){$('error').hidden=false;$('error').textContent='The archive could not be loaded. Serve this folder over HTTP and check the JSON files. '+error.message;$('eras').replaceChildren();$('sync-label').textContent='Archive unavailable';console.error(error);}
