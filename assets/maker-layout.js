// Only adjacent visible cells can connect through the gap without crossing another card.
export function isInlineMakerLink(edge,cells){
 const source=cells.get(edge.source),target=cells.get(edge.target);
 return edge.type==='maker'&&Boolean(source&&target&&source.grid===target.grid&&source.row===target.row&&target.column===source.column+1);
}
export function horizontalMakerPoints(sourceRight,targetLeft,y){
 if(targetLeft<=sourceRight)throw Error('Maker gap must be clear and run left to right');
 return [[sourceRight,y],[targetLeft,y]];
}
