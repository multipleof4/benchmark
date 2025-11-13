async function findShortestPath(g,s,e){
  const {default:Q}=await import('https://cdn.skypack.dev/js-priority-queue')
  const d={[s]:0},q=new Q({comparator:(a,b)=>a.w-b.w})
  q.queue({n:s,w:0})
  while(q.length){
    const {n,w}=q.dequeue()
    if(w>(d[n]??Infinity))continue
    if(n===e)return w
    for(const k in g[n]||{}){
      const nw=w+g[n][k]
      if(nw<(d[k]??Infinity)){
        d[k]=nw
        q.queue({n:k,w:nw})
      }
    }
  }
  return Infinity
}
export default findShortestPath;