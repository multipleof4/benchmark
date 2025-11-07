async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.skypack.dev/js-priority-queue');
  
  const dist = { [start]: 0 };
  const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
  const visited = new Set();
  
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