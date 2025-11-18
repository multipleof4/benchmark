const findShortestPath = async (graph, start, end) => {
  const { default: PQ } = await import('https://cdn.skypack.dev/js-priority-queue');
  const queue = new PQ({ comparator: (a, b) => a.d - b.d });
  const dists = { [start]: 0 }, visited = new Set();
  
  queue.queue({ n: start, d: 0 });

  while (queue.length) {
    const { n, d } = queue.dequeue();
    if (n === end) return d;
    if (visited.has(n)) continue;
    visited.add(n);

    for (const [neighbor, weight] of Object.entries(graph[n] || {})) {
      const newDist = d + weight;
      if (newDist < (dists[neighbor] ?? Infinity)) {
        dists[neighbor] = newDist;
        queue.queue({ n: neighbor, d: newDist });
      }
    }
  }
  return Infinity;
};
export default findShortestPath;