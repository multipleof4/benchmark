let u;
const loadQueue=async()=> (u=u||import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.2.0/es6.js')).then(r=>r.default);

export async function findShortestPath(graph,start,end){
 if(start===end) return 0;
 if(!graph||typeof graph!=='object') return Infinity;
 const own=Object.prototype.hasOwnProperty;
 if(!own.call(graph,start)||!own.call(graph,end)) return Infinity;
 const PriorityQueue=await loadQueue();
 const dist=new Map([[start,0]]);
 const heap=new PriorityQueue({comparator:(a,b)=>a[1]-b[1]});
 heap.queue([start,0]);
 while(heap.length){
  const [node,score]=heap.dequeue();
  if(score>dist.get(node)) continue;
  if(node===end) return score;
  const edges=graph[node];
  if(!edges) continue;
  for(const [next,weight] of Object.entries(edges)){
   const total=score+weight;
   if(total<(dist.get(next)??Infinity)){
    dist.set(next,total);
    heap.queue([next,total]);
   }
  }
 }
 return Infinity;
}
export default findShortestPath;