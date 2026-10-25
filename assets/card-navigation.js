// Keyboard moves for a selected card: sideways along the maker's family line, vertically between a chip and its computers.
export const cardMoves={ArrowLeft:'previous',h:'previous',ArrowRight:'next',l:'next',ArrowUp:'up',k:'up',ArrowDown:'down',j:'down'};

// order lists the rendered card IDs in display order; filters therefore limit destinations.
// cursor remembers which chip a computer was reached from so Down can continue through that chip's computers.
export function cardDestination({id,move,order,entries,links,cursor=null}){
 const rank=new Map(order.map((card,index)=>[card,index])),entry=entries.get(id);
 if(!entry||!rank.has(id))return null;
 if(move==='previous'||move==='next'){
  if(entry.kind!=='chip')return null;
  const family=order.filter(card=>entries.get(card)?.kind==='chip'&&entries.get(card).company===entry.company),target=family[family.indexOf(id)+(move==='next'?1:-1)];
  return target?{id:target,origin:null}:null;
 }
 const visible=(card,kind)=>entries.get(card)?.kind===kind&&rank.has(card);
 const systemsOf=chip=>[...new Set(links.filter(link=>link.source===chip&&visible(link.target,'system')).map(link=>link.target))].sort((a,b)=>rank.get(a)-rank.get(b));
 // A computer's required CPU-side chips come first; planned options follow.
 const chipsOf=system=>{const found=links.filter(link=>link.target===system&&visible(link.source,'chip'));return [...new Set([...found.filter(link=>link.type==='required'&&link.basis!=='reconstruction'),...found].map(link=>link.source))];};
 const origin=cursor?.to===id&&entry.kind==='system'&&systemsOf(cursor.origin).includes(id)?cursor.origin:null;
 if(entry.kind==='chip'){
  const systems=systemsOf(id),target=move==='down'?systems.find(card=>rank.get(card)>rank.get(id)):systems.filter(card=>rank.get(card)<rank.get(id)).at(-1);
  return target?{id:target,origin:id}:null;
 }
 if(entry.kind!=='system')return null;
 if(move==='up'){const chip=origin??chipsOf(id)[0];return chip?{id:chip,origin:null}:null;}
 const target=origin&&systemsOf(origin).find(card=>rank.get(card)>rank.get(id));
 return target?{id:target,origin}:null;
}
