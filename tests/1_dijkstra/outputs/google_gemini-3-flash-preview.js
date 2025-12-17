export const findShortestPath = async (graph, start, end) => {
  const { default: PQ } = await import('https://cdn.skypack.dev/js-priority-queue');
  
  const dists = { [start]: 0 };
  const pq = new PQ({ comparator: (a, b) => a.w - b.w });

  pq.queue({ n: start, w: 0 });

  while (pq.length) {
    const { n, w } = pq.dequeue();

    if (n === end) return w;
    if (w > (dists[n] ?? Infinity)) continue;

    for (const [neighbor, weight] of Object.entries(graph[n] ?? {})) {
      const total = w + weight;
      if (total < (dists[neighbor] ?? Infinity)) {
        dists[neighbor] = total;
        pq.queue({ n: neighbor, w: total });
      }
    }
  }

  return Infinity;
};
export default findShortestPath;
// Generation time: 12.594s
// Result: PASS