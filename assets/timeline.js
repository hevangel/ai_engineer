const $=id=>document.getElementById(id);let catalog,snapshot,vocabulary,credits;let kind='all';let visible=[];let drawFrame=0;
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
const link=(text,url)=>{const a=element('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
async function read(url){const r=await fetch(url);if(!r.ok)throw Error(url+' returned HTTP '+r.status);return r.json();}
function legend(){for(const stage of vocabulary.stages){const item=element('div','legend-item');const icon=element('span','stage-symbol',stage.icon);icon.style.setProperty('--stage',stage.color);const copy=element('div');copy.append(element('strong','',stage.label),element('p','',stage.description));item.append(icon,copy);$('stage-legend').append(item);const option=element('option','',stage.label);option.value=stage.id;$('stage').append(option);}for(const build of vocabulary.builds)$('build-legend').append(element('span','',build.icon+' '+build.label));$('coverage-explanation').textContent=vocabulary.coverageLabel+': '+vocabulary.coverageDescription;}
function credit(entry){const data=credits[entry.id];$('photo-credit').replaceChildren();const image=element('img');image.src=entry.image.src;image.alt=entry.image.alt;$('photo-credit').append(image);if(data){$('photo-credit').append(element('p','',data.title),element('p','',data.creator||'Creator listed at original source'),element('p','',data.license+' · '+data.changes),link('Original photograph and license ↗',data.source));if(data.credit&&data.credit!==data.creator)$('photo-credit').append(element('p','',data.credit));if(data.licenseUrl)$('photo-credit').append(element('p',''),link('License terms ↗',data.licenseUrl));}if(entry.image.representative)$('photo-credit').append(element('p','representative','Representative family photograph; not a confirmed image of this exact device or revision.'));$('photo-dialog').showModal();}
function badge(symbol,label,className=''){const b=element('span','badge '+className,symbol);b.tabIndex=0;b.setAttribute('role','img');b.setAttribute('aria-label',label);b.title=label;return b;}
function card(entry){const status=snapshot.statuses[entry.id];const stage=vocabulary.stages.find(s=>s.id===status?.stage);const company=catalog.companies[entry.company];const article=element('article','hardware');article.dataset.id=entry.id;article.dataset.company=entry.company;article.dataset.kind=entry.kind;article.style.setProperty('--company',company.color);const photo=element('div','photo-wrap');const image=element('img');image.loading='lazy';image.decoding='async';image.width=640;image.height=440;image.src=entry.image?.src||'';image.alt=entry.image?.alt||entry.title;photo.append(image);const creditButton=element('button','photo-credit','i');creditButton.setAttribute('aria-label','Photo attribution for '+entry.title);creditButton.addEventListener('click',()=>credit(entry));photo.append(creditButton);const badges=element('div','status-badges');const percent=status?.coverage?.percent??null;badges.append(badge(percent===null?'—':percent+'%',percent===null?'Source coverage not reported':`${percent}% source coverage: ${status.coverage.cleaned} cleaned of ${status.coverage.total} defined items`,'coverage-badge'));const build=vocabulary.builds.find(b=>b.id===status?.build?.status)||vocabulary.builds[0];badges.append(badge(build.icon,build.label,'build-badge build-'+build.id));const stageBadge=badge(stage?.icon||'?',stage?.label||'Status unavailable');stageBadge.style.setProperty('--stage',stage?.color||'#78828c');badges.append(stageBadge);photo.append(badges);const meta=element('div','entry-meta');meta.append(element('span','maker',company.name),element('span','',entry.kind==='system'?'COMPUTER SYSTEM':entry.kind==='card'?'EXPANSION CARD':'CHIP FAMILY'));const title=element('h3');title.append(link(entry.title,entry.issue.url));const footer=element('div','entry-footer');const date=entry.dateSource?link(entry.dateLabel+' ↗',entry.dateSource):element('span','',entry.dateLabel);date.title='Historical placement; follow the source for date qualifications';footer.append(date,link('#'+entry.issue.number+' ↗',entry.issue.url));article.append(photo,meta,title,element('p','',entry.description));if(entry.image?.representative)article.append(element('p','representative','Representative family photograph'));article.append(footer);return article;}
function render(){const search=$('search').value.toLowerCase().trim(),company=$('company').value,stage=$('stage').value;visible=catalog.entries.filter(e=>(kind==='all'||kind===e.kind)&&(company==='all'||company===e.company)&&(stage==='all'||snapshot.statuses[e.id]?.stage===stage)&&(!search||(e.title+' '+catalog.companies[e.company].name+' '+e.id).toLowerCase().includes(search)));$('result-count').textContent=visible.length+' OF '+catalog.entries.length+' ENTRIES';$('eras').replaceChildren();$('empty').hidden=visible.length>0;document.querySelectorAll('.maker-button').forEach(b=>b.classList.toggle('active',b.dataset.company===company));for(const era of catalog.eras){const entries=visible.filter(e=>e.era===era.id);if(!entries.length)continue;const section=element('section','era');section.dataset.era=era.id;const header=element('div','era-header'),heading=element('div');heading.append(element('span','era-label',era.range),element('h2','',era.title));const number=element('span','era-number',era.id==='undated'?'?':era.id);number.setAttribute('aria-hidden','true');number.append(element('small','',era.id==='undated'?'DATE':'BIT'));header.append(heading,number);section.append(header);for(const year of [...new Set(entries.map(e=>e.year))]){const group=element('div','year-block');group.dataset.year=year??'undated';const yearHeading=element('div','year-heading');yearHeading.append(element('span','',year??'UNDATED'),element('i'));const grid=element('div','year-grid');for(const entry of entries.filter(e=>e.year===year))grid.append(card(entry));group.append(yearHeading,grid);section.append(group);}$('eras').append(section);}scheduleDraw();updateYear();}
function scheduleDraw(){cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(drawConnections);}
function drawConnections(){
 const svg=$('connections');
 const bounds=$('timeline').getBoundingClientRect();
 const gutter=parseFloat(getComputedStyle($('timeline')).getPropertyValue('--trace-gutter'));
 const makers=Object.entries(catalog.companies).map(([id,company])=>({
  id,company,cards:[...document.querySelectorAll(`.hardware[data-company="${id}"][data-kind="chip"]`)]
 })).filter(maker=>maker.cards.length>1);
 const ns='http://www.w3.org/2000/svg';
 const shape=(tag,attributes)=>{
  const node=document.createElementNS(ns,tag);
  for(const [name,value]of Object.entries(attributes))node.setAttribute(name,String(value));
  return node;
 };
 const coordinate=value=>Math.round(value*2)/2;
 const paths=document.createDocumentFragment(),pads=document.createDocumentFragment();
 svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
 svg.style.height=bounds.height+'px';
 makers.forEach(({id,company,cards},channel)=>{
  // Keep the vertical runs outside the entire card grid. Every bend is 45 degrees.
  const lane=bounds.width-gutter+10+(makers.length===1?0:channel*(gutter-20)/(makers.length-1));
  const clearance=18+(channel%3)*3;
  const points=cards.map(card=>{
   const rect=card.getBoundingClientRect();
   return {x:rect.right-bounds.left-18,top:rect.top-bounds.top,bottom:rect.bottom-bounds.top};
  });
  const group=shape('g',{'data-company':id,class:'company-trace'});
  for(let i=1;i<points.length;i++){
   const from=points[i-1],to=points[i];
   const outY=from.bottom+clearance,inY=to.top-clearance;
   const direction=Math.sign(inY-outY)||1;
   const bend=Math.min(8,Math.abs(inY-outY)/2);
   // Exit vertically, chamfer into the right gutter, then enter vertically from above.
   const route=[
    [from.x,from.bottom],[from.x,outY-8],[from.x+8,outY],
    [lane-bend,outY],[lane,outY+direction*bend],
    [lane,inY-direction*bend],[lane-bend,inY],
    [to.x+8,inY],[to.x,inY+8],[to.x,to.top]
   ];
   const d=route.map(([x,y],j)=>(j?'L':'M')+' '+coordinate(x)+' '+coordinate(y)).join(' ');
   group.append(shape('path',{d,class:'trace-clearance'}),shape('path',{d,class:'trace-wire',stroke:company.color}));
  }
  points.forEach((point,index)=>{
   const ends=[];
   if(index>0)ends.push(['in',point.top]);
   if(index<points.length-1)ends.push(['out',point.bottom]);
   for(const [direction,y]of ends)pads.append(shape('circle',{
    cx:coordinate(point.x),cy:coordinate(y),r:5.5,
    class:'trace-pad','data-company':id,'data-direction':direction,stroke:company.color
   }));
  });
  paths.append(group);
 });
 // All pads sit above all traces, so each drilled hole stays visibly open.
 svg.replaceChildren(paths,pads);
}

function updateYear(){let selected=null;for(const group of document.querySelectorAll('.year-block[data-year]')){if(group.getBoundingClientRect().top<220)selected=group.dataset.year;else if(selected===null)selected=group.dataset.year;else break;}if(selected&&selected!=='undated'){$('current-year').textContent=selected;$('year-scrubber').value=selected;}else if(selected==='undated')$('current-year').textContent='—';}
function goYear(year){const groups=[...document.querySelectorAll('.year-block')].filter(g=>g.dataset.year!=='undated');let group=groups.find(g=>Number(g.dataset.year)>=year)||groups.at(-1);group?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
function setup(){for(const [id,company]of Object.entries(catalog.companies)){if(!catalog.entries.some(e=>e.company===id))continue;const option=element('option','',company.name);option.value=id;$('company').append(option);const button=element('button','maker-button');button.dataset.company=id;button.style.setProperty('--company',company.color);button.append(element('i'),document.createTextNode(company.name));button.addEventListener('click',()=>{$('company').value=$('company').value===id?'all':id;render();});$('maker-key').append(button);}const years=catalog.entries.map(e=>e.year).filter(Number.isFinite),min=Math.min(...years),max=Math.max(...years);$('year-scrubber').min=min;$('year-scrubber').max=max;for(let year=Math.ceil(min/5)*5;year<=max;year+=5){const button=element('button','year-marker',String(year));button.style.top=((year-min)/(max-min)*100)+'%';button.addEventListener('click',()=>goYear(year));$('year-markers').append(button);}$('year-scrubber').addEventListener('input',e=>goYear(Number(e.target.value)));for(const button of document.querySelectorAll('[data-kind]')){if(button.tagName!=='BUTTON')continue;button.addEventListener('click',()=>{kind=button.dataset.kind;document.querySelectorAll('.view-tabs button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});render();});}for(const id of ['company','stage'])$(id).addEventListener('change',render);$('search').addEventListener('input',render);$('reset').addEventListener('click',()=>{$('company').value='all';$('stage').value='all';$('search').value='';kind='all';document.querySelector('[data-kind="all"]').click();});$('entry-count').textContent=catalog.entries.length;$('company-count').textContent=new Set(catalog.entries.map(e=>e.company)).size;const stamp=new Date(snapshot.syncedAt);$('sync-label').textContent='GITHUB SNAPSHOT · '+(Number.isNaN(stamp.valueOf())?'not synced':stamp.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}));const toggle=open=>{$('legend').hidden=!open;$('legend-toggle').setAttribute('aria-expanded',String(open));};$('legend-toggle').addEventListener('click',()=>toggle($('legend').hidden));$('legend-close').addEventListener('click',()=>{toggle(false);$('legend-toggle').focus();});$('photo-close').addEventListener('click',()=>$('photo-dialog').close());$('photo-dialog').addEventListener('click',e=>{if(e.target===$('photo-dialog'))$('photo-dialog').close();});addEventListener('scroll',updateYear,{passive:true});addEventListener('resize',scheduleDraw);new ResizeObserver(scheduleDraw).observe($('eras'));}
try{[catalog,snapshot,vocabulary,credits]=await Promise.all([read('data/catalog.json'),read('data/status.json'),read('data/stages.json'),read('images/credits.json')]);legend();setup();render();}catch(error){$('error').hidden=false;$('error').textContent='The archive could not be loaded. Serve this folder over HTTP and check the JSON files. '+error.message;$('eras').replaceChildren();$('sync-label').textContent='Archive unavailable';console.error(error);}
