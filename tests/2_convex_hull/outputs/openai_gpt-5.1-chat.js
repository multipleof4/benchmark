export async function findConvexHull(a){
  const _ = (await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js')).default
  a = _.uniqWith(a,_.isEqual)
  a = _.sortBy(a,['x','y'])
  const c=(o,p,q)=>((p.x-o.x)*(q.y-o.y)-(p.y-o.y)*(q.x-o.x))
  const b=[]
  for(const p of a){
    while(b.length>1 && c(b[b.length-2],b[b.length-1],p)<=0) b.pop()
    b.push(p)
  }
  const u=[]
  for(const p of [...a].reverse()){
    while(u.length>1 && c(u[u.length-2],u[u.length-1],p)<=0) u.pop()
    u.push(p)
  }
  u.pop()
  b.pop()
  return [...b,...u]
}
export default findConvexHull;