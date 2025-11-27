export async function findConvexHull(pts){
  const {default:_}=await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js');
  const p=_.orderBy(_.uniqWith(pts,(a,b)=>a.x===b.x&&a.y===b.y),['x','y']);
  if(p.length<3)return p;
  const c=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  const l=[],u=[];
  for(const v of p){
    while(l.length>1&&c(l[l.length-2],l[l.length-1],v)<=0)l.pop();
    l.push(v);
  }
  for(const v of [...p].reverse()){
    while(u.length>1&&c(u[u.length-2],u[u.length-1],v)<=0)u.pop();
    u.push(v);
  }
  return l.slice(0,-1).concat(u.slice(0,-1));
}
export default findConvexHull;
// Generation time: 10.565s
// Result: PASS