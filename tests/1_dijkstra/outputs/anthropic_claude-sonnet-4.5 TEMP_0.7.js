async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.skypack.dev/js-priority-queue');
  
  const distances = {};
  const pq = new PriorityQueue({ comparator: (a, b) => a.dist - b.dist });
  
  for (const node in graph) distances[node] = Infinity;
  distances[start] = 0;
  pq.queue({ node: start, dist: 0 });
  
  while (pq.length) {
    const { node, dist } = pq.dequeue();
    
    if (node === end) return dist;
    if (dist > distances[node]) continue;
    
    for (const neighbor in graph[node]) {
      const newDist = dist + graph[node][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.queue({ node: neighbor, dist: newDist });
      }
    }
  }
  
  return distances[end];
}
export default findShortestPath;