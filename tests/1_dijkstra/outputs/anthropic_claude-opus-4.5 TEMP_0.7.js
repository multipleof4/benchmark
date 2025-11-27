async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.4.1/+esm');
  
  const dist = { [start]: 0 };
  const visited = new Set();
  const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
  
  pq.queue([start, 0]);
  
  while (pq.length) {
    const [node, d] = pq.dequeue();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    if (node === end) return d;
    
    for (const [neighbor, weight] of Object.entries(graph[node] || {})) {
      const newDist = d + weight;
      if (newDist < (dist[neighbor] ?? Infinity)) {
        dist[neighbor] = newDist;
        pq.queue([neighbor, newDist]);
      }
    }
  }
  
  return Infinity;
}
export default findShortestPath;
// Generation time: 4.850s
// Result: FAIL