const src='https://esm.sh/js-priority-queue@1'
let load
const getPQ=()=>load||(load=import(src).then(m=>m.default))
const findShortestPath=async(g,s,e)=>{
  const PQ=await getPQ()
  const pq=new PQ({comparator:(a,b)=>a[0]-b[0]})
  const dist=new Map([[s,0]])
  const done=new Set
  pq.queue([0,s])
  while(pq.length){
    const [d,n]=pq.dequeue()
    if(done.has(n))continue
    done.add(n)
    if(n===e)return d
    const edges=g[n]
    if(!edges)continue
    for(const k in edges){
      const w=d+edges[k]
      if(w<(dist.get(k)??Infinity)){
        dist.set(k,w)
        pq.queue([w,k])
      }
    }
  }
  return Infinity
}
export default findShortestPath;