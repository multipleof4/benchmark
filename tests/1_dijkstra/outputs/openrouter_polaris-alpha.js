async function findShortestPath(g,s,e){
  if(!g||!g[s]||!g[e])return Infinity
  const{default:PriorityQueue}=await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/js/priority-queue.min.js')
  const d={},v={}
  Object.keys(g).forEach(k=>d[k]=k===s?0:Infinity)
  const q=new PriorityQueue({comparator:(a,b)=>a.w-b.w})
  q.queue({n:s,w:0})
  while(q.length){
    const{n,w}=q.dequeue()
    if(v[n])continue
    v[n]=1
    if(n===e)return w
    const nbrs=g[n]
    for(const x in nbrs){
      const nw=w+nbrs[x]
      if(nw<d[x]){
        d[x]=nw
        q.queue({n:x,w:nw})
      }
    }
  }
  return Infinity
}
export default findShortestPath;