async function findShortestPath(graph, start, end) {
  // Dynamically import the priority queue library from CDN
  const { default: PriorityQueue } = await import(
    'https://cdn.jsdelivr.net/npm/js-priority-queue@0.1.5/+esm'
  );

  // Initialize distances object with Infinity for all nodes
  const distances = {};
  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  // Initialize visited set
  const visited = new Set();

  // Create a min-priority queue (lower distance = higher priority)
  const pq = new PriorityQueue({
    comparator: (a, b) => a.distance - b.distance
  });

  // Add start node to priority queue
  pq.queue({ node: start, distance: 0 });

  while (pq.length > 0) {
    const { node: currentNode, distance: currentDistance } = pq.dequeue();

    // Skip if already visited
    if (visited.has(currentNode)) {
      continue;
    }

    // Mark as visited
    visited.add(currentNode);

    // If we reached the end node, return the distance
    if (currentNode === end) {
      return currentDistance;
    }

    // Skip if current distance is outdated
    if (currentDistance > distances[currentNode]) {
      continue;
    }

    // Check all neighbors
    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      if (visited.has(neighbor)) {
        continue;
      }

      const weight = neighbors[neighbor];
      const newDistance = currentDistance + weight;

      // If we found a shorter path, update it
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        pq.queue({ node: neighbor, distance: newDistance });
      }
    }
  }

  // If we get here, no path exists
  return Infinity;
}

// Example usage:
(async () => {
  const graph = {
    'A': { 'B': 1, 'C': 4 },
    'B': { 'A': 1, 'C': 2, 'D': 5 },
    'C': { 'A': 4, 'B': 2, 'D': 1 },
    'D': { 'B': 5, 'C': 1 }
  };

  const shortestPath = await findShortestPath(graph, 'A', 'D');
  console.log('Shortest path from A to D:', shortestPath); // Output: 4

  const noPath = await findShortestPath(graph, 'A', 'E');
  console.log('Path from A to E (non-existent):', noPath); // Output: Infinity
})();