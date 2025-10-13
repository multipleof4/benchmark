const findShortestPath = async (graph, start, end) => {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const dist = { [start]: 0 };
  const pq = new PriorityQueue({ comparator: (a, b) => a.weight - b.weight });

  pq.enqueue({ node: start, weight: 0 });

  while (pq.length) {
    const { node: u, weight: uWeight } = pq.dequeue();

    if (uWeight > (dist[u] ?? Infinity)) {
      continue;
    }

    if (u === end) {
      return uWeight;
    }

    for (const v in graph[u] || {}) {
      const newWeight = uWeight + graph[u][v];

      if (newWeight < (dist[v] ?? Infinity)) {
        dist[v] = newWeight;
        pq.enqueue({ node: v, weight: newWeight });
      }
    }
  }

  return Infinity;
};
export default findShortestPath;