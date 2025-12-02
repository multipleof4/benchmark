export async function findShortestPath(graph, start, end) {
  if (start === end) return 0;
  if (!graph || !graph[start] || !graph[end]) return Infinity;

  const { default: PQ } = await import('https://cdn.skypack.dev/js-priority-queue@0.2.0?min') ||
                           (await import('https://unpkg.com/js-priority-queue@0.2.0/dist/js-priority-queue.min.js')) ||
                           { default: self.PriorityQueue };
  const pq = new PQ({ comparator: (a, b) => a.d - b.d });

  const dist = Object.create(null);
  const q = new Set(Object.keys(graph));

  for (const k of q) dist[k] = Infinity;
  dist[start] = 0;
  pq.enqueue({ n: start, d: 0 });

  while (pq.length) {
    const { n: u, d: du } = pq.dequeue();
    if (du !== dist[u]) continue;
    if (u === end) return du;
    const nb = graph[u] || {};
    for (const v in nb) {
      if (!q.has(v)) continue;
      const w = +nb[v];
      if (!isFinite(w)) continue;
      const nd = du + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        pq.enqueue({ n: v, d: nd });
      }
    }
  }
  return Infinity;
}
export default findShortestPath;
// Generation time: 18.720s
// Result: FAIL