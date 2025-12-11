let _pqP;
const _loadPQ = () =>
  _pqP || (_pqP = import("https://esm.sh/js-priority-queue@0.1.5"));

async function findShortestPath(graph, start, end) {
  if (start === end) return 0;
  if (!graph) return Infinity;

  const { default: PriorityQueue } = await _loadPQ();
  const dist = Object.create(null);
  const pq = new PriorityQueue({ comparator: (a, b) => a[0] - b[0] });

  dist[start] = 0;
  pq.queue([0, start]);

  while (pq.length) {
    const [d, u] = pq.dequeue();
    if (d !== dist[u]) continue;
    if (u === end) return d;

    for (const [v, w] of Object.entries(graph[u] || {})) {
      const nd = d + +w;
      if (nd < (dist[v] ?? Infinity)) {
        dist[v] = nd;
        pq.queue([nd, v]);
      }
    }
  }

  return Infinity;
}
export default findShortestPath;
// Generation time: 91.630s
// Result: PASS