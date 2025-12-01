const findShortestPath = async (graph, start, end) => {
  const { PriorityQueue } = await import('https://cdn.jsdelivr.net/npm/js-priority-queue@latest/+esm');
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = new PriorityQueue({ comparator: (a, b) => a.distance - b.distance });

  Object.keys(graph).forEach(node => distances[node] = Infinity);
  distances[start] = 0;
  queue.queue({ node: start, distance: 0 });

  while (queue.length) {
    const { node: current } = queue.dequeue();
    if (visited.has(current)) continue;
    visited.add(current);
    if (current === end) break;

    for (const neighbor in graph[current]) {
      const weight = graph[current][neighbor];
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        queue.queue({ node: neighbor, distance: newDist });
      }
    }
  }

  return distances[end] === undefined ? Infinity : distances[end];
};
export default findShortestPath;
// Generation time: 9.823s
// Result: FAIL