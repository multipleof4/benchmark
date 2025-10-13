/**
 * Finds the total weight of the shortest path between two nodes in a weighted, undirected graph.
 * Uses Dijkstra's algorithm with a priority queue loaded dynamically from a CDN.
 *
 * @param {Object<string, Object<string, number>>} graph - Adjacency list representing the graph.
 * @param {string} start - Starting node id.
 * @param {string} end - Target node id.
 * @returns {Promise<number>} - Total weight of the shortest path, or Infinity if no path exists.
 */
const findShortestPath = async (graph, start, end) => {
  // Dynamically import the priority queue implementation from jsDelivr
  const { default: PriorityQueue } = await import(
    'https://cdn.jsdelivr.net/npm/js-priority-queue@1.0.0?module'
  );

  if (!graph || !graph.hasOwnProperty(start) || !graph.hasOwnProperty(end)) {
    return Infinity;
  }
  if (start === end) {
    return 0;
  }

  const distances = {};
  const visited = new Set();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  const pq = new PriorityQueue({
    comparator: (a, b) => a.distance - b.distance,
  });

  pq.queue({ node: start, distance: 0 });

  while (pq.length > 0) {
    const { node, distance } = pq.dequeue();

    if (visited.has(node)) continue;
    visited.add(node);

    if (node === end) {
      return distance;
    }

    for (const [neighbor, weight] of Object.entries(graph[node] || {})) {
      if (visited.has(neighbor)) continue;

      const newDist = distance + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.queue({ node: neighbor, distance: newDist });
      }
    }
  }

  return Infinity;
};

// Example usage:
// (async () => {
//   const graph = {
//     A: { B: 1, C: 4 },
//     B: { A: 1, C: 2, D: 5 },
//     C: { A: 4, B: 2, D: 1 },
//     D: { B: 5, C: 1 }
//   };
//   console.log(await findShortestPath(graph, 'A', 'D')); // Output: 4
// })();