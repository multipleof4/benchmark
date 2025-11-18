async function findShortestPath(graph,start,end){
  const{default:PriorityQueue}=await import('https://cdn.skypack.dev/js-priority-queue');
  const dist={};
  const pq=new PriorityQueue({comparator:(x,y)=>x.d-y.d});
  for(const n of Object.keys(graph))dist[n]=Infinity;
  dist[start]=0;
  pq.queue({n:start,d:0});
  while(!pq.isEmpty()){
    const{n:n,d:d}=pq.dequeue();
    if(d>dist[n])continue;
    if(n===end)return d;
    for(let nei in graph[n]){
      const w=graph[n][nei];
      const alt=d+w;
      if(alt<dist[nei]){
        dist[nei]=alt;
        pq.queue({n:nei,d:alt});
      }
    }
  }
  return Infinity;
}
export default findShortestPath;