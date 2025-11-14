const findShortestPath = async (graph, startNode, endNode) => {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const distances = Object.fromEntries(
    Object.keys(graph).map(node => [node, 1 / 0])
  );
  distances[startNode] = 0;

  const pq = new PriorityQueue({
    comparator: (a, b) => a.priority - b.priority
  });
  pq.queue({ node: startNode, priority: 0 });

  while (pq.length) {
    const { node: u, priority: dist } = pq.dequeue();

    if (dist > distances[u]) {
      continue;
    }

    if (u === endNode) {
      break;
    }

    for (const [v, weight] of Object.entries(graph[u] ?? {})) {
      const newDist = distances[u] + weight;
      if (newDist < distances[v]) {
        distances[v] = newDist;
        pq.queue({ node: v, priority: newDist });
      }
    }
  }

  return distances[endNode];
};
export default findShortestPath;