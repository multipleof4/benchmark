async function findShortestPath(g,s,e){
  const {default:Q}=await import('https://cdn.jsdelivr.net/npm/js-priority-queue@latest/dist/priority-queue.min.js')
  const d={},v={}
  for(const k in g)d[k]=Infinity
  d[s]=0
  const q=new Q({comparator:(a,b)=>a[1]-b[1]})
  q.queue([s,0])
  while(q.length){
    const [n,w]=q.dequeue()
    if(v[n])continue
    v[n]=1
    if(n===e)return w
    for(const k in g[n]){
      const nw=w+g[n][k]
      if(nw<d[k]){
        d[k]=nw
        q.queue([k,nw])
      }
    }
  }
  return Infinity
}
export default findShortestPath;