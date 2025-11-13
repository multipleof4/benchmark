async function findShortestPath(graph, start, end) {
  const { default: PQ } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm');
  
  const distances = Object.keys(graph).reduce((acc, node) => ({ ...acc, [node]: Infinity }), {});
  distances[start] = 0;
  
  const pq = new PQ({ comparator: (a, b) => a.dist - b.dist });
  pq.queue({ node: start, dist: 0 });
  
  const visited = new Set();
  
  while (pq.length) {
    const { node, dist } = pq.dequeue();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    if (node === end) return dist;
    
    for (const [neighbor, weight] of Object.entries(graph[node] || {})) {
      const newDist = dist + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.queue({ node: neighbor, dist: newDist });
      }
    }
  }
  
  return distances[end];
}
export default findShortestPath;