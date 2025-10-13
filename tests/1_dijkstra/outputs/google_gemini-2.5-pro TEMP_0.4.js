async function findShortestPath(graph, startNode, endNode) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const distances = { [startNode]: 0 };
  const pq = new PriorityQueue({ comparator: (a, b) => a.dist - b.dist });

  pq.queue({ node: startNode, dist: 0 });

  while (pq.length) {
    const { node: u, dist: uDist } = pq.dequeue();

    if (u === endNode) return uDist;
    if (uDist > (distances[u] ?? Infinity)) continue;

    for (const v in graph[u] || {}) {
      const newDist = uDist + graph[u][v];

      if (newDist < (distances[v] ?? Infinity)) {
        distances[v] = newDist;
        pq.queue({ node: v, dist: newDist });
      }
    }
  }

  return Infinity;
}
export default findShortestPath;