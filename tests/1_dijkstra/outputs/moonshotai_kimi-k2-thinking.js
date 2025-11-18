async function findShortestPath(graph, start, end) {
  const { default: Q } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/index.min.js');
  const dist = { [start]: 0 }, visited = new Set();
  const pq = new Q({ comparator: (a, b) => dist[a] - dist[b] });
  pq.queue(start);
  
  while (pq.length) {
    const node = pq.dequeue();
    if (node === end) return dist[end];
    if (visited.has(node)) continue;
    visited.add(node);
    const nodeDist = dist[node];
    for (const [adj, weight] of Object.entries(graph[node] || {})) {
      if (visited.has(adj)) continue;
      const newDist = nodeDist + weight;
      if (newDist < (dist[adj] ?? Infinity)) {
        dist[adj] = newDist;
        pq.queue(adj);
      }
    }
  }
  return Infinity;
}
export default findShortestPath;