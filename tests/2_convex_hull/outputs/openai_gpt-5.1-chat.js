export async function findConvexHull(p){
  const _=(await import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js')).default
  p=_.uniqWith(p,_.isEqual)
  p=_.sortBy(p,['x','y'])
  const c=(a,b,d)=>(b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x)
  const h=[]
  for(const v of p){
    while(h.length>1&&c(h[h.length-2],h[h.length-1],v)<=0)h.pop()
    h.push(v)
  }
  const u=[]
  for(const v of [...p].reverse()){
    while(u.length>1&&c(u[u.length-2],u[u.length-1],v)<=0)u.pop()
    u.push(v)
  }
  h.pop()
  u.pop()
  return [...h,...u]
}
export default findConvexHull;