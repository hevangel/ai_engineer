// Orthogonal wire routing for the software view: wires run through the gaps between cards instead of crossing them.
// Pure geometry, no DOM; `rects` are {left,right,top,bottom} in board pixels.
const STUB=10,CELL=6,PAD=2,TURN=8,CROWD=3;
const DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
export function portsFor(a,b){
 if(b.left>a.right+6)return {start:{x:a.right,y:a.cy,dir:0},end:{x:b.left,y:b.cy,dir:2}};
 if(a.left>b.right+6)return {start:{x:a.left,y:a.cy,dir:2},end:{x:b.right,y:b.cy,dir:0}};
 if(b.top>=a.bottom)return {start:{x:a.cx,y:a.bottom,dir:1},end:{x:b.cx,y:b.top,dir:3}};
 return {start:{x:a.cx,y:a.top,dir:3},end:{x:b.cx,y:b.bottom,dir:1}};
}
class Heap{
 constructor(){this.items=[];}
 push(cost,value){const items=this.items;items.push([cost,value]);let i=items.length-1;while(i>0){const p=(i-1)>>1;if(items[p][0]<=items[i][0])break;[items[p],items[i]]=[items[i],items[p]];i=p;}}
 pop(){const items=this.items,top=items[0],last=items.pop();if(items.length){items[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<items.length&&items[l][0]<items[m][0])m=l;if(r<items.length&&items[r][0]<items[m][0])m=r;if(m===i)break;[items[m],items[i]]=[items[i],items[m]];i=m;}}return top;}
 get size(){return this.items.length;}
}
// A router holds the obstacle grid and the wires already placed, so later wires prefer uncrowded gaps.
export function createRouter({width,height,rects}){
 const cols=Math.ceil(width/CELL)+1,rows=Math.ceil(height/CELL)+1,blocked=new Uint8Array(cols*rows),used=new Uint8Array(cols*rows);
 for(const r of rects){
  const x0=Math.max(0,Math.floor((r.left-PAD)/CELL)),x1=Math.min(cols-1,Math.ceil((r.right+PAD)/CELL)),y0=Math.max(0,Math.floor((r.top-PAD)/CELL)),y1=Math.min(rows-1,Math.ceil((r.bottom+PAD)/CELL));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)blocked[y*cols+x]=1;
 }
 const best=new Float32Array(cols*rows*4),from=new Int32Array(cols*rows*4),seen=new Uint32Array(cols*rows*4);let generation=0;
 function search(sx,sy,sdir,ex,ey,margin){
  const lo={x:Math.max(0,Math.min(sx,ex)-margin),y:Math.max(0,Math.min(sy,ey)-margin)},hi={x:Math.min(cols-1,Math.max(sx,ex)+margin),y:Math.min(rows-1,Math.max(sy,ey)+margin)};
  generation++;
  const heap=new Heap(),start=(sy*cols+sx)*4+sdir;best[start]=0;from[start]=-1;seen[start]=generation;heap.push(0,start);
  while(heap.size){
   const [,state]=heap.pop(),dir=state&3,cell=state>>2,cx=cell%cols,cy=(cell-cx)/cols,g=best[state];
   if(cx===ex&&cy===ey){const cells=[];for(let s=state;s>=0;s=from[s])cells.push(s>>2);return cells.reverse().map(c=>({x:(c%cols)*CELL,y:Math.floor(c/cols)*CELL}));}
   for(let d=0;d<4;d++){
    if(d===((dir+2)&3))continue;
    const nx=cx+DIRS[d][0],ny=cy+DIRS[d][1];if(nx<lo.x||ny<lo.y||nx>hi.x||ny>hi.y)continue;
    const nc=ny*cols+nx;if(blocked[nc]&&!(nx===ex&&ny===ey))continue;
    const cost=g+1+(d===dir?0:TURN)+used[nc]*CROWD,ns=nc*4+d;
    if(seen[ns]!==generation||cost<best[ns]){seen[ns]=generation;best[ns]=cost;from[ns]=state;heap.push(cost+Math.abs(nx-ex)+Math.abs(ny-ey),ns);}
   }
  }
  return null;
 }
 return {
  // Returns corner points from the source port to the target port, or null when no clear route exists.
  route(a,b){
   const {start,end}=portsFor(a,b),snap=v=>Math.round(v/CELL)*CELL;
   // Ports sit on the grid along their edge so every segment stays axis-aligned.
   for(const p of [start,end]){if(p.dir%2===0)p.y=snap(p.y);else p.x=snap(p.x);}
   const cellOf=p=>{const x=p.dir===0?Math.ceil((p.x+STUB)/CELL):p.dir===2?Math.floor((p.x-STUB)/CELL):p.x/CELL,y=p.dir===1?Math.ceil((p.y+STUB)/CELL):p.dir===3?Math.floor((p.y-STUB)/CELL):p.y/CELL;return [x,y];};
   const [sx,sy]=cellOf(start),[ex,ey]=cellOf(end);
   if([sx,sy,ex,ey].some(v=>v<0)||sx>=cols||ex>=cols||sy>=rows||ey>=rows)return null;
   const saved=[[sx,sy],[ex,ey]].map(([x,y])=>[y*cols+x,blocked[y*cols+x]]);for(const [cell] of saved)blocked[cell]=0;
   // Search a corridor around the two ports first (the common, cheap case) and only then the whole board.
   const cells=search(sx,sy,start.dir,ex,ey,25)||search(sx,sy,start.dir,ex,ey,Infinity);
   for(const [cell,value] of saved)blocked[cell]=value;
   if(!cells)return null;
   for(const c of cells)used[Math.round(c.y/CELL)*cols+Math.round(c.x/CELL)]=Math.min(255,used[Math.round(c.y/CELL)*cols+Math.round(c.x/CELL)]+1);
   const points=[{x:start.x,y:start.y},...cells.map(c=>({x:c.x,y:c.y})),{x:end.x,y:end.y}];
   // Keep only the corners: drop points that continue straight, keeping the ports as the end points.
   const corners=points.filter((p,i)=>{if(i===0||i===points.length-1)return true;const q=points[i-1],r=points[i+1];return !((q.x===p.x&&p.x===r.x)||(q.y===p.y&&p.y===r.y));});
   return corners;
  }
 };
}
// A polyline with softly rounded corners, as an SVG path.
export function roundedPath(points,radius=8){
 let d=`M${points[0].x} ${points[0].y}`;
 for(let i=1;i<points.length-1;i++){
  const p=points[i],q=points[i-1],r=points[i+1],inLen=Math.hypot(p.x-q.x,p.y-q.y),outLen=Math.hypot(r.x-p.x,r.y-p.y),k=Math.min(radius,inLen/2,outLen/2);
  d+=` L${p.x-Math.sign(p.x-q.x)*k} ${p.y-Math.sign(p.y-q.y)*k} Q${p.x} ${p.y} ${p.x+Math.sign(r.x-p.x)*k} ${p.y+Math.sign(r.y-p.y)*k}`;
 }
 const last=points.at(-1);return d+` L${last.x} ${last.y}`;
}
