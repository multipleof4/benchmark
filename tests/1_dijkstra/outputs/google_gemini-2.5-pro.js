async function findShortestPath(graph, startNode, endNode) {
  const { default: PriorityQueue } = await import(
    'https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js'
  );

  const distances = {};
  const pq = new PriorityQueue({ comparator: (a, b) => a.priority - b.priority });

  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  pq.queue({ node: startNode, priority: 0 });

  while (pq.length) {
    const { node: currentNode, priority: currentPriority } = pq.dequeue();

    if (currentPriority > distances[currentNode]) {
      continue;
    }

    if (currentNode === endNode) {
      return currentPriority;
    }

    for (const neighbor in graph[currentNode]) {
      const weight = graph[currentNode][neighbor];
      const newDistance = currentPriority + weight;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        pq.queue({ node: neighbor, priority: newDistance });
      }
    }
  }

  return Infinity;
}
export default findShortestPath;