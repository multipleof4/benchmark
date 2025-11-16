async function findShortestPath(graph, start, end) {
  const { PriorityQueue } = await import('https://cdn.skypack.dev/js-priority-queue');
  const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
  const dist = {}; Object.keys(graph).forEach(n => dist[n] = Infinity); dist[start] = 0;
  pq.queue([start, 0]);
  while (!pq.isEmpty()) {
    const [u, d] = pq.dequeue();
    if (u === end) return d;
    if (d > dist[u]) continue;
    for (const [v, w] of Object.entries(graph[u] || {})) {
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        pq.queue([v, nd]);
      }
    }
  }
  return Infinity;
}
export default findShortestPath;