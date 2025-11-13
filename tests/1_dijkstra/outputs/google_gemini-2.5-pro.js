async function findShortestPath(graph, startNode, endNode) {
  const { default: PriorityQueue } = await import('https://esm.sh/js-priority-queue');

  const distances = { [startNode]: 0 };
  const queue = new PriorityQueue({ comparator: (a, b) => a.priority - b.priority });

  queue.queue({ node: startNode, priority: 0 });

  while (queue.length) {
    const { node: currentNode, priority: currentDist } = queue.dequeue();

    if (currentDist > (distances[currentNode] ?? Infinity)) {
      continue;
    }

    if (currentNode === endNode) {
      return currentDist;
    }

    for (const neighbor in graph[currentNode] || {}) {
      const weight = graph[currentNode][neighbor];
      const newDist = currentDist + weight;

      if (newDist < (distances[neighbor] ?? Infinity)) {
        distances[neighbor] = newDist;
        queue.queue({ node: neighbor, priority: newDist });
      }
    }
  }

  return Infinity;
}
export default findShortestPath;