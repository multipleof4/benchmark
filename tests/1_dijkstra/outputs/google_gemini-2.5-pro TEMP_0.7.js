const findShortestPath = async (graph, start, end) => {
  const cdn = 'https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/priority-queue.min.js';
  const { default: PriorityQueue } = await import(cdn);

  const distances = Object.fromEntries(
    Object.keys(graph).map(node => [node, Infinity])
  );
  distances[start] = 0;

  const pq = new PriorityQueue({
    comparator: (a, b) => a.priority - b.priority
  });
  pq.queue({ value: start, priority: 0 });

  while (pq.length) {
    const { value: current } = pq.dequeue();

    if (current === end) break;

    const neighbors = graph[current] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      const newDist = distances[current] + weight;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.queue({ value: neighbor, priority: newDist });
      }
    }
  }

  return distances[end];
};
export default findShortestPath;