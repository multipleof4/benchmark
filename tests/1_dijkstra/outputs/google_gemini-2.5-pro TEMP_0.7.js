async function findShortestPath(graph, startNode, endNode) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const dist = {};
  const pq = new PriorityQueue({ comparator: (a, b) => dist[a] - dist[b] });

  for (const vertex in graph) {
    dist[vertex] = Infinity;
  }
  dist[startNode] = 0;

  pq.queue(startNode);

  while (pq.length) {
    const u = pq.dequeue();

    if (u === endNode) break;
    if (!graph[u] || dist[u] === Infinity) continue;

    for (const v in graph[u]) {
      const newDist = dist[u] + graph[u][v];

      if (newDist < dist[v]) {
        dist[v] = newDist;
        pq.queue(v);
      }
    }
  }

  return dist[endNode] ?? Infinity;
}
export default findShortestPath;