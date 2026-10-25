// Use the clear gap only when no rendered hardware row intervenes.
export function isLocalComponentLink(edge,rowById,entries){
 const sourceRow=rowById.get(edge.source),targetRow=rowById.get(edge.target);
 return ['required','optional'].includes(edge.type)&&edge.basis!=='reconstruction'&&!edge.compatibilityGroup
  &&entries.get(edge.source)?.kind==='chip'&&entries.get(edge.target)?.kind==='system'
  &&Number.isInteger(sourceRow)&&targetRow===sourceRow+1;
}
export function localComponentPoints(from,to,trackY){
 if(!(from.y<trackY&&trackY<to.y))throw Error('Component track must be between the rows');
 const distance=Math.abs(to.x-from.x);
 if(!distance)return [[from.x,from.y],[to.x,to.y]];
 const sign=Math.sign(to.x-from.x),bend=Math.min(6,distance/2,trackY-from.y,to.y-trackY);
 return [[from.x,from.y],[from.x,trackY-bend],[from.x+sign*bend,trackY],
  [to.x-sign*bend,trackY],[to.x,trackY+bend],[to.x,to.y]];
}
