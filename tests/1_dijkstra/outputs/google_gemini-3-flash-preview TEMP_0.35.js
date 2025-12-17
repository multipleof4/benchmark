async function findShortestPath(graph, start, end) {
  const PQ = (await import('https://esm.sh/js-priority-queue')).default;
  const dists = { [start]: 0 };
  const pq = new PQ({ comparator: (a, b) => a.w - b.w });

  pq.queue({ n: start, w: 0 });

  while (pq.length) {
    const { n, w } = pq.dequeue();

    if (n === end) return w;
    if (w > (dists[n] ?? Infinity)) continue;

    for (const [m, weight] of Object.entries(graph[n] ?? {})) {
      const d = w + weight;
      if (d < (dists[m] ?? Infinity)) {
        dists[m] = d;
        pq.queue({ n: m, w: d });
      }
    }
  }

  return Infinity;
}
export default findShortestPath;
// Generation time: 20.870s
// Result: PASS