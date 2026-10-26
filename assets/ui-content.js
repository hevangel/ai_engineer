// Editorial strings are data; this helper only resolves and formats them.
export function contentValue(data,path){
 return path.split('.').reduce((node,key)=>node&&Object.hasOwn(node,key)?node[key]:undefined,data);
}
export function formatText(data,path,vars={}){
 const value=contentValue(data,path);
 if(typeof value!=='string')throw Error('Missing interface text: '+path);
 return value.replace(/\{(\w+)\}/g,(_,name)=>{
  if(!Object.hasOwn(vars,name)||vars[name]===undefined||vars[name]===null)throw Error('Missing text variable: '+path+'.'+name);
  return String(vars[name]);
 });
}
