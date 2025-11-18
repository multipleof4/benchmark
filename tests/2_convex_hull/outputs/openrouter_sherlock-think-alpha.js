async function findConvexHull(points){
  const{default:L}=await import('https://cdn.skypack.dev/lodash-es');
  const{sortBy,uniqBy}=L;
  let p=uniqBy(points,({x,y})=>`${x},${y}`);
  if(p.length<2)return p;
  p=sortBy(p,['x','y']);
  const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  let l=[];
  for(let i=0;i<p.length;i++){
    let pt=p[i];
    while(l.length>=2&&cross(l[l.length-2],l[l.length-1],pt)<=0)l.pop();
    l.push(pt);
  }
  let u=[];
  for(let i=p.length-1;i>=0;i--){
    let pt=p[i];
    while(u.length>=2&&cross(u[u.length-2],u[u.length-1],pt)<=0)u.pop();
    u.push(pt);
  }
  return[...l.slice(0,-1),...u.slice(0,-1)];
}
export default findConvexHull;