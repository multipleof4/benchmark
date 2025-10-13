async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm');
  const distances = Object.keys(graph).reduce((acc, node) => ({ ...acc, [node]: Infinity }), {});
  distances[start] = 0;
  const pq = new PriorityQueue({ comparator: (a, b) => a[1] - b[1] });
  pq.queue([start, 0]);
  const visited = new Set();
  while (pq.length > 0) {
    const [current, currentDist] = pq.dequeue();
    if (visited.has(current)) continue;
    visited.add(current);
    if (current === end) return currentDist;
    for (const [neighbor, weight] of Object.entries(graph[current] || {})) {
      const newDist = currentDist + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.queue([neighbor, newDist]);
      }
    }
  }
  return distances[end];
}
export default findShortestPath;