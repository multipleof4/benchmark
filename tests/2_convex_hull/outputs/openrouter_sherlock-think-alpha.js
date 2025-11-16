async function findConvexHull(pts){
const _=(await import('https://esm.run/lodash@4.17.21')).default;
let p=_.uniqBy(_.sortBy(pts,['x','y']),q=>[q.x,q.y]);
if(p.length<=2)return p;
const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
let lower=[];
for(let q of p){
while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],q)<=0)lower.pop();
lower.push(q);
}
let upper=[];
let rp=[...p].reverse();
for(let q of rp){
while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],q)<=0)upper.pop();
upper.push(q);
}
return lower.slice(0,-1).concat(upper.slice(0,-1));
}
export default findConvexHull;