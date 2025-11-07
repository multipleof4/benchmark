async function findShortestPath(graph, start, end) {
  const { default: PQ } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm');
  
  const dist = { [start]: 0 };
  const pq = new PQ({ comparator: (a, b) => a[1] - b[1] });
  pq.queue([start, 0]);
  
  while (pq.length) {
    const [node, d] = pq.dequeue();
    
    if (node === end) return d;
    if (d > (dist[node] ?? Infinity)) continue;
    
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