import test from 'node:test';
import assert from 'node:assert/strict';
import {createRouter,roundedPath} from '../assets/software-routing.js';
const card=(left,top,right,bottom)=>({left,top,right,bottom,cx:(left+right)/2,cy:(top+bottom)/2});
const crosses=(points,rect)=>points.slice(1).some((p,i)=>{const q=points[i],x0=Math.min(p.x,q.x),x1=Math.max(p.x,q.x),y0=Math.min(p.y,q.y),y1=Math.max(p.y,q.y);return x1>rect.left&&x0<rect.right&&y1>rect.top&&y0<rect.bottom;});
test('wires run axis-aligned around a card that blocks the straight line',()=>{
 const a=card(20,150,120,250),wall=card(200,100,300,300),b=card(380,150,480,250);
 const points=createRouter({width:600,height:400,rects:[a,wall,b]}).route(a,b);
 assert.ok(points);
 assert.ok(points.slice(1).every((p,i)=>p.x===points[i].x||p.y===points[i].y),'every segment is horizontal or vertical');
 assert.equal(points[0].x,a.right);assert.equal(points.at(-1).x,b.left);
 assert.equal(crosses(points,wall),false);
});
test('a wire between vertically stacked cards leaves the bottom and enters the top',()=>{
 const a=card(20,20,120,120),b=card(20,220,120,320),points=createRouter({width:200,height:400,rects:[a,b]}).route(a,b);
 assert.equal(points[0].y,a.bottom);assert.equal(points.at(-1).y,b.top);
 assert.match(roundedPath(points),/^M/);
});
