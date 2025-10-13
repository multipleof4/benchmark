// Lazy-load the PriorityQueue module once and cache the Promise
let priorityQueueModulePromise;

/**
 * Asynchronously finds the total weight of the shortest path between two nodes
 * in a weighted, undirected graph using Dijkstra's algorithm.
 *
 * @param {Object<string, Object<string, number>>} graph - Adjacency list representation of the graph.
 * @param {string} start - The starting node.
 * @param {string} end - The destination node.
 * @returns {Promise<number>} Total weight of the shortest path or Infinity if no path exists.
 */
export async function findShortestPath(graph, start, end) {
  if (!graph || graph[start] === undefined || graph[end] === undefined) {
    return Infinity;
  }
  if (start === end) {
    return 0;
  }

  // Dynamically import js-priority-queue from a CDN (via jsDelivr +esm build)
  if (!priorityQueueModulePromise) {
    priorityQueueModulePromise = import(
      'https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm'
    );
  }

  const { default: PriorityQueue } = await priorityQueueModulePromise;

  const distances = Object.create(null);
  const visited = new Set();

  // Initialize distances
  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  const queue = new PriorityQueue({
    comparator: (a, b) => a.distance - b.distance,
  });

  queue.queue({ node: start, distance: 0 });

  while (queue.length > 0) {
    const { node: currentNode, distance: currentDistance } = queue.dequeue();

    if (visited.has(currentNode)) {
      continue;
    }
    visited.add(currentNode);

    if (currentNode === end) {
      return currentDistance;
    }

    const neighbors = graph[currentNode] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      if (weight < 0) {
        throw new Error('Dijkstra\'s algorithm requires non-negative edge weights.');
      }
      const newDistance = currentDistance + weight;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        queue.queue({ node: neighbor, distance: newDistance });
      }
    }
  }

  return Infinity;
}