export function expandCompatibleConnections(links,definitions,entries){
 const primary=new Map(),ids=new Set();
 for(const group of definitions.groups){
  if(!/^#[0-9a-f]{6}$/i.test(group.color)||!group.wireLabel||ids.has(group.id)||primary.has(group.primary)||!group.members.includes(group.primary)||new Set(group.members).size!==group.members.length||group.members.length<2||!group.qualification||!group.evidence?.length||group.evidence.some(e=>!e.url?.startsWith('https://'))||group.members.some(id=>entries.get(id)?.kind!=='chip'))throw Error('Invalid compatibility group '+group.id);
  ids.add(group.id);primary.set(group.primary,group);
 }
 const result=[];
 for(const link of links){
  const group=link.type==='required'?primary.get(link.source):null;
  if(!group){result.push(link);continue;}
  result.push({...link,compatibilityGroup:group.id});
  for(const source of group.members.filter(id=>id!==group.primary)){
   if(links.some(other=>other.source===source&&other.target===link.target))throw Error('Alternative already has an independent gate: '+source);
   result.push({source,target:link.target,type:'compatible',compatibilityGroup:group.id,originalSource:group.primary,evidence:group.evidence[0].url,note:group.note+' '+group.qualification});
  }
 }
 return result;
}

export function groupCompatibleConnections(links,visible,definitions){
 const specs=new Map(definitions.groups.map(g=>[g.id,g])),groups=new Map();
 for(const link of links){
  if(!link.compatibilityGroup||!visible.has(link.source)||!visible.has(link.target))continue;
  const spec=specs.get(link.compatibilityGroup);
  if(!spec||!spec.members.includes(link.source))throw Error('Unqualified compatible connection');
  const id=link.target+'--'+spec.id;
  if(!groups.has(id))groups.set(id,{id,kind:'compatible',system:link.target,primary:spec.primary,label:spec.label,color:spec.color,spec,links:[]});
  groups.get(id).links.push(link);
 }
 return [...groups.values()];
}
