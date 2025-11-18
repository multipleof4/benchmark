async function findConvexHull(points){
  const m=await import('https://cdn.skypack.dev/lodash?min')
  const _=m.default||m
  const pts=_.sortBy(_.uniqWith(points,(a,b)=>a.x===b.x&&a.y===b.y),['x','y'])
  if(pts.length<3)return pts.slice()
  const h=[]
  const c=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)
  for(const p of pts){
    while(h.length>1&&c(h.at(-2),h.at(-1),p)<=0)h.pop()
    h.push(p)
  }
  const t=h.length+1
  for(let i=pts.length-2;i>=0;i--){
    const p=pts[i]
    while(h.length>=t&&c(h.at(-2),h.at(-1),p)<=0)h.pop()
    h.push(p)
  }
  h.pop()
  return h
}
export default findConvexHull;