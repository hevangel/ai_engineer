// Expansion bus membership is presentation metadata; dependency evidence stays intact.
export function groupExpansionBuses(links, entries, visible, definitions){
 const groups=new Map();
 for(const link of links){
  const card=entries.get(link.source);
  if(card?.kind!=='card'||!visible.has(link.source)||!visible.has(link.target))continue;
  const definition=definitions[card.bus];
  if(!definition||entries.get(link.target)?.kind!=='system')throw Error('Missing expansion bus profile: '+card.id);
  const id=card.bus;
  if(!groups.has(id))groups.set(id,{id,kind:'expansion',family:card.bus,...definition,links:[],cards:[],systems:[]});
  const bus=groups.get(id);bus.links.push(link);
  if(!bus.cards.includes(link.source))bus.cards.push(link.source);
  if(!bus.systems.includes(link.target))bus.systems.push(link.target);
 }
 return [...groups.values()];
}

// Closed row intervals prevent trunks from sharing a lane while they overlap.
export function allocateBusLanes(buses, rowById){
 const occupied=[];
 const spans=buses.map(bus=>{
  const rows=[bus.system,...bus.links.map(link=>link.source)].map(id=>rowById.get(id));
  if(rows.some(row=>!Number.isInteger(row)))throw Error('Missing bus endpoint row: '+bus.id);
  return {bus,start:Math.min(...rows),end:Math.max(...rows)};
 }).sort((a,b)=>a.start-b.start||b.end-a.end||a.bus.id.localeCompare(b.bus.id));
 for(const {bus,start,end}of spans){
  let lane=occupied.findIndex(last=>last<start);if(lane<0)lane=occupied.length;
  occupied[lane]=end;bus.lane=lane;
 }
 return occupied.length;
}

// One horizontal run per family and direction on a row, rightmost family nearest cards.
export function groupBusRowRuns(branches){
 const groups=new Map();
 for(const branch of branches){
  const key=branch.bus.id+'--'+branch.role;
  if(!groups.has(key))groups.set(key,{bus:branch.bus,role:branch.role,branches:[]});
  groups.get(key).branches.push(branch);
 }
 const runs=[...groups.values()].sort((a,b)=>Math.max(...b.branches.map(x=>x.column))-Math.max(...a.branches.map(x=>x.column))||a.bus.id.localeCompare(b.bus.id));
 for(const role of ['card','system'])runs.filter(run=>run.role===role).forEach((run,track)=>{run.track=track;});
 return runs;
}

// Cards leave below the complete row; computer paths arrive from above it.
export function busTapPoints(port,barY,role,bend=6){
 if(!['card','system'].includes(role)||(role==='card'?barY<=port.y:barY>=port.y))throw Error('Invalid bus tap direction');
 const chamfer=Math.min(bend,Math.abs(barY-port.y)/2);
 return role==='card'?[[port.x,port.y],[port.x,barY-chamfer],[port.x+chamfer,barY]]:[[port.x+chamfer,barY],[port.x,barY+chamfer],[port.x,port.y]];
}
