async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.skypack.dev/js-priority-queue');
  
  const distances = {};
  const visited = new Set();
  const pq = new PriorityQueue({ comparator: (a, b) => a.dist - b.dist });
  
  for (const node in graph) distances[node] = Infinity;
  distances[start] = 0;
  pq.queue({ node: start, dist: 0 });
  
  while (pq.length > 0) {
    const { node, dist } = pq.dequeue();
    
    if (visited.has(node)) continue;
    if (node === end) return dist;
    
    visited.add(node);
    
    for (const neighbor in graph[node]) {
      if (!visited.has(neighbor)) {
        const newDist = dist + graph[node][neighbor];
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          pq.queue({ node: neighbor, dist: newDist });
        }
      }
    }
  }
  
  return Infinity;
}
export default findShortestPath;
// Generation time: 4.029s
// Result: PASS