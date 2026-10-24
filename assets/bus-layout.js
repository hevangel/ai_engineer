// Expansion bus membership is presentation metadata; dependency evidence stays intact.
export function groupExpansionBuses(links, entries, visible, definitions){
 const groups=new Map();
 for(const link of links){
  const card=entries.get(link.source);
  if(card?.kind!=='card'||!visible.has(link.source)||!visible.has(link.target))continue;
  const definition=definitions[card.bus];
  if(!definition||entries.get(link.target)?.kind!=='system')throw Error('Missing expansion bus profile: '+card.id);
  const id=link.target+'--'+card.bus;
  if(!groups.has(id))groups.set(id,{id,system:link.target,family:card.bus,...definition,links:[]});
  groups.get(id).links.push(link);
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

export function busBranchPoints(port,lane,underY=null,turnX=null,bend=3){
 if(underY===null)return [[port.x,port.y],[lane,port.y]];
 if(!(turnX>port.x&&lane>turnX&&underY>port.y))throw Error('Invalid under-row bus route');
 const chamfer=Math.min(bend,(turnX-port.x)/2,(underY-port.y)/2,(lane-turnX)/2);
 return [[port.x,port.y],[turnX-chamfer,port.y],[turnX,port.y+chamfer],[turnX,underY-chamfer],[turnX+chamfer,underY],[lane,underY]];
}
