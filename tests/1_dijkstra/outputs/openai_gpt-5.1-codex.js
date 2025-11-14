const findShortestPath=async(g,s,t)=>{
  if(s===t)return 0
  const{default:PriorityQueue}=await import('https://cdn.skypack.dev/js-priority-queue')
  if(!g[s]||!g[t])return Infinity
  const seen=new Map([[s,0]])
  const pq=new PriorityQueue({comparator:(a,b)=>a[1]-b[1]})
  pq.queue([s,0])
  while(pq.length){
    const[n,d]=pq.dequeue()
    if(d>(seen.get(n)??Infinity))continue
    if(n===t)return d
    const nbrs=g[n]||{}
    for(const k in nbrs){
      const nd=d+nbrs[k]
      if(nd<(seen.get(k)??Infinity)){
        seen.set(k,nd)
        pq.queue([k,nd])
      }
    }
  }
  return Infinity
}
export default findShortestPath;