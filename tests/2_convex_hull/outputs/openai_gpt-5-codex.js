async function findConvexHull(points){
 const {default:_}=await import('https://cdn.skypack.dev/lodash-es');
 const pts=_.uniqWith(_.sortBy(points,['x','y']),(a,b)=>a.x===b.x&&a.y===b.y);
 if(pts.length<3) return pts.slice();
 const c=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
 const l=[],u=[];
 for(const p of pts){
  while(l.length>1&&c(l.at(-2),l.at(-1),p)<=0)l.pop();
  l.push(p);
 }
 for(let i=pts.length;i--;){
  const p=pts[i];
  while(u.length>1&&c(u.at(-2),u.at(-1),p)<=0)u.pop();
  u.push(p);
 }
 l.pop();u.pop();
 return [...l,...u].reverse();
}
export default findConvexHull;