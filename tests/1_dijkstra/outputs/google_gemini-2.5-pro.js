async function findShortestPath(graph, start, end) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const distances = Object.fromEntries(
    Object.keys(graph).map(node => [node, Infinity])
  );
  distances[start] = 0;

  const pq = new PriorityQueue({
    comparator: (a, b) => distances[b] - distances[a]
  });
  pq.queue(start);

  while (pq.length) {
    const currentNode = pq.dequeue();

    if (currentNode === end) break;

    if (!graph[currentNode]) continue;

    for (const [neighbor, weight] of Object.entries(graph[currentNode])) {
      const newDist = distances[currentNode] + weight;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.queue(neighbor);
      }
    }
  }

  return distances[end];
}
export default findShortestPath;