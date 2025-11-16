async function findShortestPath(graph,start,end){
  const{PriorityQueue}=await import('https://cdn.skypack.dev/js-priority-queue');
  const dist={};
  for(let n in graph)dist[n]=Infinity;
  dist[start]=0;
  const pq=new PriorityQueue({comparator:(a,b)=>a.d-b.d});
  pq.queue({node:start,d:0});
  while(!pq.isEmpty()){
    const{node,d}=pq.dequeue();
    if(d>dist[node])continue;
    if(node===end)return d;
    for(let nei in graph[node]){
      const alt=d+graph[node][nei];
      if(alt<dist[nei]){
        dist[nei]=alt;
        pq.queue({node:nei,d:alt});
      }
    }
  }
  return Infinity;
}
export default findShortestPath;