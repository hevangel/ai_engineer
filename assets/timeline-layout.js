// Widths include the chapter padding, card minimums and actual column gaps.
export function minimumBoardWidth(columns,{cardMin,gap,padding}){
 return padding+columns*cardMin+Math.max(0,columns-1)*gap;
}
export function preferredColumns(width,metrics,max=3){
 for(let columns=max;columns>1;columns--)if(minimumBoardWidth(columns,metrics)<=width+0.5)return columns;
 return 1;
}
