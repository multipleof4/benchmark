export async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/index.min.js');
  
  if (!graph[start] || !graph[end]) return Infinity;
  if (start === end) return 0;
  
  const dist = { [start]: 0 };
  const pq = new PriorityQueue({ comparator: (a, b) => a[0] - b[0] });
  pq.queue([0, start]);
  
  while (pq.length) {
    const [d, node] = pq.dequeue();
    
    if (node === end) return d;
    if (d > (dist[node] ?? Infinity)) continue;
    
    for (const [n, w] of Object.entries(graph[node] || {})) {
      const nd = d + w;
      if (nd < (dist[n] ?? Infinity)) {
        dist[n] = nd;
        pq.queue([nd, n]);
      }
    }
  }
  
  return Infinity;
}
export default findShortestPath;