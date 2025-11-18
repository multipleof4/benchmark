async function findConvexHull(pts){
  const{ sortBy:s,uniqBy:u }=await import('https://cdn.skypack.dev/lodash');
  if(!pts?.length)return[];
  const p=u(s(pts,['x','y']),t=>`${t.x},${t.y}`);
  if(p.length<2)return p;
  const c=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  let l=[];for(let t of p){while(l.length>1&&c(l[l.length-2],l[l.length-1],t)<=0)l.pop();l.push(t)}
  let r=[];for(let i=p.length-1;i>=0;i--){const t=p[i];while(r.length>1&&c(r[r.length-2],r[r.length-1],t)<=0)r.pop();r.push(t)}
  l.pop();r.pop();
  return[...l,...r];
}
export default findConvexHull;