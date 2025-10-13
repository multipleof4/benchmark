async function findShortestPath(graph, startNode, endNode) {
  const { default: PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js');

  const distances = { [startNode]: 0 };
  const pq = new PriorityQueue({ comparator: (a, b) => a.priority - b.priority });

  pq.queue({ value: startNode, priority: 0 });

  while (pq.length) {
    const { value: currentNode } = pq.dequeue();

    if (currentNode === endNode) break;

    const neighbors = graph[currentNode] ?? {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      const newDist = distances[currentNode] + weight;

      if (newDist < (distances[neighbor] ?? Infinity)) {
        distances[neighbor] = newDist;
        pq.queue({ value: neighbor, priority: newDist });
      }
    }
  }

  return distances[endNode] ?? Infinity;
}
export default findShortestPath;