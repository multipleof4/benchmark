async function findShortestPath(graph, start, end) {
  const PriorityQueue = (await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm')).default;
  const distances = Object.keys(graph).reduce((acc, node) => ({ ...acc, [node]: Infinity }), {});
  distances[start] = 0;
  const pq = new PriorityQueue({ comparator: (a, b) => a.distance - b.distance });
  pq.queue({ node: start, distance: 0 });
  const visited = new Set();
  while (pq.length > 0) {
    const { node, distance } = pq.dequeue();
    if (visited.has(node)) continue;
    visited.add(node);
    if (node === end) return distance;
    for (const [neighbor, weight] of Object.entries(graph[node] || {})) {
      const newDistance = distance + weight;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        pq.queue({ node: neighbor, distance: newDistance });
      }
    }
  }
  return distances[end];
}