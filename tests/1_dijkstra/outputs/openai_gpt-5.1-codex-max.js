async function findShortestPath(g,s,t){
  let {default:P}=await import('https://cdn.skypack.dev/js-priority-queue')
  if(!(s in g)||!(t in g))return Infinity
  let d={},u=new Set,q=new P({comparator:(a,b)=>a[0]-b[0]})
  Object.keys(g).forEach(k=>d[k]=Infinity)
  d[s]=0
  q.queue([0,s])
  while(q.length){
    let [w,n]=q.dequeue()
    if(u.has(n))continue
    if(n===t)return w
    u.add(n)
    for(let m in g[n]){
      let nw=w+g[n][m]
      if(nw<d[m])d[m]=nw,q.queue([nw,m])
    }
  }
  return Infinity
}
export default findShortestPath;
// Generation time: 15.370s
// Result: PASS