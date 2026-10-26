// Pure ordering, linking and keyboard-navigation rules for the software view; data comes from data/software.json.
const rank=(list,id)=>{const index=list.findIndex(item=>item.id===id);return index<0?list.length:index;};
export function layoutRows({systems,entries,layers,categories}){
 return [...systems].sort((a,b)=>a.year-b.year||a.title.localeCompare(b.title)).map(system=>{
  const owned=entries.filter(entry=>entry.system===system.id);
  const columns=layers.map(layer=>({layer:layer.id,items:owned.filter(entry=>entry.layer===layer.id).sort((a,b)=>layer.id==='software'?rank(categories,a.category)-rank(categories,b.category)||a.year-b.year||a.title.localeCompare(b.title):a.year-b.year||a.title.localeCompare(b.title)).map(entry=>entry.id)})).filter(column=>column.items.length);
  return {system:system.id,columns,order:columns.flatMap(column=>column.items)};
 }).filter(row=>row.order.length);
}
// An edge points from the thing that must exist first to the thing built on or after it.
export function softwareLinks(entries){
 const links=[];
 for(const entry of entries){
  for(const source of entry.dependsOn||[])links.push({from:source,to:entry.id,kind:'dependency'});
  for(const source of entry.derivedFrom||[])links.push({from:source,to:entry.id,kind:'lineage'});
 }
 return links;
}
// Everything the title needs (transitively upstream) plus everything built on it (downstream).
export function chainIds(links,id){
 const seen=new Set([id]);
 for(const [here,there] of [['to','from'],['from','to']]){
  const queue=[id],walked=new Set([id]);
  while(queue.length){const current=queue.pop();for(const link of links)if(link[here]===current&&!walked.has(link[there])){walked.add(link[there]);seen.add(link[there]);queue.push(link[there]);}}
 }
 return seen;
}
export function findCycle(entries){
 const next=new Map(entries.map(entry=>[entry.id,[...(entry.dependsOn||[]),...(entry.derivedFrom||[])]])),state=new Map();
 const visit=(id,trail)=>{if(state.get(id)==='done')return null;if(state.get(id)==='open')return [...trail.slice(trail.indexOf(id)),id];state.set(id,'open');for(const parent of next.get(id)||[]){const cycle=visit(parent,[...trail,id]);if(cycle)return cycle;}state.set(id,'done');return null;};
 for(const entry of entries){const cycle=visit(entry.id,[]);if(cycle)return cycle;}
 return null;
}
export const softwareMoves={ArrowLeft:'previous',h:'previous',ArrowRight:'next',l:'next',ArrowUp:'up',k:'up',ArrowDown:'down',j:'down'};
// h/l walk the row; k/j move to the neighbouring row (keeping the column position where possible).
export function softwareDestination({rows,id,move}){
 const rowIndex=rows.findIndex(row=>row.order.includes(id));if(rowIndex<0)return null;
 const row=rows[rowIndex],at=row.order.indexOf(id);
 if(move==='previous')return row.order[at-1]??null;
 if(move==='next')return row.order[at+1]??null;
 const other=rows[rowIndex+(move==='down'?1:-1)];
 return other?other.order[Math.min(at,other.order.length-1)]:null;
}
