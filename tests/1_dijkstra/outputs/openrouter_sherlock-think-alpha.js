async function findShortestPath(graph,start,end){
  const {PriorityQueue}=await import('https://cdn.skypack.dev/js-priority-queue');
  if(start===end)return 0;
  const dist={};
  dist[start]=0;
  const pq=new PriorityQueue({comparator:(a,b)=>a.dist-b.dist});
  pq.queue({node:start,dist:0});
  while(!pq.isEmpty()){
    const u=pq.dequeue();
    if(u.dist>dist[u.node])continue;
    const neighbors=graph[u.node];
    if(!neighbors)continue;
    for(const v in neighbors){
      const w=neighbors[v];
      const alt=dist[u.node]+w;
      if(alt<(dist[v]??Infinity)){
        dist[v]=alt;
        pq.queue({node:v,dist:alt});
      }
    }
  }
  return dist[end]??Infinity;
}
export default findShortestPath;