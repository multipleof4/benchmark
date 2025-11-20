async function findShortestPath(graph, start, end) {
  const { PriorityQueue } = await import('https://cdn.skypack.dev/js-priority-queue');
  const pq = new PriorityQueue({ comparator: (a, b) => a.d - b.d });
  const dist = {};
  dist[start] = 0;
  pq.queue({ node: start, d: 0 });
  while (!pq.isEmpty()) {
    const { node, d } = pq.dequeue();
    if (d > dist[node]) continue;
    if (node === end) return d;
    for (const [nei, w] of Object.entries(graph[node] || {})) {
      const alt = d + w;
      if (alt < (dist[nei] ?? Infinity)) {
        dist[nei] = alt;
        pq.queue({ node: nei, d: alt });
      }
    }
  }
  return Infinity;
}
export default findShortestPath;