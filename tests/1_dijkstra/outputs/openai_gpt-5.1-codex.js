let pqPromise
const getPQ=()=>pqPromise??=import('https://cdn.jsdelivr.net/npm/js-priority-queue@latest/+esm')

async function findShortestPath(g,s,t){
if(!g||!(s in g)||!(t in g)) return Infinity
if(s===t) return 0
const {default:PriorityQueue}=await getPQ()
const d={[s]:0}
const seen=new Set
const q=new PriorityQueue({comparator:(a,b)=>a[0]-b[0]})
q.queue([0,s])
while(q.length){
const [w,n]=q.dequeue()
if(seen.has(n)) continue
seen.add(n)
if(n===t) return w
const edges=g[n]
if(!edges) continue
for(const k in edges){
if(seen.has(k)) continue
const nw=w+edges[k]
if(nw<(d[k]??Infinity)){
d[k]=nw
q.queue([nw,k])
}
}
}
return Infinity
}
export default findShortestPath;