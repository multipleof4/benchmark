let pq;
const loadPQ=()=>pq||(pq=import('https://cdn.skypack.dev/js-priority-queue').then(m=>m.default));

async function findShortestPath(graph,start,end){
 const PQ=await loadPQ();
 if(start===end) return 0;
 if(!graph||typeof graph!=='object') return Infinity;
 const d=new Map([[start,0]]);
 const q=new PQ({comparator:(a,b)=>a[0]-b[0]});
 q.queue([0,start]);
 while(q.length){
  const [w,n]=q.dequeue();
  if(w>(d.get(n)??Infinity)) continue;
  if(n===end) return w;
  const edges=graph[n];
  if(!edges||typeof edges!=='object') continue;
  for(const k of Object.keys(edges)){
   const c=edges[k];
   if(typeof c!=='number'||c<0||!Number.isFinite(c)) continue;
   const nw=w+c;
   if(nw<(d.get(k)??Infinity)){
    d.set(k,nw);
    q.queue([nw,k]);
   }
  }
 }
 return Infinity;
}
export default findShortestPath;