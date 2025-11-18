const findShortestPath = async (graph, start, end) => {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const dists = Object.fromEntries(
    Object.keys(graph).map(node => [node, Infinity])
  );

  const pq = new PriorityQueue({ comparator: (a, b) => a.priority - b.priority });

  dists[start] = 0;
  pq.queue({ node: start, priority: 0 });

  while (pq.length) {
    const { node: u, priority: currentDist } = pq.dequeue();

    if (currentDist > dists[u]) {
      continue;
    }

    if (u === end) break;

    for (const [v, weight] of Object.entries(graph[u])) {
      const distThroughU = dists[u] + weight;

      if (distThroughU < dists[v]) {
        dists[v] = distThroughU;
        pq.queue({ node: v, priority: distThroughU });
      }
    }
  }

  return dists[end];
};
export default findShortestPath;