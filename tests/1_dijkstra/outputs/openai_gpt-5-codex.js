let u
const o=()=>u||(u=import('https://cdn.skypack.dev/js-priority-queue').then(r=>r.default||r))
async function findShortestPath(g,s,t){
const PQ=await o()
if(s===t)return 0
const d={},q=new PQ({comparator:(a,b)=>a[1]-b[1]})
for(const k in g)d[k]=Infinity
d[s]=0
q.queue([s,0])
while(q.length){
const[n,w]=q.dequeue()
if(w>d[n])continue
if(n===t)return w
for(const[nb,c]of Object.entries(g[n]||{})){
const nw=w+c
if(nw<d[nb]){
d[nb]=nw
q.queue([nb,nw])
}
}
}
return Infinity
}
export default findShortestPath;